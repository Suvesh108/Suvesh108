const fs = require('fs');
const path = require('path');

const previewPath = path.resolve('preview.html');
let content = fs.readFileSync(previewPath, 'utf8');

// 1. UPDATE CSS FOR ROOT OBSIDIAN AMBER PALETTE & REMOVE THEME SWITCHER STYLES
// Replace :root and remove data-theme rules
const rootStyleOld = `:root {
  /* Default Palette: Titanium Azure */
  --bg-page: #080b11;
  --bg-surface: #0e131f;
  --bg-subpanel: #131a2b;
  --bg-card-hover: #172036;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(56, 189, 248, 0.4);
  --border-rim: rgba(255, 255, 255, 0.06);
  --accent: #38bdf8;
  --accent-muted: rgba(56, 189, 248, 0.12);
  --accent-secondary: #818cf8;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --shadow-card: inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 12px 32px rgba(0, 0, 0, 0.4);
  --radius-card: 14px;
  --radius-inner: 10px;
  --radius-chip: 6px;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Geist Mono", monospace;
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
}

[data-theme="amber"] {
  --bg-page: #09090b;
  --bg-surface: #121217;
  --bg-subpanel: #181820;
  --bg-card-hover: #20202b;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(245, 158, 11, 0.4);
  --border-rim: rgba(255, 255, 255, 0.05);
  --accent: #f59e0b;
  --accent-muted: rgba(245, 158, 11, 0.12);
  --accent-secondary: #d97706;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
}

[data-theme="emerald"] {
  --bg-page: #070b09;
  --bg-surface: #0d1511;
  --bg-subpanel: #121f19;
  --bg-card-hover: #182821;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(16, 185, 129, 0.4);
  --border-rim: rgba(255, 255, 255, 0.06);
  --accent: #10b981;
  --accent-muted: rgba(16, 185, 129, 0.12);
  --accent-secondary: #059669;
  --text-primary: #f0fdf4;
  --text-secondary: #9ca3af;
  --text-tertiary: #6b7280;
}`;

const rootStyleNew = `:root {
  /* Obsidian Amber Palette (Enforced Global Default) */
  --bg-page: #09090b;
  --bg-surface: #121217;
  --bg-subpanel: #181820;
  --bg-card-hover: #1f1f2a;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(245, 158, 11, 0.4);
  --border-rim: rgba(255, 255, 255, 0.05);
  --accent: #f59e0b;
  --accent-muted: rgba(245, 158, 11, 0.12);
  --accent-secondary: #d97706;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  --shadow-card: inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 12px 32px rgba(0, 0, 0, 0.5);
  --radius-card: 14px;
  --radius-inner: 10px;
  --radius-chip: 6px;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Geist Mono", monospace;
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
}`;

content = content.replace(rootStyleOld, rootStyleNew);

// 2. CENTER ALL HEADERS AND HEADLINE CONTENT
// Update .hero, .hero-header, .hero-title-group, .meta-chips, .social-nav, and .section-header
const oldHeroStyles = `.hero {
  padding: 24px 0 36px;
  border-bottom: 1px solid var(--border-subtle);
}
.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}
.hero-title-group {
  max-width: 660px;
}
h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.15;
  margin: 0 0 6px;
  color: var(--text-primary);
}
.hero-role {
  font-size: 14.5px;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}
.hero-tagline {
  color: var(--text-secondary);
  font-size: 13.5px;
  max-width: 580px;
  margin: 0 0 18px;
  line-height: 1.6;
}
.meta-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}`;

const newHeroStyles = `.hero {
  padding: 32px 0 40px;
  border-bottom: 1px solid var(--border-subtle);
  text-align: center;
}
.hero-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
}
.hero-title-group {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
h1 {
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.15;
  margin: 0 0 8px;
  color: var(--text-primary);
  text-align: center;
}
.hero-role {
  font-size: 15px;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
  text-align: center;
}
.hero-tagline {
  color: var(--text-secondary);
  font-size: 13.5px;
  max-width: 620px;
  margin: 0 auto 18px;
  line-height: 1.6;
  text-align: center;
}
.meta-chips {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin: 0 auto 20px;
}
.social-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}`;

content = content.replace(oldHeroStyles, newHeroStyles);

// Update section headers to center
const oldSectionHeader = `.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}
.section-header h2 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}`;

