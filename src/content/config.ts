// src/content/config.ts
// Defines the frontmatter schema for each content type
// Astro validates every .md/.mdx file against these schemas at build time

import { defineCollection, z } from 'astro:content';

// ── Articles ──────────────────────────────────────────
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedDate: z.string(),        // ISO: "2026-03-15"
    modifiedDate: z.string().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    cover: z.string().optional(),     // "/images/articles/my-cover.jpg"
    readTime: z.string().optional(),  // "6 min"
    toc: z.boolean().default(false),  // show table of contents?
    draft: z.boolean().default(false),
    keywords: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
  }),
});

// ── Projects ──────────────────────────────────────────
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),          // Short (used in card)
    summary: z.string(),              // Full (used in detail page)
    category: z.string(),             // "Automation" | "Platform" | "Tracking"
    tags: z.array(z.string()),        // Tech stack: ["n8n", "MySQL"]
    cover: z.string().optional(),
    year: z.number(),
    role: z.string(),                 // "Product Owner"
    status: z.string(),               // "Live" | "In Progress" | "Archived"
    type: z.string(),                 // "Internal Tool" | "Open Source"
    featured: z.boolean().default(false),
    metrics: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).optional(),
    links: z.object({
      github: z.string().optional(),
      demo: z.string().optional(),
    }).optional(),
  }),
});

// ── Certificates ──────────────────────────────────────
const certificates = defineCollection({
  type: 'data',                       // JSON/YAML only, no markdown body
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    issuerShort: z.string(),          // For logo placeholder: "AWS"
    category: z.string(),             // "Automation" | "Cloud" | "SEO" | "Product"
    color: z.enum(['teal','blue','amber','purple','coral','gray']),
    issuedDate: z.string(),           // "2025-01"
    expiryDate: z.string().optional(),
    credentialUrl: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { articles, projects, certificates };
