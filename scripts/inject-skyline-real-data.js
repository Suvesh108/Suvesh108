const fs = require('fs');

// Read raw real contribution data
const rawData = JSON.parse(fs.readFileSync('suvesh-contributions.json', 'utf8'));
const contributionsJsonStr = JSON.stringify(rawData);

// Read user's exact HTML code
const userHtml = fs.readFileSync('C:/Users/Suvesh/Desktop/contribution-skyline.html', 'utf8');

// Extract CSS
const styleStart = userHtml.indexOf('<style>') + '<style>'.length;
const styleEnd = userHtml.indexOf('</style>');
let userCss = userHtml.slice(styleStart, styleEnd);

// Custom theme styling to match Obsidian Amber and page aesthetics
userCss = `
/* =============================================================
   2. CONTRIBUTION SKYLINE (Exact Component Implementation)
   ============================================================= */
${userCss}

/* Obsidian Theme Adaptations for Contribution Skyline */
.skyline {
  background: var(--bg-surface) !important;
  border: 1px solid var(--border-subtle) !important;
  border-radius: var(--radius-card) !important;
  box-shadow: var(--shadow-card) !important;
}
.heading {
  color: var(--text-primary) !important;
}
.toggle {
  background: var(--bg-subpanel) !important;
  border-color: var(--border-subtle) !important;
}
.toggle button {
  color: var(--text-secondary) !important;
}
.toggle button[aria-pressed=true] {
  background: var(--accent) !important;
  color: #121217 !important;
}
.panel {
  background: #04060a !important;
  border-color: var(--border-rim) !important;
}
.stats {
  border-top-color: var(--border-rim) !important;
}
.stat-value {
  color: var(--accent) !important;
  font-family: var(--font-mono) !important;
}
.footer {
  border-top-color: var(--border-rim) !important;
  color: var(--text-secondary) !important;
}
.tooltip {
  background: var(--bg-subpanel) !important;
  color: var(--text-primary) !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.12) !important;
}
.tooltip:after {
  border-top-color: var(--bg-subpanel) !important;
}
`;

// Extract Section HTML
const bodyStart = userHtml.indexOf('<section class="skyline"');
const bodyEnd = userHtml.indexOf('</section>', bodyStart) + '</section>'.length;
let userSection = userHtml.slice(bodyStart, bodyEnd);

let skylineSectionMarkup = `  <!-- =============================================================
       2. CONTRIBUTION SKYLINE (Fully Functional Interactive Component)
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

    ${userSection}
  </section>`;

// Extract Script
const scriptStart = userHtml.indexOf('<script>') + '<script>'.length;
const scriptEnd = userHtml.lastIndexOf('</script>');
let userScript = userHtml.slice(scriptStart, scriptEnd);

// Inject real user contribution data into CONFIG
userScript = userScript.replace('data: window.CONTRIBUTION_DATA || null,', `data: ${contributionsJsonStr},`);
userScript = userScript.replace('palette: "github"', 'palette: "amber"');

// Ensure palettes object includes amber
const oldPalettes = 'const palettes={';
const newPalettes = `const palettes={
 amber:{light:["#fde2c4","#fbad6e","#f06b3a","#b3261e"],dark:["#4a1a10","#8f2f16","#e0572a","#f59e0b"]},`;
userScript = userScript.replace(oldPalettes, newPalettes);

// Update preview.html and index.html
let preview = fs.readFileSync('preview.html', 'utf8');

// Replace CSS
const cssStart = preview.indexOf('/* =============================================================\n   2. CONTRIBUTION SKYLINE');
const cssEnd = preview.indexOf('/* =============================================================\n   3. CORE TECH ARSENAL');
preview = preview.slice(0, cssStart) + userCss + '\n' + preview.slice(cssEnd);

// Replace Section Markup
const secStart = preview.indexOf('<section id="skyline-section">');
const secEnd = preview.indexOf('</section>', secStart) + '</section>'.length;
preview = preview.slice(0, secStart) + skylineSectionMarkup + preview.slice(secEnd);

// Replace Script
const jsStart = preview.indexOf('// ==========================================================================\n// 4. CONTRIBUTION SKYLINE');
const jsEnd = preview.indexOf('// ==========================================================================\n// 5. CORE TECH ARSENAL');
preview = preview.slice(0, jsStart) + `// ==========================================================================\n// 4. CONTRIBUTION SKYLINE (Exact Component Implementation with Real Data)\n// ==========================================================================\n` + userScript + '\n\n' + preview.slice(jsEnd);

fs.writeFileSync('preview.html', preview, 'utf8');
fs.writeFileSync('index.html', preview, 'utf8');

// Update brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, preview, 'utf8');

console.log('Successfully injected exact Contribution Skyline with real data!');
