/**
 * AtherOS — Files App
 */
const FilesApp = (() => {
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

  const ICONS = {
    photos:'🖼', projects:'💼', music:'🎵', 'notes.txt':'📄',
    'readme.md':'📋', '.secret':'🔒', atheros:'⬡', dualsoul:'✦',
    portfolio:'🌐', archive:'📦', 'quantum-beat':'🎹',
    '2050_01.raw':'📷', 'memories.zip':'🗜', 'constellation.png':'⭐',
    'bridge_night.jpg':'🌉', 'ambient_01.flac':'🎶', 'future_beats.mp3':'🎵',
    'memory_lane.wav':'🎼', 'hidden_message.txt':'💬', home:'🏠',
    etc:'⚙', usr:'📁', var:'🗂', dev:'💻', user:'👤',
    bin:'⚡', lib:'📚', share:'📂', log:'📋', tmp:'🗑',
    null:'∅', random:'🎲', hologram:'🔮', 'atheros.conf':'⚙',
    hosts:'🌐', environment:'🌿',
  };

  const SIDEBAR = [
    ['🏠 Home', '/home/user'],
    ['📷 Photos', '/home/user/photos'],
    ['💼 Projects', '/home/user/projects'],
    ['🎵 Music', '/home/user/music'],
    ['⚙ Etc', '/etc'],
    ['/ Root', '/'],
  ];

  let currentPath = '/home/user';

  function build(path = currentPath) {
    currentPath = vfs[path] !== undefined ? path : '/home/user';
    const items = vfs[currentPath] || [];

    return `
      <div class="files-wrap">
        <div class="files-sidebar">
          <div class="files-section">PLACES</div>
          ${SIDEBAR.map(([label, p]) => `
            <div class="files-item${p === currentPath ? ' active' : ''}"
              onclick="FilesApp.nav('${p}')">${label}</div>`).join('')}
          <div class="files-section">CLOUD</div>
          <div class="files-item">☁ Archive</div>
          <div class="files-item">🔗 Shared</div>
        </div>
        <div class="files-main">
          <div class="files-path">${currentPath}</div>
          <div class="files-grid">
            ${items.map(f => {
              const fullPath = (currentPath === '/' ? '' : currentPath) + '/' + f;
              const isDir = vfs[fullPath] !== undefined;
              return `<div class="file-card" ondblclick="FilesApp.nav('${fullPath}')">
                <div class="file-icon">${ICONS[f] || (isDir ? '📁' : '📄')}</div>
                <div class="file-name">${f}</div>
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }

  function nav(path) {
    const wb = document.getElementById('wb-files');
    if (wb) wb.innerHTML = build(path);
  }

  return { build, nav };
})();


/**
 * AtherOS — Gallery App
 */
const GalleryApp = (() => {
  const items = [
    { e:'🌃', l:'Neon City Night',  c:'linear-gradient(135deg,#0a0520,#1a0a30)' },
    { e:'🌊', l:'Ocean at 3AM',     c:'linear-gradient(135deg,#001528,#003060)' },
    { e:'🌸', l:'Spring Archive',   c:'linear-gradient(135deg,#2a0a20,#500030)' },
    { e:'⭐', l:'Constellation',    c:'linear-gradient(135deg,#050510,#0a0a30)' },
    { e:'🌅', l:'Golden Hour',      c:'linear-gradient(135deg,#301000,#603000)' },
    { e:'🌲', l:'Forest Quiet',     c:'linear-gradient(135deg,#051005,#0a2010)' },
    { e:'🏙', l:'City Layers',      c:'linear-gradient(135deg,#100520,#201040)' },
    { e:'🌉', l:'Bridge at Dusk',   c:'linear-gradient(135deg,#050518,#100828)' },
    { e:'🌌', l:'Deep Space',       c:'linear-gradient(135deg,#000010,#050520)' },
  ];

  function build() {
    return `
      <div class="gallery-wrap">
        <div class="gallery-header">
          <div class="gallery-count">PHOTO ARCHIVE · ${items.length} MEMORIES</div>
          <div class="gallery-tab active">All</div>
          <div class="gallery-tab">2050</div>
          <div class="gallery-tab">Starred</div>
        </div>
        <div class="gallery-grid">
          ${items.map((g, i) => `
            <div class="gallery-card" onclick="GalleryApp.view(${i})" style="background:${g.c};">
              <div class="gallery-inner">${g.e}</div>
              <div class="gallery-overlay">🔍</div>
            </div>`).join('')}
        </div>
        <div class="gallery-hint">CLICK ANY PHOTO TO OPEN</div>
      </div>`;
  }

  function view(i) {
    OS.showNotif('Gallery', `Opening: ${items[i].l}`, 2500);
  }

  return { build, view };
})();


