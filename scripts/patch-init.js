const fs = require('fs');

let content = fs.readFileSync('preview.html', 'utf8');

const targetStr = `// Initialize Skyline Engine on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('skyline-canvas');
  const stage = document.getElementById('skyline-stage');
  const tip = document.getElementById('skyline-tooltip');
  if (canvas && stage && tip) {
    window.skylineEngine = new SkylineEngine(canvas, stage, tip);
  }
});`;

const replacementStr = `// Initialize Skyline Engine safely across all load states
function initSkyline() {
  const canvas = document.getElementById('skyline-canvas');
  const stage = document.getElementById('skyline-stage');
  const tip = document.getElementById('skyline-tooltip');
  if (canvas && stage && tip && !window.skylineEngine) {
    window.skylineEngine = new SkylineEngine(canvas, stage, tip);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSkyline);
} else {
  initSkyline();
}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('preview.html', content, 'utf8');
  fs.writeFileSync('C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html', content, 'utf8');
  console.log('Init safely replaced and synced!');
} else {
  console.log('Target string not found or already replaced.');
}
