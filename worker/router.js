import { htmlResponse, jsonResponse, notFoundResponse } from './utils/responses.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const frontendUrl = env?.FRONTEND_URL || env?.PAGES_URL;

  if (request.method === 'GET' && url.pathname === '/') {
    const environment = env?.ENVIRONMENT || 'production';

    return htmlResponse(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>SkyRoute Worker API</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; line-height: 1.5; max-width: 640px; margin: 0 auto; }
            code { background: #f6f6f6; padding: 0.15rem 0.35rem; border-radius: 0.25rem; }
          </style>
        </head>
        <body>
          <h1>SkyRoute Worker API</h1>
          <p>This worker is alive and serving requests. Use <code>GET /health</code> for basic monitoring.</p>
          <p><strong>Environment:</strong> <code>${environment}</code></p>
          <p>Any other routes will return a JSON 404 to keep API responses predictable.</p>
        </body>
      </html>`);
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  return notFoundResponse();
}
