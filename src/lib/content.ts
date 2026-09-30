import { getCollection } from 'astro:content';
import { keyOf, langOf, type Lang } from './i18n';

type Name = 'projects' | 'log';

export async function listEntries(name: Name, lang: Lang) {
  const all = await getCollection(name as 'projects', (e) => !e.data.draft && langOf(e.id) === lang);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function hasTranslation(name: Name, key: string, lang: Lang) {
  const list = await listEntries(name, lang);
  return list.some((e) => keyOf(e.id) === key);
}
