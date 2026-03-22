// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, verifyToken } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) return next();

  // Login page is always accessible
  if (pathname === '/admin/login' || pathname === '/admin/login/') return next();

  const cookie = context.cookies.get(SESSION_COOKIE);
  const valid = cookie ? await verifyToken(cookie.value) : false;

  if (!valid) {
    const next = encodeURIComponent(pathname);
    return context.redirect(`/admin/login?next=${next}`);
  }

  return next();
});
