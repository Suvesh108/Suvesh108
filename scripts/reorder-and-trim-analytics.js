const fs = require('fs');
const path = require('path');

const previewPath = path.resolve('preview.html');
let content = fs.readFileSync(previewPath, 'utf8');

// 1. Locate the github-analytics-velocity section
const analyticsStart = content.indexOf('<!-- =============================================================\n       5. GITHUB ANALYTICS & VELOCITY');
const analyticsEnd = content.indexOf('<!-- =============================================================\n       6. LOGS');

if (analyticsStart === -1 || analyticsEnd === -1) {
  console.error('Could not locate analytics section boundaries');
  process.exit(1);
}

// 2. Extract and remove the section from its current position
const originalSection = content.slice(analyticsStart, analyticsEnd);
content = content.slice(0, analyticsStart) + content.slice(analyticsEnd);

// 3. Create the streamlined heatmap card (removing 1st: Global Metrics/Top Languages, and 2nd: Honors & Achievements)
const streamlinedSection = `  <!-- =============================================================
       CONTRIBUTION ACTIVITY HEATMAP (Placed Below Skyline)
       ============================================================= -->
  <section id="github-activity-heatmap">
    <div class="analytics-mid-card">
      <div class="heatmap-glowing-dots">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="analytics-heatmap" id="analytics-heatmap" aria-label="Decorative contribution activity heatmap"></div>
      <div class="analytics-segmented-bar">
        <span></span><span></span><span></span>
      </div>
    </div>
  </section>

`;

// 4. Locate the closing of contribution-skyline section
const skylineMarker = '</section>\n\n  <!-- =============================================================\n       3. CORE TECH ARSENAL';
const skylineIdx = content.indexOf(skylineMarker);

if (skylineIdx === -1) {
  console.error('Could not locate skylineMarker');
  process.exit(1);
}

// Insert right after contribution-skyline's </section>
const insertPosition = skylineIdx + '</section>\n\n'.length;
content = content.slice(0, insertPosition) + streamlinedSection + content.slice(insertPosition);

// 5. Update CSS in preview.html for .analytics-mid-card
if (!content.includes('.analytics-mid-card')) {
  const cssInsertion = `
.analytics-mid-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  padding: 20px 24px 16px;
  box-shadow: var(--shadow-card);
  margin-top: 18px;
  margin-bottom: 24px;
}
`;
  const styleEnd = content.indexOf('</style>');
  content = content.slice(0, styleEnd) + cssInsertion + content.slice(styleEnd);
}

fs.writeFileSync(previewPath, content, 'utf8');
console.log('Successfully removed 1st & 2nd and moved section below contribution skyline!');

// Sync with Brain artifact
const brainPath = 'C:/Users/Suvesh/.gemini/antigravity/brain/96cf25d4-72df-4427-86d7-208e5cd2e459/profile_preview.html';
fs.writeFileSync(brainPath, content, 'utf8');
console.log('Brain profile_preview.html synced successfully!');