/**
 * AtherOS — Code Editor App
 */
const CodeApp = (() => {
  const files = {
    'index.tsx': `import React, { useState } from 'react'\nimport { motion } from 'framer-motion'\n\nconst DualSoul = () => {\n  const [active, setActive] = useState('shadow')\n\n  return (\n    <motion.div\n      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      className="dualsoul-wrapper"\n    >\n      <h1>DualSoul</h1>\n      <p>Two worlds. One identity.</p>\n    </motion.div>\n  )\n}\n\nexport default DualSoul`,

    'atheros.ts': `// AtherOS Core System\nexport interface Window {\n  id: string\n  title: string\n  x: number\n  y: number\n  width: number\n  height: number\n  focused: boolean\n}\n\nexport class WindowManager {\n  private windows: Map<string, Window> = new Map()\n\n  open(win: Window): void {\n    this.windows.set(win.id, win)\n    this.focus(win.id)\n  }\n\n  close(id: string): void {\n    this.windows.delete(id)\n  }\n\n  focus(id: string): void {\n    this.windows.forEach((w, k) => {\n      w.focused = k === id\n    })\n  }\n}`,

    'styles.css': `/* AtherOS Design System */\n:root {\n  --cyan:   #00d4ff;\n  --purple: #a855f7;\n  --pink:   #f472b6;\n  --green:  #22c55e;\n  --bg:     #050510;\n  --glass:  rgba(255,255,255,0.04);\n  --border: rgba(0,212,255,0.18);\n}\n\n.window {\n  backdrop-filter: blur(28px);\n  background: var(--glass);\n  border: 1px solid var(--border);\n  border-radius: 14px;\n  box-shadow: 0 20px 60px rgba(0,0,0,.7);\n}`,
  };

  let current = 'index.tsx';

  function build() {
    const code = files[current] || '';
    const lines = code.split('\n');
    return `
      <div class="code-wrap">
        <div class="code-toolbar">
          ${Object.keys(files).map(f => `
            <div class="code-tab${f === current ? ' active' : ''}"
              onclick="CodeApp.switchFile('${f}')">${f}</div>`).join('')}
          <div class="code-line-count">${lines.length} lines</div>
        </div>
        <div class="code-editor-body">
          <div class="code-gutter" id="codeGutter">
            ${lines.map((_, i) => `<div class="code-line-num">${i + 1}</div>`).join('')}
          </div>
          <textarea class="code-textarea" id="codeArea"
            oninput="CodeApp.onInput()"
            spellcheck="false">${code}</textarea>
        </div>
      </div>`;
  }

  function switchFile(name) {
    current = name;
    const wb = document.getElementById('wb-code');
    if (wb) wb.innerHTML = build();
  }

  function onInput() {
    const area = document.getElementById('codeArea');
    const gutter = document.getElementById('codeGutter');
    if (!area || !gutter) return;
    files[current] = area.value;
    const lines = area.value.split('\n');
    gutter.innerHTML = lines.map((_, i) => `<div class="code-line-num">${i + 1}</div>`).join('');
  }

  return { build, switchFile, onInput };
})();


/**
 * AtherOS — Notes App
 */
const NotesApp = (() => {
  let content = localStorage.getItem('atheros-notes') || '# My Notes\n\nYour thoughts live here...\n\n';

  function build() {
    return `
      <div class="notes-wrap">
        <div class="notes-toolbar">
          <span>PERSONAL ARCHIVE</span>
          <button title="Bold"    onclick="NotesApp.insert('**','**')"><b>B</b></button>
          <button title="Italic"  onclick="NotesApp.insert('_','_')"><i>I</i></button>
          <button title="Heading" onclick="NotesApp.insert('## ','')">H</button>
          <button title="Line"    onclick="NotesApp.insert('\\n---\\n','')">―</button>
          <span class="notes-saved" id="notesSaved"></span>
        </div>
        <textarea class="notes-area" id="notesArea"
          oninput="NotesApp.save(this.value)"
          spellcheck="false">${content}</textarea>
      </div>`;
  }

  function save(val) {
    content = val;
    localStorage.setItem('atheros-notes', val);
    const el = document.getElementById('notesSaved');
    if (el) { el.textContent = '● Saved'; setTimeout(() => { if (el) el.textContent = ''; }, 1500); }
  }

  function insert(before, after) {
    const a = document.getElementById('notesArea');
    if (!a) return;
    const s = a.selectionStart, e = a.selectionEnd;
    const sel = a.value.substring(s, e);
    a.value = a.value.substring(0, s) + before + sel + after + a.value.substring(e);
    a.focus();
    a.selectionStart = s + before.length;
    a.selectionEnd   = s + before.length + sel.length;
  }

  return { build, save, insert };
})();


