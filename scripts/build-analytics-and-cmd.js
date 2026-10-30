const fs = require('fs');
const path = require('path');

const previewPath = path.resolve('preview.html');
let content = fs.readFileSync(previewPath, 'utf8');

// 1. CSS for the Exact Image 1 (GitHub Analytics) & Image 2 (CMD Window for Logs)
const newCss = `/* =============================================================
   5. GITHUB ANALYTICS & VELOCITY (No Section Title, Content-Only)
   ============================================================= */
.analytics-velocity-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: var(--shadow-card);
  margin-bottom: 36px;
}

.analytics-top-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.analytics-subcard {
  background: #080b10;
  border: 1px solid rgba(245, 158, 11, 0.28);
  border-radius: 8px;
  padding: 18px 20px;
}
.analytics-subcard h3 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin: 0 0 14px;
  text-transform: uppercase;
}

/* Global Metrics */
.metrics-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 18px;
}
.metrics-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 12px;
  color: #94a3b8;
}
.metrics-row b {
  font-size: 13.5px;
  color: #f8fafc;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}
.metrics-row b.accent {
  color: var(--accent);
}

/* Top Languages */
.lang-bars-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.lang-item-row {
  display: grid;
  grid-template-columns: 90px 48px 1fr;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.lang-item-name {
  color: #f8fafc;
  font-weight: 600;
}
.lang-item-pct {
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.lang-pill-track {
  height: 8px;
  background: #151b26;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.lang-pill-fill {
  height: 100%;
  border-radius: 10px;
}

/* Middle Heatmap & Progress Bar */
.analytics-mid-block {
  padding: 24px 6px 16px;
}
.heatmap-glowing-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}
.heatmap-glowing-dots span {
  width: 14px;
  height: 8px;
  border-radius: 4px;
  background: #f59e0b;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}
.analytics-heatmap {
  display: grid;
  grid-template-columns: repeat(52, minmax(4px, 1fr));
  gap: 4px;
  margin: 12px 0 16px;
}
.analytics-heatmap .day {
  aspect-ratio: 1;
  background: #111722;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 2px;
}
.analytics-heatmap .day.l1 { background: #51431b; }
.analytics-heatmap .day.l2 { background: #8b7026; }
.analytics-heatmap .day.l3 { background: #c7a633; }
.analytics-heatmap .day.l4 { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.6); }

.analytics-segmented-bar {
  height: 10px;
  background: #161b22;
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  margin: 10px 0 20px;
}
.analytics-segmented-bar span:nth-child(1) { width: 62%; background: #92691b; }
.analytics-segmented-bar span:nth-child(2) { width: 22%; background: #d97706; }
.analytics-segmented-bar span:nth-child(3) { width: 16%; background: #f59e0b; }

/* Honors & Achievements */
.honors-wrap-card {
  background: #080b10;
  border: 1px solid rgba(245, 158, 11, 0.28);
  border-radius: 8px;
  padding: 16px 20px;
}
.honors-wrap-card h3 {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin: 0 0 14px;
  text-transform: uppercase;
}
.honors-grid-four {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.honor-pill-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #111722;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 14px;
}
.honor-star-icon {
  font-size: 18px;
  color: var(--accent);
  line-height: 1;
}
.honor-pill-card b {
  display: block;
  font-size: 12px;
  color: #f8fafc;
  font-weight: 600;
}
.honor-pill-card small {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

/* =============================================================
   6. LOGS (Authentic Terminal / CMD Window)
   ============================================================= */
.cmd-window {
  background: #06090e;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 16px 44px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  font-family: var(--font-mono);
  margin-bottom: 30px;
}
.cmd-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0f141d;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  user-select: none;
}
.cmd-dots {
  display: flex;
  align-items: center;
  gap: 7px;
}
.cmd-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.cmd-dot.red { background: #ef4444; }
.cmd-dot.yellow { background: #f59e0b; }
.cmd-dot.green { background: #10b981; }

.cmd-title-text {
  font-size: 11.5px;
  color: #94a3b8;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cmd-title-text svg {
  width: 14px;
  height: 14px;
  stroke: var(--accent);
  fill: none;
}
.cmd-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #64748b;
}

.cmd-body {
  padding: 18px 22px 24px;
  font-size: 12.5px;
  line-height: 1.7;
  color: #cbd5e1;
}
.cmd-prompt-line {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
  color: #94a3b8;
  flex-wrap: wrap;
}
.cmd-user {
  color: #10b981;
  font-weight: 600;
}
.cmd-path {
  color: var(--accent);
  font-weight: 600;
}
.cmd-input {
  color: #f8fafc;
}
.cmd-banner-note {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 14px;
  border-left: 2px solid var(--accent);
  padding-left: 8px;
}

.cmd-log-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cmd-log-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background-color 150ms ease;
}
.cmd-log-item:hover {
  background: rgba(245, 158, 11, 0.06);
}
.cmd-idx {
  font-size: 11px;
  color: var(--accent);
  font-weight: 700;
  min-width: 24px;
}
.cmd-icon {
  font-size: 13px;
  line-height: 1;
}
.cmd-text {
  flex: 1;
  color: #cbd5e1;
}
.cmd-text a {
  color: #60a5fa;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.cmd-text a:hover {
  color: #93c5fd;
}
.cmd-tag-badge {
  font-size: 10px;
  color: #a1a1aa;
  background: #181820;
  padding: 1px 6px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.cmd-cursor-line {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  margin-top: 6px;
}
.cmd-cursor-block {
  display: inline-block;
  width: 8px;
  height: 14px;
  background: var(--accent);
  vertical-align: middle;
  animation: cmdBlink 1s step-end infinite;
}
@keyframes cmdBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .analytics-top-grid { grid-template-columns: 1fr; }
  .honors-grid-four { grid-template-columns: repeat(2, 1fr); }
  .lang-item-row { grid-template-columns: 80px 42px 1fr; }
}
@media (max-width: 520px) {
  .honors-grid-four { grid-template-columns: 1fr; }
  .metrics-table { grid-template-columns: 1fr; }
}
`;

