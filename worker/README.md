# SkyRoute Worker

A Cloudflare Worker API for the SkyRoute project.

## Endpoints
- `GET /` — redirects to the deployed frontend when `FRONTEND_URL` (or `PAGES_URL`) is set and the hostname differs from the worker's. If the hostnames match, the worker returns metadata to avoid redirect loops.
- `GET /health` — health check endpoint returning `{ "status": "ok" }`.

## Local development
The worker uses the root-level `wrangler.toml` (at `../wrangler.toml`).

1. Install dependencies from the repository root (the workspace installs the worker's dev dependencies, including Wrangler). The worker is preconfigured to redirect `/` to `https://pilot.mingleedan.org` via `FRONTEND_URL` in `wrangler.toml`:
   ```bash
   npm install
   ```
2. Run the worker locally:
   ```bash
   npm run dev --workspace worker
   ```

3. Deploy the worker (from the repository root):
   ```bash
   npm run deploy:worker
   ```

Configure additional settings in `wrangler.toml` as needed.
