# AtherOS — Personal Digital Universe

> *"Designed for the future. Running in the present. Archived from 2050."*

A fully interactive, futuristic web-based operating system built as a cinematic personal portfolio and creative universe.

---

## 🚀 Getting Started

### Option 1 — Open directly (quickest)
```
Double-click index.html in any modern browser
```

### Option 2 — Local dev server (recommended, avoids font CORS issues)
```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# Then open: http://localhost:8080
```

---

## 📁 Project Structure

```
AtherOS/
├── index.html              ← Entry point
├── README.md
├── css/
│   └── styles.css          ← Full design system & all app styles
└── js/
    ├── core.js             ← OS engine (boot, windows, launcher, AI, clock…)
    └── apps/
        ├── dualsoul.js     ← DualSoul split-screen portfolio app
        ├── terminal.js     ← Full UNIX-style terminal with virtual FS
        ├── music.js        ← Ambient music player
        └── files.js        ← Files + Gallery + Code Editor + Notes +
                              Calculator + Browser + Monitor + Settings
```

---

## 🎮 How to Use

### Boot & Unlock
| Action | Result |
|---|---|
| Wait ~5s | Boot sequence completes |
| Click anywhere | Unlocks to desktop |
| Type `1234` | PIN unlock |

### Desktop
| Action | Result |
|---|---|
| **Right-click** desktop | Context menu |
| **Double-click** icon | Open app |
| **Ctrl + K** | Spotlight search |

### Windows
| Action | Result |
|---|---|
| Drag title bar | Move window |
| 🔴 button | Close |
| 🟡 button | Minimise |
| 🟢 button | Maximise / restore |
| Drag bottom-right corner | Resize |

### Taskbar
| Button | App |
|---|---|
| `⊞` | App launcher grid |
| `✦` | DualSoul portfolio |
| `⌨` | Terminal |
| `📁` | File Explorer |
| `♪` | Music Player |
| `🖼` | Gallery |
| `</>` | Code Editor |
| `◎` | AtherBrowser |
| `✏` | Notes |
| `▦` | Calculator |
| `▲` | System Monitor |
| `⚙` | Settings |
| `🔍` | Spotlight search |
| `◈` | Aether AI panel |
| `🔔` | Notification centre |

---

## ⌨️ Terminal Commands

```bash
help        # List all commands
ls          # List directory contents
cd <dir>    # Change directory  (cd .. / cd ~ / cd projects)
pwd         # Print working directory
cat <file>  # Read a file  (try: cat readme.md  /  cat notes.txt)
mkdir <dir> # Create directory
touch <file># Create file
rm <file>   # Remove file
echo <text> # Print text
date        # Current date & time
whoami      # User info
neofetch    # System info with ASCII art
clear       # Clear terminal
```

**Secret:** Try `cd .secret` then `cat hidden_message.txt` 🔒

---

## ✦ DualSoul Portfolio

The centrepiece app — a split-screen cinematic portfolio with two contrasting personalities:

| SHADOW | NOVA |
|---|---|
| Introspective | Expressive |
| Photography | Development |
| Cinematic | Vibrant |
| Calm | Playful |

- Click either side to explore that profile's skills, projects & story
- Click **BACK** to return to the split view
- Click any **Memory Fragment** in the archive strip for Easter eggs

---

## 🎨 Personalisation

### Wallpapers
- Right-click desktop → **Change Wallpaper**
- Or open **Settings → Appearance → Wallpaper**

### Notes
- Auto-saved to browser `localStorage`
- Bold / Italic / Heading toolbar included

### Settings toggles
- Particle effects, glassmorphism, animations, notifications, AI panel, sound

---

## 🌐 Browser Compatibility

| Browser | Support |
|---|---|
| Chrome / Edge 100+ | ✅ Full |
| Firefox 100+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Mobile | ⚠ Desktop layout only |

---

## 🛠 Customising

### Change the unlock PIN
In `js/core.js`, find:
```js
if (state.pin === '1234') {
```
Replace `'1234'` with your 4-digit PIN.

### Add your name / city to the weather widget
In `index.html`, find the weather widget section and update the static values.

### Add your own tracks to the music player
In `js/apps/music.js`, edit the `tracks` array:
```js
const tracks = [
  { t:'Your Track Name', a:'Artist Name', e:'🎵', d: 240 }, // d = duration in seconds
  ...
];
```

### Add your own memories to DualSoul
In `js/apps/dualsoul.js`, edit the `MEMORIES` array and the `PROFILES` object.

### Add apps
1. Create `js/apps/yourapp.js` exporting `const YourApp = (() => { ... })()`
2. Add `<script src="js/apps/yourapp.js">` in `index.html` before `core.js`
3. Add an entry to `APP_DEFS` in `js/core.js`
4. Add a `case 'yourapp':` in the `buildApp` switch

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom design system, glassmorphism, animations) |
| Logic | Vanilla JavaScript ES6+ (no build tools required) |
| Fonts | Google Fonts — Orbitron, Exo 2, JetBrains Mono |
| Storage | `localStorage` (notes persistence) |

---

## 📜 License

Personal use. Built with soul, code, and memory.

---

*AtherOS — v2050.2 · Personal Digital Universe*