const newSectionHeader = `.section-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 22px;
  gap: 6px;
}
.section-header > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
}
.section-desc {
  font-size: 12.5px;
  color: var(--text-tertiary);
  margin: 0 auto;
  max-width: 620px;
  text-align: center;
}`;

content = content.replace(oldSectionHeader, newSectionHeader);

// Center filter-tabs for arsenal
content = content.replace(
  `.filter-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}`,
  `.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}`
);

// 3. REMOVE PALETTE SWITCH BAR FROM HTML
const oldPaletteBar = `  <!-- Interactive Palette Switcher (Enforcing "diffent color pallet" request) -->
  <div class="theme-switch-bar">
    <div class="theme-switch-brand">
      <span class="dot"></span>
      <span>ARCHITECT PALETTE</span>
    </div>
    <div class="theme-options">
      <button class="theme-btn active" onclick="setTheme('azure', this)">Titanium Azure</button>
      <button class="theme-btn" onclick="setTheme('amber', this)">Obsidian Amber</button>
      <button class="theme-btn" onclick="setTheme('emerald', this)">Phosphor Emerald</button>
    </div>
  </div>`;

content = content.replace(oldPaletteBar, '');

// Also remove .theme-switch-bar styles if present
content = content.replace(/\/\* Palette Quick-Switch Floating Bar \*\/[\s\S]*?\.theme-btn:active \{ transform: scale\(0\.97\); \}/, '');

// 4. SKYLINE REFINEMENTS:
// Title -> "Contribution Skyline"
// Remove switch box and static SVG render box
const oldSkylineSectionStart = `  <!-- =============================================================
       2. 3D ISOMETRIC CONTRIBUTION SKYLINE (Interactive Canvas Engine)
       ============================================================= -->
  <section id="contribution-skyline">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          3D Isometric Contribution Skyline
        </h2>
        <p class="section-desc">Interactive 3D isometric skyline &amp; heat map &bull; Drag to orbit &bull; Double-click to reset</p>
      </div>

      <div class="skyline-toolbar">
        <div class="skyline-tabs">
          <button class="skyline-tab-btn active" id="tab-skyline-interactive" onclick="switchSkylineMode('interactive')">Interactive 3D Engine</button>
          <button class="skyline-tab-btn" id="tab-skyline-svg" onclick="switchSkylineMode('svg')">Static SVG Render</button>
        </div>
      </div>
    </div>

    <!-- Mode 1: Interactive Component from 21st.dev -->
    <div class="skyline-box" id="skyline-interactive-container">`;

const newSkylineSectionStart = `  <!-- =============================================================
       2. CONTRIBUTION SKYLINE (Interactive 3D Engine)
       ============================================================= -->
  <section id="contribution-skyline">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Contribution Skyline
        </h2>
        <p class="section-desc">Interactive 3D isometric skyline &amp; activity heat map &bull; Drag to orbit &bull; Double-click to reset</p>
      </div>
    </div>

    <!-- 3D Interactive Component from 21st.dev -->
    <div class="skyline-box" id="skyline-interactive-container">`;

content = content.replace(oldSkylineSectionStart, newSkylineSectionStart);

// Remove static svg container from skyline section
const oldSvgContainer = `    <!-- Mode 2: Static SVG Gallery (toggleable) -->
    <div class="skyline-box" id="skyline-svg-container" style="display: none;">
      <div style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
        <button class="skyline-tab-btn active" onclick="switchSvgVariant('night-view', this)">Night View</button>
        <button class="skyline-tab-btn" onclick="switchSvgVariant('night-green', this)">Night Green</button>
        <button class="skyline-tab-btn" onclick="switchSvgVariant('night-rainbow', this)">Night Rainbow</button>
        <button class="skyline-tab-btn" onclick="switchSvgVariant('gitblock', this)">Gitblock</button>
        <button class="skyline-tab-btn" onclick="switchSvgVariant('season', this)">Season</button>
      </div>
      <div class="skyline-frame">
        <a href="https://github.com/Suvesh108" target="_blank" rel="noreferrer" title="Inspect Suvesh108 GitHub Contributions">
          <img id="skyline-img" src="./profile-3d-contrib/profile-night-view.svg" alt="3D Isometric Contribution Skyline" />
        </a>
      </div>
    </div>`;

content = content.replace(oldSvgContainer, '');

