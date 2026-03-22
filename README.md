# TJ Portfolio — Astro + Vercel

Personal portfolio site built with Astro, deployed on Vercel. Full SEO stack included out of the box.

---

## Tech Stack

- **Framework**: Astro 4 (static output)
- **Hosting**: Vercel (free tier)
- **Content**: MDX files (articles & projects), JSON (certificates)
- **SEO**: Sitemap, OG tags, JSON-LD, Canonical URLs, RSS, robots.txt

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:4321

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## Project Structure

```
tj-portfolio/
├── public/
│   ├── images/
│   │   ├── og-default.jpg        ← 1200×630px OG image (REQUIRED)
│   │   └── articles/             ← Article cover images
│   ├── robots.txt
│   └── favicon.svg
│
├── src/
│   ├── config/
│   │   └── site.ts               ← ✏️ EDIT THIS FIRST — all site info here
│   │
│   ├── content/
│   │   ├── config.ts             ← Content schema definitions
│   │   ├── articles/             ← Write .mdx files here
│   │   ├── projects/             ← Write .mdx files here
│   │   └── certificates/         ← Add .json files here
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro      ← Nav + Footer + global styles
│   │   └── ArticleLayout.astro   ← Article-specific layout
│   │
│   ├── components/
│   │   └── SEO.astro             ← All meta tags in one place
│   │
│   └── pages/
│       ├── index.astro           ← Homepage
│       ├── rss.xml.ts            ← RSS feed (auto-generated)
│       ├── articles/
│       │   ├── index.astro       ← Articles listing
│       │   └── [...slug].astro   ← Dynamic article pages
│       ├── projects/
│       │   ├── index.astro
│       │   └── [...slug].astro
│       └── certificates/
│           └── index.astro
│
├── astro.config.mjs
├── vercel.json
└── package.json
```

---

## Setup Checklist

### Step 1 — Edit site config (DO THIS FIRST)
Open `src/config/site.ts` and update every field marked with 🔁

### Step 2 — Add your OG image
Place a 1200×630px image at `public/images/og-default.jpg`
This shows when your links are shared on LinkedIn, WhatsApp, Twitter

### Step 3 — Add your favicon
Replace `public/favicon.svg` with your own

### Step 4 — Update robots.txt
Replace `yourdomain.com` in `public/robots.txt` with your real domain

### Step 5 — Update astro.config.mjs
Replace `yourdomain.com` in the `site` field

---

## Domain Name Recommendation

For a personal brand site, go with **Cloudflare Registrar** — cheapest renewal prices, no markup.

**Suggested domain formats:**
```
yourname.dev        ← Best for developers/technical people
yourname.me         ← Personal brand feel
yourname.com        ← Most universal
tj.codes            ← Creative option if available
```

**For TJ specifically:**
- `tj.dev` — check availability
- `tjbuilds.dev`
- `tjautomation.dev`
- `tjcodes.com`

**Buy from:**
- **Cloudflare Registrar** (cloudflare.com/products/registrar) — at-cost pricing, ~$8–10/yr for .com
- **Namecheap** — good alternative, ~$10–12/yr

> ⚠️ Avoid GoDaddy — renewal prices spike after year 1

---

## Domain → Vercel Setup

1. Buy domain from Cloudflare Registrar
2. In Vercel dashboard → Project → Settings → Domains → Add domain
3. Vercel gives you DNS records
4. In Cloudflare DNS → add those records
5. SSL is automatic — Vercel handles it

> If using Cloudflare nameservers, set SSL/TLS to **Full (Strict)** in Cloudflare dashboard

---

## Writing Articles

Create a new file in `src/content/articles/your-slug.mdx`:

```mdx
---
title: "Your Article Title"
description: "One sentence summary — used in meta description and article cards."
publishedDate: "2026-03-15"
category: "Automation"
tags: ["n8n", "MySQL", "Tutorial"]
cover: "/images/articles/your-cover.jpg"   # optional
readTime: "6 min"                           # optional, auto shown in header
toc: true                                   # show table of contents?
draft: false                                # true = won't appear in build
featured: false                             # show in featured section?
keywords: ["n8n Malaysia", "automation"]    # extra SEO keywords
---

Your content starts here. Normal Markdown syntax.

## Section heading

Paragraph text...
```

**That's it.** The layout handles all SEO, TOC, sharing, sidebar automatically.

---

## Adding Projects

Create `src/content/projects/your-project-slug.mdx`:

```mdx
---
title: "Lead Management System"
description: "Short description for card view."
summary: "Longer description for detail page."
category: "Automation"
tags: ["n8n", "MySQL", "WhatsApp API"]
year: 2025
role: "Product Owner"
status: "Live"
type: "Internal Tool"
featured: true
metrics:
  - value: "~80%"
    label: "Less manual effort"
  - value: "< 60s"
    label: "First contact time"
---

Full project description in markdown...

## The problem
...

## How it works
...
```

---

## Adding Certificates

Create `src/content/certificates/your-cert.json`:

```json
{
  "name": "AWS Certified Cloud Practitioner",
  "issuer": "Amazon Web Services",
  "issuerShort": "AWS",
  "category": "Cloud",
  "color": "blue",
  "issuedDate": "2024-09",
  "credentialUrl": "https://aws.amazon.com/verification/..."
}
```

---

## SEO Features Included

| Feature | How it works |
|---------|-------------|
| Meta title & description | Set in frontmatter, auto-formatted |
| Meta keywords | `keywords` array in frontmatter |
| Canonical URL | Auto-generated from page slug |
| Open Graph | Auto — uses cover image or og-default.jpg |
| Twitter Card | Auto — summary_large_image |
| JSON-LD Person | Applied globally on every page |
| JSON-LD Article | Applied automatically on article pages |
| Sitemap | Auto-generated at build time → /sitemap-index.xml |
| robots.txt | At /public/robots.txt |
| RSS Feed | Auto-generated at /rss.xml |
| Structured URLs | cleanUrls: true in vercel.json |

---

## Deployment

```bash
# Push to GitHub, then connect repo in Vercel dashboard
# Vercel auto-deploys on every git push to main

git add .
git commit -m "initial deploy"
git push origin main
```

Then in Vercel:
1. Import Git Repository
2. Framework: Astro (auto-detected)
3. Build command: `npm run build` (auto-detected)
4. Output directory: `dist` (auto-detected)
5. Add your custom domain in Settings → Domains

---

## After Going Live — SEO Steps

1. **Google Search Console** — add your site, submit sitemap URL: `yourdomain.com/sitemap-index.xml`
2. **Bing Webmaster Tools** — submit sitemap there too
3. **Test OG tags** — use [opengraph.xyz](https://opengraph.xyz) to verify social previews
4. **Test JSON-LD** — use [Google Rich Results Test](https://search.google.com/test/rich-results)
5. **Test page speed** — [PageSpeed Insights](https://pagespeed.web.dev) — Astro static sites typically score 95+
6. **Add to LinkedIn** — update your LinkedIn with your site URL
