# SkyRoute Enterprise

This repository hosts the SkyRoute frontend (Astro) and backend (Cloudflare Worker) projects in a single monorepo.

## Project structure
```
skyroute-enterprise/
│
├── astro/                      # Frontend UI (GitHub Pages)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── astro.config.mjs
│   └── tsconfig.json
│
├── worker/                     # Cloudflare Worker API
│   ├── index.js
│   ├── router.js
│   ├── utils/
│   ├── wrangler.toml
│   └── README.md
│
├── .github/
│   └── workflows/
│       └── pages.yml           # Deploys the Astro app
│
├── README.md
└── LICENSE
```

## Astro frontend
1. Install dependencies:
   ```bash
   cd astro
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Cloudflare Worker API
The worker resides in `worker/` and exposes a basic root response plus a `/health` endpoint. To run it locally:
```bash
cd worker
wrangler dev
```

## Deployment
GitHub Actions in `.github/workflows/pages.yml` builds the Astro site and deploys it to GitHub Pages on pushes to `main`.