/**
 * AtherOS — Calculator App
 */
const CalcApp = (() => {
  let expr = '', result = '0';

  const BUTTONS = [
    ['C','±','%','÷'],
    ['7','8','9','×'],
    ['4','5','6','−'],
    ['1','2','3','+'],
    ['0','.','⌫','='],
  ];

  function build() {
    return `
      <div class="calc-wrap">
        <div class="calc-display">
          <div class="calc-expr"   id="cExpr">&nbsp;</div>
          <div class="calc-result" id="cResult">0</div>
        </div>
        <div class="calc-grid" style="flex:1;">
          ${BUTTONS.flat().map(b => {
            const isOp = ['÷','×','−','+'].includes(b);
            const isEq = b === '=';
            return `<button class="calc-btn${isOp ? ' op' : ''}${isEq ? ' eq' : ''}"
              onclick="CalcApp.press('${b}')">${b}</button>`;
          }).join('')}
        </div>
      </div>`;
  }

  function press(b) {
    const r = document.getElementById('cResult');
    const e = document.getElementById('cExpr');

    if (b === 'C')  { expr = ''; result = '0'; }
    else if (b === '=') {
      try {
        const sanitized = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
        const val = Function('"use strict";return (' + sanitized + ')')();
        result = String(Math.round(val * 1e10) / 1e10);
        expr = result;
      } catch { result = 'Error'; expr = ''; }
    }
    else if (b === '⌫') { expr = expr.slice(0, -1) || ''; result = expr || '0'; }
    else if (b === '±') { result = String(-parseFloat(result) || 0); expr = result; }
    else if (b === '%') { result = String(parseFloat(result) / 100); expr = result; }
    else { expr += b; }

    if (r) r.textContent = result;
    if (e) e.textContent = expr || '\u00a0';
  }

  return { build, press };
})();


/**
 * AtherOS — Browser App
 */
