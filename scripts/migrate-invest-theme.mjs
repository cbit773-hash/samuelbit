import fs from 'fs';
import path from 'path';

const SRC = path.join(process.cwd(), 'src');

const REPLACEMENTS = [
  ['bg-[#050505]', 'bg-background'],
  ['bg-[#050505]/90', 'bg-surface/95'],
  ['bg-[#060d14]', 'bg-surface'],
  ['bg-[#0a0a0a]', 'bg-surface-alt'],
  ['bg-[#020202]', 'bg-surface-alt'],
  ['bg-[#111]', 'bg-surface-inset'],
  ['bg-[#0c1424]', 'bg-surface'],
  ['#04091a', '#ffffff'],
  ['border-white/10', 'border-border'],
  ['border-white/5', 'border-border'],
  ['border-white/20', 'border-border'],
  ['border-white/15', 'border-border'],
  ['hover:bg-amber-600', 'hover:bg-primary-hover'],
  ['hover:bg-amber-500', 'hover:bg-primary-hover'],
  ['hover:bg-amber-400', 'hover:text-brand'],
  ['bg-amber-', 'bg-accent-lime/'],
  ['from-primary to-amber-300', 'from-brand to-primary'],
  ['text-amber-', 'text-brand'],
  ['bg-black/20', 'bg-foreground/10'],
  ['bg-black/30', 'bg-foreground/10'],
  ['bg-black/40', 'bg-surface-inset'],
  ['bg-black/50', 'bg-surface-inset'],
  ['bg-black/60', 'bg-foreground/20'],
  ['bg-black/70', 'bg-foreground/20'],
  ['bg-black/80', 'bg-foreground/25'],
  ['bg-black ', 'bg-surface-inset '],
  ['bg-black/', 'bg-surface-inset/'],
  ['text-gray-400', 'text-muted'],
  ['text-gray-500', 'text-muted'],
  ['text-gray-600', 'text-muted-tertiary'],
  ['text-gray-300', 'text-foreground'],
  ['text-gray-200', 'text-foreground'],
  ['border-ash-stone', 'border-border'],
  ['hover:text-white', 'hover:text-foreground'],
  ['hover:bg-white/20', 'hover:bg-surface-alt'],
  ['hover:bg-white/10', 'hover:bg-surface-alt'],
  ['hover:bg-white/5', 'hover:bg-surface-alt'],
  ['bg-primary text-black', 'bg-primary text-polar-white'],
  ['text-blue-400', 'text-brand'],
  ['text-blue-500', 'text-brand'],
  ['hover:text-blue-300', 'hover:text-brand-hover'],
  ['hover:text-blue-400', 'hover:text-brand'],
  ['bg-blue-600', 'bg-primary'],
  ['bg-blue-500', 'bg-primary'],
  ['ring-offset-[#0f1117]', 'ring-offset-surface'],
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
