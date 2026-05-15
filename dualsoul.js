/**
 * AtherOS — DualSoul App
 * Cinematic split-screen portfolio experience
 */

const DualSoulApp = (() => {

  const MEMORIES = [
    '◈ First photograph', '◈ Built first app', '◈ Composed a song',
    '◈ 3AM epiphany', '◈ The bridge photo', '◈ Ocean sunrise code',
    '◈ Lost & found again', '◈ DualSoul born', '◈ The constellation map',
    '◈ Year of silence', '◈ The archive opens', '◈ Two worlds merge',
  ];

  const PROFILES = {
    shadow: {
      num: '01', color: '#c084fc', colorAlpha: 'rgba(168,85,247,',
      name: 'SHADOW', tag: 'INTROSPECTIVE · CINEMATIC · CALM',
      quote: '"I document the quiet moments the world forgets to see."',
      intro: '"I capture light and call it memory. Every photograph is a letter to my future self — proof that this moment existed, that I was here, that beauty is real."',
      bg: 'linear-gradient(160deg,#0b0520,#160830,#0c1828)',
      stats: [{ v:'247', l:'FRAMES' }, { v:'∞', l:'MEMORIES' }, { v:'18', l:'STORIES' }],
      skills: [
        ['Photography', 'Cinematic storytelling, film photography, long exposures'],
        ['Writing', 'Introspective poetry, personal essays, memory logs'],
        ['Ambience', 'Atmospheric music, drone sounds, lo-fi composition'],
      ],
      projects: [
        ['The Quiet Archive', 'A visual diary of forgotten spaces and silent moments'],
        ['Constellation Map', 'Memory mapped as a navigable star field'],
        ['2050 Logs', 'Dispatches from a future I'm building toward'],
      ],
    },
    nova: {
      num: '02', color: '#22d3ee', colorAlpha: 'rgba(0,212,255,',
      name: 'NOVA', tag: 'EXPRESSIVE · VIBRANT · PLAYFUL',
      quote: '"I build universes and live inside them."',
      intro: '"I write code like I write music — in loops and layers, building something alive. Every project is a universe I get to inhabit, even if only for a moment."',
      bg: 'linear-gradient(160deg,#001528,#002040,#001020)',
      stats: [{ v:'12K', l:'LINES' }, { v:'🎵', l:'BEATS' }, { v:'37', l:'PROJECTS' }],
      skills: [
        ['Development', 'React, Next.js, TypeScript, WebGL, creative coding'],
        ['Music', 'Electronic production, beat-making, synthesis'],
        ['Design', 'UI/UX, motion design, generative art'],
      ],
      projects: [
        ['AtherOS', 'This operating system you\'re using right now'],
        ['DualSoul', 'The cinematic portfolio platform'],
        ['Quantum Beat', 'An AI-powered generative music composer'],
      ],
    },
  };

  function build() {
    return `
      <div class="ds-wrap">
        <div class="ds-hero">
          <!-- LEFT: SHADOW -->
          <div class="ds-left" onclick="DualSoulApp.openProfile('shadow')">
            <div class="ds-orb" style="width:100px;height:100px;background:rgba(168,85,247,.07);top:8%;left:5%;border:1px solid rgba(168,85,247,.12);animation:orbFloat 4s ease-in-out infinite;"></div>
            <div class="ds-orb" style="width:50px;height:50px;background:rgba(0,212,255,.05);bottom:18%;right:10%;border-radius:50%;animation:orbFloat 6s ease-in-out infinite 2s;"></div>
            <div class="ds-profile-num" style="color:rgba(168,85,247,.5);">PROFILE · 01</div>
            <div class="ds-name" style="color:#c084fc;">SHADOW</div>
            <div class="ds-tag" style="color:rgba(168,85,247,.45);">INTROSPECTIVE · CINEMATIC · CALM</div>
            <div class="ds-quote">"I document the quiet moments the world forgets to see."</div>
            <div class="ds-stats">
              <div><div class="ds-stat-val" style="color:#c084fc;">247</div><div class="ds-stat-lbl">FRAMES</div></div>
              <div><div class="ds-stat-val" style="color:#c084fc;">∞</div><div class="ds-stat-lbl">MEMORIES</div></div>
              <div><div class="ds-stat-val" style="color:#c084fc;">18</div><div class="ds-stat-lbl">STORIES</div></div>
            </div>
            <div class="ds-explore-hint" style="color:rgba(168,85,247,.4);border-color:rgba(168,85,247,.15);">CLICK TO EXPLORE →</div>
          </div>

          <div class="ds-divider"></div>

          <!-- RIGHT: NOVA -->
          <div class="ds-right" onclick="DualSoulApp.openProfile('nova')">
            <div class="ds-orb" style="width:90px;height:90px;background:rgba(0,212,255,.07);top:10%;right:8%;border:1px solid rgba(0,212,255,.12);border-radius:50%;animation:orbFloat 5s ease-in-out infinite 1s;"></div>
            <div class="ds-orb" style="width:60px;height:60px;background:rgba(244,114,182,.05);bottom:14%;left:8%;animation:orbFloat 7s ease-in-out infinite 3s;border-radius:50%;"></div>
            <div class="ds-profile-num" style="color:rgba(0,212,255,.5);">PROFILE · 02</div>
            <div class="ds-name" style="color:#22d3ee;">NOVA</div>
            <div class="ds-tag" style="color:rgba(0,212,255,.45);">EXPRESSIVE · VIBRANT · PLAYFUL</div>
            <div class="ds-quote">"I build universes and live inside them."</div>
            <div class="ds-stats">
              <div><div class="ds-stat-val" style="color:#22d3ee;">12K</div><div class="ds-stat-lbl">LINES</div></div>
              <div><div class="ds-stat-val" style="color:#22d3ee;">🎵</div><div class="ds-stat-lbl">BEATS</div></div>
              <div><div class="ds-stat-val" style="color:#22d3ee;">37</div><div class="ds-stat-lbl">PROJECTS</div></div>
            </div>
            <div class="ds-explore-hint" style="color:rgba(0,212,255,.4);border-color:rgba(0,212,255,.15);">CLICK TO EXPLORE →</div>
          </div>
        </div>

        <!-- MEMORY ARCHIVE STRIP -->
        <div class="ds-archive">
          <div class="ds-archive-label">◈  MEMORY ARCHIVE  ·  ACCESSED FROM 2050  ◈</div>
          <div class="ds-memory-row">
            ${MEMORIES.map(m => `<div class="ds-memory" onclick="DualSoulApp.memFlash('${m}')">${m}</div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function openProfile(key) {
    const p = PROFILES[key];
    const wb = document.getElementById('wb-dualsoul');
    if (!wb) return;

    wb.innerHTML = `
      <div class="ds-detail" style="background:${p.bg};">
        <div class="ds-detail-hdr">
          <div style="font-size:9px;letter-spacing:4px;color:${p.color}55;">PROFILE · ${p.num}</div>
          <div style="font-family:'Orbitron',monospace;font-size:20px;font-weight:700;color:${p.color};letter-spacing:5px;margin-left:10px;">${p.name}</div>
          <div class="ds-back-btn" onclick="DualSoulApp.reset()">✕  BACK</div>
        </div>
        <div class="ds-detail-body">
          <div class="ds-intro-quote">${p.intro}</div>

          <div>
            <div class="ds-section-label" style="color:${p.color}55;">SKILLS &amp; CRAFTS</div>
            ${p.skills.map(([n,d]) => `
              <div class="ds-skill-item" style="border-bottom-color:rgba(255,255,255,.04);">
                <div class="ds-skill-name" style="color:${p.color};">${n}</div>
                <div class="ds-skill-desc">${d}</div>
              </div>`).join('')}
          </div>

          <div>
            <div class="ds-section-label" style="color:${p.color}55;">PROJECTS</div>
            ${p.projects.map(([n,d]) => `
              <div class="ds-project-card"
                onmouseover="this.style.borderColor='${p.color}30'"
                onmouseout="this.style.borderColor='rgba(255,255,255,.06)'">
                <div class="ds-project-name">${n}</div>
                <div class="ds-project-desc">${d}</div>
              </div>`).join('')}
          </div>

          <div style="text-align:center;padding:16px 0;">
            <div style="font-size:9px;letter-spacing:3px;color:rgba(255,255,255,.18);">◈  END OF ARCHIVE ENTRY  ◈</div>
          </div>
        </div>
      </div>`;
  }

  function reset() {
    const wb = document.getElementById('wb-dualsoul');
    if (wb) wb.innerHTML = build();
  }

  function memFlash(m) {
    OS.showNotif('Memory Fragment', `Loading: ${m.replace('◈ ', '')}...`, 3000);
  }

  return { build, openProfile, reset, memFlash };
})();
