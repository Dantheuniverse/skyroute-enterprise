// 建議的 CORS 標頭輔助函式
function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // 根據需求調整，* 表示允許所有來源
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With", // 加入常用標頭
  };
}

// 建議的 Proxy 請求輔助函式
async function proxyRequest(request, env, targetHost, targetPort, basePath = "/", targetProtocol = 'http') {
  const originalUrl = new URL(request.url);

  // 建構目標 URL
  const targetUrl = new URL(originalUrl);
  targetUrl.hostname = targetHost;
  targetUrl.port = targetPort;
  targetUrl.protocol = env.TARGET_PROTO || targetProtocol; // 從環境變數讀取或使用預設

  // 如果 basePath 是根目錄 "/"，則保留原始路徑；否則移除 basePath
  targetUrl.pathname = basePath === "/" ? originalUrl.pathname : (originalUrl.pathname.replace(basePath, "") || "/");
  targetUrl.search = originalUrl.search; // 保留原始查詢參數

  // 建立到目標的新請求
  const modifiedRequestHeaders = new Headers(request.headers);

  // 設定 Host 標頭為目標主機
  modifiedRequestHeaders.set('Host', targetHost);

  // 移除 Cloudflare 可能添加的、不應轉發到內部的標頭 (可選)
  ['cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor', 'cdn-loop', 'x-forwarded-proto', 'x-forwarded-for', 'x-real-ip'].forEach(h => modifiedRequestHeaders.delete(h));

  // 添加轉發標頭
  const clientIp = request.headers.get('cf-connecting-ip');
  if (clientIp) {
    modifiedRequestHeaders.set('X-Forwarded-For', clientIp);
    modifiedRequestHeaders.set('X-Real-IP', clientIp);
  }
  modifiedRequestHeaders.set('X-Forwarded-Proto', originalUrl.protocol.replace(':', ''));
  modifiedRequestHeaders.set('X-Forwarded-Host', originalUrl.hostname);


  const finalRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: modifiedRequestHeaders,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
    redirect: "follow",
  });

  try {
    const response = await fetch(finalRequest);
    const responseHeaders = new Headers(response.headers);

    // 設定安全性相關標頭 (可選)
    responseHeaders.set("X-Frame-Options", "SAMEORIGIN");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    // responseHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"); // HSTS 需謹慎啟用
    responseHeaders.set("Permissions-Policy", "accelerometer=(), camera=(), microphone=()");
    // 調整 CSP
    // responseHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' ws: wss:; object-src 'none'; frame-ancestors 'self';");


    // 合併 CORS 標頭
    const cors = getCorsHeaders();
    for (const key in cors) {
      responseHeaders.set(key, cors[key]);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Proxy error for ${targetUrl.toString()}: ${error.message}`, error);
    return new Response(`Tunnel error connecting to backend for ${originalUrl.hostname}: ${error.message}`, { status: 502, headers: getCorsHeaders() });
  }
}


export default {
  /**
   * Handles incoming HTTP requests.
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    const proxyAuthToken = env.PROXY_AUTH_TOKEN; // 從環境變數讀取代理驗證 Token

    console.log(`Request for: ${hostname}${url.pathname}`);

    // 預檢請求 (CORS) 處理
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204, // No Content
        headers: getCorsHeaders(),
      });
    }

    // 1. API 控制功能 (透過 ?action=... 參數)
    // 假設 API 控制功能只在 worker 的 .workers.dev 子網域或 skyroute-enterprise.mingleedan.org 上啟用
    if (hostname.endsWith('.workers.dev') || hostname === 'skyroute-enterprise.mingleedan.org') {
      if (url.searchParams.has("action")) {
        const action = url.searchParams.get("action");

        if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) {
          console.error("Error: CF_API_TOKEN or CF_ACCOUNT_ID environment variable not set for API action.");
          return new Response(JSON.stringify({ success: false, errors: [{ message: "API Configuration Error: Missing required Cloudflare credentials." }] }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...getCorsHeaders() } }
          );
        }

        const apiRequest = async (endpoint, method = 'GET', body = null) => {
          const options = {
            method,
            headers: {
              'Authorization': `Bearer ${env.CF_API_TOKEN}`,
              'Content-Type': 'application/json'
            }
          };
          if (body) options.body = JSON.stringify(body);

          try {
            const response = await fetch(`https://api.cloudflare.com/client/v4${endpoint}`, options);
            const data = await response.json();
            return { status: response.status, data };
          } catch (fetchError) {
            console.error(`Error calling Cloudflare API endpoint ${endpoint}:`, fetchError);
            return { status: 500, data: { success: false, errors: [{ message: `Failed to fetch Cloudflare API: ${fetchError.message}` }] } };
          }
        };

        let result;
        switch (action) {
          case 'verifyToken':
            result = await apiRequest('/user/tokens/verify');
            break;
          case 'listTunnels':
            result = await apiRequest(`/accounts/${env.CF_ACCOUNT_ID}/cfd_tunnel`);
            break;
          case 'listCertificates':
            result = await apiRequest(`/accounts/${env.CF_ACCOUNT_ID}/access/certificates`);
            break;
          case 'listAccessApps':
            result = await apiRequest(`/accounts/${env.CF_ACCOUNT_ID}/access/apps`);
            break;
          default:
            console.error(`Invalid API action specified: ${action}`);
            return new Response(
              JSON.stringify({ success: false, errors: [{ message: `無效的 action: ${action}。請使用：verifyToken, listTunnels, listCertificates, listAccessApps` }] }),
              { status: 400, headers: { "Content-Type": "application/json", ...getCorsHeaders() } }
            );
        }
        return new Response(JSON.stringify(result.data, null, 2), {
          status: result.status,
          headers: { 'Content-Type': 'application/json', ...getCorsHeaders() },
        });
      }

      // 處理 worker 自身的根路徑、健康檢查等
      if (url.pathname === "/") {
        return new Response(
          `✅ Worker 'skyroute-enterprise' is online.\n\nAPI actions: /?action=verifyToken, listTunnels, listCertificates, listAccessApps\nProxied services: /ha, /media, nas.mingleedan.org, home.mingleedan.org`,
          { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", ...getCorsHeaders() } }
        );
      }
      if (url.pathname === "/healthcheck") {
        return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...getCorsHeaders() },
        });
      }
      if (url.pathname === "/favicon.ico") {
        return new Response("", { status: 204, headers: getCorsHeaders() });
      }
    } // End of .workers.dev or skyroute-enterprise.mingleedan.org specific logic


    // 2. Proxy 反向代理功能
    //    你可以選擇是否需要 PROXY_AUTH_TOKEN 進行驗證
    //    const authToken = url.searchParams.get("token");
    //    if (proxyAuthToken && authToken !== proxyAuthToken) { // 只有在 PROXY_AUTH_TOKEN 有設定時才驗證
    //      return new Response(JSON.stringify({ error: "Unauthorized: Missing or invalid token." }), {
    //        status: 401,
    //        headers: { 'Content-Type': 'application/json', ...getCorsHeaders() },
    //      });
    //    }

    // 路由到 Home Assistant (home.mingleedan.org 或 /ha 路徑)
    if (hostname === 'home.mingleedan.org' || url.pathname.startsWith("/ha")) {
      const targetHost = env.HA_HOST; // 例如: <UUID>.cfargotunnel.com 或 192.168.x.x
      const targetPort = env.HA_PORT; // 例如: 8123 (通常 HA 不需要 port，因為 tunnel 會處理)
      const targetProtocol = env.HA_PROTO || 'http'; // 本地 HA 通常是 http

      if (!targetHost) { // HA_PORT 可以是空的，如果 targetHost 包含 port
        return new Response("HA_HOST environment variable not set.", { status: 503, headers: getCorsHeaders() });
      }

      const basePath = url.pathname.startsWith("/ha") ? "/ha" : "/";
      return proxyRequest(request, env, targetHost, targetPort || '', basePath, targetProtocol);
    }

    // 路由到 OMV/NAS (nas.mingleedan.org)
    else if (hostname === 'nas.mingleedan.org') {
      const targetHost = env.OMV_HOST; // 例如: 192.168.31.173 (你的 OMV IP)
      const targetPort = env.OMV_PORT; // 例如: 80
      const targetProtocol = env.OMV_PROTO || 'http';

      if (!targetHost || !targetPort) {
        return new Response("OMV_HOST or OMV_PORT environment variable not set.", { status: 503, headers: getCorsHeaders() });
      }
      return proxyRequest(request, env, targetHost, targetPort, "/", targetProtocol);
    }

    // 路由到 Media Server (/media 路徑)
    else if (url.pathname.startsWith("/media")) {
      const targetHost = env.MEDIA_HOST;
      const targetPort = env.MEDIA_PORT; // 例如 8096 (Jellyfin)
      const targetProtocol = env.MEDIA_PROTO || 'http';

      if (!targetHost || !targetPort) {
        return new Response("MEDIA_HOST or MEDIA_PORT environment variable not set.", { status: 503, headers: getCorsHeaders() });
      }
      return proxyRequest(request, env, targetHost, targetPort, "/media", targetProtocol);
    }

    // 路由到 Admin (admin.mingleedan.org) - 範例，你需要實現
    else if (hostname === 'admin.mingleedan.org') {
      console.log(`Handling request for admin: ${hostname}`);
      return new Response('Admin Interface - Placeholder', { status: 200, headers: getCorsHeaders() });
    }


    // 其他未匹配的路由
    console.log(`Unhandled request: ${hostname}${url.pathname}`);
    return new Response("❌ 404 Not Found - Route not handled by Worker", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", ...getCorsHeaders() },
    });
  }, // --- End of fetch function ---

  /**
   * Handles scheduled events (Cron Triggers).
   */
  async scheduled(event, env, ctx) {
    console.log(`⏰ Cron job triggered at: ${new Date(event.scheduledTime).toISOString()}`);
    console.log(`Cron details: ${event.cron}`);
    // 在這裡加入你的排程任務邏輯
    // 例如: ctx.waitUntil(someAsyncTask());
    // console.log("Cron job finished.");
  }, // --- End of scheduled function ---
}; // --- End of export default ---
