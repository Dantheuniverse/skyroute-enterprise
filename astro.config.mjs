import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages only serves static assets. Switching to static output ensures
  // every route (including /drone) is emitted as HTML instead of relying on a
  // Cloudflare Worker runtime that Pages cannot run.
  output: 'static',
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  })],
  server: {
    port: 4321
  },
  vite: {
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url))
      }
    }
  }
});
