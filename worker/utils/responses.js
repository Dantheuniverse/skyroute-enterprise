const defaultHeaders = { 'content-type': 'application/json; charset=utf-8' };

export function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: { ...defaultHeaders, ...init.headers },
    status: init.status || 200
  });
}

export function notFoundResponse() {
  return jsonResponse({ error: 'Not Found' }, { status: 404 });
}
