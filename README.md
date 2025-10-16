# Skyroute Enterprise Video Portfolio

A production-ready Astro starter tailored for Cloudflare Pages. The site showcases immersive video work, serves dynamic comments through a Cloudflare Worker, and ships with Tailwind CSS styling plus TypeScript-first tooling.

## Folder structure

```
.
├── astro.config.mjs
├── functions/
│   └── api/
│       └── comments.ts         # Cloudflare Worker for GET/POST comments with KV
├── public/
│   └── videos/                 # Video assets, thumbnails, and metadata
├── src/
│   ├── components/
│   │   ├── CommentBox.astro    # Interactive comments widget consuming the worker API
│   │   └── VideoCard.astro     # Card UI for featured workpieces
│   ├── layouts/
│   │   └── BaseLayout.astro    # Site-wide meta tags, navigation, and theming
│   ├── lib/
│   │   └── works.ts            # Demo content for the video portfolio
│   ├── pages/
│   │   ├── about.astro
│   │   ├── blog/index.astro
│   │   ├── index.astro
│   │   └── work/[slug].astro   # Dynamic route for individual workpieces + lazy video loading
│   ├── styles/
│   │   └── global.css
│   └── env.d.ts
└── wrangler.toml
```

## Key configuration

- **Astro** is configured to output server code for Cloudflare via `@astrojs/cloudflare` (`astro.config.mjs`).
- **Tailwind CSS** integration is enabled with a custom Tailwind config and PostCSS pipeline.
- **Cloudflare Worker** lives in `functions/api/comments.ts`, binding to the `COMMENTS_KV` namespace declared in `wrangler.toml`.
- **TypeScript paths** are configured in `tsconfig.json` for ergonomic imports (`@components/*`, `@layouts/*`, etc.).

## Environment setup

Install dependencies:

```bash
npm install
```

Populate your KV namespace IDs inside `wrangler.toml` and optionally provide additional environment variables under the `[vars]` block.

## Local development

```bash
npm run dev
```

Astro will run locally at `http://localhost:4321` with hot module reloading.

To emulate the Cloudflare Worker locally, run:

```bash
npm run dev -- --experimental-integrations
```

and, in a separate terminal, you can also run `wrangler dev` to exercise just the API function if needed.

## Build & deploy

1. Generate a production build:
   ```bash
   npm run build
   ```
2. Preview the built output locally:
   ```bash
   npm run preview
   ```
3. Publish to Cloudflare Pages (assuming the project is connected):
   ```bash
   wrangler pages deploy ./dist
   ```
   or, for Wrangler deployments to Workers:
   ```bash
   wrangler deploy
   ```

The build step outputs:

- `dist/client` – static assets for Cloudflare Pages.
- `dist/worker.mjs` – server entry consumed by the Cloudflare adapter.

## Comments KV quick start

Create a KV namespace and bind it:

```bash
wrangler kv:namespace create "COMMENTS_KV"
wrangler kv:namespace create "COMMENTS_KV" --preview
```

Copy the resulting IDs into the `wrangler.toml` file under the `[[kv_namespaces]]` section. The comment worker stores all comments under keys in the form `comments:<postId>`.

## Deployment notes

- The `VideoCard` and `CommentBox` components are ready to be expanded with real production data.
- Replace placeholder SVG thumbnails in `public/videos/` with optimized imagery for your work.
- Large video files should be delivered from an external CDN (update the URLs in `src/lib/works.ts`).
- The layout ships with SEO-friendly `<meta>` and OpenGraph tags plus a dark/light mode toggle persisted in `localStorage`.

Happy launching!
