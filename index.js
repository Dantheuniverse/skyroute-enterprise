export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const token = env.CF_API_TOKEN;
    const accountId = env.CF_ACCOUNT_ID;
    const proxyAuthToken = env.PROXY_AUTH_TOKEN; // ✅ 代理安全驗證用 Token

    // ✅ 預檢請求 (CORS) 完整處理
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // ✅ 首頁提示
    if (url.pathname === "/") {
      return new Response(
        `✅ Worker gateway online.\n\nUse ?action=verifyToken, listTunnels, listCertificates, listAccessApps for API management.\n\nOr access /ha /media /nas for proxy.`,
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // ✅ 1. API 控制功能
    if (url.searchParams.has("action")) {
      const action = url.searchParams.get("action");

      const apiRequest = async (endpoint, method = 'GET', body = null) => {
        try {
          const options = {
            method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          };
          if (body) options.body = JSON.stringify(body);

          const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, options);
          const data = await response.json();
          return { status: response.status, data };
        } catch (error) {
          return { status: 500, data: { error: error.toString() } };
        }
      };

      let result;
      switch (action) {
        case 'verifyToken':
          result = await apiRequest('/user/tokens/verify');
          break;
        case 'listTunnels':
          result = await apiRequest(`/accounts/${accountId}/cfd_tunnel`);
          break;
        case 'listCertificates':
          result = await apiRequest(`/accounts/${accountId}/access/certificates`);
          break;
        case 'listAccessApps':
          result = await apiRequest(`/accounts/${accountId}/access/apps`);
          break;
        default:
          result = { status: 400, data: { error: "Invalid action. Use ?action=verifyToken, listTunnels, listCertificates, listAccessApps" } };
      }

      return new Response(JSON.stringify(result.data, null, 2), {
        status: result.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      });
    }

    // ✅ 2. Proxy 反向代理功能，需 Token 認證
    if (url.pathname.startsWith("/ha") || url.pathname.startsWith("/media") || url.pathname.startsWith("/nas")) {
      const authToken = url.searchParams.get("token");
      if (authToken !== proxyAuthToken) {
        return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid token." }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        });
      }

      if (!token || !accountId) {
        return new Response(JSON.stringify({ error: "Missing environment variables for proxy. Please check CF_API_TOKEN and CF_ACCOUNT_ID." }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        });
      }

      // 目標路由設定
      if (url.pathname.startsWith("/ha")) {
        url.hostname = "mingleedan.org";
        url.port = "8123";
        url.pathname = url.pathname.replace("/ha", "");
      } else if (url.pathname.startsWith("/media")) {
        url.hostname = "mingleedan.org";
        url.port = "8096";
        url.pathname = url.pathname.replace("/media", "");
      } else if (url.pathname.startsWith("/nas")) {
        url.hostname = "mingleedan.org";
        url.port = "5000";
        url.pathname = url.pathname.replace("/nas", "");
      }

      const modifiedRequest = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
        redirect: 'follow'
      });

      try {
        const response = await fetch(modifiedRequest);
        const newHeaders = new Headers(response.headers);
        secureHeaders(newHeaders);
        return new Response(response.body, {
          status: response.status,
          headers: newHeaders,
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Tunnel error: " + error.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() },
        });
      }
    }

    // ✅ 其他未處理路徑
    return new Response(JSON.stringify({ error: "❌ 404 Not Found" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }
}

// ✅ 共用安全標頭
function secureHeaders(headers) {
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("Permissions-Policy", "accelerometer=(), camera=(), microphone=()");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// ✅ 共用 CORS 標頭
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}
