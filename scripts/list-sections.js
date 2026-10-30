const fs = require('fs');
const html = fs.readFileSync('preview.html', 'utf8');

const matches = html.match(/<section[^>]*id="([^"]+)"/g);
console.log('Sections:', matches);
