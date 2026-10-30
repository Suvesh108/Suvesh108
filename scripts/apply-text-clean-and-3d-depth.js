const fs = require('fs');

let html = fs.readFileSync('preview.html', 'utf8');

// -------------------------------------------------------------
// 1. REMOVE SPECIFIC TEXTS
// -------------------------------------------------------------

// Text 1: Hero tagline
const heroTaglineRegex = /<p class="hero-tagline">\s*Architecting resilient cloud-native infrastructure, low-latency concurrent backends, and zero-trust edge automation\.\s*<\/p>/;
if (heroTaglineRegex.test(html)) {
  html = html.replace(heroTaglineRegex, '');
  console.log('Removed text 1: hero tagline');
} else {
  console.log('Text 1 not matched with regex, searching exact string');
  html = html.replace(/<p class="hero-tagline">[\s\S]*?Architecting resilient cloud-native infrastructure[\s\S]*?<\/p>/, '');
}

// Text 2: Engineering Analytics Bento section description
const desc2 = '<p class="section-desc">Production throughput telemetry, cadence distributions, and architecture mix</p>';
if (html.includes(desc2)) {
  html = html.replace(desc2, '');
  console.log('Removed text 2: Bento section desc');
}

// Text 3: Contribution Skyline section description
const desc3 = '<p class="section-desc">Interactive 3D isometric skyline &amp; activity heat map &bull; Drag to orbit &bull; Double-click to reset</p>';
if (html.includes(desc3)) {
  html = html.replace(desc3, '');
  console.log('Removed text 3: Skyline section desc');
}

// Text 4: Core Tech Arsenal section description
const desc4 = '<p class="section-desc">Platform primitives, systems languages, and cloud runtime architecture</p>';
if (html.includes(desc4)) {
  html = html.replace(desc4, '');
  console.log('Removed text 4: Core tech section desc');
}

// Text 5: My Projects section description
const desc5 = '<p class="section-desc">Open-source distributed runtimes, low-latency tooling, and cloud-native systems</p>';
if (html.includes(desc5)) {
  html = html.replace(desc5, '');
  console.log('Removed text 5: Projects section desc');
}

// Text 6: Logs section description
const desc6 = '<p class="section-desc">Interactive terminal execution stream and verified release manifest</p>';
if (html.includes(desc6)) {
  html = html.replace(desc6, '');
  console.log('Removed text 6: Logs section desc');
}

// -------------------------------------------------------------
// 2. RENAME HEADINGS
// -------------------------------------------------------------

// Rename "Engineering Analytics Bento" -> "Git Analytics"
html = html.replace('Engineering Analytics Bento', 'Git Analytics');
console.log('Renamed Engineering Analytics Bento to Git Analytics');

// Rename "Core Tech Arsenal" -> "My Core Tech"
// Note: also update any occurrences in headings/navigation
html = html.replace('Core Tech Arsenal', 'My Core Tech');
console.log('Renamed Core Tech Arsenal to My Core Tech');

// -------------------------------------------------------------
// 3. SIMPLIFY COMPLEX JARGON IN GIT ANALYTICS & PROJECTS
// -------------------------------------------------------------

// Bento card 1: Velocity Cadence -> Commit Activity
html = html.replace('<div class="bento-title">Velocity Cadence</div>', '<div class="bento-title">Commit Activity</div>');
html = html.replace('<span class="bento-badge">↗ 24.8% Cadence</span>', '<span class="bento-badge">↗ 24.8% More</span>');
html = html.replace('Scrub curve to inspect monthly commit delivery', 'Hover over the line to see monthly commits');
html = html.replace('Scrub curve to inspect monthly commit delivery', 'Hover over the line to see monthly commits'); // in case in JS too

// Bento card 2: Coding Rhythm & Focus -> Daily Coding Habits
html = html.replace('<div class="bento-title">Coding Rhythm &amp; Focus</div>', '<div class="bento-title">Daily Coding Habits</div>');
html = html.replace('<span class="bento-badge" style="color:var(--accent-secondary);border-color:rgba(129,140,248,0.3)">98.6% Flow</span>', '<span class="bento-badge" style="color:var(--accent-secondary);border-color:rgba(129,140,248,0.3)">Active Builder</span>');
html = html.replace('Zero merge conflicts across 29 active repositories', 'Clean merge history across 29 active projects');
html = html.replace('<span>00:00 (Late)</span><span>06:00 (Dawn)</span><span>12:00 (Noon)</span><span>18:00 (Dusk)</span><span>23:59</span>', '<span>Night</span><span>Morning</span><span>Afternoon</span><span>Evening</span><span>Midnight</span>');

// Bento card 3: Architecture Distribution -> Top Repositories
html = html.replace('<div class="bento-title">Architecture Distribution</div>', '<div class="bento-title">Top Repositories</div>');
html = html.replace('All Systems', 'All Projects');
html = html.replace('Platform Core', 'Core Apps');
html = html.replace('Edge &amp; Tooling', 'Tools &amp; APIs');

// Bento card 4: Competency & Stack -> Languages & Skills
html = html.replace('<div class="bento-title">Competency &amp; Stack</div>', '<div class="bento-title">Languages &amp; Skills</div>');
html = html.replace('Donut Pie', 'Pie View');

// JS chart updates for hover
html = html.replace('Velocity Units', 'Commits');
html = html.replace('Interval ${idx + 1}/24 · Sustained concurrent delivery', 'Month ${Math.floor(idx/2)+1} · Steady progress');

// Hero role simplification: keep professional yet clean
html = html.replace('Senior Full Stack Engineer &amp; Distributed Systems Architect', 'Senior Full Stack &amp; Systems Engineer');

