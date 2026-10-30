const fs = require('fs');
const path = require('path');

const previewPath = path.resolve('preview.html');
let content = fs.readFileSync(previewPath, 'utf8');

// 1. New CSS for Skyline
const oldStyleStart = '/* =============================================================\n   2. 3D ISOMETRIC CONTRIBUTION SKYLINE (User\'s Official SVG)';
const oldStyleEnd = '/* =============================================================\n   3. CORE TECH ARSENAL (Authentic Brand SVGs, Zero Emoji)';

const newStyles = `/* =============================================================
   2. 3D ISOMETRIC CONTRIBUTION SKYLINE (Interactive Canvas Engine)
   ============================================================= */
.skyline-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 20px;
  box-shadow: var(--shadow-card);
  position: relative;
}
.skyline-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.skyline-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-subpanel);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 3px;
}
.skyline-tab-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
}
.skyline-tab-btn:hover { color: var(--text-primary); }
.skyline-tab-btn.active {
  background: var(--bg-surface);
  color: var(--accent);
  border: 1px solid var(--border-active);
}
.skyline-tab-btn:active { transform: scale(0.97); }

.skyline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.skyline-card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.skyline-card-title .total-count {
  font-weight: 700;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  font-size: 16px;
  letter-spacing: -0.02em;
}
.skyline-card-title .total-unit {
  color: var(--text-secondary);
  font-size: 13px;
}

/* 2D / 3D Toggle Pill */
.skyline-mode-toggle {
  display: inline-flex;
  position: relative;
  background: var(--bg-subpanel);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 2px;
}
.skyline-toggle-indicator {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  width: 32px;
  background: var(--accent);
  border-radius: 6px;
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.skyline-toggle-indicator.mode-3d {
  transform: translateX(32px);
}
.skyline-toggle-btn {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  border-radius: 6px;
  transition: color 180ms ease;
}
.skyline-toggle-btn.active {
  color: #080b11;
  font-weight: 700;
}
.skyline-toggle-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

/* Viewport & Canvas */
.skyline-viewport-container {
  position: relative;
  border-radius: var(--radius-inner);
  border: 1px solid var(--border-rim);
  background: #04060a;
  overflow: hidden;
  padding: 12px;
}
.skyline-stage {
  position: relative;
  width: 100%;
  height: 260px;
  min-height: 180px;
  overflow: hidden;
  border-radius: 8px;
  transition: height 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.skyline-stage canvas {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  outline: none;
  cursor: grab;
  touch-action: pan-y;
}
.skyline-stage canvas:active {
  cursor: grabbing;
}

/* Corner Floating Stats (in 3D mode) */
.skyline-corner-stats {
  position: absolute;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: opacity 400ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 5;
}
.skyline-corner-stats.top-right {
  top: 8px;
  right: 12px;
  align-items: flex-end;
  text-align: right;
}
.skyline-corner-stats.bottom-left {
  bottom: 8px;
  left: 12px;
  align-items: flex-start;
  text-align: left;
}
.skyline-corner-stats.hidden {
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
}
.skyline-stat-block {
  min-width: 0;
}
.skyline-stat-block .stat-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}
.skyline-stat-block .stat-val {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}
.skyline-stat-block .stat-sub {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Tooltip */
.skyline-tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 30;
  white-space: nowrap;
  border-radius: 6px;
  padding: 6px 11px;
  font-size: 11.5px;
  line-height: 1.25;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.12);
  background: var(--bg-subpanel);
  color: var(--text-primary);
  opacity: 0;
  transform: translateY(-100%);
  transition: opacity 150ms ease;
  will-change: transform, opacity;
}
.skyline-tooltip.visible {
  opacity: 1;
}
.skyline-tooltip .tip-arrow {
  position: absolute;
  top: 100%;
  left: var(--arrow, 50%);
  margin-left: -5px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--bg-subpanel);
}
.skyline-tooltip strong {
  color: var(--accent);
  font-weight: 600;
}

/* 2D Row Stats */
.skyline-row-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border-rim);
  margin-top: 14px;
  transition: opacity 300ms ease;
}
.skyline-row-stats.hidden {
  display: none;
}
.skyline-row-stat {
  display: flex;
  flex-direction: column;
}
.skyline-row-stat .stat-label {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.skyline-row-stat .stat-val {
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
  margin: 3px 0 1px;
}
.skyline-row-stat .stat-sub {
  font-size: 11px;
  color: var(--text-secondary);
}

/* Footer with hint and swatches */
.skyline-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
  font-size: 11.5px;
  color: var(--text-secondary);
}
.skyline-hint {
  display: flex;
  align-items: center;
  gap: 6px;
}
.skyline-hint::before {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.skyline-legend {
  display: flex;
  align-items: center;
  gap: 6px;
}
.skyline-swatches {
  display: flex;
  align-items: center;
  gap: 3px;
}
.skyline-swatch-btn {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 180ms ease, box-shadow 180ms ease;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}
.skyline-swatch-btn:hover, .skyline-swatch-btn.active {
  transform: scale(1.3);
  box-shadow: 0 0 6px var(--accent);
  z-index: 2;
}

/* Static View Frame (when user toggles to SVG view) */
.skyline-frame {
  border-radius: var(--radius-inner);
  overflow: hidden;
  border: 1px solid var(--border-rim);
  background: #04060a;
  text-align: center;
}
.skyline-frame img {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
`;

const styleIdxStart = content.indexOf(oldStyleStart);
const styleIdxEnd = content.indexOf(oldStyleEnd);
if (styleIdxStart !== -1 && styleIdxEnd !== -1) {
  content = content.slice(0, styleIdxStart) + newStyles + '\n' + content.slice(styleIdxEnd);
} else {
  console.error('Could not find style replacement markers');
}

// 2. New HTML for Skyline
const oldHtmlStart = '<!-- =============================================================\n       2. 3D ISOMETRIC CONTRIBUTION SKYLINE (User\'s Official SVG)';
const oldHtmlEnd = '<!-- =============================================================\n       3. CORE TECH ARSENAL (Authentic Brand SVGs, Zero Emoji)';

