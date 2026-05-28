import fs from 'fs';
import path from 'path';

const SRC = path.join(process.cwd(), 'src');

const REPLACEMENTS = [
  ['border-ash-stone', 'border-border'],
  ['text-gray-400', 'text-muted'],
  ['text-gray-500', 'text-muted'],
  ['text-gray-600', 'text-muted'],
  ['text-gray-300', 'text-foreground'],
  ['bg-[#060d14]', 'bg-surface'],
  ['bg-[#0a0a0a]', 'bg-surface'],
  ['bg-[#020202]', 'bg-surface-alt'],
  ['bg-black/20', 'bg-surface-inset'],
  ['bg-black/30', 'bg-surface-inset'],
  ['bg-black/40', 'bg-surface-inset'],
  ['bg-black/50', 'bg-surface-inset'],
  ['bg-black/70', 'bg-foreground/20'],
  ['bg-black/80', 'bg-foreground/25'],
  ['bg-[#111]', 'bg-surface-inset'],
  ['border-white/20', 'border-border'],
  ['border-white/15', 'border-border'],
  ['border-white/10', 'border-border'],
  ['hover:text-white', 'hover:text-foreground'],
  ['hover:bg-white/20', 'hover:bg-surface-inset'],
  ['hover:bg-white/10', 'hover:bg-surface-inset'],
  ['hover:bg-white/5', 'hover:bg-surface-inset'],
  ['placeholder-gray-500', 'placeholder-muted'],
  ['bg-primary text-black', 'bg-primary text-polar-white'],
  ['text-white', 'text-foreground'],
  ['bg-blue-600 text-foreground', 'bg-blue-600 text-polar-white'],
  ['bg-blue-500 text-foreground', 'bg-blue-500 text-polar-white'],
  ['bg-rose-500 text-foreground', 'bg-rose-500 text-polar-white'],
  ['ring-offset-[#0f1117]', 'ring-offset-surface'],
  ["color: '#04091a'", "color: '#ffffff'"],
  ["textColor: '#8e92af'", "textColor: '#454a66'"],
  ["vertLines: { color: '#262a42' }", "vertLines: { color: '#e8f1ff' }"],
  ["horzLines: { color: '#262a42' }", "horzLines: { color: '#e8f1ff' }"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (/\.(tsx?|css)$/.test(name)) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(SRC)) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  for (const [from, to] of REPLACEMENTS) {
    c = c.split(from).join(to);
  }
  if (c !== orig) {
    fs.writeFileSync(file, c, 'utf8');
    changed++;
  }
}
console.log(`Updated ${changed} files`);
