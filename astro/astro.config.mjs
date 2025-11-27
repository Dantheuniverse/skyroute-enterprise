import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://drone.mingleedan.org',
  build: {
    format: 'directory'
  }
});
