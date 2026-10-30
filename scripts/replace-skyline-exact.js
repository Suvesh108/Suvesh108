const fs = require('fs');

// Read the user-provided file
const userHtml = fs.readFileSync('C:/Users/Suvesh/Desktop/contribution-skyline.html', 'utf8');

// 1. Extract CSS
const styleStart = userHtml.indexOf('<style>') + '<style>'.length;
const styleEnd = userHtml.indexOf('</style>');
let userCss = userHtml.slice(styleStart, styleEnd);

// Scope and adapt CSS so it fits seamlessly in preview.html / index.html dark Obsidian theme
userCss = `
/* =============================================================
   2. CONTRIBUTION SKYLINE (from Desktop/contribution-skyline.html)
   ============================================================= */
.skyline {
  width: 100%;
  margin: auto;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 20px;
  background: var(--bg-surface);
  box-shadow: var(--shadow-card);
  position: relative;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.heading {
  font-size: 15px;
  margin: 0;
  font-weight: 400;
  color: var(--text-primary);
}
.heading strong {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}
.toggle {
  display: flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--bg-subpanel);
}
.toggle button {
  width: 34px;
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 180ms ease;
}
.toggle button[aria-pressed=true] {
  background: var(--accent);
  color: #121217;
}
.toggle svg {
  width: 15px;
  height: 15px;
}
.panel {
  border: 1px solid var(--border-rim);
  border-radius: 10px;
  overflow: hidden;
  background: #04060a;
}
.stage-wrap {
  position: relative;
  padding: 14px 14px 0;
}
.stage {
  position: relative;
  width: 100%;
  min-height: 140px;
  overflow: hidden;
}
.stage canvas {
  position: absolute;
  inset: 0;
  display: block;
  outline: 0;
  max-width: none;
  touch-action: pan-y;
  cursor: grab;
}
.stage canvas:active {
  cursor: grabbing;
}
.tooltip {
  position: absolute;
  z-index: 20;
  top: 10px;
  left: 10px;
  padding: 7px 11px;
  border-radius: 6px;
  background: var(--bg-subpanel);
  color: var(--text-primary);
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -100%);
  transition: opacity .12s;
  box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12);
}
.tooltip:after {
  content: "";
  position: absolute;
  top: 100%;
  left: var(--arrow, 50%);
  margin-left: -5px;
  border: 5px solid transparent;
  border-top-color: var(--bg-subpanel);
  border-bottom: 0;
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding: 16px 16px 12px;
  border-top: 1px solid var(--border-rim);
}
.stat-label {
  color: var(--text-tertiary);
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.stat-value {
  font-size: 26px;
  font-weight: 750;
  letter-spacing: -.03em;
  line-height: 1.15;
  margin-top: 3px;
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono);
  color: var(--accent);
}
.stat-sub {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 16px;
  color: var(--text-secondary);
  font-size: 11.5px;
  border-top: 1px solid var(--border-rim);
}
.legend {
  display: flex;
  align-items: center;
  gap: 5px;
}
.swatch {
  width: 12px;
  height: 12px;
  padding: 0;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);
  transition: transform 150ms ease;
}
.swatch[aria-pressed=true] {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.corner {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: opacity .4s;
}
.corner.top {
  right: 14px;
  top: 14px;
  align-items: flex-end;
  text-align: right;
}
.corner.bottom {
  left: 14px;
  bottom: 14px;
}
.corner .stat-value {
  font-size: clamp(26px, 4.5vw, 42px);
}
.corner .stat-sub {
  max-width: 180px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
@media(max-width:650px){
  .stats { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .corner .stat-value { font-size: 24px; }
  .corner .stat-sub { max-width: 120px; }
}
`;

// 2. Extract HTML Section
const bodyStart = userHtml.indexOf('<section class="skyline"');
const bodyEnd = userHtml.indexOf('</section>', bodyStart) + '</section>'.length;
let sectionHtml = userHtml.slice(bodyStart, bodyEnd);

// Wrap with section-header
sectionHtml = `  <!-- =============================================================
       2. CONTRIBUTION SKYLINE (Direct Desktop/contribution-skyline.html Replacement)
       ============================================================= -->
  <section id="skyline-section">
    <div class="section-header">
      <div>
        <h2>
          <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Contribution Skyline
        </h2>
      </div>
    </div>

    ${sectionHtml}
  </section>`;

// 3. Extract Script
const scriptStart = userHtml.indexOf('<script>') + '<script>'.length;
const scriptEnd = userHtml.lastIndexOf('</script>');
let userScript = userHtml.slice(scriptStart, scriptEnd);

// Update CONFIG.palette to amber and default to dark obsidian palette
userScript = userScript.replace('palette: "github"', 'palette: "amber"');

// Ensure palettes includes amber
const oldPalettes = 'const palettes={';
const newPalettes = `const palettes={
 amber:{light:["#fde2c4","#fbad6e","#f06b3a","#b3261e"],dark:["#4a1a10","#8f2f16","#e0572a","#f59e0b"]},`;

userScript = userScript.replace(oldPalettes, newPalettes);

// Expose skyline controller
userScript = `// ==========================================================================
// 4. CONTRIBUTION SKYLINE (Direct Desktop/contribution-skyline.html Engine)
// ==========================================================================
${userScript}`;

// 4. Update preview.html
let preview = fs.readFileSync('preview.html', 'utf8');

// Replace CSS
const cssStart = preview.indexOf('.skyline-box {');
const cssEnd = preview.indexOf('/* =============================================================\n   3. CORE TECH ARSENAL');
preview = preview.slice(0, cssStart) + userCss + '\n' + preview.slice(cssEnd);

// Replace Section HTML
const secStart = preview.indexOf('<section id="contribution-skyline">');
const secEnd = preview.indexOf('</section>', secStart) + '</section>'.length;
preview = preview.slice(0, secStart) + sectionHtml + preview.slice(secEnd);

// Replace Script
const jsStart = preview.indexOf('// ==========================================================================\n// 4. INTERACTIVE 3D CONTRIBUTION SKYLINE ENGINE');
const jsEnd = preview.indexOf('// ==========================================================================\n// 5. CORE TECH ARSENAL', jsStart);
preview = preview.slice(0, jsStart) + userScript + '\n\n' + preview.slice(jsEnd);

fs.writeFileSync('preview.html', preview, 'utf8');
fs.writeFileSync('index.html', preview, 'utf8');

// Sync to brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, preview, 'utf8');

console.log('Successfully replaced Skyline in preview.html, index.html, and brain artifact!');
