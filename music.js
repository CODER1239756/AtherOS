/**
 * AtherOS — Music Player App
 */

const MusicApp = (() => {
  const tracks = [
    { t:'Neon Reverie',    a:'AtherSounds',       e:'🌌', d:225 },
    { t:'Cinematic Void',  a:'Shadow Collective',  e:'🎞', d:198 },
    { t:'Digital Bloom',   a:'Nova Waves',         e:'🌸', d:243 },
    { t:'2050 Pulse',      a:'Quantum Beat',       e:'⚡', d:187 },
    { t:'Memory Lane',     a:'DualSoul OST',       e:'💫', d:267 },
  ];

  const colors = [
    'linear-gradient(135deg,#a855f7,#00d4ff)',
    'linear-gradient(135deg,#ec4899,#a855f7)',
    'linear-gradient(135deg,#00d4ff,#22c55e)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#6366f1,#a855f7)',
  ];

  let idx      = 0;
  let playing  = false;
  let progress = 0;
  let interval = null;

  function build() {
    const t = tracks[idx];
    return `
      <div class="music-wrap">
        <div class="music-label">NOW PLAYING</div>
        <div class="music-cover${playing ? ' playing' : ''}" id="mCover"
          style="background:${colors[idx % colors.length]};">${t.e}</div>
        <div class="music-title"  id="mTitle">${t.t}</div>
        <div class="music-artist" id="mArtist">${t.a}</div>

        <div class="music-timebar">
          <div class="music-times">
            <span id="mTime">0:00</span>
            <span>${fmt(t.d)}</span>
          </div>
          <div class="music-progress-bar" onclick="MusicApp.seek(event)">
            <div class="music-progress-fill" id="mFill" style="width:${progress}%;"></div>
          </div>
        </div>

        <div class="music-controls">
          <div class="music-ctrl" onclick="MusicApp.prev()">⏮</div>
          <div class="music-ctrl main" id="mPlay" onclick="MusicApp.toggle()">${playing ? '⏸' : '▶'}</div>
          <div class="music-ctrl" onclick="MusicApp.next()">⏭</div>
        </div>

        <div class="music-track-list">
          ${tracks.map((tr, i) => `
            <div class="music-track${i === idx ? ' active' : ''}" onclick="MusicApp.setTrack(${i})">
              <span style="font-size:18px;">${tr.e}</span>
              <div style="flex:1;">
                <div class="music-track-name" style="color:${i === idx ? 'var(--cyan)' : 'var(--text)'};">${tr.t}</div>
                <div class="music-track-artist">${tr.a}</div>
              </div>
              <div class="music-track-dur">${fmt(tr.d)}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function fmt(s) { return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }

  function toggle() {
    playing = !playing;
    const btn = document.getElementById('mPlay');
    const cov = document.getElementById('mCover');
    if (btn) btn.textContent = playing ? '⏸' : '▶';
    if (cov) { cov.className = 'music-cover' + (playing ? ' playing' : ''); }
    if (playing) startInterval(); else clearInterval(interval);
  }

  function startInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
      const dur = tracks[idx].d;
      progress = Math.min(100, progress + 100 / dur);
      const fill = document.getElementById('mFill');
      if (fill) fill.style.width = progress + '%';
      const time = document.getElementById('mTime');
      const secs = Math.floor(progress * dur / 100);
      if (time) time.textContent = fmt(secs);
      if (progress >= 100) { progress = 0; next(); }
    }, 1000);
  }

  function next() {
    idx = (idx + 1) % tracks.length;
    progress = 0; clearInterval(interval);
    reload();
  }

  function prev() {
    idx = (idx - 1 + tracks.length) % tracks.length;
    progress = 0; clearInterval(interval);
    reload();
  }

  function setTrack(i) {
    idx = i; progress = 0; clearInterval(interval);
    reload();
  }

  function seek(e) {
    const bar = document.getElementById('mFill')?.parentElement;
    if (!bar) return;
    progress = (e.offsetX / bar.offsetWidth) * 100;
    const fill = document.getElementById('mFill');
    if (fill) fill.style.width = progress + '%';
  }

  function reload() {
    const wb = document.getElementById('wb-music');
    if (wb) { wb.innerHTML = build(); if (playing) startInterval(); }
  }

  function stop() { clearInterval(interval); playing = false; }

  return { build, toggle, next, prev, setTrack, seek, stop };
})();
