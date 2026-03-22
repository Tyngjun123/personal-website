import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://yourdomain.com', // 🔁 Replace with your actual domain after Vercel deploy
  integrations: [
    mdx(),
  ],
  adapter: vercel({
    webAnalytics: { enabled: true }, // Free Vercel analytics
  }),
  output: 'hybrid',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
  image: {
    // Optimize images at build time
    service: { entrypoint: 'astro/assets/services/sharp' }
  }
});
