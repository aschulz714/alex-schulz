// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aschulz714.github.io',
  base: '/alex-schulz',
  // Pages that existed on the live site before the 2026 redesign.
  redirects: {
    '/work/pacific-county-timber': '/alex-schulz/work/early-maps',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
