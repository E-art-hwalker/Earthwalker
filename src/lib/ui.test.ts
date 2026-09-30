import { describe, it, expect } from 'vitest';
import { ui } from './ui';

describe('ui strings', () => {
  it('has identical keys in both languages', () => {
    expect(Object.keys(ui.sk).sort()).toEqual(Object.keys(ui.en).sort());
  });
  it('has no empty strings', () => {
    for (const lang of ['en', 'sk'] as const)
      for (const [k, v] of Object.entries(ui[lang])) expect(v, `${lang}.${k}`).not.toBe('');
  });
});
