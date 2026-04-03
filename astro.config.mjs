import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel/serverless';
export default defineConfig({
  site: 'https://tj-portfolio-coral.vercel.app',
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
