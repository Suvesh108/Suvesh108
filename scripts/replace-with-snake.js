const fs = require('fs');
const path = require('path');

const previewPath = path.resolve('preview.html');
let content = fs.readFileSync(previewPath, 'utf8');

// 1. Locate and replace the github-activity-heatmap section with github-snake-game
const oldSectionStart = '<!-- =============================================================\n       CONTRIBUTION ACTIVITY HEATMAP (Placed Below Skyline)';
const oldSectionEnd = '<!-- =============================================================\n       3. CORE TECH ARSENAL';

const oldIdxStart = content.indexOf(oldSectionStart);
const oldIdxEnd = content.indexOf(oldSectionEnd);

if (oldIdxStart === -1 || oldIdxEnd === -1) {
  console.error('Could not find heatmap section markers');
  process.exit(1);
}

const snakeSection = `<!-- =============================================================
       GITHUB SNAKE GAME (Platane/snk - Placed Below Skyline)
       ============================================================= -->
  <section id="github-snake-game">
    <div class="snake-card">
      <div class="snake-frame">
        <img src="./snake.svg" alt="GitHub Contribution Snake Animation" class="snake-svg-img" />
      </div>
    </div>
  </section>

  `;

content = content.slice(0, oldIdxStart) + snakeSection + content.slice(oldIdxEnd);

// 2. Add CSS styles for .snake-card and .snake-frame
const snakeCss = `
/* =============================================================
   GITHUB SNAKE GAME (Platane/snk)
   ============================================================= */
.snake-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 16px 20px;
  box-shadow: var(--shadow-card);
  margin-top: 18px;
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.snake-frame {
  width: 100%;
  max-width: 880px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-inner);
  overflow: hidden;
  background: #080b10;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 10px 14px;
}
.snake-svg-img {
  width: 100%;
  height: auto;
  max-height: 192px;
  display: block;
  object-fit: contain;
}
`;

// Insert CSS before </style>
const styleEnd = content.indexOf('</style>');
content = content.slice(0, styleEnd) + snakeCss + '\n' + content.slice(styleEnd);

// 3. Clean up renderAnalyticsHeatmap call and function
content = content.replace('renderAnalyticsHeatmap();', '// renderAnalyticsHeatmap replaced by Platane/snk snake');

fs.writeFileSync(previewPath, content, 'utf8');
console.log('Successfully replaced activity heatmap with Platane/snk snake game in preview.html!');

// 4. Sync with brain artifact directory
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, content, 'utf8');
console.log('Brain profile_preview.html synced successfully!');
