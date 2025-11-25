# SkyRoute Worker

A Cloudflare Worker API for the SkyRoute project.

## Endpoints
- `GET /` — basic project metadata.
- `GET /health` — health check endpoint returning `{ "status": "ok" }`.

## Local development
The worker uses the root-level `wrangler.toml` (at `../wrangler.toml`).

1. Install dependencies from the repository root (the workspace installs the worker's dev dependencies, including Wrangler):
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
