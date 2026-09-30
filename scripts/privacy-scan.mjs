import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function normalize(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function scanText(text, words) {
  const hay = normalize(text);
  return words.filter((w) => w.trim() !== '' && hay.includes(normalize(w)));
}

export function scanDir(dir, words) {
  const hits = [];
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.md')) {
        const found = scanText(readFileSync(full, 'utf8'), words);
        if (found.length) hits.push({ file: full, words: found });
      }
    }
  };
  if (existsSync(dir)) walk(dir);
  return hits;
}

export function loadWords(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('#'));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const required = process.argv.includes('--require');
  const words = loadWords('private-words.txt');
  if (words === null) {
    console.error('private-words.txt not found.');
    process.exit(required ? 1 : 0);
  }
  const hits = scanDir('src/content', words);
  if (hits.length) {
    for (const h of hits) console.error(`${h.file}: ${h.words.join(', ')}`);
    process.exit(1);
  }
  console.log('Private-word scan clean');
}
