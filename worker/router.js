import { jsonResponse, notFoundResponse } from './utils/responses.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const environment = env?.ENVIRONMENT || 'production';
  const frontendUrl = env?.FRONTEND_URL || env?.PAGES_URL;

  if (request.method === 'GET' && url.pathname === '/') {
    if (frontendUrl) {
      try {
        const destination = new URL(frontendUrl);

        if (destination.hostname !== url.hostname) {
          return Response.redirect(destination.toString(), 302);
        }
      } catch {
        // Ignore invalid frontend URLs and fall through to metadata response
      }
    }

    return jsonResponse({
      name: 'SkyRoute Enterprise Worker',
      description: 'API edge router for the SkyRoute Enterprise site.',
      environment
    });
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  return notFoundResponse();
}
