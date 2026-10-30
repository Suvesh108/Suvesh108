const fs = require('fs');

let content = fs.readFileSync('preview.html', 'utf8');

const newCss = `
/* =============================================================
   5. GITHUB ANALYTICS & VELOCITY (Exact Image 1, Content-Only)
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

const styleEnd = content.indexOf('</style>');
if (!content.includes('.cmd-window') && styleEnd !== -1) {
  content = content.slice(0, styleEnd) + newCss + '\n' + content.slice(styleEnd);
}

fs.writeFileSync('preview.html', content, 'utf8');
fs.writeFileSync('C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html', content, 'utf8');
console.log('CSS injected and synced successfully!');
