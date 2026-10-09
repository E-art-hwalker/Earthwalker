import { describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { normalize, scanText, scanDir, loadWords } from './privacy-scan.mjs';

describe('normalize', () => {
  it('lowercases and strips diacritics', () => {
    expect(normalize('VĹK Čučoriedka')).toBe('vlk cucoriedka');
  });
});

describe('scanText', () => {
  it('matches regardless of case and diacritics', () => {
    expect(scanText('Projekt Vĺk je tajný', ['vlk'])).toEqual(['vlk']);
    expect(scanText('NOVAK s.r.o.', ['Novák'])).toEqual(['Novák']);
  });
  it('returns nothing when there is no match', () => {
    expect(scanText('hello world', ['secret'])).toEqual([]);
  });
  it('ignores empty words', () => {
    expect(scanText('hello', [''])).toEqual([]);
  });
  it('matches a "=" entry only as a whole word', () => {
    expect(scanText('štandardná aplikácia', ['=nda'])).toEqual([]);
    expect(scanText('Sign the NDA today', ['=nda'])).toEqual(['=nda']);
    expect(scanText('NDA.', ['=nda'])).toEqual(['=nda']);
  });
  it('still matches plain entries inside longer words', () => {
    expect(scanText('standard', ['nda'])).toEqual(['nda']);
  });
});

describe('scanDir and loadWords', () => {
  it('finds hits in nested markdown files', () => {
    const dir = mkdtempSync(join(tmpdir(), 'scan-'));
    mkdirSync(join(dir, 'log/en'), { recursive: true });
    writeFileSync(join(dir, 'log/en/a.md'), 'the price is 500 EUR');
    writeFileSync(join(dir, 'log/en/b.md'), 'nothing here');
    const hits = scanDir(dir, ['price']);
    expect(hits).toHaveLength(1);
    expect(hits[0].file).toContain('a.md');
  });
  it('loadWords returns null for a missing file and skips comments', () => {
    expect(loadWords('/nonexistent/private-words.txt')).toBeNull();
    const dir = mkdtempSync(join(tmpdir(), 'words-'));
    const p = join(dir, 'w.txt');
    writeFileSync(p, '# comment\nalpha\n\n beta \n');
    expect(loadWords(p)).toEqual(['alpha', 'beta']);
  });
});
