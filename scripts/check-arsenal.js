const fs = require('fs');
const html = fs.readFileSync('preview.html', 'utf8');

const sIdx = html.indexOf('const ARSENAL_DATA =');
const eIdx = html.indexOf('function renderArsenal');
const dataStr = html.slice(sIdx, eIdx);

const names = [...dataStr.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Arsenal items count:', names.length);
console.log('Arsenal items:', names.join(', '));
