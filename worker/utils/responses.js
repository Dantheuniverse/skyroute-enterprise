const defaultHeaders = { 'content-type': 'application/json; charset=utf-8' };

export function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: { ...defaultHeaders, ...init.headers },
    status: init.status || 200
  });
}

export function htmlResponse(body, init = {}) {
  return new Response(body, {
    headers: { 'content-type': 'text/html; charset=utf-8', ...init.headers },
    status: init.status || 200
  });
}

export function notFoundResponse() {
  return jsonResponse({ error: 'Not Found' }, { status: 404 });
}
