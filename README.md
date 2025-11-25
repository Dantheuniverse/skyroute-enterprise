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
### Using the top-level workspace (recommended)
Install dependencies and run scripts from the repository root. The root `package.json` is configured as a workspace that targets the `astro/` project, so build systems that call `npm run build` at the repo root will automatically build the Astro site.

```bash
# install workspace dependencies
npm install

# start the development server
npm run dev

# build for production
npm run build
```

### Running directly inside `astro/`
If you prefer to work inside the `astro/` directory:
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

You can override the canonical site URL used by Astro builds by setting the `SITE_URL` environment variable.

## Cloudflare Worker API
The worker resides in `worker/` and exposes a basic root response plus a `/health` endpoint. To run it locally (after `npm install` in the repository root installs the workspace dependencies):
```bash
npm run dev --workspace worker
```

## Deployment
GitHub Actions in `.github/workflows/pages.yml` builds the Astro site and deploys it to GitHub Pages on pushes to `main`.
