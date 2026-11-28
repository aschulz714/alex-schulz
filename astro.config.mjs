// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aschulz714.github.io',
  base: '/alex-schulz',
  // Addresses of project pages that are no longer published. They forward to the Work page.
  redirects: {
    '/work/pacific-county-timber': '/alex-schulz/work',
    '/work/court-finder': '/alex-schulz/work',
    '/work/early-maps': '/alex-schulz/work',
    '/work/hodego': '/alex-schulz/work',
    '/work/north-kai-franchise-index': '/alex-schulz/work',
    '/work/options-pages': '/alex-schulz/work',
    '/work/private-jet-tracker': '/alex-schulz/work',
    '/work/rail-served-national': '/alex-schulz/work',
    '/work/satellite-commodities': '/alex-schulz/work',
    '/work/tennis-patterns': '/alex-schulz/work',
    '/work/wealth-atlas': '/alex-schulz/work',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
