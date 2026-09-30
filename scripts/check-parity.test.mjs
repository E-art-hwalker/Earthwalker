import { describe, it, expect, beforeEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkParity } from './check-parity.mjs';

let dir;
const put = (rel) => {
  const p = join(dir, rel);
  mkdirSync(join(p, '..'), { recursive: true });
  writeFileSync(p, '---\ntitle: x\n---\n');
};

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'parity-'));
});

describe('checkParity', () => {
  it('passes when every key exists in both languages', () => {
    put('projects/en/vlk.md');
    put('projects/sk/vlk.md');
    expect(checkParity(dir)).toEqual([]);
  });
  it('reports a key missing in one language', () => {
    put('projects/en/vlk.md');
    const problems = checkParity(dir);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain('projects/vlk');
    expect(problems[0]).toContain('sk');
  });
  it('ignores non-markdown files such as .gitkeep', () => {
    put('log/en/.gitkeep');
    put('log/sk/.gitkeep');
    expect(checkParity(dir)).toEqual([]);
  });
});