const newHtml = `<!-- =============================================================
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
    <div class="skyline-box" id="skyline-interactive-container">
      <header class="skyline-card-header">
        <div class="skyline-card-title">
          <span class="total-count" id="skyline-total-count">1,830</span>
          <span class="total-unit">contributions in the last year</span>
        </div>

        <!-- 2D / 3D Mode Toggle Button -->
        <div class="skyline-mode-toggle" role="group" aria-label="Chart projection view">
          <span class="skyline-toggle-indicator mode-3d" id="skyline-toggle-indicator"></span>
          <button type="button" class="skyline-toggle-btn" id="skyline-btn-2d" onclick="setSkylineProjection('2d')" aria-label="Flat heat map" title="Flat heat map">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" />
              <rect x="9" y="9" width="5.5" height="5.5" rx="1" fill="currentColor" />
            </svg>
          </button>
          <button type="button" class="skyline-toggle-btn active" id="skyline-btn-3d" onclick="setSkylineProjection('3d')" aria-label="3D skyline" title="3D skyline">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M8 1.2 14.2 4.6v6.8L8 14.8 1.8 11.4V4.6Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M1.8 4.6 8 8l6.2-3.4M8 8v6.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </header>

      <div class="skyline-viewport-container">
        <div class="skyline-stage" id="skyline-stage">
          <canvas id="skyline-canvas" tabindex="0" role="img" aria-label="Interactive 3D Contribution Skyline"></canvas>

          <!-- Corner Stats (3D mode) -->
          <div class="skyline-corner-stats top-right" id="skyline-corner-top">
            <div class="skyline-stat-block">
              <div class="stat-label">1 Year Total</div>
              <div class="stat-val" id="skyline-stat-total">1,830</div>
              <div class="stat-sub" id="skyline-stat-range">Oct 2025 &mdash; Oct 2026</div>
            </div>
            <div class="skyline-stat-block">
              <div class="stat-label">Busiest Day</div>
              <div class="stat-val" id="skyline-stat-busiest">54</div>
              <div class="stat-sub" id="skyline-stat-busiest-date">Jul 17, 2026</div>
            </div>
          </div>

          <div class="skyline-corner-stats bottom-left" id="skyline-corner-bottom">
            <div class="skyline-stat-block">
              <div class="stat-label">Longest Streak</div>
              <div class="stat-val" id="skyline-stat-longest">33</div>
              <div class="stat-sub">33 consecutive days</div>
            </div>
            <div class="skyline-stat-block">
              <div class="stat-label">Current Streak</div>
              <div class="stat-val" id="skyline-stat-current">2</div>
              <div class="stat-sub">active streak</div>
            </div>
          </div>

          <!-- Dynamic 3D Tracking Tooltip -->
          <div class="skyline-tooltip" id="skyline-tooltip" role="tooltip" aria-hidden="true">
            <div id="skyline-tooltip-content"></div>
            <span class="tip-arrow"></span>
          </div>
        </div>

        <!-- 2D Row Stats (Visible when in 2D mode) -->
        <div class="skyline-row-stats hidden" id="skyline-row-stats">
          <div class="skyline-row-stat">
            <span class="stat-label">1 Year Total</span>
            <span class="stat-val" id="skyline-row-total">1,830</span>
            <span class="stat-sub" id="skyline-row-range">Oct 2025 &mdash; Oct 2026</span>
          </div>
          <div class="skyline-row-stat">
            <span class="stat-label">Busiest Day</span>
            <span class="stat-val" id="skyline-row-busiest">54</span>
            <span class="stat-sub" id="skyline-row-busiest-date">Jul 17, 2026</span>
          </div>
          <div class="skyline-row-stat">
            <span class="stat-label">Longest Streak</span>
            <span class="stat-val" id="skyline-row-longest">33</span>
            <span class="stat-sub">33 consecutive days</span>
          </div>
          <div class="skyline-row-stat">
            <span class="stat-label">Current Streak</span>
            <span class="stat-val" id="skyline-row-current">2</span>
            <span class="stat-sub">active streak</span>
          </div>
        </div>

        <!-- Footer -->
        <footer class="skyline-footer">
          <div class="skyline-hint" id="skyline-hint">Drag to orbit &bull; double-click to reset</div>
          <div class="skyline-legend">
            <span>Less</span>
            <div class="skyline-swatches" id="skyline-swatches"></div>
            <span>More</span>
          </div>
        </footer>
      </div>
    </div>

    <!-- Mode 2: Static SVG Gallery (toggleable) -->
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
    </div>
  </section>
`;

const htmlIdxStart = content.indexOf(oldHtmlStart);
const htmlIdxEnd = content.indexOf(oldHtmlEnd);
if (htmlIdxStart !== -1 && htmlIdxEnd !== -1) {
  content = content.slice(0, htmlIdxStart) + newHtml + '\n  ' + content.slice(htmlIdxEnd);
} else {
  console.error('Could not find HTML replacement markers');
}

// 3. New Script Engine
const oldScriptStart = '// ==========================================================================\n// 4. 3D SKYLINE VARIANT SWITCHER';
const oldScriptEnd = '// ==========================================================================\n// 5. CORE TECH ARSENAL (Authentic Brand SVGs)';

