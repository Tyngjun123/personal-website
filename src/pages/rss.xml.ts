// src/pages/rss.xml.ts
// Auto-generates RSS feed from all articles
// Accessible at: yourdomain.com/rss.xml

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');

  const sorted = articles
    .filter(a => !a.data.draft)
    .sort((a, b) =>
      new Date(b.data.publishedDate).getTime() -
      new Date(a.data.publishedDate).getTime()
    );

  return rss({
    title: `${SITE.name} — Articles`,
    description: SITE.description,
    site: context.site!,
    items: sorted.map(article => ({
      title: article.data.title,
      pubDate: new Date(article.data.publishedDate),
      description: article.data.description,
      categories: [article.data.category, ...article.data.tags],
      author: SITE.author,
      link: `/articles/${article.slug}/`,
    })),
    customData: `
      <language>en-my</language>
      <managingEditor>${SITE.email} (${SITE.author})</managingEditor>
      <webMaster>${SITE.email} (${SITE.author})</webMaster>
      <copyright>© ${new Date().getFullYear()} ${SITE.author}</copyright>
      <ttl>10080</ttl>
    `,
    stylesheet: false,
  });
}
