const fs = require('fs');
const path = require('path');

const targetDirs = [
  'app/(dashboard)',
  'components/diagrams',
  'components/reader',
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content
    .replace(/blue-600/g, 'emerald-600')
    .replace(/blue-500/g, 'emerald-500')
    .replace(/blue-700/g, 'emerald-700')
    .replace(/blue-400/g, 'emerald-400')
    .replace(/blue-300/g, 'emerald-300')
    .replace(/blue-200/g, 'emerald-200')
    .replace(/blue-100/g, 'emerald-100')
    .replace(/blue-50/g, 'emerald-50')
    .replace(/blue-950/g, 'emerald-950')
    .replace(/from-blue-/g, 'from-emerald-')
    .replace(/to-indigo-/g, 'to-teal-');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated theme in:', filePath);
  }
}

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      processFile(full);
    }
  }
}

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) walk(dir);
});
console.log('Theme transformation finished.');

