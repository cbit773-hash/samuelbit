import fs from 'fs';
import path from 'path';

const SRC = path.join(process.cwd(), 'src');
const REPS = [
  ['bg-accent-lime/500/', 'bg-accent-lime/'],
  ['text-brand500', 'text-brand'],
  ['border-amber-500', 'border-brand'],
  ['focus:border-amber-500', 'focus:border-brand'],
  ['focus:ring-amber-500', 'focus:ring-brand/30'],
  ['from-amber-500', 'from-brand'],
  ['to-orange-600', 'to-brand-hover'],
  ['hover:from-amber-600', ''],
  ['hover:to-orange-700', ''],
  ['bg-white/5', 'bg-surface-alt'],
  ['placeholder-gray-600', 'placeholder-muted-tertiary'],
  ["color: '#050505'", "color: '#ffffff'"],
  ['textColor: \'#9ca3af\'', "textColor: '#454745'"],
  ['vertLines: { color: \'rgba(255, 255, 255, 0.05)\' }', "vertLines: { color: '#e8ebe6' }"],
  ['horzLines: { color: \'rgba(255, 255, 255, 0.05)\' }', "horzLines: { color: '#e8ebe6' }"],
  ['rgba(245, 158, 11, 0.5)', 'rgba(0, 108, 255, 0.4)'],
  ["color: 'rgba(255, 255, 255, 0.03)'", "color: 'rgba(14, 15, 12, 0.04)'"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx?|css)$/.test(name)) files.push(p);
  }
  return files;
}

let n = 0;
for (const file of walk(SRC)) {
  let c = fs.readFileSync(file, 'utf8');
  const o = c;
  for (const [a, b] of REPS) c = c.split(a).join(b);
  if (c !== o) {
    fs.writeFileSync(file, c, 'utf8');
    n++;
  }
}
console.log(`Fixed ${n} files`);
