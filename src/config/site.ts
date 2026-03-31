// src/config/site.ts
// Managed by the CMS — edit via /admin/cms/home

import settings from '../data/cms-settings.json';

export const SITE = {
  name:          settings.name,
  title:         settings.title,
  description:   settings.description,
  url:           settings.url,
  author:        settings.author,
  authorRole:    settings.authorRole,
  authorBio:     settings.authorBio,
  location:      settings.location,
  email:         settings.email,
  social: {
    github:    settings.social.github,
    linkedin:  settings.social.linkedin,
    twitter:   settings.social.twitter,
    facebook:  settings.social.facebook,
    instagram: settings.social.instagram,
    tiktok:    settings.social.tiktok,
    youtube:   settings.social.youtube,
  },
  ogImage:       settings.ogImage,
  twitterHandle: settings.twitterHandle,
  locale:        settings.locale,
  themeColor:    settings.themeColor,
  workExperience: (settings.workExperience ?? []) as Array<{
    company: string;
    role: string;
    period: string;
    current: boolean;
    description: string;
    tags: string[];
  }>,
  education: (settings.education ?? []) as Array<{
    school: string;
    degree: string;
    period: string;
    tags: string[];
  }>,
};

// Navigation links
export const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Projects',     href: '/projects' },
  { label: 'Certificates', href: '/certificates' },
  { label: 'Articles',     href: '/articles' },
];