const BrowserApp = (() => {
  const shortcuts = ['🌌 Memory Archive','💾 Personal Cloud','🎵 Music Studio','✦ DualSoul','⌨ Code Repo','📷 Photo Library'];

  function build() {
    return `
      <div class="browser-wrap">
        <div class="browser-bar">
          <button class="browser-nav">←</button>
          <button class="browser-nav">→</button>
          <button class="browser-nav">↺</button>
          <input class="browser-url" value="atheros://home"
            onkeydown="if(event.key==='Enter') BrowserApp.nav(this.value)">
          <span style="font-size:13px;color:#22c55e;">🔒</span>
        </div>
        <div class="browser-body">
          <div class="browser-logo">AtherSearch</div>
          <div class="browser-sub">YOUR UNIVERSE · YOUR ARCHIVE · 2050</div>
          <input class="browser-search" placeholder="Search the archive...">
          <div class="browser-shortcuts">
            ${shortcuts.map(s => `<div class="browser-shortcut">${s}</div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function nav(url) { OS.showNotif('AtherBrowser', `Navigating to ${url}`, 2000); }

  return { build, nav };
})();


/**
 * AtherOS — System Monitor App
 */
const MonitorApp = (() => {
  let cpu = 34, ram = 62, interval = null;
  const startTime = Date.now();

  function build() {
    return `
      <div class="monitor-wrap">
        <div class="monitor-grid">
          <div class="monitor-card">
            <div class="monitor-label">CPU USAGE</div>
            <div class="monitor-value" id="monCPU">${cpu}%</div>
            <div class="monitor-bar-track">
              <div class="monitor-bar-fill" id="monCPUBar"
                style="width:${cpu}%;background:linear-gradient(90deg,#a855f7,#00d4ff);"></div>
            </div>
          </div>
          <div class="monitor-card">
            <div class="monitor-label">MEMORY</div>
            <div class="monitor-value" id="monRAM" style="color:#f472b6;">${ram}%</div>
            <div class="monitor-bar-track">
              <div class="monitor-bar-fill" id="monRAMBar"
                style="width:${ram}%;background:linear-gradient(90deg,#ec4899,#a855f7);"></div>
            </div>
          </div>
          <div class="monitor-card">
            <div class="monitor-label">NETWORK I/O</div>
            <div class="monitor-value" id="monNet" style="color:#22c55e;font-size:20px;">12 MB/s</div>
            <div class="monitor-bar-track">
              <div class="monitor-bar-fill" id="monNetBar"
                style="width:45%;background:linear-gradient(90deg,#22c55e,#00d4ff);"></div>
            </div>
          </div>
          <div class="monitor-card">
            <div class="monitor-label">UPTIME</div>
            <div class="monitor-value" id="monUptime" style="color:#f59e0b;font-size:18px;">0m 0s</div>
          </div>
        </div>

        <div class="monitor-card">
          <div class="monitor-label">ACTIVE PROCESSES</div>
          <table class="proc-table">
            <thead>
              <tr><th>PROCESS</th><th>CPU</th><th>MEM</th><th>STATUS</th></tr>
            </thead>
            <tbody>
              <tr><td>dualsoul</td>        <td style="color:#00d4ff;">8.2%</td>  <td>124MB</td>  <td style="color:#22c55e;">RUNNING</td></tr>
              <tr><td>athershell</td>       <td style="color:#00d4ff;">1.1%</td>  <td>32MB</td>   <td style="color:#22c55e;">RUNNING</td></tr>
              <tr><td>particle-engine</td>  <td style="color:#00d4ff;">4.5%</td>  <td>88MB</td>   <td style="color:#22c55e;">RUNNING</td></tr>
              <tr><td>memory-archive</td>   <td style="color:#00d4ff;">0.3%</td>  <td>512MB</td>  <td style="color:#00d4ff;">STANDBY</td></tr>
              <tr><td>ambience-daemon</td>  <td style="color:#00d4ff;">2.1%</td>  <td>44MB</td>   <td style="color:#22c55e;">RUNNING</td></tr>
              <tr><td>aether-ai</td>        <td style="color:#00d4ff;">6.8%</td>  <td>256MB</td>  <td style="color:#22c55e;">RUNNING</td></tr>
            </tbody>
          </table>
        </div>
      </div>`;
  }

  function start() {
    stop();
    interval = setInterval(() => {
      cpu = Math.max(5,  Math.min(92, cpu + (Math.random() - 0.5) * 7));
      ram = Math.max(30, Math.min(88, ram + (Math.random() - 0.5) * 2.5));
      const net = Math.round(Math.random() * 40 + 5);
      const secs = Math.floor((Date.now() - startTime) / 1000);

      const cv = document.getElementById('monCPU');    if (cv) cv.textContent = Math.round(cpu) + '%';
      const cb = document.getElementById('monCPUBar'); if (cb) cb.style.width = cpu + '%';
      const rv = document.getElementById('monRAM');    if (rv) rv.textContent = Math.round(ram) + '%';
      const rb = document.getElementById('monRAMBar'); if (rb) rb.style.width = ram + '%';
      const nv = document.getElementById('monNet');    if (nv) nv.textContent = net + ' MB/s';
      const nb = document.getElementById('monNetBar'); if (nb) nb.style.width = Math.min(100, net * 2.5) + '%';
      const uv = document.getElementById('monUptime'); if (uv) uv.textContent = `${Math.floor(secs/60)}m ${secs%60}s`;
    }, 1500);
  }

  function stop() { clearInterval(interval); }

  return { build, start, stop };
})();


/**
 * AtherOS — Settings App
 */
const SettingsApp = (() => {
  let tab = 'appearance';
  const toggles = { particles:true, glass:true, animations:true, notifications:true, ai:false, sound:true };

  const WALLS = [
    'radial-gradient(ellipse at 15% 55%,rgba(168,85,247,.13) 0%,transparent 55%),radial-gradient(ellipse at 85% 15%,rgba(0,212,255,.1) 0%,transparent 50%),#050510',
    'radial-gradient(ellipse at 80% 40%,rgba(244,114,182,.13) 0%,transparent 55%),radial-gradient(ellipse at 20% 75%,rgba(0,212,255,.08) 0%,transparent 50%),#050a10',
    'radial-gradient(ellipse at 50% 30%,rgba(168,85,247,.18) 0%,transparent 60%),radial-gradient(ellipse at 85% 85%,rgba(0,212,255,.06) 0%,transparent 45%),#08050f',
    'radial-gradient(ellipse at 30% 70%,rgba(34,197,94,.1) 0%,transparent 50%),radial-gradient(ellipse at 70% 20%,rgba(0,212,255,.1) 0%,transparent 50%),#050a08',
  ];

  const TABS = [['appearance','🎨','Appearance'],['system','🖥','System'],['privacy','🔒','Privacy'],['about','ℹ','About']];
  const TOGGLES_CFG = [
    ['particles','Particle Effects','Ambient background particles'],
    ['glass','Glassmorphism','Frosted glass windows'],
    ['animations','Animations','Window & transition effects'],
    ['notifications','Notifications','System notifications'],
    ['ai','Auto AI Panel','Show AI panel on startup'],
    ['sound','Ambient Sound','Background ambient audio'],
  ];

  function build() {
    let body = '';

    if (tab === 'appearance') {
      const wallIdx = OS.getWallIdx ? OS.getWallIdx() : 0;
      body = `
        <div class="settings-section">DISPLAY</div>
        ${TOGGLES_CFG.map(([k, l, sub]) => `
          <div class="settings-row">
            <div><div class="settings-label">${l}</div><div class="settings-sub">${sub}</div></div>
            <div class="toggle-switch${toggles[k] ? ' on' : ''}" onclick="SettingsApp.toggle('${k}')"></div>
          </div>`).join('')}
        <div class="settings-section">WALLPAPER</div>
        <div class="wall-previews">
          ${WALLS.map((w, i) => `
            <div class="wall-preview${i === wallIdx ? ' active' : ''}"
              style="background:${w};"
              onclick="OS.setWall(${i});SettingsApp.reload()"></div>`).join('')}
        </div>`;
    }
    else if (tab === 'system') {
      body = `
        <div class="settings-section">SYSTEM INFORMATION</div>
        ${[
          ['Version',      'AtherOS 2050.2'],
          ['Build',        'ATHER-CINEMATIC-DARK'],
          ['Kernel',       'AetherKernel 12.2'],
          ['Architecture', 'Quantum-x64'],
          ['Memory',       '∞ GB Quantum RAM'],
          ['Display',      'Holographic · ∞ × ∞'],
          ['Locale',       'en_US.UTF-8'],
          ['Timezone',     'IST (UTC+5:30)'],
        ].map(([k,v]) => `
          <div class="settings-row">
            <div class="settings-label">${k}</div>
            <div style="font-size:12px;color:var(--cyan);font-family:'JetBrains Mono',monospace;">${v}</div>
          </div>`).join('')}`;
    }
    else if (tab === 'privacy') {
      body = `
        <div class="settings-section">PRIVACY</div>
        <div class="settings-row">
          <div><div class="settings-label">Analytics</div><div class="settings-sub">Share usage data</div></div>
          <div class="toggle-switch" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Location Services</div><div class="settings-sub">Used for weather widget</div></div>
          <div class="toggle-switch on" onclick="this.classList.toggle('on')"></div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Memory Archive</div><div class="settings-sub">Save memory fragments</div></div>
          <div class="toggle-switch on" onclick="this.classList.toggle('on')"></div>
        </div>`;
    }
    else {
      body = `
        <div class="about-hero">
          <div class="about-logo">ATHER<span>OS</span></div>
          <div class="about-version">PERSONAL DIGITAL UNIVERSE · VERSION 2050.2</div>
          <div class="about-badges">
            <div class="about-badge" style="color:#22c55e;border-color:rgba(34,197,94,.3);background:rgba(34,197,94,.06);">● SYSTEM NOMINAL</div>
            <div class="about-badge" style="color:#00d4ff;border-color:rgba(0,212,255,.3);background:rgba(0,212,255,.06);">⚡ DUALSOUL ACTIVE</div>
            <div class="about-badge" style="color:#a855f7;border-color:rgba(168,85,247,.3);background:rgba(168,85,247,.06);">◈ AI ONLINE</div>
          </div>
          <div class="about-note">
            Designed for the future.<br>
            Running in the present.<br>
            Archived from 2050.
          </div>
        </div>`;
    }

    return `
      <div class="settings-wrap">
        <div class="settings-nav">
          ${TABS.map(([k, ic, label]) => `
            <div class="settings-item${tab === k ? ' active' : ''}"
              onclick="SettingsApp.switchTab('${k}')">${ic} ${label}</div>`).join('')}
        </div>
        <div class="settings-body">${body}</div>
      </div>`;
  }

  function switchTab(t) {
    tab = t;
    reload();
  }

  function toggle(key) {
    toggles[key] = !toggles[key];
    OS.showNotif('Settings', `${key} ${toggles[key] ? 'enabled' : 'disabled'}`, 2000);
    reload();
  }

  function reload() {
    const wb = document.getElementById('wb-settings');
    if (wb) wb.innerHTML = build();
  }

  return { build, switchTab, toggle, reload };
})();
