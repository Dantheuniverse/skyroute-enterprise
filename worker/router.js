import { jsonResponse, notFoundResponse } from './utils/responses.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const frontendUrl = env?.FRONTEND_URL || env?.PAGES_URL;

  if (request.method === 'GET' && url.pathname === '/') {
    if (frontendUrl) {
      try {
        const destination = new URL(frontendUrl);
        if (destination.origin !== url.origin) {
          return Response.redirect(destination.toString(), 302);
        }

        // Avoid redirect loops when the worker is bound to the same hostname
        // as the configured frontend. Returning metadata keeps the worker
        // reachable without sending the browser in circles.
        return jsonResponse({
          message: 'SkyRoute Worker API',
          note: 'Frontend URL matches worker host; redirect skipped to avoid loop',
          environment: env?.ENVIRONMENT || 'production',
        });
      } catch (error) {
        return jsonResponse({ error: 'Invalid frontend URL provided', detail: String(error) }, { status: 500 });
      }
    }

    return jsonResponse({ message: 'SkyRoute Worker API', environment: env?.ENVIRONMENT || 'production' });
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  return notFoundResponse();
}