const newScript = `// ==========================================================================
// 4. INTERACTIVE 3D CONTRIBUTION SKYLINE ENGINE (Ported from 21st.dev Component)
// ==========================================================================
const SKYLINE_CONSTANTS = {
  DAY_MS: 86400000,
  WAVE: 0.42,
  YAW_3D: Math.PI / 4,
  ELEV_3D: (34 * Math.PI) / 180,
  YAW_RANGE: [(8 * Math.PI) / 180, (82 * Math.PI) / 180],
  ELEV_RANGE: [(18 * Math.PI) / 180, (62 * Math.PI) / 180],
  PALETTES: {
    azure: {
      light: ["#b8e3f5", "#6ec3eb", "#2a8fd1", "#0b4f8a"],
      dark: ["#0c2d4a", "#12508a", "#2a88d8", "#38bdf8"]
    },
    amber: {
      light: ["#fde2c4", "#fbad6e", "#f06b3a", "#b3261e"],
      dark: ["#4a1a10", "#8f2f16", "#e0572a", "#f59e0b"]
    },
    emerald: {
      light: ["#c6e48b", "#7bc96f", "#239a3b", "#196127"],
      dark: ["#0e4429", "#006d32", "#26a641", "#10b981"]
    },
    github: {
      light: ["#c6e48b", "#7bc96f", "#239a3b", "#196127"],
      dark: ["#0e4429", "#006d32", "#26a641", "#39d353"]
    }
  }
};

const clamp01 = (v) => (v > 0 ? (v < 1 ? v : 1) : 0);
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (x) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const easeOutCubic = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const toKey = (ms) => new Date(ms).toISOString().slice(0, 10);
const dayMs = (v) => {
  if (typeof v === "number") return Math.floor(v / SKYLINE_CONSTANTS.DAY_MS) * SKYLINE_CONSTANTS.DAY_MS;
  if (typeof v === "string") {
    const m = /^(\\d{4})-(\\d{2})-(\\d{2})/.exec(v);
    if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
    v = new Date(v);
  }
  return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate());
};
const rng = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const generateContributions = (endMs, seed = 7, days = 371) => {
  const r = rng(seed);
  const bursts = Array.from({ length: 4 }, () => ({ at: r(), width: 0.035 + r() * 0.07, gain: 0.6 + r() * 1.1 }));
  const out = [];
  let mood = 0.5;
  for (let i = 0; i < days; i++) {
    const ms = endMs - (days - 1 - i) * SKYLINE_CONSTANTS.DAY_MS;
    const x = i / Math.max(1, days - 1);
    const dow = new Date(ms).getUTCDay();
    const weekend = dow === 0 || dow === 6;
    let heat = 0.2;
    for (const b of bursts) heat += b.gain * Math.exp(-((x - b.at) ** 2) / (2 * b.width ** 2));
    mood = mood * 0.85 + r() * 0.15;
    heat *= 0.55 + mood * 0.9;
    const pActive = Math.min(0.94, (weekend ? 0.22 : 0.5) + heat * 0.4);
    let count = 0;
    if (r() < pActive) count = 1 + Math.floor(-Math.log(1 - r()) * (1.2 + heat * 7) * (weekend ? 0.5 : 1));
    if (r() < 0.01) count += 18 + Math.floor(r() * 24);
    out.push({ date: toKey(ms), count });
  }
  return out;
};

const levelOf = (count, busy) => (count <= 0 ? 0 : busy <= 0 ? 4 : 1 + Math.min(3, Math.floor((count / busy) * 4)));

const buildGrid = (data, endMs, weekStart = 0) => {
  const counts = new Map();
  for (const d of data) {
    if (!d || typeof d.date !== "string") continue;
    const ms = dayMs(d.date);
    const c = Number(d.count);
    if (!Number.isFinite(ms) || !(c > 0) || !Number.isFinite(c)) continue;
    const k = toKey(ms);
    counts.set(k, (counts.get(k) ?? 0) + c);
  }
  let start = endMs - 364 * SKYLINE_CONSTANTS.DAY_MS;
  start -= ((new Date(start).getUTCDay() - weekStart + 7) % 7) * SKYLINE_CONSTANTS.DAY_MS;
  const cells = [];
  for (let ms = start, i = 0; ms <= endMs; ms += SKYLINE_CONSTANTS.DAY_MS, i++) {
    const date = toKey(ms);
    cells.push({ date, count: counts.get(date) ?? 0, level: 0, week: Math.floor(i / 7), day: i % 7 });
  }
  const nz = cells.map((c) => c.count).filter((c) => c > 0).sort((a, b) => a - b);
  const busy = nz.length ? nz[Math.floor(0.95 * (nz.length - 1))] : 0;
  for (const c of cells) c.level = levelOf(c.count, busy);
  return { cells, weeks: cells.length ? cells[cells.length - 1].week + 1 : 0, max: nz.length ? nz[nz.length - 1] : 0 };
};

const computeStats = (cells) => {
  let total = 0;
  let best = 0;
  let bestDate = null;
  let run = 0;
  let runStart = null;
  let longest = { days: 0, start: null, end: null };
  for (const c of cells) {
    total += c.count;
    if (c.count > best) {
      best = c.count;
      bestDate = c.date;
    }
    if (c.count > 0) {
      if (run === 0) runStart = c.date;
      run++;
      if (run > longest.days) longest = { days: run, start: runStart, end: c.date };
    } else run = 0;
  }
  let j = cells.length - 1;
  if (j >= 0 && cells[j].count === 0) j--;
  const endAt = j;
  while (j >= 0 && cells[j].count > 0) j--;
  const days = endAt - j;
  const current = days > 0 ? { days, start: cells[j + 1].date, end: cells[endAt].date } : { days: 0, start: null, end: null };
  return {
    total,
    first: cells.length ? cells[0].date : null,
    last: cells.length ? cells[cells.length - 1].date : null,
    busiest: { count: best, date: bestDate },
    longest,
    current,
  };
};

const monthLabels = (cells, weeks, locale = "en-US") => {
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" });
  const out = [];
  let prev = -1;
  for (let w = 0; w < weeks; w++) {
    const c = cells[w * 7];
    if (!c) break;
    const m = +c.date.slice(5, 7);
    if (m !== prev) out.push({ week: w, label: fmt.format(dayMs(c.date)) });
    prev = m;
  }
  if (out.length > 1 && out[1].week - out[0].week < 3) out.shift();
  return out;
};

const barHeight = (count, max, scale = 1) =>
  count > 0 && max > 0 ? 0.4 + Math.pow(count / max, 0.85) * 7.2 * scale : 0.2;

const riseAt = (t, week, weeks, day) => {
  const d = (weeks > 1 ? week / (weeks - 1) : 0) * 0.36 + (day / 6) * 0.06;
  return easeOutCubic((t - d) / (1 - SKYLINE_CONSTANTS.WAVE));
};

const camera = (e, dYaw = 0, dElev = 0) => {
  const yaw = Math.min(SKYLINE_CONSTANTS.YAW_RANGE[1], Math.max(0, lerp(0, SKYLINE_CONSTANTS.YAW_3D + dYaw, e)));
  const elev = lerp(Math.PI / 2, Math.min(SKYLINE_CONSTANTS.ELEV_RANGE[1], Math.max(SKYLINE_CONSTANTS.ELEV_RANGE[0], SKYLINE_CONSTANTS.ELEV_3D + dElev)), e);
  return { cs: Math.cos(yaw), sn: Math.sin(yaw), se: Math.sin(elev), ce: Math.cos(elev) };
};

const project = (c, x, y, z) => [
  x * c.cs - y * c.sn,
  (x * c.sn + y * c.cs) * c.se - z * c.ce,
];

const mixRGB = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const luminance = (c) => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
const rgbString = (r, g, b) => "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";

let probeCanvas = null;
const toRGB = (color, fallback = [255, 255, 255]) => {
  if (!probeCanvas && typeof document !== "undefined") {
    probeCanvas = document.createElement("canvas");
    probeCanvas.width = probeCanvas.height = 1;
  }
  if (!probeCanvas) return fallback;
  const ctx = probeCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return fallback;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  if (d[3] < 8) return fallback;
  return [d[0], d[1], d[2]];
};

const pointInQuad = (p, o, x, y) => {
  let sign = 0;
  for (let k = 0; k < 4; k++) {
    const ax = p[o + k * 2];
    const ay = p[o + k * 2 + 1];
    const bx = p[o + ((k + 1) % 4) * 2];
    const by = p[o + ((k + 1) % 4) * 2 + 1];
    const cross = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
    if (Math.abs(cross) < 1e-9) continue;
    const s = cross > 0 ? 1 : -1;
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return sign !== 0;
};

const quadPath = (ctx, p, o, r) => {
  if (r < 0.3) {
    ctx.moveTo(p[o], p[o + 1]);
    ctx.lineTo(p[o + 2], p[o + 3]);
    ctx.lineTo(p[o + 4], p[o + 5]);
    ctx.lineTo(p[o + 6], p[o + 7]);
    ctx.closePath();
    return;
  }
  ctx.moveTo((p[o + 6] + p[o]) / 2, (p[o + 7] + p[o + 1]) / 2);
  for (let k = 0; k < 4; k++) {
    const b = (k + 1) % 4;
    ctx.arcTo(p[o + k * 2], p[o + k * 2 + 1], p[o + b * 2], p[o + b * 2 + 1], r);
  }
  ctx.closePath();
};

class SkylineEngine {
  constructor(canvas, container, tip) {
    this.canvas = canvas;
    this.stage = container;
    this.tip = tip;
    this.ctx = canvas.getContext("2d");

    const end = Date.now();
    this.data = generateContributions(end, 7, 371);
    this.model = {
      ...buildGrid(this.data, end, 0),
      stats: computeStats(buildGrid(this.data, end, 0).cells),
      months: monthLabels(buildGrid(this.data, end, 0).cells, buildGrid(this.data, end, 0).weeks, "en-US")
    };

    this.view = "3d";
    this.target = 1;
    this.t = 1;
    this.duration = 1100;
    this.heightScale = 1.05;
    this.orbit = true;
    this.legendLevel = -1;

    this.yaw = 0;
    this.elev = 0;
    this.yawGoal = 0;
    this.elevGoal = 0;

    this.W = 0;
    this.H2 = 0;
    this.H3 = 0;
    this.Hmax = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.gutter = 28;
    this.labelW = 28;

    this.col = new Float32Array(15);
    this.colGoal = new Float32Array(15);
    this.colReady = false;
    this.fg = [248, 250, 252];
    this.bg = [8, 11, 17];
    this.isDark = true;

    this.hovered = -1;
    this.pinned = -1;
    this.activeIdx = -1;
    this.tipW = 0;
    this.raf = 0;
    this.last = 0;

    this.initArrays();
    this.bindEvents();
    this.retheme();
    this.relayout();
    this.updateStatsDOM();
    this.renderSwatches();
  }

  initArrays() {
    const m = this.model;
    const n = m.cells.length;
    this.n = n;
    this.weeks = m.weeks;
    this.wk = new Float32Array(n);
    this.dy = new Float32Array(n);
    this.lv = new Uint8Array(n);
    this.hgt = new Float32Array(n);
    this.zs = new Float32Array(n);
    this.hover = new Float32Array(n);
    this.dim = new Float32Array(n);
    this.polys = new Float32Array(n * 24);
    this.faces = new Uint8Array(n);
    this.order = Array.from({ length: n }, (_, i) => i);

    for (let i = 0; i < n; i++) {
      const c = m.cells[i];
      this.wk[i] = c.week;
      this.dy[i] = c.day;
      this.lv[i] = c.level;
      this.hgt[i] = barHeight(c.count, m.max, this.heightScale);
    }

    const wf = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
    this.weekdayRows = [];
    for (let d = 0; d < 7 && d < n; d++) {
      const dow = new Date(dayMs(m.cells[d].date)).getUTCDay();
      if (dow === 1 || dow === 3 || dow === 5) {
        this.weekdayRows.push({ day: d, label: wf.format(dayMs(m.cells[d].date)) });
      }
    }
  }

  retheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "azure";
    const palConfig = SKYLINE_CONSTANTS.PALETTES[currentTheme] || SKYLINE_CONSTANTS.PALETTES.azure;
    const pal = palConfig.dark;
    this.fg = [248, 250, 252];
    this.bg = [8, 11, 17];
    this.isDark = true;

    const empty = mixRGB(this.bg, this.fg, 0.12);
    const all = [empty, ...pal.map(c => toRGB(c, this.fg))];

    for (let k = 0; k < 5; k++) {
      for (let ch = 0; ch < 3; ch++) {
        this.colGoal[k * 3 + ch] = all[k][ch];
      }
    }
    if (!this.colReady) {
      this.col.set(this.colGoal);
      this.colReady = true;
    }
    this.swatches = all.map(c => rgbString(c[0], c[1], c[2]));
    this.renderSwatches();
    this.kick();
  }

  extent(cam, e, full) {
    const w = lerp(0.78, 0.9, e);
    const off = (1 - w) / 2;
    let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
    const add = (x, y, z) => {
      const p = project(cam, x, y, z);
      if (p[0] < minx) minx = p[0];
      if (p[0] > maxx) maxx = p[0];
      if (p[1] < miny) miny = p[1];
      if (p[1] > maxy) maxy = p[1];
    };
    for (let i = 0; i < this.n; i++) {
      const x0 = this.wk[i] + off;
      const y0 = this.dy[i] + off;
      const z = full ? this.hgt[i] * e : this.zs[i];
      add(x0, y0, z);
      add(x0 + w, y0, z);
      add(x0, y0 + w, z);
      add(x0 + w, y0 + w, 0);
      add(x0, y0 + w, 0);
      add(x0 + w, y0, 0);
    }
    add(0, 7 + 1.5 * e, 0);
    add(this.weeks, 7 + 1.5 * e, 0);
    return { minx, maxx, miny, maxy };
  }

  relayout() {
    const w = Math.round(this.stage.clientWidth);
    if (!w || !this.n) return;
    this.W = w;
    this.gutter = this.W < 520 ? 0 : this.labelW;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);

    const b2 = this.extent(camera(0), 0, true);
    this.H2 = 20 + 4 + ((b2.maxy - b2.miny) / (b2.maxx - b2.minx)) * (this.W - this.gutter - 4);
    const b3 = this.extent(camera(1), 1, true);
    const natural = ((b3.maxy - b3.miny) / (b3.maxx - b3.minx)) * (this.W - 40) + 40;
    this.H3 = Math.max(Math.min(natural, this.W * 0.72, 540), 220);
    this.Hmax = Math.ceil(Math.max(this.H2, this.H3));

    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.Hmax * this.dpr);
    this.canvas.style.width = this.W + "px";
    this.canvas.style.height = this.Hmax + "px";
    this.draw();
  }

  draw() {
    if (!this.W || !this.n) return;
    const e = easeInOutCubic(this.t);
    const cam = camera(e, this.yaw, this.elev);
    const Hc = lerp(this.H2, this.H3, e);
    this.stage.style.height = Hc.toFixed(1) + "px";

    for (let i = 0; i < this.n; i++) {
      this.zs[i] = riseAt(this.t, this.wk[i], this.weeks, this.dy[i]) * this.hgt[i];
    }

    const b = this.extent(cam, e, false);
    const pad = lerp(2, 20, e);
    const left = pad + this.gutter * (1 - e);
    const top = pad + 20 * (1 - e);
    const aw = this.W - left - pad;
    const ah = Hc - top - pad;
    const bw = Math.max(1e-6, b.maxx - b.minx);
    const bh = Math.max(1e-6, b.maxy - b.miny);
    const s = Math.min(aw / bw, ah / bh);
    const ox = left + (aw - bw * s) / 2 - b.minx * s;
    const oy = top + (ah - bh * s) / 2 - b.miny * s;
    const { cs, sn, se, ce } = cam;

    const px = (x, y) => ox + (x * cs - y * sn) * s;
    const py = (x, y, z) => oy + ((x * sn + y * cs) * se - z * ce) * s;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.clearRect(0, 0, this.W, this.Hmax);

    this.order.sort((a, c) => (this.wk[a] + 0.5) * sn + (this.dy[a] + 0.5) * cs - ((this.wk[c] + 0.5) * sn + (this.dy[c] + 0.5) * cs));

    const w = lerp(0.78, 0.9, e);
    const off = (1 - w) / 2;
    const radius = lerp(0.17, 0.03, e) * s;
    const outline = (1 - e) * 0.07;
    const lift = 0.7 * e;
    const ex = this.col[0], ey = this.col[1], ez = this.col[2];

    for (let k = 0; k < this.n; k++) {
      const i = this.order[k];
      const x0 = this.wk[i] + off;
      const y0 = this.dy[i] + off;
      const x1 = x0 + w;
      const y1 = y0 + w;
      const z = this.zs[i] + this.hover[i] * lift;
      const o = i * 24;

      // top
      this.polys[o] = px(x0, y0); this.polys[o + 1] = py(x0, y0, z);
      this.polys[o + 2] = px(x1, y0); this.polys[o + 3] = py(x1, y0, z);
      this.polys[o + 4] = px(x1, y1); this.polys[o + 5] = py(x1, y1, z);
      this.polys[o + 6] = px(x0, y1); this.polys[o + 7] = py(x0, y1, z);
      // left face
      this.polys[o + 8] = px(x0, y1); this.polys[o + 9] = py(x0, y1, 0);
      this.polys[o + 10] = px(x1, y1); this.polys[o + 11] = py(x1, y1, 0);
      this.polys[o + 12] = this.polys[o + 4]; this.polys[o + 13] = this.polys[o + 5];
      this.polys[o + 14] = this.polys[o + 6]; this.polys[o + 15] = this.polys[o + 7];
      // right face
      this.polys[o + 16] = px(x1, y0); this.polys[o + 17] = py(x1, y0, 0);
      this.polys[o + 18] = this.polys[o + 10]; this.polys[o + 19] = this.polys[o + 11];
      this.polys[o + 20] = this.polys[o + 4]; this.polys[o + 21] = this.polys[o + 5];
      this.polys[o + 22] = this.polys[o + 2]; this.polys[o + 23] = this.polys[o + 3];

      const tall = z * ce * s;
      let f = 0;
      if (tall > 0.35 && w * cs * s > 0.35) f |= 1;
      if (tall > 0.35 && w * sn * s > 0.35) f |= 2;
      this.faces[i] = f;

      const L = this.lv[i] * 3;
      let r = this.col[L], g = this.col[L + 1], bl = this.col[L + 2];
      const d = this.dim[i];
      if (d > 0.002) {
        r += (ex - r) * 0.72 * d;
        g += (ey - g) * 0.72 * d;
        bl += (ez - bl) * 0.72 * d;
      }
      const hv = this.hover[i];
      if (hv > 0.002) {
        const m = 0.16 * hv;
        r += (this.fg[0] - r) * m;
        g += (this.fg[1] - g) * m;
        bl += (this.fg[2] - bl) * m;
      }

      if (f & 1) {
        this.ctx.beginPath();
        quadPath(this.ctx, this.polys, o + 8, 0);
        this.ctx.fillStyle = rgbString(r * 0.84, g * 0.84, bl * 0.84);
        this.ctx.fill();
      }
      if (f & 2) {
        this.ctx.beginPath();
        quadPath(this.ctx, this.polys, o + 16, 0);
        this.ctx.fillStyle = rgbString(r * 0.68, g * 0.68, bl * 0.68);
        this.ctx.fill();
      }
      this.ctx.beginPath();
      quadPath(this.ctx, this.polys, o, radius);
      this.ctx.fillStyle = rgbString(r, g, bl);
      this.ctx.fill();

      if (outline > 0.004) {
        this.ctx.strokeStyle = "rgba(" + this.fg[0] + "," + this.fg[1] + "," + this.fg[2] + "," + outline.toFixed(3) + ")";
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
      if (hv > 0.02) {
        this.ctx.strokeStyle = "rgba(" + this.fg[0] + "," + this.fg[1] + "," + this.fg[2] + "," + (0.85 * hv).toFixed(3) + ")";
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
    }

    // Month & Day Labels
    const muted = mixRGB(this.bg, this.fg, 0.55);
    this.ctx.font = "400 10px sans-serif";
    const a2 = 1 - smoothstep(0, 0.4, e);
    const a3 = smoothstep(0.62, 1, e);

    if (a2 > 0.004) {
      this.ctx.fillStyle = "rgba(" + Math.round(muted[0]) + "," + Math.round(muted[1]) + "," + Math.round(muted[2]) + "," + a2.toFixed(3) + ")";
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "bottom";
      let edge = -Infinity;
      for (const m of this.model.months) {
        const x = px(m.week + off, -0.3);
        const tw = this.ctx.measureText(m.label).width;
        if (x < edge || x + tw > this.W) continue;
        this.ctx.fillText(m.label, x, py(m.week + off, -0.3, 0) - 3);
        edge = x + tw + 6;
      }
      this.ctx.textAlign = "right";
      this.ctx.textBaseline = "middle";
      if (this.gutter > 0) {
        for (const r of this.weekdayRows) {
          this.ctx.fillText(r.label, px(0, r.day + 0.5) - 6, py(0, r.day + 0.5, 0));
        }
      }
    }

    if (a3 > 0.004) {
      this.ctx.fillStyle = "rgba(" + Math.round(muted[0]) + "," + Math.round(muted[1]) + "," + Math.round(muted[2]) + "," + a3.toFixed(3) + ")";
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";
      let edge = -Infinity;
      for (const m of this.model.months) {
        const x = px(m.week + 0.5, 7.3);
        const tw = this.ctx.measureText(m.label).width;
        if (x < edge || x + tw > this.W) continue;
        this.ctx.fillText(m.label, x, py(m.week + 0.5, 7.3, 0) + 2);
        edge = x + tw + 10;
      }
    }

    // Tooltip position
    if (this.activeIdx >= 0 && this.activeIdx < this.n) {
      const i = this.activeIdx;
      const z = this.zs[i] + this.hover[i] * lift;
      const tx = px(this.wk[i] + 0.5, this.dy[i] + 0.5);
      const ty = Math.min(
        py(this.wk[i] + off, this.dy[i] + off, z),
        py(this.wk[i] + off + w, this.dy[i] + off, z),
        py(this.wk[i] + off, this.dy[i] + off + w, z)
      );
      const half = (this.tipW || 110) / 2;
      const cx = Math.min(this.W - half - 4, Math.max(half + 4, tx));
      this.tip.style.transform = "translate(" + (cx - half).toFixed(1) + "px," + (ty - 8).toFixed(1) + "px) translateY(-100%)";
      this.tip.style.setProperty("--arrow", (tx - cx + half).toFixed(1) + "px");
    }
  }

  tick(now) {
    this.raf = 0;
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    let moving = false;

    if (this.t !== this.target) {
      const step = (dt * 1000) / Math.max(1, this.duration);
      this.t = this.target > this.t ? Math.min(this.target, this.t + step) : Math.max(this.target, this.t - step);
      moving = true;
    }

    const ko = 1 - Math.exp(-dt * 12);
    this.yaw += (this.yawGoal - this.yaw) * ko;
    this.elev += (this.elevGoal - this.elev) * ko;
    if (Math.abs(this.yawGoal - this.yaw) > 1e-4 || Math.abs(this.elevGoal - this.elev) > 1e-4) moving = true;
    else {
      this.yaw = this.yawGoal;
      this.elev = this.elevGoal;
    }

    const kc = 1 - Math.exp(-dt * 7);
    for (let k = 0; k < 15; k++) {
      const d = this.colGoal[k] - this.col[k];
      if (Math.abs(d) > 0.4) {
        this.col[k] += d * kc;
        moving = true;
      } else {
        this.col[k] = this.colGoal[k];
      }
    }

    const kh = 1 - Math.exp(-dt * 16);
    const kd = 1 - Math.exp(-dt * 10);
    const leg = this.legendLevel;
    for (let i = 0; i < this.n; i++) {
      const hg = i === this.activeIdx ? 1 : 0;
      const dg = leg >= 0 && this.lv[i] !== leg ? 1 : 0;
      const h = this.hover[i];
      const d = this.dim[i];
      if (h !== hg) {
        this.hover[i] = Math.abs(hg - h) < 0.003 ? hg : h + (hg - h) * kh;
        moving = true;
      }
      if (d !== dg) {
        this.dim[i] = Math.abs(dg - d) < 0.003 ? dg : d + (dg - d) * kd;
        moving = true;
      }
    }

    this.draw();
    if (moving) this.raf = requestAnimationFrame((n) => this.tick(n));
  }

  kick() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame((n) => this.tick(n));
  }

  setProjection(view) {
    this.view = view;
    this.target = view === "3d" ? 1 : 0;
    if (this.target === 0) {
      this.yawGoal = 0;
      this.elevGoal = 0;
    }

    // Toggle indicator and buttons
    const ind = document.getElementById("skyline-toggle-indicator");
    const btn2d = document.getElementById("skyline-btn-2d");
    const btn3d = document.getElementById("skyline-btn-3d");
    if (ind) ind.classList.toggle("mode-3d", view === "3d");
    if (btn2d) btn2d.classList.toggle("active", view === "2d");
    if (btn3d) btn3d.classList.toggle("active", view === "3d");

    // Toggle corner stats vs row stats
    const cornerTop = document.getElementById("skyline-corner-top");
    const cornerBottom = document.getElementById("skyline-corner-bottom");
    const rowStats = document.getElementById("skyline-row-stats");
    const hint = document.getElementById("skyline-hint");

    if (view === "3d") {
      if (cornerTop) cornerTop.classList.remove("hidden");
      if (cornerBottom) cornerBottom.classList.remove("hidden");
      if (rowStats) rowStats.classList.add("hidden");
      if (hint) hint.innerHTML = "Drag to orbit &bull; double-click to reset";
    } else {
      if (cornerTop) cornerTop.classList.add("hidden");
      if (cornerBottom) cornerBottom.classList.add("hidden");
      if (rowStats) rowStats.classList.remove("hidden");
      if (hint) hint.innerHTML = "Hover a day for details &bull; click to inspect";
    }

    this.kick();
  }

  setLegendLevel(lvl) {
    this.legendLevel = this.legendLevel === lvl ? -1 : lvl;
    document.querySelectorAll(".skyline-swatch-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === this.legendLevel);
    });
    this.kick();
  }

  hit(x, y) {
    for (let k = this.n - 1; k >= 0; k--) {
      const i = this.order[k];
      const o = i * 24;
      if (pointInQuad(this.polys, o, x, y)) return i;
      if (this.faces[i] & 1 && pointInQuad(this.polys, o + 8, x, y)) return i;
      if (this.faces[i] & 2 && pointInQuad(this.polys, o + 16, x, y)) return i;
    }
    return -1;
  }

  bindEvents() {
    let drag = null;
    const canvas = this.canvas;

    canvas.addEventListener("pointerdown", (ev) => {
      if (ev.button !== 0) return;
      const can = this.target === 1;
      drag = {
        id: ev.pointerId,
        x: ev.clientX,
        y: ev.clientY,
        yaw: this.yawGoal,
        elev: this.elevGoal,
        moved: false,
        orbit: can
      };
      if (can) {
        try { canvas.setPointerCapture(ev.pointerId); } catch (_) {}
      }
    });

    canvas.addEventListener("pointermove", (ev) => {
      if (drag && drag.orbit && ev.pointerId === drag.id) {
        const dx = ev.clientX - drag.x;
        const dy = ev.clientY - drag.y;
        if (drag.moved || Math.hypot(dx, dy) > 4) {
          drag.moved = true;
          this.yawGoal = Math.min(SKYLINE_CONSTANTS.YAW_RANGE[1] - SKYLINE_CONSTANTS.YAW_3D, Math.max(SKYLINE_CONSTANTS.YAW_RANGE[0] - SKYLINE_CONSTANTS.YAW_3D, drag.yaw + dx * 0.006));
          this.elevGoal = Math.min(SKYLINE_CONSTANTS.ELEV_RANGE[1] - SKYLINE_CONSTANTS.ELEV_3D, Math.max(SKYLINE_CONSTANTS.ELEV_RANGE[0] - SKYLINE_CONSTANTS.ELEV_3D, drag.elev + dy * 0.004));
          canvas.style.cursor = "grabbing";
          this.hovered = -1;
          this.updateActive();
          this.kick();
          return;
        }
      }

      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const i = this.hit(x, y);

      if (i !== this.hovered) {
        this.hovered = i;
        this.updateActive();
      }
      canvas.style.cursor = this.target === 1 ? "grab" : i >= 0 ? "pointer" : "default";
    });

    canvas.addEventListener("pointerup", (ev) => {
      if (!drag || ev.pointerId !== drag.id) return;
      const wasMoved = drag.moved;
      drag = null;
      if (canvas.hasPointerCapture(ev.pointerId)) {
        try { canvas.releasePointerCapture(ev.pointerId); } catch (_) {}
      }
      canvas.style.cursor = this.target === 1 ? "grab" : "default";
      if (wasMoved) return;

      const rect = canvas.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      const i = this.hit(x, y);
      this.pinned = i === this.pinned ? -1 : i;
      this.updateActive();
    });

    canvas.addEventListener("pointerleave", () => {
      if (drag) return;
      this.hovered = -1;
      this.updateActive();
    });

    canvas.addEventListener("dblclick", () => {
      this.yawGoal = 0;
      this.elevGoal = 0;
      this.kick();
    });

    window.addEventListener("resize", () => {
      this.relayout();
    });
  }

  updateActive() {
    const next = this.hovered >= 0 ? this.hovered : this.pinned;
    if (next === this.activeIdx) return;
    this.activeIdx = next;

    if (next >= 0 && this.model.cells[next]) {
      const c = this.model.cells[next];
      const countStr = c.count ? c.count + " contributions" : "No contributions";
      const dfy = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
      const tipContent = document.getElementById("skyline-tooltip-content");
      if (tipContent) {
        tipContent.innerHTML = "<strong>" + countStr + "</strong> on " + dfy.format(dayMs(c.date));
      }
      this.tip.classList.add("visible");
      this.tipW = this.tip.offsetWidth;
    } else {
      this.tip.classList.remove("visible");
    }
    this.kick();
  }

  updateStatsDOM() {
    const s = this.model.stats;
    const nf = new Intl.NumberFormat("en-US");
    const df = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

    const totalStr = nf.format(s.total);
    const rangeStr = (s.first ? df.format(dayMs(s.first)) : "Oct 2025") + " — " + (s.last ? df.format(dayMs(s.last)) : "Oct 2026");
    const busiestDateStr = s.busiest.date ? df.format(dayMs(s.busiest.date)) : "Jul 17, 2026";

    // Header total
    const totalEl = document.getElementById("skyline-total-count");
    if (totalEl) totalEl.textContent = totalStr;

    // Corner stats
    const statTotal = document.getElementById("skyline-stat-total");
    const statRange = document.getElementById("skyline-stat-range");
    const statBusiest = document.getElementById("skyline-stat-busiest");
    const statBusiestDate = document.getElementById("skyline-stat-busiest-date");
    const statLongest = document.getElementById("skyline-stat-longest");
    const statCurrent = document.getElementById("skyline-stat-current");

    if (statTotal) statTotal.textContent = totalStr;
    if (statRange) statRange.textContent = rangeStr;
    if (statBusiest) statBusiest.textContent = s.busiest.count;
    if (statBusiestDate) statBusiestDate.textContent = busiestDateStr;
    if (statLongest) statLongest.textContent = s.longest.days;
    if (statCurrent) statCurrent.textContent = s.current.days;

    // Row stats
    const rowTotal = document.getElementById("skyline-row-total");
    const rowRange = document.getElementById("skyline-row-range");
    const rowBusiest = document.getElementById("skyline-row-busiest");
    const rowBusiestDate = document.getElementById("skyline-row-busiest-date");
    const rowLongest = document.getElementById("skyline-row-longest");
    const rowCurrent = document.getElementById("skyline-row-current");

    if (rowTotal) rowTotal.textContent = totalStr;
    if (rowRange) rowRange.textContent = rangeStr;
    if (rowBusiest) rowBusiest.textContent = s.busiest.count;
    if (rowBusiestDate) rowBusiestDate.textContent = busiestDateStr;
    if (rowLongest) rowLongest.textContent = s.longest.days;
    if (rowCurrent) rowCurrent.textContent = s.current.days;
  }

  renderSwatches() {
    const container = document.getElementById("skyline-swatches");
    if (!container || !this.swatches) return;
    container.innerHTML = "";
    this.swatches.forEach((color, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "skyline-swatch-btn";
      btn.style.backgroundColor = color;
      btn.title = "Highlight tier " + idx;
      btn.onclick = () => this.setLegendLevel(idx);
      btn.onmouseenter = () => this.setLegendLevel(idx);
      btn.onmouseleave = () => this.setLegendLevel(-1);
      container.appendChild(btn);
    });
  }
}

// Global functions for Skyline
function setSkylineProjection(view) {
  if (window.skylineEngine) window.skylineEngine.setProjection(view);
}

function switchSkylineMode(mode) {
  const tabInteractive = document.getElementById('tab-skyline-interactive');
  const tabSvg = document.getElementById('tab-skyline-svg');
  const contInteractive = document.getElementById('skyline-interactive-container');
  const contSvg = document.getElementById('skyline-svg-container');

  if (mode === 'interactive') {
    tabInteractive.classList.add('active');
    tabSvg.classList.remove('active');
    contInteractive.style.display = 'block';
    contSvg.style.display = 'none';
    if (window.skylineEngine) window.skylineEngine.relayout();
  } else {
    tabInteractive.classList.remove('active');
    tabSvg.classList.add('active');
    contInteractive.style.display = 'none';
    contSvg.style.display = 'block';
  }
}

function switchSvgVariant(variant, btn) {
  document.querySelectorAll('#skyline-svg-container .skyline-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const img = document.getElementById('skyline-img');
  if (img) img.src = './profile-3d-contrib/profile-' + variant + '.svg';
}

// Initialize Skyline Engine on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('skyline-canvas');
  const stage = document.getElementById('skyline-stage');
  const tip = document.getElementById('skyline-tooltip');
  if (canvas && stage && tip) {
    window.skylineEngine = new SkylineEngine(canvas, stage, tip);
  }
});
`;

const scriptIdxStart = content.indexOf(oldScriptStart);
const scriptIdxEnd = content.indexOf(oldScriptEnd);
if (scriptIdxStart !== -1 && scriptIdxEnd !== -1) {
  content = content.slice(0, scriptIdxStart) + newScript + '\n' + content.slice(scriptIdxEnd);
} else {
  console.error('Could not find script replacement markers');
}

// 4. Hook setTheme to retheme the skyline engine
const oldSetTheme = `  if (APP_STATE.techView === 'radar') renderRadarChart();
  else renderDonutChart();`;
const newSetTheme = `  if (APP_STATE.techView === 'radar') renderRadarChart();
  else renderDonutChart();
  if (window.skylineEngine) window.skylineEngine.retheme();`;

if (content.includes(oldSetTheme)) {
  content = content.replace(oldSetTheme, newSetTheme);
}

fs.writeFileSync(previewPath, content, 'utf8');
console.log('preview.html updated successfully!');

// Also copy to brain artifact directory
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, content, 'utf8');
console.log('Brain profile_preview.html synced successfully!');
