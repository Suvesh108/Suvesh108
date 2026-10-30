const fs = require('fs');
let html = fs.readFileSync('preview.html', 'utf8');

// 1. Replace .skyline-stage CSS rule
const oldCss = `.skyline-stage {
  position: relative;
  width: 100%;
  height: 260px;
  min-height: 180px;
  overflow: hidden;
  border-radius: 8px;
  transition: height 300ms cubic-bezier(0.16, 1, 0.3, 1);
}`;

const newCss = `.skyline-stage {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 0 !important;
  overflow: hidden;
  border-radius: 8px;
  transition: height 250ms cubic-bezier(0.16, 1, 0.3, 1);
}`;

if (!html.includes(oldCss)) {
  console.log('oldCss not found exactly, trying regex');
  html = html.replace(/\.skyline-stage\s*\{[^}]+\}/, newCss);
} else {
  html = html.replace(oldCss, newCss);
  console.log('Replaced .skyline-stage CSS');
}

// 2. Tighten skyline-row-stats margins
const oldStatsCss = `.skyline-row-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border-rim);
  margin-top: 14px;
  transition: opacity 300ms ease;
}`;

const newStatsCss = `.skyline-row-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border-rim);
  margin-top: 8px;
  transition: opacity 300ms ease;
}`;

if (!html.includes(oldStatsCss)) {
  console.log('oldStatsCss not found exactly, trying regex');
  html = html.replace(/\.skyline-row-stats\s*\{[^}]+\}/, newStatsCss);
} else {
  html = html.replace(oldStatsCss, newStatsCss);
  console.log('Replaced .skyline-row-stats CSS');
}

// 3. Update H3 calculation in SkylineEngine.relayout()
const oldH3 = 'this.H3 = Math.max(Math.min(natural, this.W * 0.72, 540), 220);';
const newH3 = 'this.H3 = Math.max(Math.min(natural, this.W * 0.45, 280), 220);';

if (html.includes(oldH3)) {
  html = html.replace(oldH3, newH3);
  console.log('Replaced H3 calculation');
} else {
  console.log('oldH3 not found');
}

fs.writeFileSync('preview.html', html, 'utf8');

// Also update brain artifact profile_preview.html
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, html, 'utf8');
console.log('Updated profile_preview.html artifact successfully.');
