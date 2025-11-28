var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/utils/responses.js
var defaultHeaders = { "content-type": "application/json; charset=utf-8" };
function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: { ...defaultHeaders, ...init.headers },
    status: init.status || 200
  });
}
__name(jsonResponse, "jsonResponse");
function notFoundResponse() {
  return jsonResponse({ error: "Not Found" }, { status: 404 });
}
__name(notFoundResponse, "notFoundResponse");

// worker/router.js
async function handleRequest(request, env) {
  const url = new URL(request.url);
  const frontendUrl = env?.FRONTEND_URL || env?.PAGES_URL;
  if (request.method === "GET" && url.pathname === "/") {
    if (frontendUrl) {
      try {
        const destination = new URL(frontendUrl);
        return Response.redirect(destination.toString(), 302);
      } catch (error) {
        return jsonResponse({ error: "Invalid frontend URL provided", detail: String(error) }, { status: 500 });
      }
    }
    return jsonResponse({ message: "SkyRoute Worker API", environment: env?.ENVIRONMENT || "production" });
  }
  if (request.method === "GET" && url.pathname === "/health") {
    return jsonResponse({ status: "ok" });
  }
  return notFoundResponse();
}
__name(handleRequest, "handleRequest");

// worker/index.js
var worker_default = {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=index.js.map
