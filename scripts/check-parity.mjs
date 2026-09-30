import { readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LANGS = ['en', 'sk'];

function keysIn(dir) {
  if (!existsSync(dir)) return new Set();
  const out = new Set();
  const walk = (d, prefix) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full, prefix + name + '/');
      else if (name.endsWith('.md')) out.add(prefix + name.replace(/\.md$/, ''));
    }
  };
  walk(dir, '');
  return out;
}

export function checkParity(contentDir) {
  const problems = [];
  for (const collection of readdirSync(contentDir)) {
    const cdir = join(contentDir, collection);
    if (!statSync(cdir).isDirectory()) continue;
    const byLang = Object.fromEntries(LANGS.map((l) => [l, keysIn(join(cdir, l))]));
    const all = new Set(LANGS.flatMap((l) => [...byLang[l]]));
    for (const key of all)
      for (const l of LANGS)
        if (!byLang[l].has(key)) problems.push(`${collection}/${key} is missing the "${l}" translation`);
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkParity('src/content');
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log('Translation parity OK');
}
