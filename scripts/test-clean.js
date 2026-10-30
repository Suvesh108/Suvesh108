const fs = require('fs');
const content = fs.readFileSync('preview.html', 'utf8');

console.log('Contains GLOBAL METRICS:', content.includes('GLOBAL METRICS'));
console.log('Contains TOP LANGUAGES:', content.includes('TOP LANGUAGES'));
console.log('Contains HONORS & ACHIEVEMENTS:', content.includes('HONORS & ACHIEVEMENTS'));
console.log('Contains analytics-heatmap:', content.includes('id="analytics-heatmap"'));
console.log('Contains renderAnalyticsHeatmap:', content.includes('renderAnalyticsHeatmap()'));
