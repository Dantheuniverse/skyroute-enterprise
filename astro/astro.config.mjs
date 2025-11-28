import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://pilot.mingleedan.org',
  build: {
    format: 'directory'
  }
});
