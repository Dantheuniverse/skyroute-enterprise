# SkyRoute Worker

A Cloudflare Worker API for the SkyRoute project.

## Endpoints
- `GET /` — basic project metadata.
- `GET /health` — health check endpoint returning `{ "status": "ok" }`.

## Local development
1. Install Wrangler globally if you have npm available:
   ```bash
   npm install -g wrangler
   ```
2. Run the worker locally:
   ```bash
   wrangler dev
   ```

Configure additional settings in `wrangler.toml` as needed.
