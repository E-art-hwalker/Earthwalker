import type { Lang } from './i18n';

export const ui: Record<Lang, Record<string, string>> = {
  en: {
    siteTitle: 'Earthwalker',
    home: 'Home',
    projects: 'Projects',
    log: 'Highlights',
    about: 'About',
    latest: 'Latest highlights',
    featured: 'Projects',
    noLog: 'Highlights will appear here soon.',
    aboutSoon: 'This page is coming soon.',
    otherLang: 'Slovenčina',
    back: '← Back',
    readMore: 'Read more',
  },
  sk: {
    siteTitle: 'Earthwalker',
    home: 'Domov',
    projects: 'Projekty',
    log: 'Míľniky',
    about: 'O mne',
    latest: 'Posledné míľniky',
    featured: 'Projekty',
    noLog: 'Míľniky sa tu čoskoro objavia.',
    aboutSoon: 'Táto stránka bude čoskoro.',
    otherLang: 'English',
    back: '← Späť',
    readMore: 'Čítať ďalej',
  },
};