// 5. RENAME FEATURED SYSTEMS TO "My Projects"
content = content.replace(
  `          Featured Systems &amp; Implementations
        </h2>
        <p class="section-desc">Production-grade distributed utilities engineered with zero-trust defensive patterns</p>`,
  `          My Projects
        </h2>
        <p class="section-desc">Open-source distributed runtimes, low-latency tooling, and cloud-native systems</p>`
);

// 6. REPLACE PRODUCTION INVARIANTS & HONORS WITH:
// "GitHub Analytics & Velocity" AND "Engineering Activity & Logs"
const oldInvariantsSection = `  <!-- =============================================================
       5. PRODUCTION INVARIANTS & HONORS
       ============================================================= -->
  <section id="invariants-honors">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Production Invariants &amp; Honors
        </h2>
        <p class="section-desc">Defensive engineering rules enforced across all architectures</p>
      </div>
    </div>

    <div class="invariants-grid">
      <div class="invariant-item">
        <b>
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Zero-Trust Schemas
        </b>
        <p>100% external input validation with strict schemas (Zod for TypeScript, Pydantic for Python). Zero raw type assertions.</p>
      </div>
      <div class="invariant-item">
        <b>
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          OWASP Guardrails
        </b>
        <p>User-scoped queries prevent IDOR/BOLA. Parameterized DB statements only. Zero sensitive token leakage in client state.</p>
      </div>
      <div class="invariant-item">
        <b>
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Stream Concurrency
        </b>
        <p>Non-blocking asynchronous streams with backpressure control, zero-copy buffers, and sub-10ms edge execution.</p>
      </div>
      <div class="invariant-item">
        <b>
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          Minimal Blast Radius
        </b>
        <p>Atomic surgical primitives over monolithic framework lock-in. Verification against circular dependencies.</p>
      </div>
    </div>

    <div class="honors-grid">
      <div class="honor-card">
        <div class="honor-icon">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="honor-meta">
          <b>Code Specialist</b>
          <small>486+ Annual Commits</small>
        </div>
      </div>
      <div class="honor-card">
        <div class="honor-icon">
          <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <div class="honor-meta">
          <b>Systems Architect</b>
          <small>29 Shipped Repositories</small>
        </div>
      </div>
      <div class="honor-card">
        <div class="honor-icon">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="honor-meta">
          <b>Edge Telemetry</b>
          <small>Zero-CORS Diagnostics</small>
        </div>
      </div>
      <div class="honor-card">
        <div class="honor-icon">
          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div class="honor-meta">
          <b>Polyglot Engineer</b>
          <small>Go A Rust A TS A Python</small>
        </div>
      </div>
    </div>
  </section>`;

