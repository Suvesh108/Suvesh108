const fs = require('fs');
const path = require('path');

const previewPath = path.resolve('preview.html');
let content = fs.readFileSync(previewPath, 'utf8');

// 1. Remove the entire destructive GLOBAL JUSTIFY CENTER OVERRIDES block
const startComment = content.indexOf('/* ==========================================================================\n   GLOBAL JUSTIFY CENTER OVERRIDES');
const endMarker = '/* =============================================================\n   GITHUB SNAKE GAME';
const endIdx = content.indexOf(endMarker);

if (startComment === -1 || endIdx === -1) {
  console.error('Could not find override block markers');
  process.exit(1);
}

// 2. Replacement CSS: Compact layout + Centered headers + Left-aligned card interiors
const compactAndCenteredCss = `/* ==========================================================================
   CLEAN TYPOGRAPHY & COMPACT SPACING (Restoring Natural Card Flow & Centered Headers)
   ========================================================================== */
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 20px 18px 48px;
}

/* Compact Hero with Centered Content */
.hero {
  padding: 20px 0 24px;
  border-bottom: 1px solid var(--border-subtle);
  text-align: center;
}
.hero-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
}
.hero-title-group {
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}
h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin: 0 0 6px;
  color: var(--text-primary);
  text-align: center;
}
.hero-role {
  font-size: 14px;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
  text-align: center;
}
.hero-tagline {
  color: var(--text-secondary);
  font-size: 13px;
  max-width: 580px;
  margin: 0 auto 16px;
  line-height: 1.55;
  text-align: center;
}
.meta-chips {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin: 0 auto 16px;
}
.social-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Compact Sections with Centered Section Headers */
section {
  padding: 22px 0;
  border-bottom: 1px solid var(--border-subtle);
}
.section-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 16px;
  gap: 4px;
  width: 100%;
}
.section-header > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}
.section-header h2 {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 3px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
}
.section-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0 auto;
  max-width: 580px;
  text-align: center;
}

/* Compact Bento with Natural Left-Aligned Card Data */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 10px;
}
.bento-card {
  padding: 14px 16px;
  border-radius: 12px;
  text-align: left;
}
.bento-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.bento-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: left;
}
.bento-stat-num {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: left;
  line-height: 1.1;
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}
.bento-subtext {
  font-size: 10.5px;
  color: var(--text-tertiary);
  margin-top: 3px;
  text-align: left;
}
.chart-container {
  height: 110px;
  margin-top: 10px;
}

/* Compact Skyline with Natural Toolbar & Controls */
.skyline-box {
  padding: 14px 16px;
  border-radius: 12px;
}
.skyline-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.skyline-card-title {
  text-align: left;
}
.skyline-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 11px;
}

/* Compact Snake Card */
.snake-card {
  padding: 12px 16px;
  margin-top: 12px;
  margin-bottom: 20px;
  border-radius: 12px;
}
.snake-frame {
  padding: 8px 10px;
}

/* Core Tech Arsenal: Centered Filter Tabs, Compact Grid */
.filter-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}
.arsenal-grid {
  gap: 8px;
}
.arsenal-card {
  padding: 10px 12px;
  border-radius: 8px;
}

/* My Projects: Natural Left-Aligned Cards with Compact Padding */
.systems-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.system-card {
  padding: 14px 16px;
  border-radius: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.system-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  margin-bottom: 8px;
}
.system-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  text-align: left;
  margin-bottom: 12px;
}
.system-stats {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--text-tertiary);
  margin-bottom: 10px;
  text-align: left;
}
.system-stack {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.system-actions {
  display: flex;
  gap: 10px;
}

/* Logs: Natural Left-Aligned Terminal Window */
.cmd-window {
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: left;
}
.cmd-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  text-align: left;
}
.cmd-title-text {
  text-align: left;
  font-size: 11px;
}
.cmd-body {
  padding: 14px 18px 18px;
  font-size: 12px;
  line-height: 1.55;
  text-align: left;
}
.cmd-prompt-line {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 8px;
  text-align: left;
  flex-wrap: wrap;
}
.cmd-banner-note {
  font-size: 10.5px;
  color: #64748b;
  margin-bottom: 10px;
  border-left: 2px solid var(--accent);
  padding-left: 8px;
  text-align: left;
}
.cmd-log-list {
  list-style: none;
  padding: 0;
  margin: 0 0 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
}
.cmd-log-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 6px;
  text-align: left;
  border-radius: 4px;
}
.cmd-text {
  text-align: left;
}
.cmd-cursor-line {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  text-align: left;
}

@media (max-width: 768px) {
  .bento-grid { grid-template-columns: 1fr; }
  .systems-grid { grid-template-columns: 1fr; }
  .card-velocity, .card-rhythm, .card-treemap, .card-techmix { grid-column: span 1; }
}
`;

content = content.slice(0, startComment) + compactAndCenteredCss + '\n' + content.slice(endIdx);

fs.writeFileSync(previewPath, content, 'utf8');
console.log('Successfully purged justify-center overrides and applied compact layout!');

// Sync with Brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, content, 'utf8');
console.log('Brain profile_preview.html synced successfully!');