// Replace the previous section 5 & 6 CSS
const cssMarkerStart = '/* =============================================================\n   5. GITHUB ANALYTICS & VELOCITY';
const cssMarkerEnd = '</style>';
const cssIdxStart = content.indexOf(cssMarkerStart);
const cssIdxEnd = content.indexOf(cssMarkerEnd, cssIdxStart);

if (cssIdxStart !== -1 && cssIdxEnd !== -1) {
  content = content.slice(0, cssIdxStart) + newCss + '\n' + content.slice(cssIdxEnd);
} else {
  console.error('Could not find CSS markers');
}

// 2. HTML Markup for Content-Only Analytics & CMD Logs
const htmlReplacement = `  <!-- =============================================================
       5. GITHUB ANALYTICS & VELOCITY (No Headline / Name, Content-Only)
       ============================================================= -->
  <section id="github-analytics-velocity">
    <div class="analytics-velocity-card">
      
      <!-- Top Row: Global Metrics (Left) & Top Languages (Right) -->
      <div class="analytics-top-grid">
        <!-- Subcard 1: Global Metrics -->
        <div class="analytics-subcard">
          <h3>GLOBAL METRICS</h3>
          <div class="metrics-table">
            <div class="metrics-row">
              <span>Total Stars</span>
              <b>0</b>
            </div>
            <div class="metrics-row">
              <span>Total Forks</span>
              <b>0</b>
            </div>
            <div class="metrics-row">
              <span>Commits (Year)</span>
              <b class="accent">327</b>
            </div>
            <div class="metrics-row">
              <span>Pull Requests</span>
              <b>0</b>
            </div>
            <div class="metrics-row">
              <span>Total Issues</span>
              <b>0</b>
            </div>
            <div class="metrics-row">
              <span>Followers</span>
              <b>1</b>
            </div>
          </div>
        </div>

        <!-- Subcard 2: Top Languages -->
        <div class="analytics-subcard">
          <h3>TOP LANGUAGES</h3>
          <div class="lang-bars-list">
            <div class="lang-item-row">
              <span class="lang-item-name">JavaScript</span>
              <span class="lang-item-pct">52.7%</span>
              <div class="lang-pill-track"><div class="lang-pill-fill" style="width: 52.7%; background: #facc15;"></div></div>
            </div>
            <div class="lang-item-row">
              <span class="lang-item-name">TypeScript</span>
              <span class="lang-item-pct">21.2%</span>
              <div class="lang-pill-track"><div class="lang-pill-fill" style="width: 21.2%; background: #3b82f6;"></div></div>
            </div>
            <div class="lang-item-row">
              <span class="lang-item-name">HTML</span>
              <span class="lang-item-pct">6.5%</span>
              <div class="lang-pill-track"><div class="lang-pill-fill" style="width: 6.5%; background: #ef4444;"></div></div>
            </div>
            <div class="lang-item-row">
              <span class="lang-item-name">Dart</span>
              <span class="lang-item-pct">6.1%</span>
              <div class="lang-pill-track"><div class="lang-pill-fill" style="width: 6.1%; background: #06b6d4;"></div></div>
            </div>
            <div class="lang-item-row">
              <span class="lang-item-name">Kotlin</span>
              <span class="lang-item-pct">2.8%</span>
              <div class="lang-pill-track"><div class="lang-pill-fill" style="width: 2.8%; background: #a855f7;"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle: Decorative Heatmap & Segmented Progress Bar -->
      <div class="analytics-mid-block">
        <div class="heatmap-glowing-dots">
          <span></span><span></span><span></span><span></span>
        </div>
        <div class="analytics-heatmap" id="analytics-heatmap" aria-label="Decorative contribution activity heatmap"></div>
        <div class="analytics-segmented-bar">
          <span></span><span></span><span></span>
        </div>
      </div>

      <!-- Bottom: Honors & Achievements (Image 1) -->
      <div class="honors-wrap-card">
        <h3>HONORS &amp; ACHIEVEMENTS</h3>
        <div class="honors-grid-four">
          <div class="honor-pill-card">
            <span class="honor-star-icon">✦</span>
            <div>
              <b>Code Specialist</b>
              <small>327+ Commits</small>
            </div>
          </div>
          <div class="honor-pill-card">
            <span class="honor-star-icon">★</span>
            <div>
              <b>Active Builder</b>
              <small>Shipping Systems</small>
            </div>
          </div>
          <div class="honor-pill-card">
            <span class="honor-star-icon">◈</span>
            <div>
              <b>Networker</b>
              <small>Growing Reach</small>
            </div>
          </div>
          <div class="honor-pill-card">
            <span class="honor-star-icon">&#x2B21;</span>
            <div>
              <b>Systems Manager</b>
              <small>29 Repositories</small>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- =============================================================
       6. LOGS (Interactive CMD / Terminal Window)
       ============================================================= -->
  <section id="logs">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Logs
        </h2>
        <p class="section-desc">Interactive terminal execution stream and verified release manifest</p>
      </div>
    </div>

    <!-- Custom CMD / Terminal Window (Image 2) -->
    <div class="cmd-window">
      <!-- Title Bar -->
      <div class="cmd-title-bar">
        <div class="cmd-dots">
          <span class="cmd-dot red"></span>
          <span class="cmd-dot yellow"></span>
          <span class="cmd-dot green"></span>
        </div>
        <div class="cmd-title-text">
          <svg viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Command Prompt &mdash; suvesh@desktop: ~/github/releases
        </div>
        <div class="cmd-actions">
          <span>UTF-8</span>
          <span>live</span>
        </div>
      </div>

      <!-- Terminal Body -->
      <div class="cmd-body">
        <div class="cmd-prompt-line">
          <span class="cmd-user">suvesh@desktop</span>:<span class="cmd-path">~/github</span>$ <span class="cmd-input">gh release list --limit 10 --repo Suvesh108</span>
        </div>
        <div class="cmd-banner-note">
          [SYSTEM] Initialized release journal &bull; 10 release artifacts synchronized
        </div>

        <ol class="cmd-log-list">
          <li class="cmd-log-item">
            <span class="cmd-idx">01.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">EDM v0.0.1 — Edge Download Manager</a> in <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">Suvesh108/EDM</a></span>
            <span class="cmd-tag-badge">latest</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">02.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">EDM v0.0.1 — Edge Download Manager</a> in <a href="https://github.com/Suvesh108/EDM" target="_blank" rel="noreferrer">Suvesh108/EDM</a></span>
            <span class="cmd-tag-badge">tag:v0.0.1</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">03.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/Universal-Shared" target="_blank" rel="noreferrer">Universal Shared v0.2.4</a> in <a href="https://github.com/Suvesh108/Universal-Shared" target="_blank" rel="noreferrer">Suvesh108/Universal-Shared</a></span>
            <span class="cmd-tag-badge">pkg:core</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">04.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">UnitWise v0.0.8 — Dual-Mode Wi-Fi &amp; Bluetooth LE Live Signal Auto-Discovery</a> in <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">Suvesh108/UnitWise</a></span>
            <span class="cmd-tag-badge">iot:ble</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">05.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">UnitWise v0.0.7 — Sense-Grade Vampire Load Disaggregation &amp; Live Dynamic Particle Energy Flow</a> in <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">Suvesh108/UnitWise</a></span>
            <span class="cmd-tag-badge">telemetry</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">06.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">UnitWise v0.0.6 — Real IoT Discovery &amp; Fluid Motion</a> in <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">Suvesh108/UnitWise</a></span>
            <span class="cmd-tag-badge">runtime</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">07.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">UnitWise v0.0.5 — Multi-Property Management &amp; Dynamic Live OTA</a> in <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">Suvesh108/UnitWise</a></span>
            <span class="cmd-tag-badge">ota:live</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">08.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">UnitWise v0.0.4 — Minimalist UI/UX Overhaul &amp; Interactive Donut Graph</a> in <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">Suvesh108/UnitWise</a></span>
            <span class="cmd-tag-badge">ui:v2</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">09.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">UnitWise v0.0.3 — Dual-Mode Auto-Discovery Scanner &amp; Synchronized OTA</a> in <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">Suvesh108/UnitWise</a></span>
            <span class="cmd-tag-badge">scanner</span>
          </li>
          <li class="cmd-log-item">
            <span class="cmd-idx">10.</span>
            <span class="cmd-icon">🚀</span>
            <span class="cmd-text">Published release <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">v0.0.1 - UnitWise Prototype Release</a> in <a href="https://github.com/Suvesh108/UnitWise" target="_blank" rel="noreferrer">Suvesh108/UnitWise</a></span>
            <span class="cmd-tag-badge">initial</span>
          </li>
        </ol>

        <div class="cmd-cursor-line">
          <span class="cmd-user">suvesh@desktop</span>:<span class="cmd-path">~/github</span>$ <span class="cmd-cursor-block"></span>
        </div>
      </div>
    </div>
  </section>`;