const newImportedSections = `  <!-- =============================================================
       5. GITHUB ANALYTICS & VELOCITY (Imported from Profile Main)
       ============================================================= -->
  <section id="github-analytics-velocity">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          GitHub Analytics &amp; Velocity
        </h2>
        <p class="section-desc">Global platform telemetry, language distribution, and verified developer honors</p>
      </div>
    </div>

    <div class="metrics-dashboard-grid">
      <!-- Card A: Global Metrics -->
      <div class="metric-card">
        <div class="metric-card-header">
          <h3>GLOBAL METRICS</h3>
          <span class="metric-badge">Live Synced</span>
        </div>
        <div class="stats-matrix">
          <div class="stat-cell">
            <span class="stat-cell-label">Total Stars</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Total Forks</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Commits (Year)</span>
            <b class="stat-cell-val accent">327</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Pull Requests</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Total Issues</span>
            <b class="stat-cell-val">0</b>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Followers</span>
            <b class="stat-cell-val">1</b>
          </div>
        </div>
      </div>

      <!-- Card B: Top Languages -->
      <div class="metric-card">
        <div class="metric-card-header">
          <h3>TOP LANGUAGES</h3>
          <span class="metric-badge">Codebase Share</span>
        </div>
        <div class="languages-stack">
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">JavaScript</span>
              <span class="lang-pct">52.9%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 52.9%; background: #f59e0b;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">TypeScript</span>
              <span class="lang-pct">21.1%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 21.1%; background: #3b82f6;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">HTML</span>
              <span class="lang-pct">6.6%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 6.6%; background: #ef4444;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">Dart</span>
              <span class="lang-pct">6.1%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 6.1%; background: #06b6d4;"></div></div>
          </div>
          <div class="lang-row">
            <div class="lang-meta">
              <span class="lang-name">Kotlin</span>
              <span class="lang-pct">2.8%</span>
            </div>
            <div class="lang-progress"><div class="lang-fill" style="width: 2.8%; background: #a855f7;"></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Honors & Achievements Subpanel -->
    <div class="honors-subpanel">
      <div class="honors-subpanel-header">
        <h3>HONORS &amp; ACHIEVEMENTS</h3>
      </div>
      <div class="honors-grid-refined">
        <div class="honor-badge-card">
          <span class="honor-symbol">✦</span>
          <div>
            <b>Code Specialist</b>
            <small>327+ Verified Commits</small>
          </div>
        </div>
        <div class="honor-badge-card">
          <span class="honor-symbol">★</span>
          <div>
            <b>Active Builder</b>
            <small>Shipping Distributed Systems</small>
          </div>
        </div>
        <div class="honor-badge-card">
          <span class="honor-symbol">◈</span>
          <div>
            <b>Networker</b>
            <small>Expanding Developer Reach</small>
          </div>
        </div>
        <div class="honor-badge-card">
          <span class="honor-symbol">◯</span>
          <div>
            <b>Systems Manager</b>
            <small>2+ Repositories Maintained</small>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- =============================================================
       6. ENGINEERING ACTIVITY & LOGS (Imported from Profile Main)
       ============================================================= -->
  <section id="engineering-activity-logs">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Engineering Activity &amp; Logs
        </h2>
        <p class="section-desc">Production releases, architecture notes, and system audit trail</p>
      </div>
    </div>

    <div class="activity-log-container">
      <!-- Column 1: Technical Writing & Architecture -->
      <div class="activity-column">
        <div class="activity-col-header">
          <h3>Technical Writing &amp; RFCs</h3>
        </div>
        <ul class="activity-stream-list">
          <li class="activity-stream-item">
            <span class="stream-badge">RFC-104</span>
            <div class="stream-content">
              <b>Decentralized Edge Cache Invalidation</b>
              <p>Designing sub-millisecond cache eviction mechanisms across globally distributed worker nodes.</p>
            </div>
          </li>
          <li class="activity-stream-item">
            <span class="stream-badge">ARCH-08</span>
            <div class="stream-content">
              <b>Zero-Copy Stream Pipelines</b>
              <p>Benchmarks on IPC stream concurrency using Go channel rings and Rust memory buffers.</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Column 2: Recent Activity -->
      <div class="activity-column">
        <div class="activity-col-header">
          <h3>Recent Activity</h3>
        </div>
        <ol class="recent-events-list">
          <li class="event-item">
            <span class="event-icon">🚀</span>
            <div class="event-details">
              <span>Published release <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">EDM v0.0.1 — Edge Download Manager</a> in <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">Suvesh108/EDM</a></span>
              <span class="event-tag">Production Release</span>
            </div>
          </li>
          <li class="event-item">
            <span class="event-icon">📦</span>
            <div class="event-details">
              <span>Optimized distributed concurrency worker pool in <a href="https://github.com/Suvesh108" target="_blank" rel="noreferrer">jobscrap</a></span>
              <span class="event-tag">Commit 4f2a1b</span>
            </div>
          </li>
          <li class="event-item">
            <span class="event-icon">⚡</span>
            <div class="event-details">
              <span>Configured zero-trust token middleware and telemetry streams for <a href="https://github.com/Suvesh108" target="_blank" rel="noreferrer">suvesh-api</a></span>
              <span class="event-tag">Edge Gateway</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>`;

content = content.replace(oldInvariantsSection, newImportedSections);

