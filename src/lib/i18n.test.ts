import { describe, it, expect } from 'vitest';
import { isLang, langOf, keyOf, url, switcherHref } from './i18n';

describe('i18n helpers', () => {
  it('recognises supported languages only', () => {
    expect(isLang('en')).toBe(true);
    expect(isLang('sk')).toBe(true);
    expect(isLang('de')).toBe(false);
  });
  it('splits content ids into language and key', () => {
    expect(langOf('sk/vlk')).toBe('sk');
    expect(keyOf('sk/vlk')).toBe('vlk');
    expect(keyOf('en/2026-09-30-maps')).toBe('2026-09-30-maps');
  });
  it('builds URLs under the base path with exactly one slash', () => {
    expect(url('/Earthwalker', '/en/')).toBe('/Earthwalker/en/');
    expect(url('/Earthwalker/', 'en/')).toBe('/Earthwalker/en/');
    expect(url('', '/en/')).toBe('/en/');
  });
  it('switcher uses the translated page when it exists', () => {
    const alt = { sk: '/Earthwalker/sk/projects/vlk/' };
    expect(switcherHref('sk', alt, '/Earthwalker')).toBe('/Earthwalker/sk/projects/vlk/');
  });
  it('switcher falls back to the language home when no translation exists', () => {
    expect(switcherHref('sk', {}, '/Earthwalker')).toBe('/Earthwalker/sk/');
  });
});