// Replace HTML for both sections
const htmlMarkerStart = '<!-- =============================================================\n       5. GITHUB ANALYTICS & VELOCITY';
const htmlMarkerEnd = '<footer>';
const htmlIdxStart = content.indexOf(htmlMarkerStart);
const htmlIdxEnd = content.indexOf(htmlMarkerEnd, htmlIdxStart);

if (htmlIdxStart !== -1 && htmlIdxEnd !== -1) {
  content = content.slice(0, htmlIdxStart) + htmlReplacement + '\n  ' + content.slice(htmlIdxEnd);
} else {
  console.error('Could not find HTML markers');
}

// 3. Add JS for rendering decorative heatmap
const jsHeatmapFunction = `
// ==========================================================================
// 6. DECORATIVE HEATMAP ENGINE (Image 1)
// ==========================================================================
function renderAnalyticsHeatmap() {
  const heat = document.getElementById("analytics-heatmap");
  if (!heat) return;
  heat.innerHTML = '';
  // 52 cols x 7 rows = 364 days
  let seed = 20261029;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < 364; i++) {
    const d = document.createElement("span");
    d.className = "day";
    const v = rand();
    if (v > 0.965) d.classList.add("l4");
    else if (v > 0.92) d.classList.add("l3");
    else if (v > 0.86) d.classList.add("l2");
    else if (v > 0.79) d.classList.add("l1");
    heat.appendChild(d);
  }
}
`;

if (!content.includes('function renderAnalyticsHeatmap')) {
  content = content.replace('// Bootstrap', jsHeatmapFunction + '\n// Bootstrap');
  content = content.replace('renderArsenal(\'all\');', 'renderArsenal(\'all\');\n  renderAnalyticsHeatmap();');
}

fs.writeFileSync(previewPath, content, 'utf8');
console.log('preview.html updated with Image 1 and Image 2 specifications!');

// Sync with Brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, content, 'utf8');
console.log('Brain profile_preview.html synced successfully!');
