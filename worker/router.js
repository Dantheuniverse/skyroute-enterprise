import { jsonResponse, notFoundResponse } from './utils/responses.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (request.method === 'GET' && url.pathname === '/') {
    return jsonResponse({ message: 'SkyRoute Worker API', environment: env?.ENVIRONMENT || 'production' });
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  return notFoundResponse();
}
