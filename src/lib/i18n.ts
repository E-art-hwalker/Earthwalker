export const LOCALES = ['en', 'sk'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'en';

export function isLang(v: string): v is Lang {
  return (LOCALES as readonly string[]).includes(v);
}

export function langOf(id: string): string {
  return id.split('/')[0];
}

export function keyOf(id: string): string {
  return id.split('/').slice(1).join('/');
}

export function url(base: string, path: string): string {
  const b = base.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

export type AltPaths = Partial<Record<Lang, string>>;

export function switcherHref(to: Lang, alt: AltPaths, base: string): string {
  return alt[to] ?? url(base, `/${to}/`);
}