// Meta chips: Invariant: Zero-Trust Zod/Pydantic -> Reliable & Tested Code
html = html.replace('Invariant: <b>Zero-Trust Zod/Pydantic</b>', 'Quality: <b>Tested &amp; Secure</b>');

// Simplify Project Descriptions to clear, punchy, easy words
html = html.replace(
  'High-performance multi-threaded job aggregator featuring TLS fingerprint bypassing, automated deduplication, and parsing pipelines across Naukri, LinkedIn, Indeed, Glassdoor, and Internshala.',
  'Fast, automated job search tool that collects and cleans listings across LinkedIn, Indeed, Naukri, Glassdoor, and Internshala into one dashboard.'
);

html = html.replace(
  'Premium real-time edge network diagnostic and telemetry platform powered by Cloudflare Speedtest engine with zero-CORS latency tracking and jitter analytics.',
  'Real-time network speed and latency tester powered by Cloudflare Edge with instant ping and jitter tracking.'
);

html = html.replace(
  'High-bitrate multi-threaded media extraction utility featuring parallel stream chunk downloading, lossless audio-video muxing, and custom format pipelines.',
  'High-speed media downloader that downloads parallel chunks and cleanly combines video and audio files.'
);

html = html.replace(
  'Decentralized product authentication and supply chain tracking protocol using cryptographic IDs, instant NFC/QR verification, and transparent provenance records.',
  'Product verification app using secure NFC &amp; QR tags to prevent counterfeits and trace product origin.'
);

// -------------------------------------------------------------
// 4. ENHANCE 3D DEPTH & AMBIENT PREMIUM LIGHTING
// -------------------------------------------------------------

// Enhance :root shadows and 3D lighting variables
const rootTarget = `--shadow-card: inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 12px 32px rgba(0, 0, 0, 0.5);`;
const rootReplacement = `--shadow-card: inset 0 1px 0 0 rgba(255, 255, 255, 0.12), inset 0 0 1px 1px rgba(255, 255, 255, 0.04), 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 20px 40px -4px rgba(0, 0, 0, 0.85);
  --shadow-card-hover: inset 0 1px 0 0 rgba(255, 255, 255, 0.2), inset 0 0 2px 1px rgba(245, 158, 11, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 28px 56px -6px rgba(0, 0, 0, 0.95);
  --depth-surface-bevel: linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 100%);`;

if (html.includes(rootTarget)) {
  html = html.replace(rootTarget, rootReplacement);
  console.log('Replaced --shadow-card in root');
}

// Add 3d styling rules to Bento Cards, Skyline Box, System Cards, CMD Window, and Tech Arsenal
const enhanced3DCSS = `
/* -------------------------------------------------------------
   PREMIUM 3D DEPTH & ELEVATION LAYER
   ------------------------------------------------------------- */
.bento-card, .skyline-box, .system-card, .cmd-window, .snake-card {
  box-shadow: var(--shadow-card) !important;
  background-image: var(--depth-surface-bevel) !important;
  position: relative;
  transform: translateZ(0);
}

.bento-card {
  transition: transform 220ms var(--ease-spring), box-shadow 220ms ease, border-color 200ms ease;
}
.bento-card:hover {
  transform: translateY(-3px) scale(1.002);
  box-shadow: var(--shadow-card-hover) !important;
  border-color: rgba(245, 158, 11, 0.35) !important;
}

/* 3D Depth on Charts Viewport */
.chart-container, .tech-viewport, .snake-frame {
  background: radial-gradient(ellipse at 50% -20%, rgba(245, 158, 11, 0.04) 0%, rgba(4, 6, 10, 0.95) 75%) !important;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 1px 0 rgba(255, 255, 255, 0.04) !important;
}

/* 3D Depth on Treemap Tiles */
.treemap-tile {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 4px 12px rgba(0, 0, 0, 0.4) !important;
}
.treemap-tile:hover {
  transform: translateY(-3px) scale(1.02) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.6) !important;
}

/* 3D Bevel & Lighting on Interactive Buttons & Badges */
.period-btn, .view-btn, .skyline-tab-btn, .filter-tab {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: all 180ms ease;
}
.period-btn.active, .view-btn.active, .skyline-tab-btn.active, .filter-tab.active {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 3px 8px rgba(245, 158, 11, 0.3) !important;
}

/* 3D Elevation on Arsenal Cards */
.arsenal-card {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 4px 10px rgba(0, 0, 0, 0.4) !important;
  transition: transform 200ms var(--ease-spring), box-shadow 200ms ease, border-color 180ms ease !important;
}
.arsenal-card:hover {
  transform: translateY(-3px) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 8px 22px rgba(0, 0, 0, 0.6) !important;
  border-color: var(--accent) !important;
}

/* 3D Elevation on Project Cards */
.system-card {
  box-shadow: var(--shadow-card) !important;
  transition: transform 220ms var(--ease-spring), box-shadow 220ms ease, border-color 200ms ease !important;
}
.system-card:hover {
  transform: translateY(-3px) scale(1.005) !important;
  box-shadow: var(--shadow-card-hover) !important;
  border-color: rgba(245, 158, 11, 0.4) !important;
}

/* 3D Elevation on Terminal / CMD Window */
.cmd-window {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 0 1px 1px rgba(255, 255, 255, 0.03), 0 24px 60px -8px rgba(0, 0, 0, 0.9) !important;
}
.cmd-title-bar {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.4);
}
`;

// Inject before </style>
html = html.replace('</style>', `${enhanced3DCSS}\n</style>`);
console.log('Injected 3D depth CSS');

fs.writeFileSync('preview.html', html, 'utf8');

// Sync to brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, html, 'utf8');
console.log('Synchronized to profile_preview.html');
