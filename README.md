# Skyroute Enterprise Deployment Guide

This repository packages a production-ready Astro site that proxies requests through a Cloudflare Worker and exposes
self-hosted services via Cloudflare Tunnel. The README consolidates every deployment document in the repo so the
application can be deployed, operated, and upgraded with confidence.

## System architecture

```mermaid
flowchart TD
    A[Developer] -->|Push code| B[GitHub Repository]
    B -->|Trigger pipeline| C[GitHub Actions]
    C -->|Use secrets| D[Cloudflare API]
    D -->|Deploy| E[Cloudflare Workers]

    E -->|Serve traffic| F[Visitors]
    F -->|Access via| G[workers.dev or custom domain]

    subgraph Cloudflare Tunnel
      H[Cloudflared Web UI (Docker)] -->|Configure token| I[Cloudflare Tunnel]
      I -->|Secure connection| J[Self-hosted services]
      J --> K[Home Assistant / NAS / Media Server]
    end

    E -->|Reverse proxy| I
```

## Repository layout

```
.
├── astro.config.mjs              # Astro configured for the Cloudflare adapter
├── functions/api/comments.ts     # Worker endpoint powering the comment widget
├── public/videos/                # Static assets and portfolio videos
├── src/                          # Pages, components, layouts, and styles
├── wrangler.toml                 # Wrangler bindings (KV, vars) for the Worker
├── Dockerfile                    # Optional container for Cloudflared Web UI
├── 操作流程圖                     # Flowchart reference (in Traditional Chinese)
└── 從部署到日常維運、異常排查到自動化升級   # Operations playbook (in Traditional Chinese)
```

## Required accounts & tools

| Purpose | Tool | Notes |
|---------|------|-------|
| Static site build | Node.js 18+, npm | Run Astro builds locally or inside CI |
| Worker & tunnel hosting | Cloudflare account | Needs Workers, KV, and Tunnel privileges |
| Automation | GitHub Actions | Stores secrets and runs `wrangler deploy` |
| Tunnel dashboard | Docker Engine | Hosts the Cloudflared Web UI container |

## Secrets and configuration

> :lock: **Keep all credentials inside GitHub Secrets**. `.env.local` is for local experiments only and should stay git-ignored.

| Secret | Description | Where it is used |
|--------|-------------|------------------|
| `CF_ACCOUNT_ID` | Cloudflare account identifier | GitHub Actions `wrangler deploy` workflow |
| `CF_API_TOKEN` | API token with Worker/Tunnel permissions | GitHub Actions | 
| `TUNNEL_HOSTNAME` | Domain routed through the tunnel (e.g. `example.com`) | Worker runtime to build proxied URLs |
| `COMMENTS_KV_ID` | KV namespace for storing blog comments | `wrangler.toml` + Worker bindings |

Add Cloudflare bindings in `wrangler.toml` under `[vars]` and `[kv_namespaces]` to match your account.

## Local development

1. Install dependencies
   ```bash
   npm install
   ```
2. Launch Astro with the Cloudflare adapter
   ```bash
   npm run dev
   ```
   The site becomes available at <http://localhost:4321>. Use `npm run dev -- --experimental-integrations` to emulate the
   Worker locally and `wrangler dev` for isolated API testing.

## Deployment pipeline

1. Push to the default branch. GitHub Actions runs the deployment workflow and loads secrets securely.
2. The workflow executes `wrangler deploy` to publish the Worker and any static assets.
3. Visitors reach the Worker via `workers.dev` or a custom domain. Requests for self-hosted services are routed through
   Cloudflare Tunnel managed by the Dockerized Cloudflared Web UI.

### Manual deployment commands

Run locally if you need to bypass CI:

```bash
npm run build
wrangler deploy
```

For Cloudflare Pages deployments:

```bash
wrangler pages deploy ./dist
```

## Operating the stack

### Daily checklist

- [ ] Confirm the Cloudflared Tunnel is online in the Web UI (`http://localhost:14333`).
- [ ] Ensure the Worker endpoint responds via its public domain.
- [ ] Review GitHub Actions runs for deployment status.
- [ ] Rotate GitHub Secrets regularly and invalidate old tokens.

### Routine commands

| Command | Purpose |
|---------|---------|
| `docker ps` | Inspect the Cloudflared Web UI container state |
| `docker restart cloudflared` | Restart the Tunnel dashboard |
| `docker logs cloudflared` | Review tunnel diagnostics |
| `git push origin main` | Trigger automated deployment |
| `npm run deploy` | Manual Worker deployment alias (configure in `package.json` if needed) |

## Troubleshooting

| Symptom | Investigation steps |
|---------|--------------------|
| Worker URL returns errors | Check GitHub Actions logs, confirm Worker routes in the Cloudflare dashboard |
| Tunnel offline / 502 errors | Verify tunnel status in the Web UI, ensure the backend service (Home Assistant/NAS/etc.) is running |
| Deployments fail | Refresh `CF_API_TOKEN` and `CF_ACCOUNT_ID` secrets, inspect workflow logs |
| New code not visible | Make sure a deployment ran, then hard-refresh the browser cache |

## Automation ideas

- Enable [Watchtower](https://containrrr.dev/watchtower/) to auto-update the Cloudflared Web UI container.
- Integrate notifications (Slack, LINE, Telegram) with GitHub Actions for deployment outcomes.
- Add uptime monitors such as UptimeRobot or Healthchecks.io to track Worker and tunnel health.
- Layer Cloudflare Zero Trust policies on the tunnel for fine-grained access control.

## Advanced automations

- **Codex & Agents SDK workflow guide** – Optional cloud and multi-agent automation playbooks have moved to [`CODEX_GUIDE.md`](CODEX_GUIDE.md) so the main README can stay focused on the core project.

## Additional references (Traditional Chinese)

- **操作流程圖**：Mermaid flowchart covering developer-to-deployment stages and tunnel topology.
- **從部署到日常維運、異常排查到自動化升級**：Runbook for daily operations, troubleshooting, and automation upgrades.

These files remain in the repository root for quick sharing with Mandarin-speaking collaborators.