// 7. ADD CSS STYLES FOR THE NEW IMPORTED SECTIONS (GitHub Analytics & Velocity + Activity Logs)
const newSectionsCss = `/* =============================================================
   5. GITHUB ANALYTICS & VELOCITY
   ============================================================= */
.metrics-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.metric-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 18px 20px;
  box-shadow: var(--shadow-card);
}
.metric-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.metric-card-header h3 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin: 0;
  text-transform: uppercase;
}
.metric-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--accent-muted);
  color: var(--accent);
}
.stats-matrix {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 14px;
}
.stat-cell {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 10px;
  background: var(--bg-subpanel);
  border: 1px solid var(--border-rim);
  border-radius: 6px;
}
.stat-cell-label {
  font-size: 11.5px;
  color: var(--text-secondary);
}
.stat-cell-val {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}
.stat-cell-val.accent {
  color: var(--accent);
}

.languages-stack {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.lang-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.lang-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
}
.lang-name {
  font-weight: 600;
  color: var(--text-primary);
}
.lang-pct {
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
.lang-progress {
  height: 5px;
  background: var(--bg-subpanel);
  border-radius: 3px;
  overflow: hidden;
}
.lang-fill {
  height: 100%;
  border-radius: 3px;
}

.honors-subpanel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 16px 20px;
  box-shadow: var(--shadow-card);
}
.honors-subpanel-header {
  margin-bottom: 12px;
  text-align: center;
}
.honors-subpanel-header h3 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent);
  margin: 0;
  text-transform: uppercase;
}
.honors-grid-refined {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.honor-badge-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-subpanel);
  border: 1px solid var(--border-rim);
  border-radius: 8px;
  padding: 10px 12px;
}
.honor-symbol {
  font-size: 16px;
  color: var(--accent);
  line-height: 1;
}
.honor-badge-card b {
  display: block;
  font-size: 11.5px;
  color: var(--text-primary);
  font-weight: 600;
}
.honor-badge-card small {
  display: block;
  font-size: 10.5px;
  color: var(--text-tertiary);
  margin-top: 2px;
}

/* =============================================================
   6. ENGINEERING ACTIVITY & LOGS
   ============================================================= */
.activity-log-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.activity-column {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 18px 20px;
  box-shadow: var(--shadow-card);
}
.activity-col-header {
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-rim);
}
.activity-col-header h3 {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}
.activity-stream-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.activity-stream-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.stream-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--accent-muted);
  color: var(--accent);
  white-space: nowrap;
  margin-top: 2px;
}
.stream-content b {
  display: block;
  font-size: 12.5px;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 2px;
}
.stream-content p {
  font-size: 11.5px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.45;
}

.recent-events-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.event-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: var(--bg-subpanel);
  border: 1px solid var(--border-rim);
  border-radius: 8px;
}
.event-icon {
  font-size: 14px;
  line-height: 1;
  margin-top: 2px;
}
.event-details {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.45;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.event-details a {
  color: var(--accent);
  font-weight: 600;
}
.event-tag {
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: var(--font-mono);
}

@media (max-width: 768px) {
  .metrics-dashboard-grid, .activity-log-container {
    grid-template-columns: 1fr;
  }
  .honors-grid-refined {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 500px) {
  .honors-grid-refined {
    grid-template-columns: 1fr;
  }
}
`;

// Replace old invariants CSS with new CSS
const oldInvariantsCss = `/* =============================================================
   5. INVARIANTS & HONORS
   ============================================================= */
.invariants-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.invariant-item {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-inner);
  padding: 14px;
  box-shadow: var(--shadow-card);
}
.invariant-item b {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--accent);
  margin-bottom: 4px;
}
.invariant-item b svg { width: 13px; height: 13px; stroke: currentColor; fill: none; }
.invariant-item p {
  font-size: 11px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.45;
}

.honors-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 14px;
}
.honor-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-inner);
}
.honor-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: var(--accent-muted);
  display: grid;
  place-items: center;
  color: var(--accent);
  flex-shrink: 0;
}
.honor-icon svg { width: 14px; height: 14px; stroke: currentColor; fill: none; }
.honor-meta b {
  display: block;
  font-size: 11.5px;
  color: var(--text-primary);
}
.honor-meta small {
  display: block;
  font-size: 10.5px;
  color: var(--text-tertiary);
}`;

content = content.replace(oldInvariantsCss, newSectionsCss);

// 8. UPDATE SKYLINE ENGINE SCRIPT SO OBSIDIAN AMBER IS THE DEFAULT PALETTE
content = content.replace(
  `const currentTheme = document.documentElement.getAttribute("data-theme") || "azure";`,
  `const currentTheme = "amber";`
);

// Save updated preview.html
fs.writeFileSync(previewPath, content, 'utf8');
console.log('preview.html successfully updated with all 5 refinements!');

// Also write to brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, content, 'utf8');
console.log('Brain profile_preview.html successfully synced!');
