import { jsonResponse, notFoundResponse } from './utils/responses.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const frontendUrl = env?.FRONTEND_URL || env?.PAGES_URL;

  if (request.method === 'GET' && url.pathname === '/') {
    if (frontendUrl) {
      try {
        const destination = new URL(frontendUrl);
        return Response.redirect(destination.toString(), 302);
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
