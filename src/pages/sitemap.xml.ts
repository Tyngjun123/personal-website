import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://tj-portfolio-coral.vercel.app';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const projects = await getCollection('projects', ({ data }) => !data.draft);

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/articles', priority: '0.9', changefreq: 'weekly' },
    { url: '/projects', priority: '0.9', changefreq: 'weekly' },
    { url: '/certificates', priority: '0.6', changefreq: 'monthly' },
  ];

  const articleEntries = articles.map((a) => ({
    url: `/articles/${a.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: a.data.modifiedDate ?? a.data.publishedDate,
  }));

  const projectEntries = projects.map((p) => ({
    url: `/projects/${p.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: undefined,
  }));

  const allEntries = [...staticPages, ...articleEntries, ...projectEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (e) => `  <url>
    <loc>${SITE}${e.url}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
