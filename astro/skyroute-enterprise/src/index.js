const defaultHeaders = { 'content-type': 'application/json; charset=utf-8' };

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: { ...defaultHeaders, ...init.headers },
    status: init.status || 200
  });
}

function notFoundResponse() {
  return jsonResponse({ error: 'Not Found' }, { status: 404 });
}

function shouldSkipRedirect(destination, requestUrl) {
  const normalizePath = (path) => path.replace(/\/+$/, '') || '/';

  return (
    destination.hostname === requestUrl.hostname &&
    (destination.port || '') === (requestUrl.port || '') &&
    destination.protocol === requestUrl.protocol &&
    normalizePath(destination.pathname) === normalizePath(requestUrl.pathname)
  );
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const frontendUrl = env?.FRONTEND_URL || env?.PAGES_URL;

  if (request.method === 'GET' && url.pathname === '/') {
    if (frontendUrl) {
      try {
        const destination = new URL(frontendUrl);

        if (shouldSkipRedirect(destination, url)) {
          return jsonResponse({
            message: 'SkyRoute Worker API',
            environment: env?.ENVIRONMENT || 'production',
            frontendUrl: destination.toString(),
            note: 'Skipped redirect because the target matches the current request host.'
          });
        }

        return Response.redirect(destination.toString(), 302);
      } catch (error) {
        return jsonResponse(
          { error: 'Invalid frontend URL provided', detail: String(error) },
          { status: 500 }
        );
      }
    }

    return jsonResponse({
      message: 'SkyRoute Worker API',
      environment: env?.ENVIRONMENT || 'production'
    });
  }

  if (request.method === 'GET' && url.pathname === '/health') {
    return jsonResponse({ status: 'ok' });
  }

  return notFoundResponse();
}

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};
