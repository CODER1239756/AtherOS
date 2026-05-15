/**
 * AtherOS Core Engine
 * Handles: Boot, Lock Screen, Window Manager, Taskbar,
 *          Launcher, Spotlight, Context Menu, Notifications,
 *          Particles, Clock, Widgets, AI Panel
 */

const OS = (() => {

  // ── State ────────────────────────────────────────────
  const state = {
    unlocked:   false,
    pin:        '',
    wallIdx:    0,
    launchOpen: false,
    spotOpen:   false,
    aiOpen:     false,
    ncOpen:     false,
    windows:    {},
    zIndex:     100,
    drag:       null,
    resize:     null,
    ncLog:      [],
  };

  // ── Wallpapers ───────────────────────────────────────
  const WALLS = [
    'radial-gradient(ellipse at 15% 55%,rgba(168,85,247,.13) 0%,transparent 55%),radial-gradient(ellipse at 85% 15%,rgba(0,212,255,.1) 0%,transparent 50%),radial-gradient(ellipse at 55% 85%,rgba(244,114,182,.07) 0%,transparent 45%),#050510',
    'radial-gradient(ellipse at 80% 40%,rgba(244,114,182,.13) 0%,transparent 55%),radial-gradient(ellipse at 20% 75%,rgba(0,212,255,.08) 0%,transparent 50%),#050a10',
    'radial-gradient(ellipse at 50% 30%,rgba(168,85,247,.18) 0%,transparent 60%),radial-gradient(ellipse at 85% 85%,rgba(0,212,255,.06) 0%,transparent 45%),#08050f',
    'radial-gradient(ellipse at 30% 70%,rgba(34,197,94,.1) 0%,transparent 50%),radial-gradient(ellipse at 70% 20%,rgba(0,212,255,.1) 0%,transparent 50%),#050a08',
  ];

  // ── App Registry ─────────────────────────────────────
  const APP_DEFS = {
    dualsoul: { title: 'DualSoul — Digital Identity',  w: 760, h: 510, icon: '✦' },
    terminal: { title: 'Terminal',                      w: 580, h: 380, icon: '⌨' },
    files:    { title: 'File Explorer',                 w: 580, h: 380, icon: '📁' },
    notes:    { title: 'Notes',                         w: 480, h: 360, icon: '✏' },
    music:    { title: 'Music Player',                  w: 340, h: 430, icon: '♪' },
    calc:     { title: 'Calculator',                    w: 290, h: 440, icon: '▦' },
    monitor:  { title: 'System Monitor',                w: 540, h: 400, icon: '▲' },
    settings: { title: 'Settings',                      w: 540, h: 390, icon: '⚙' },
    browser:  { title: 'AtherBrowser',                  w: 620, h: 420, icon: '◎' },
    gallery:  { title: 'Gallery',                       w: 560, h: 400, icon: '🖼' },
    code:     { title: 'Code Editor',                   w: 620, h: 420, icon: '</>' },
  };

  const ALL_APPS_LIST = [
    { id:'dualsoul', n:'DualSoul',    icon:'✦',   desc:'Personal portfolio experience',    color:'linear-gradient(135deg,#a855f7,#00d4ff)' },
    { id:'terminal', n:'Terminal',    icon:'⌨',   desc:'UNIX-style shell',                 color:'linear-gradient(135deg,#00ff88,#00b4cc)' },
    { id:'files',    n:'Files',       icon:'📁',   desc:'File explorer',                    color:'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { id:'music',    n:'Music',       icon:'♪',   desc:'Ambient music player',             color:'linear-gradient(135deg,#ec4899,#a855f7)' },
    { id:'gallery',  n:'Gallery',     icon:'🖼',   desc:'Photo archive',                    color:'linear-gradient(135deg,#ec4899,#f97316)' },
    { id:'code',     n:'Code Editor', icon:'</>',  desc:'AtherCode IDE',                    color:'linear-gradient(135deg,#6366f1,#a855f7)' },
    { id:'browser',  n:'Browser',     icon:'◎',   desc:'AtherBrowser',                     color:'linear-gradient(135deg,#3b82f6,#00d4ff)' },
    { id:'notes',    n:'Notes',       icon:'✏',   desc:'Personal notes',                   color:'linear-gradient(135deg,#f59e0b,#22c55e)' },
    { id:'calc',     n:'Calculator',  icon:'▦',   desc:'Quantum calculator',               color:'linear-gradient(135deg,#6366f1,#a855f7)' },
    { id:'monitor',  n:'Monitor',     icon:'▲',   desc:'System diagnostics',               color:'linear-gradient(135deg,#22c55e,#00d4ff)' },
    { id:'settings', n:'Settings',    icon:'⚙',   desc:'OS configuration',                 color:'linear-gradient(135deg,#64748b,#475569)' },
  ];

  // ── Helpers ──────────────────────────────────────────
  const $ = id => document.getElementById(id);

  // ── Particles ────────────────────────────────────────
  function initParticles() {
    const cv = $('particles');
    const cx = cv.getContext('2d');

    function resize() {
      cv.width  = cv.offsetWidth  || window.innerWidth;
      cv.height = cv.offsetHeight || window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 75 }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  Math.random() * 1.4 + 0.3,
      a:  Math.random() * 0.6 + 0.1,
    }));

    (function draw() {
      cx.clearRect(0, 0, cv.width, cv.height);

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cv.width;
        if (p.x > cv.width) p.x = 0;
        if (p.y < 0) p.y = cv.height;
        if (p.y > cv.height) p.y = 0;
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(0,212,255,${p.a * 0.35})`;
        cx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 90) {
            cx.beginPath();
            cx.moveTo(pts[i].x, pts[i].y);
            cx.lineTo(pts[j].x, pts[j].y);
            cx.strokeStyle = `rgba(0,212,255,${0.07 * (1 - d / 90)})`;
            cx.lineWidth = 0.5;
            cx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  // ── Clock & Calendar ─────────────────────────────────
  const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const MONS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  function tick() {
    const n = new Date();
    const h = String(n.getHours()).padStart(2,'0');
    const m = String(n.getMinutes()).padStart(2,'0');
    const s = String(n.getSeconds()).padStart(2,'0');
    const lt = $('lockTime'); if (lt) lt.textContent = `${h}:${m}`;
    const ld = $('lockDate'); if (ld) ld.textContent = `${DAYS[n.getDay()]}  ·  ${n.getDate()} ${MONS[n.getMonth()]} ${n.getFullYear()}`;
    const tc = $('tbClock');  if (tc) tc.textContent = `${h}:${m}:${s}`;
    const sb = $('sysStatus'); if (sb) sb.textContent = `ONLINE · ${h}:${m}:${s}`;
  }

  function buildCalendar() {
    const n = new Date();
    const cm = $('calMonth'), cg = $('calGrid');
    if (!cm || !cg) return;
    cm.textContent = MONS[n.getMonth()] + ' ' + n.getFullYear();
    const dayHeaders = ['S','M','T','W','T','F','S'];
    cg.innerHTML = dayHeaders.map(d => `<div class="cal-day-header">${d}</div>`).join('');
    const first = new Date(n.getFullYear(), n.getMonth(), 1).getDay();
    const last  = new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate();
    for (let i = 0; i < first; i++) cg.innerHTML += `<div class="cal-day"></div>`;
    for (let i = 1; i <= last; i++) cg.innerHTML += `<div class="cal-day${i === n.getDate() ? ' today' : ''}">${i}</div>`;
  }

  // ── Rotating Quotes ──────────────────────────────────
  const QUOTES = [
    ['"The universe is not outside of you. Look inside yourself; everything that you want, you already are."', '— Rumi'],
    ['"We are all just walking each other home."', '— Ram Dass'],
    ['"Create with the heart; build with the mind."', '— Criss Jami'],
    ['"The cosmos is within us. We are made of star-stuff."', '— Carl Sagan'],
    ['"Make it simple, but significant."', '— Don Draper'],
    ['"You are the universe experiencing itself."', '— Alan Watts'],
    ['"Every moment is a fresh beginning."', '— T.S. Eliot'],
    ['"The wound is the place where the light enters you."', '— Rumi'],
  ];
  let quoteIdx = 0;

  function rotateQuotes() {
    quoteIdx = (quoteIdx + 1) % QUOTES.length;
    const qt = $('quoteText'), qa = $('quoteAuthor');
    if (!qt || !qa) return;
    qt.style.opacity = '0'; qa.style.opacity = '0';
    setTimeout(() => {
      qt.textContent = QUOTES[quoteIdx][0];
      qa.textContent = QUOTES[quoteIdx][1];
      qt.style.opacity = '1'; qa.style.opacity = '1';
    }, 400);
  }

  // ── Wallpaper ────────────────────────────────────────
  function setWall(idx) {
    state.wallIdx = idx;
    const el = $('wallpaper');
    if (el) el.style.background = WALLS[idx];
  }

  function nextWall() { setWall((state.wallIdx + 1) % WALLS.length); }

  // ── Boot Sequence ────────────────────────────────────
  const BOOT_MSGS = [
    'Initializing kernel...',
    'Loading personality cores...',
    'Mounting DualSoul engine...',
    'Calibrating holographic layers...',
    'Connecting to memory archive...',
    'Syncing ambient sensors...',
    'AtherOS 2050.2 ready.',
  ];

  function boot() {
    let progress = 0, msgIdx = 0;
    const bar = $('bootBar'), msg = $('bootMsg');

    const iv = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 8 + 3);
      if (bar) bar.style.width = progress + '%';
      if (msg && msgIdx < BOOT_MSGS.length && progress > msgIdx * (100 / BOOT_MSGS.length)) {
        msg.textContent = BOOT_MSGS[msgIdx];
        msgIdx++;
      }
      if (progress >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          const b = $('boot');
          if (b) { b.style.opacity = '0'; b.style.transition = 'opacity 0.8s'; setTimeout(() => b.style.display = 'none', 800); }
        }, 500);
      }
    }, 100);
  }

  // ── Lock Screen ──────────────────────────────────────
  function handlePinKey(e) {
    if (state.unlocked) return;
    if (e.key >= '0' && e.key <= '9' && state.pin.length < 4) {
      state.pin += e.key;
      for (let i = 0; i < 4; i++) {
        const dot = $('ld' + i);
        if (dot) dot.classList.toggle('active', i < state.pin.length);
      }
      if (state.pin.length === 4) {
        if (state.pin === '1234') {
          setTimeout(unlock, 250);
        } else {
          state.pin = '';
          setTimeout(() => {
            for (let i = 0; i < 4; i++) {
              const dot = $('ld' + i);
              if (dot) dot.classList.remove('active');
            }
          }, 300);
        }
      }
    }
  }

  function unlock() {
    if (state.unlocked) return;
    state.unlocked = true;
    document.removeEventListener('click', unlockClick);
    const lock = $('lock');
    if (lock) {
      lock.style.opacity = '0';
      lock.style.transform = 'scale(1.04)';
      lock.style.transition = 'all 0.8s';
      setTimeout(() => {
        lock.style.display = 'none';
        const desk = $('desktop');
        if (desk) desk.style.display = 'block';
        showNotif('AtherOS', 'Welcome back. System fully online.', 3500);
      }, 800);
    }
  }

  function unlockClick() { unlock(); }

  // ── Notifications ────────────────────────────────────
  function showNotif(title, body, dur = 4000) {
    const container = $('notifications');
    if (!container) return;

    const el = document.createElement('div');
    el.className = 'notif';
    el.innerHTML = `<div class="notif-title">${title}</div><div class="notif-body">${body}</div>`;
    container.appendChild(el);

    state.ncLog.unshift({ title, body, time: 'just now' });
    renderNC();

    el.onclick = () => dismissNotif(el);
    setTimeout(() => dismissNotif(el), dur);
  }

  function dismissNotif(el) {
    if (!el.parentNode) return;
    el.style.opacity = '0';
    el.style.transform = 'translateX(30px)';
    setTimeout(() => el.remove(), 300);
  }

  function renderNC() {
    const list = $('ncList');
    if (!list) return;
    list.innerHTML = state.ncLog.slice(0, 20).map(x =>
      `<div class="nc-item">
        <div class="nc-app">${x.title}</div>
        <div class="nc-text">${x.body}</div>
        <div class="nc-time">${x.time}</div>
      </div>`
    ).join('');
  }

  // ── Window Manager ───────────────────────────────────
  function openApp(id) {
    if (state.windows[id]) { focusWin(id); return; }
    const def = APP_DEFS[id];
    if (!def) return;

    const container = $('windows');
    const el = document.createElement('div');
    el.className = 'window anim-in';
    el.id = 'win-' + id;

    const count = Object.keys(state.windows).length;
    const left = Math.min(60 + count * 28, 420);
    const top  = Math.min(36 + count * 28, 200);

    el.style.cssText = `width:${def.w}px;height:${def.h}px;left:${left}px;top:${top}px;z-index:${++state.zIndex};`;

    el.innerHTML = `
      <div class="win-titlebar" onmousedown="OS.startDrag(event,'${id}')">
        <div class="win-btn close" onclick="OS.closeWin('${id}')"></div>
        <div class="win-btn min"   onclick="OS.minWin('${id}')"></div>
        <div class="win-btn max"   onclick="OS.maxWin('${id}')"></div>
        <div class="win-title">${def.icon}  ${def.title}</div>
      </div>
      <div class="win-body" id="wb-${id}"></div>
      <div class="win-resize" onmousedown="OS.startResize(event,'${id}')"></div>`;

    container.appendChild(el);
    state.windows[id] = { el, def, maxed: false };
    focusWin(id);

    // Inject app content
    const body = $('wb-' + id);
    if (body) body.innerHTML = buildApp(id);

    // Taskbar indicator
    const tb = $('tb-' + id);
    if (tb) tb.classList.add('active');

    // Post-mount hooks
    if (id === 'monitor') MonitorApp.start();
    if (id === 'terminal') setTimeout(() => { const t = document.getElementById('termInput'); if (t) t.focus(); }, 80);
  }

  function closeWin(id) {
    const w = state.windows[id];
    if (!w) return;
    w.el.style.opacity = '0';
    w.el.style.transform = 'scale(0.95)';
    w.el.style.transition = 'all 0.2s';
    setTimeout(() => {
      w.el.remove();
      delete state.windows[id];
      const tb = $('tb-' + id);
      if (tb) tb.classList.remove('active');
    }, 200);
    if (id === 'monitor') MonitorApp.stop();
    if (id === 'music') MusicApp.stop();
  }

  function minWin(id) {
    const w = state.windows[id];
    if (!w) return;
    w.el.style.display = w.el.style.display === 'none' ? 'flex' : 'none';
  }

  function maxWin(id) {
    const w = state.windows[id];
    if (!w) return;
    if (!w.maxed) {
      w._saved = { l: w.el.style.left, t: w.el.style.top, w: w.el.style.width, h: w.el.style.height };
      Object.assign(w.el.style, { left:'0', top:'0', width:'100%', height:'calc(100% - 52px)', borderRadius:'0' });
      w.maxed = true;
    } else {
      const s = w._saved;
      Object.assign(w.el.style, { left:s.l, top:s.t, width:s.w, height:s.h, borderRadius:'16px' });
      w.maxed = false;
    }
  }

  function focusWin(id) {
    const w = state.windows[id];
    if (!w) return;
    Object.values(state.windows).forEach(x => x.el.classList.remove('focused'));
    w.el.style.zIndex = ++state.zIndex;
    w.el.classList.add('focused');
    w.el.style.display = 'flex';
  }

  function startDrag(e, id) {
    e.preventDefault();
    const w = state.windows[id];
    if (!w || w.maxed) return;
    state.drag = { id, ox: e.clientX - w.el.offsetLeft, oy: e.clientY - w.el.offsetTop };
  }

  function startResize(e, id) {
    e.preventDefault(); e.stopPropagation();
    state.resize = { id };
  }

  // ── Context Menu ─────────────────────────────────────
  function showContextMenu(e) {
    if (e.target.closest('.window') || e.target.closest('#taskbar')) return;
    e.preventDefault();
    const m = $('contextMenu');
    if (!m) return;
    m.style.cssText = `display:block;left:${Math.min(e.clientX, window.innerWidth - 200)}px;top:${Math.min(e.clientY, window.innerHeight - 200)}px;`;
    m.innerHTML = `
      <div class="ctx-item" onclick="OS.openApp('dualsoul');OS.hideCtx()">✦ &nbsp;Open DualSoul</div>
      <div class="ctx-item" onclick="OS.openApp('terminal');OS.hideCtx()">⌨ &nbsp;New Terminal</div>
      <div class="ctx-item" onclick="OS.openApp('code');OS.hideCtx()">&lt;/&gt; Code Editor</div>
      <div class="ctx-sep"></div>
      <div class="ctx-item" onclick="OS.nextWall();OS.hideCtx()">🖼 &nbsp;Change Wallpaper</div>
      <div class="ctx-item" onclick="OS.openApp('settings');OS.hideCtx()">⚙ &nbsp;Settings</div>
      <div class="ctx-sep"></div>
      <div class="ctx-item" onclick="OS.showNotif('Desktop','Refreshed successfully.',2000);OS.hideCtx()">↺ &nbsp;Refresh</div>`;
    setTimeout(() => document.addEventListener('click', hideCtx, { once: true }), 0);
  }

  function hideCtx() {
    const m = $('contextMenu');
    if (m) m.style.display = 'none';
  }

  // ── Launcher ─────────────────────────────────────────
  function buildLauncherGrid(q = '') {
    const grid = $('launcherGrid');
    if (!grid) return;
    const apps = q ? ALL_APPS_LIST.filter(a => a.n.toLowerCase().includes(q.toLowerCase())) : ALL_APPS_LIST;
    grid.innerHTML = apps.map(a => `
      <div class="launcher-app" onclick="OS.openApp('${a.id}');OS.toggleLauncher();">
        <div class="launcher-icon" style="background:${a.color};">${a.icon}</div>
        <div class="launcher-label">${a.n}</div>
      </div>`).join('');
  }

  function toggleLauncher() {
    state.launchOpen = !state.launchOpen;
    const el = $('launcher');
    const tb = $('tb-launcher');
    if (el) el.classList.toggle('open', state.launchOpen);
    if (tb) tb.classList.toggle('active', state.launchOpen);
    if (state.launchOpen) buildLauncherGrid();
  }

  function filterLauncher(q) { buildLauncherGrid(q); }

  // ── Spotlight ─────────────────────────────────────────
  function toggleSpotlight() {
    state.spotOpen = !state.spotOpen;
    const el = $('spotlight');
    if (el) el.classList.toggle('open', state.spotOpen);
    if (state.spotOpen) {
      setTimeout(() => {
        const inp = $('spotlightInput');
        if (inp) { inp.value = ''; inp.focus(); spotSearch(''); }
      }, 40);
    }
  }

  function spotSearch(q) {
    const res = $('spotlightResults');
    if (!res) return;
    const matches = q ? ALL_APPS_LIST.filter(a => a.n.toLowerCase().includes(q.toLowerCase())) : ALL_APPS_LIST;
    if (!matches.length) { res.style.display = 'none'; return; }
    res.style.display = 'block';
    res.innerHTML = matches.slice(0, 6).map(a => `
      <div class="spot-result" onclick="OS.openApp('${a.id}');OS.toggleSpotlight();">
        <div class="spot-r-icon">${a.icon}</div>
        <div>
          <div class="spot-r-name">${a.n}</div>
          <div class="spot-r-sub">${a.desc}</div>
        </div>
      </div>`).join('');
  }

  function spotKey(e) { if (e.key === 'Escape') toggleSpotlight(); }

  // ── AI Panel ─────────────────────────────────────────
  const AI_REPLIES = {
    'dualsoul':  'DualSoul is your cinematic portfolio — two personalities, Shadow and Nova, merged into one interactive experience. It lives natively inside AtherOS.',
    'who am i':  'You are the architect of this universe. A photographer, a coder, a storyteller. Both Shadow and Nova.',
    'files':     'Opening your file system... <span style="color:var(--cyan)">→ /home/user</span>',
    'music':     'Your ambient playlist is loaded. 5 tracks ready. Click Music in the taskbar.',
    'hello':     'Hello, creator. The system is online and your memories are synchronized.',
    'help':      'I can help you navigate AtherOS, open apps, recall memories, or just talk.',
    'default':   "I'm processing that... The archive shows no direct match, but I'm always learning from you.",
  };

  function toggleAI() {
    state.aiOpen = !state.aiOpen;
    const panel = $('aiPanel');
    const tb    = $('tb-ai');
    if (panel) panel.classList.toggle('open', state.aiOpen);
    if (tb)    tb.classList.toggle('active', state.aiOpen);
    if (state.ncOpen) toggleNC();
  }

  function sendAI() {
    const inp  = $('aiInput');
    const msgs = $('aiMessages');
    if (!inp || !msgs) return;
    const text = inp.value.trim();
    if (!text) return;
    inp.value = '';

    const um = document.createElement('div');
    um.className = 'ai-msg ai-msg-user';
    um.textContent = text;
    msgs.appendChild(um);
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(() => {
      const key   = Object.keys(AI_REPLIES).find(k => text.toLowerCase().includes(k)) || 'default';
      const am    = document.createElement('div');
      am.className = 'ai-msg ai-msg-bot';
      am.innerHTML = AI_REPLIES[key];
      msgs.appendChild(am);
      msgs.scrollTop = msgs.scrollHeight;
    }, 650);
  }

  // ── Notification Centre ──────────────────────────────
  function toggleNC() {
    state.ncOpen = !state.ncOpen;
    const nc = $('notifCenter');
    const tb = $('tb-nc');
    if (nc) nc.classList.toggle('open', state.ncOpen);
    if (tb) tb.classList.toggle('active', state.ncOpen);
    if (state.aiOpen) toggleAI();
  }

  // ── App Builder ──────────────────────────────────────
  function buildApp(id) {
    switch (id) {
      case 'dualsoul': return DualSoulApp.build();
      case 'terminal': return TerminalApp.build();
      case 'notes':    return NotesApp.build();
      case 'calc':     return CalcApp.build();
      case 'music':    return MusicApp.build();
      case 'files':    return FilesApp.build();
      case 'monitor':  return MonitorApp.build();
      case 'settings': return SettingsApp.build();
      case 'browser':  return BrowserApp.build();
      case 'gallery':  return GalleryApp.build();
      case 'code':     return CodeApp.build();
      default: return `<div style="padding:24px;color:rgba(255,255,255,0.3);">Loading ${id}...</div>`;
    }
  }

  // ── Global Event Listeners ───────────────────────────
  function bindEvents() {
    // Drag & Resize
    document.addEventListener('mousemove', e => {
      if (state.drag) {
        const w = state.windows[state.drag.id];
        if (!w) return;
        w.el.style.left = (e.clientX - state.drag.ox) + 'px';
        w.el.style.top  = Math.max(0, e.clientY - state.drag.oy) + 'px';
      }
      if (state.resize) {
        const w = state.windows[state.resize.id];
        if (!w) return;
        w.el.style.width  = Math.max(280, e.clientX - w.el.offsetLeft) + 'px';
        w.el.style.height = Math.max(160, e.clientY - w.el.offsetTop)  + 'px';
      }
    });

    document.addEventListener('mouseup', () => { state.drag = null; state.resize = null; });

    // Focus window on click
    document.addEventListener('mousedown', e => {
      const winEl = e.target.closest('.window');
      if (winEl) {
        const id = winEl.id.replace('win-', '');
        focusWin(id);
      }
    });

    // Context menu
    document.addEventListener('contextmenu', showContextMenu);

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (state.unlocked) toggleSpotlight();
      }
      if (e.key === 'Escape' && state.spotOpen) toggleSpotlight();
      if (e.key === 'Escape' && state.launchOpen) toggleLauncher();
    });

    // Close launcher on outside click
    document.addEventListener('click', e => {
      if (state.launchOpen && !e.target.closest('#launcher') && !e.target.closest('#tb-launcher')) {
        toggleLauncher();
      }
    });

    // Lock screen
    document.addEventListener('keydown', handlePinKey);
    document.addEventListener('click', unlockClick);
  }

  // ── Init ─────────────────────────────────────────────
  function init() {
    initParticles();
    setWall(0);
    tick();
    setInterval(tick, 1000);
    buildCalendar();
    setInterval(rotateQuotes, 9000);
    bindEvents();
    boot();

    // Startup notifications
    setTimeout(() => showNotif('AtherOS', '📡 Weather — Mumbai: 28°C ⛅ Partly Cloudy', 4000), 1800);
    setTimeout(() => showNotif('DualSoul', '✦ Memory archive synchronized — 2050 logs accessible', 4000), 4500);
    setTimeout(() => showNotif('Aether AI', '◈ I\'m online. Ask me anything.', 3500), 7500);
    setTimeout(() => showNotif('AtherOS', '💡 Ctrl+K: Search · Right-click: Desktop menu · Dbl-click: Open apps', 6000), 11000);
  }

  // ── Public API ───────────────────────────────────────
  return {
    init,
    openApp,
    closeWin,
    minWin,
    maxWin,
    focusWin,
    startDrag,
    startResize,
    showNotif,
    toggleLauncher,
    filterLauncher,
    toggleSpotlight,
    spotSearch,
    spotKey,
    toggleAI,
    sendAI,
    toggleNC,
    hideCtx,
    nextWall,
    setWall,
    getWalls: () => WALLS,
    getWallIdx: () => state.wallIdx,
  };
})();

document.addEventListener('DOMContentLoaded', OS.init);
