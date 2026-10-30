const fs = require('fs');
const content = fs.readFileSync('preview.html', 'utf8');

console.log('cmd-window exists:', content.includes('cmd-window'));
console.log('analytics-velocity-card exists:', content.includes('analytics-velocity-card'));
console.log('GitHub Analytics title removed:', !content.includes('<h2>\n          <svg viewBox="0 0 24 24"><path d="M18 20V10"/>') && !content.includes('GitHub Analytics &amp; Velocity</h2>'));
console.log('Logs title exists:', content.includes('Logs\n        </h2>'));
console.log('renderAnalyticsHeatmap exists:', content.includes('renderAnalyticsHeatmap()'));
