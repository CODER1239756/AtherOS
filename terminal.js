/**
 * AtherOS — Terminal App
 * Full UNIX-style shell with virtual filesystem
 */

const TerminalApp = (() => {

  // ── Virtual Filesystem ───────────────────────────────
  const vfs = {
    '/': ['home','etc','usr','var','dev'],
    '/home': ['user'],
    '/home/user': ['photos','projects','music','notes.txt','readme.md','.secret'],
    '/home/user/projects': ['atheros','dualsoul','portfolio','archive','quantum-beat'],
    '/home/user/photos': ['2050_01.raw','memories.zip','constellation.png','bridge_night.jpg'],
    '/home/user/music': ['ambient_01.flac','future_beats.mp3','memory_lane.wav'],
    '/home/user/.secret': ['hidden_message.txt'],
    '/etc': ['atheros.conf','hosts','environment'],
    '/usr': ['bin','lib','share'],
    '/var': ['log','tmp'],
    '/dev': ['null','random','hologram'],
  };

  const FILE_CONTENTS = {
    'notes.txt': '"The universe is not outside of you. Look inside yourself." — Rumi',
    'readme.md': '# AtherOS\nPersonal Digital Universe v2050.2\nBuilt with soul, code, and memory.',
    'hidden_message.txt': '★ EASTER EGG FOUND ★\nYou found the secret. The real OS has always been inside you.',
    'atheros.conf': '[system]\nversion=2050.2\ntheme=dark-cinematic\nuser=shadow-nova\nmode=DualSoul',
    'hosts': '127.0.0.1 localhost\n::1 atheros.local\n0.0.0.0 dualsoul.io',
    'environment': 'OS=AtherOS\nUSER=you\nHOME=/home/user\nLANG=en_US.UTF-8\nTHEME=dark-cinematic',
  };

  // ── State ────────────────────────────────────────────
  let cwd      = '/home/user';
  let history  = [];
  let histIdx  = 0;

  // ── Build UI ─────────────────────────────────────────
  function build() {
    cwd = '/home/user'; history = []; histIdx = 0;

    return `
      <div class="terminal" id="termBody">
        <div class="term-line" style="color:#a855f7;">AtherOS Terminal v2050.2  —  type 'help' for commands</div>
        <div class="term-line" style="color:rgba(255,255,255,.2);">logged in as: <span style="color:#00d4ff;">user</span>@atheros  ·  ${new Date().toLocaleString()}</div>
        <div class="term-line"></div>
        <div id="termOutput"></div>
        <div style="display:flex;align-items:center;" class="term-line">
          <span class="term-prompt" id="termPrompt">user@atheros:${cwd}$&nbsp;</span>
          <input class="term-input" id="termInput"
            onkeydown="TerminalApp.onKey(event)"
            autocomplete="off" spellcheck="false">
        </div>
      </div>`;
  }

  // ── Key Handler ──────────────────────────────────────
  function onKey(e) {
    const inp = document.getElementById('termInput');
    if (!inp) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length) { histIdx++; inp.value = history[history.length - histIdx] || ''; }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      histIdx = Math.max(0, histIdx - 1);
      inp.value = histIdx === 0 ? '' : history[history.length - histIdx] || '';
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = inp.value.trim().split(' ');
      const partial = parts[parts.length - 1];
      const entries = vfs[cwd] || [];
      const match = entries.find(x => x.startsWith(partial));
      if (match) inp.value = parts.slice(0, -1).concat(match).join(' ');
    }
    if (e.key === 'Enter') {
      const cmd = inp.value.trim();
      inp.value = '';
      histIdx = 0;
      if (cmd) { history.push(cmd); execute(cmd); }
    }
  }

  // ── Output Helper ────────────────────────────────────
  function print(lines, color = 'rgba(255,255,255,.65)') {
    const out = document.getElementById('termOutput');
    if (!out) return;
    const arr = Array.isArray(lines) ? lines : [lines];
    arr.forEach(l => {
      const d = document.createElement('div');
      d.className = 'term-line';
      d.style.color = color;
      d.innerHTML = l;
      out.appendChild(d);
    });
    scrollBottom();
    updatePrompt();
  }

  function scrollBottom() {
    const body = document.getElementById('termBody');
    if (body) body.scrollTop = body.scrollHeight;
  }

  function updatePrompt() {
    const p = document.getElementById('termPrompt');
    if (p) p.textContent = `user@atheros:${cwd}$ `;
  }

  // ── Command Executor ─────────────────────────────────
  function execute(cmd) {
    const out = document.getElementById('termOutput');
    if (!out) return;

    // Echo the command
    const echo = document.createElement('div');
    echo.className = 'term-line';
    echo.innerHTML = `<span style="color:#00d4ff;">user@atheros:${cwd}$</span>&nbsp;<span style="color:#fff;">${cmd}</span>`;
    out.appendChild(echo);

    const [base, ...args] = cmd.trim().split(/\s+/);

    switch (base) {

      case 'help':
        print([
          '<span style="color:#a855f7;font-weight:500;">AtherOS Shell — Available Commands</span>',
          '',
          '  <span style="color:#00d4ff;">ls</span>       &nbsp;list directory contents',
          '  <span style="color:#00d4ff;">cd</span>       &nbsp;change directory',
          '  <span style="color:#00d4ff;">pwd</span>      &nbsp;print working directory',
          '  <span style="color:#00d4ff;">cat</span>      &nbsp;read file contents',
          '  <span style="color:#00d4ff;">mkdir</span>    &nbsp;create directory',
          '  <span style="color:#00d4ff;">touch</span>    &nbsp;create file',
          '  <span style="color:#00d4ff;">rm</span>       &nbsp;remove file or directory',
          '  <span style="color:#00d4ff;">echo</span>     &nbsp;print text',
          '  <span style="color:#00d4ff;">date</span>     &nbsp;show current date and time',
          '  <span style="color:#00d4ff;">whoami</span>   &nbsp;show current user info',
          '  <span style="color:#00d4ff;">neofetch</span> &nbsp;display system information',
          '  <span style="color:#00d4ff;">clear</span>    &nbsp;clear the terminal',
          '',
        ]);
        break;

      case 'ls': {
        const entries = vfs[cwd] || [];
        if (!entries.length) { print(['  (empty directory)']); break; }
        print(entries.map(x => {
          const isDir = vfs[(cwd === '/' ? '' : cwd) + '/' + x] !== undefined || vfs[cwd + '/' + x] !== undefined;
          return `  <span style="color:${isDir ? '#00d4ff' : 'rgba(255,255,255,.65)'};">${x}${isDir ? '/' : ''}</span>`;
        }));
        break;
      }

      case 'pwd':
        print([cwd]);
        break;

      case 'cd': {
        const target = args[0];
        if (!target || target === '~' || target === '') {
          cwd = '/home/user';
        } else if (target === '..') {
          const parts = cwd.split('/').filter(Boolean);
          parts.pop();
          cwd = parts.length ? '/' + parts.join('/') : '/';
        } else {
          const newPath = (cwd === '/' ? '' : cwd) + '/' + target;
          if (vfs[newPath] !== undefined) {
            cwd = newPath;
          } else {
            print([`<span style="color:#ff5f57;">cd: ${target}: No such file or directory</span>`]);
            break;
          }
        }
        print([`→ ${cwd}`], '#00d4ff');
        break;
      }

      case 'cat': {
        if (!args[0]) { print(['<span style="color:#ff5f57;">cat: missing operand</span>']); break; }
        const content = FILE_CONTENTS[args[0]];
        if (content) {
          print(content.split('\n'), 'rgba(255,255,255,.6)');
        } else {
          print([`<span style="color:#ff5f57;">cat: ${args[0]}: No such file</span>`]);
        }
        break;
      }

      case 'mkdir':
        if (!args[0]) { print(['<span style="color:#ff5f57;">mkdir: missing operand</span>']); break; }
        if (!vfs[cwd]) vfs[cwd] = [];
        vfs[cwd].push(args[0]);
        vfs[(cwd === '/' ? '' : cwd) + '/' + args[0]] = [];
        print([`Created directory: ${args[0]}`], '#22c55e');
        break;

      case 'touch':
        if (!args[0]) { print(['<span style="color:#ff5f57;">touch: missing operand</span>']); break; }
        if (!vfs[cwd]) vfs[cwd] = [];
        vfs[cwd].push(args[0]);
        print([`Created: ${args[0]}`], '#22c55e');
        break;

      case 'rm':
        if (!args[0]) { print(['<span style="color:#ff5f57;">rm: missing operand</span>']); break; }
        if (vfs[cwd]) {
          const idx = vfs[cwd].indexOf(args[0]);
          if (idx > -1) { vfs[cwd].splice(idx, 1); print([`Removed: ${args[0]}`], '#f59e0b'); }
          else print([`<span style="color:#ff5f57;">rm: ${args[0]}: No such file or directory</span>`]);
        }
        break;

      case 'echo':
        print([args.join(' ')]);
        break;

      case 'date':
        print([new Date().toString()]);
        break;

      case 'whoami':
        print([
          '<span style="color:#a855f7;font-weight:500;">user</span>',
          'Role     : Creator · Architect of AtherOS',
          'Souls    : Shadow (photographer) · Nova (developer)',
          'Location : Mumbai, IN · Archive: 2050',
          'Shell    : athershell 3.1',
        ], 'rgba(255,255,255,.6)');
        break;

      case 'clear': {
        const o = document.getElementById('termOutput');
        if (o) o.innerHTML = '';
        break;
      }

      case 'neofetch':
        neofetch();
        break;

      default:
        print([`<span style="color:#ff5f57;">Command not found: ${base}</span>. Type <span style="color:#00d4ff;">'help'</span> for available commands.`]);
    }

    scrollBottom();
  }

  // ── Neofetch ─────────────────────────────────────────
  function neofetch() {
    const out = document.getElementById('termOutput');
    if (!out) return;

    const art = [
      '   _   _   _               ___  ___',
      '  /_\\ | |_| |_  ___ _ _ / _ \\/ __|',
      ' / _ \\|  _| \' \\/ -_) \'_| (_) \\__ \\',
      '/_/ \\_\\\\__|_||_\\___|_|  \\___/|___/',
    ];

    art.forEach(l => {
      const d = document.createElement('div');
      d.className = 'term-line';
      d.innerHTML = `<span style="color:#00d4ff;font-weight:500;">${l}</span>`;
      out.appendChild(d);
    });

    const info = [
      ['OS',           'AtherOS 2050.2 Personal Edition'],
      ['Host',         'Digital Universe · DualSoul Engine'],
      ['Kernel',       'AetherKernel 12.2-cinematic'],
      ['Uptime',       'Since the beginning of creativity'],
      ['Shell',        'athershell 3.1'],
      ['Memory',       '∞ GB Quantum RAM'],
      ['CPU',          'Imagination × Execution'],
      ['GPU',          'HolographicFX 9000 · RayTrace ON'],
      ['Resolution',   '∞ × ∞ · Holographic'],
      ['Theme',        'Dark Cinematic · DualSoul'],
      ['User',         'Shadow · Nova · You'],
      ['Location',     'Mumbai ↔ 2050 Archive'],
    ];

    info.forEach(([k, v]) => {
      const d = document.createElement('div');
      d.className = 'term-line';
      d.innerHTML = `  <span style="color:#a855f7;font-weight:500;">${k}:</span> <span style="color:rgba(255,255,255,.6);">${v}</span>`;
      out.appendChild(d);
    });

    const colors = document.createElement('div');
    colors.className = 'term-line';
    colors.style.marginTop = '6px';
    colors.innerHTML = ['#ff5f57','#febc2e','#28c840','#00d4ff','#a855f7','#f472b6']
      .map(c => `<span style="color:${c};font-size:16px;">●</span>`).join(' ');
    out.appendChild(colors);
  }

  return { build, onKey };
})();
