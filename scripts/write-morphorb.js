const fs = require('fs');
const path = require('path');

const rawPath = 'C:/Users/vishnu/.gemini/antigravity/brain/d057b036-7904-4ec1-9da0-46523109477a/scratch/full_code_raw.txt';
const txt = fs.readFileSync(rawPath, 'utf8');
const lines = txt.split('\n');
const compLines = lines.slice(1, 1049);
let compCode = compLines.join('\n');
compCode = compCode.replace(/import\s+["']\.\.\/\.\.\/index\.css["'];?/g, '');
compCode = "'use client';\n" + compCode;

const targetPath = path.resolve('components/ui/ai-thiking-orb-and-input.tsx');
fs.writeFileSync(targetPath, compCode, 'utf8');
console.log('Successfully written components/ui/ai-thiking-orb-and-input.tsx with length', compCode.length);
