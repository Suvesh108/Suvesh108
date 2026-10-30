const fs = require('fs');
const path = require('path');

const previewPath = path.resolve('preview.html');
let content = fs.readFileSync(previewPath, 'utf8');

// 1. Fix HTML: Move .filter-tabs outside .section-header in tech-arsenal
const oldArsenalHeader = `  <section id="tech-arsenal">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          Core Tech Arsenal
        </h2>
        <p class="section-desc">Platform primitives, systems languages, and cloud runtime architecture</p>
      </div>

      <div class="filter-tabs">
        <button class="filter-tab active" onclick="filterTech('all', this)">All (20)</button>
        <button class="filter-tab" onclick="filterTech('lang', this)">Languages</button>
        <button class="filter-tab" onclick="filterTech('front', this)">Frontend &amp; APIs</button>
        <button class="filter-tab" onclick="filterTech('systems', this)">Storage &amp; Infra</button>
        <button class="filter-tab" onclick="filterTech('cloud', this)">Cloud &amp; Edge</button>
      </div>
    </div>`;

const newArsenalHeader = `  <section id="tech-arsenal">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          Core Tech Arsenal
        </h2>
        <p class="section-desc">Platform primitives, systems languages, and cloud runtime architecture</p>
      </div>
    </div>

    <!-- Centered Horizontal Filter Row -->
    <div class="filter-tabs">
      <button class="filter-tab active" onclick="filterTech('all', this)">All (20)</button>
      <button class="filter-tab" onclick="filterTech('lang', this)">Languages</button>
      <button class="filter-tab" onclick="filterTech('front', this)">Frontend &amp; APIs</button>
      <button class="filter-tab" onclick="filterTech('systems', this)">Storage &amp; Infra</button>
      <button class="filter-tab" onclick="filterTech('cloud', this)">Cloud &amp; Edge</button>
    </div>`;

content = content.replace(oldArsenalHeader, newArsenalHeader);

// 2. Enhance Global 3D Depth & Lighting across all cards, buttons, and surfaces
const depthCss = `
/* ==========================================================================
   PREMIUM 3D DEPTH, LIGHTING & ELEVATION ENGINE
   ========================================================================== */
body {
  background-color: var(--bg-page);
  background-image: 
    radial-gradient(ellipse 90% 45% at 50% -10%, rgba(245, 158, 11, 0.08) 0%, transparent 60%),
    radial-gradient(circle 600px at 90% 25%, rgba(245, 158, 11, 0.035) 0%, transparent 70%),
    radial-gradient(circle 650px at 10% 65%, rgba(245, 158, 11, 0.035) 0%, transparent 70%);
  background-attachment: fixed;
}

/* 3D Elevated Cards with Light-Bevel and Multi-layered Shadows */
.bento-card,
.skyline-box,
.snake-card,
.system-card,
.cmd-window {
  background: linear-gradient(180deg, #15151c 0%, #0e0e14 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.09) !important;
  box-shadow: 
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.02),
    0 16px 36px -10px rgba(0, 0, 0, 0.75),
    0 6px 12px rgba(0, 0, 0, 0.5) !important;
  transition: transform 220ms var(--ease-spring), box-shadow 220ms ease, border-color 200ms ease !important;
}

.bento-card:hover,
.system-card:hover {
  transform: translateY(-3px) scale(1.002) !important;
  border-color: rgba(245, 158, 11, 0.3) !important;
  box-shadow: 
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 0 0 1px rgba(245, 158, 11, 0.2),
    0 24px 48px -12px rgba(0, 0, 0, 0.85),
    0 0 24px -4px rgba(245, 158, 11, 0.18) !important;
}

/* 3D Deep Well Insets */
.chart-container,
.skyline-viewport-container,
.snake-frame {
  background: #05070c !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  box-shadow: 
    inset 0 4px 14px rgba(0, 0, 0, 0.8),
    inset 0 1px 2px rgba(0, 0, 0, 0.6),
    0 1px 0 rgba(255, 255, 255, 0.04) !important;
}

/* 3D Tech Arsenal Pills & Tabs (Horizontal Row) */
.filter-tabs {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 8px !important;
  margin: 0 auto 18px !important;
  flex-wrap: wrap !important;
}
.filter-tab {
  background: linear-gradient(180deg, #181822 0%, #121218 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.09) !important;
  color: var(--text-secondary) !important;
  font-size: 11.5px !important;
  font-weight: 600 !important;
  padding: 5px 14px !important;
  border-radius: 20px !important;
  cursor: pointer !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 3px 6px rgba(0, 0, 0, 0.4) !important;
  transition: transform 180ms var(--ease-spring), color 150ms ease, box-shadow 180ms ease, border-color 150ms ease !important;
}
.filter-tab:hover {
  color: var(--text-primary) !important;
  border-color: rgba(245, 158, 11, 0.35) !important;
  transform: translateY(-1.5px) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 5px 12px rgba(0, 0, 0, 0.5), 0 0 10px rgba(245, 158, 11, 0.15) !important;
}
.filter-tab.active {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%) !important;
  color: #080b11 !important;
  border-color: #f59e0b !important;
  font-weight: 700 !important;
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    0 4px 14px rgba(245, 158, 11, 0.45) !important;
}
.filter-tab:active {
  transform: translateY(0) scale(0.97) !important;
}

/* 3D Arsenal Grid Cards */
.arsenal-card {
  background: linear-gradient(180deg, #14141a 0%, #0d0d12 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 4px 10px rgba(0, 0, 0, 0.4) !important;
  transition: transform 180ms var(--ease-spring), border-color 150ms ease, box-shadow 180ms ease !important;
}
.arsenal-card:hover {
  transform: translateY(-2px) scale(1.02) !important;
  border-color: rgba(245, 158, 11, 0.4) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 8px 18px rgba(0, 0, 0, 0.6), 0 0 12px rgba(245, 158, 11, 0.2) !important;
}

/* 3D CMD Terminal Window Elevation */
.cmd-window {
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.14),
    0 24px 60px rgba(0, 0, 0, 0.85),
    0 0 0 1px rgba(245, 158, 11, 0.25) !important;
}
.cmd-title-bar {
  background: linear-gradient(180deg, #161a24 0%, #0f131c 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4) !important;
}

/* 3D Tactile Buttons & Chips */
.social-btn {
  background: linear-gradient(180deg, #181822 0%, #121218 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.09) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 3px 6px rgba(0, 0, 0, 0.4) !important;
}
.social-btn:hover {
  transform: translateY(-1.5px) !important;
  border-color: var(--accent) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16), 0 6px 16px rgba(0, 0, 0, 0.6), 0 0 12px rgba(245, 158, 11, 0.25) !important;
}
.social-btn:active {
  transform: translateY(0) scale(0.97) !important;
}
.meta-chip {
  background: linear-gradient(180deg, #15151c 0%, #0f0f14 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 4px rgba(0, 0, 0, 0.3) !important;
}
.meta-chip.accent {
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.16) 0%, rgba(245, 158, 11, 0.08) 100%) !important;
  border-color: rgba(245, 158, 11, 0.45) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 8px rgba(245, 158, 11, 0.18) !important;
}
`;

const styleEnd = content.indexOf('</style>');
content = content.slice(0, styleEnd) + depthCss + '\n' + content.slice(styleEnd);

fs.writeFileSync(previewPath, content, 'utf8');
console.log('Successfully fixed filter-tabs and added premium 3D depth to preview.html!');

// Sync with Brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, content, 'utf8');
console.log('Brain profile_preview.html synced successfully!');
