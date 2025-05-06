export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname; // 將 hostname 提取出來方便使用

    // 🎯 根目錄 - 主頁回應
    if (url.pathname === "/") {
      return new Response("✅ SkyRoute-Enterprise 正常運作！\n歡迎使用 workerdanver1.haveanewlife.workers.dev", {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // 🎯 健康檢查路徑
    if (url.pathname === "/healthcheck") {
      return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 🎯 favicon.ico 請求避免 404
    if (url.pathname === "/favicon.ico") {
      return new Response("", { status: 204 });
    }

    // 🎯 API 動態控制
    if (url.pathname.startsWith("/api/")) {
      const action = url.searchParams.get("action");
      if (!action) {
        return new Response("請指定 action 參數。\n範例：/api/?action=listTunnels", { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }); // 添加 Content-Type
      }

      // 檢查必要的環境變數是否存在
      if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) {
          console.error("Error: CF_API_TOKEN or CF_ACCOUNT_ID environment variable not set.");
          return new Response("API Configuration Error: Missing required environment variables.", { status: 500 });
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
             // 嘗試解析回應，即使狀態碼不是 2xx，以便獲取 Cloudflare 的錯誤訊息
            const data = await response.json();
            // 回傳包含原始狀態碼和解析後的資料
            return { status: response.status, data };
        } catch (fetchError) {
            console.error(`Workspace error calling Cloudflare API endpoint ${endpoint}:`, fetchError);
            // 對於 fetch 本身的錯誤，回傳 500 狀態碼和錯誤訊息
             return { status: 500, data: { success: false, errors: [{ message: `Failed to fetch Cloudflare API: ${fetchError.message}` }] } };
        }
      };

      try {
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
                 `無效的 action: ${action}。請使用：verifyToken, listTunnels, listCertificates, listAccessApps`,
                 { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } }
            );
        }

        // 直接回傳從 apiRequest 獲取的 status 和 data
        return new Response(JSON.stringify(result.data, null, 2), {
          status: result.status, // 使用 Cloudflare API 回傳的原始狀態碼
          headers: { "Content-Type": "application/json" }
        });

      } catch (error) { // 捕捉 switch 區塊或其他未預期的同步錯誤
        console.error(`API Logic Error for action ${action}:`, error);
        return new Response(`伺服器內部錯誤處理 action ${action}: ${error.message}`, { status: 500 });
      }
    } // --- End of /api/ block ---

    // 🎯 Proxy 服務：Home Assistant
    // 注意：將後面的 if 改為 else if
    else if (url.pathname.startsWith("/ha")) {
       // 建議改用環境變數
      const targetHost = env.HA_HOST || "mingleedan.org";
      const targetPort = env.HA_PORT || "8123";
      console.log(`Proxying request for /ha to ${targetHost}:${targetPort}`);
      return proxyRequest(request, env, targetHost, targetPort, "/ha"); // 傳遞 env
    }

    // 🎯 Proxy 服務：Media Server
    else if (url.pathname.startsWith("/media")) {
       // 建議改用環境變數
      const targetHost = env.MEDIA_HOST || "mingleedan.org";
      const targetPort = env.MEDIA_PORT || "8096";
      console.log(`Proxying request for /media to ${targetHost}:${targetPort}`);
      return proxyRequest(request, env, targetHost, targetPort, "/media"); // 傳遞 env
    }

    // --- 移除舊的 /nas 處理邏輯 ---
    // if (url.pathname.startsWith("/nas")) { ... } // <-- 這個區塊已被移除

    // ✨ 重新整合：Proxy 服務：OMV (nas.mingleedan.org) ✨
    else if (hostname === 'nas.mingleedan.org') {
        // 從環境變數讀取 OMV 位址和連接埠
        const targetHost = env.OMV_HOST;
        const targetPort = env.OMV_PORT;

        // 檢查環境變數是否設定
        if (!targetHost || !targetPort) {
            console.error("OMV_HOST or OMV_PORT environment variable not set.");
            return new Response("🚧 NAS Proxy Configuration Error: Target host or port not set in environment variables.", {
                status: 503, // Service Unavailable due to config error
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
        }

        // 使用 proxyRequest 將請求轉發到 OMV
        // basePath 設為 "/" 因為整個子網域都用於 NAS
        console.log(`Proxying request for nas.mingleedan.org to ${targetHost}:${targetPort}`);
        return proxyRequest(request, env, targetHost, targetPort, "/"); // 傳遞 env, basePath 為 "/"

    } // --- End of nas.mingleedan.org block ---

    // 🎯 其他路徑：統一回應 404 Not Found
    // 注意：將 if 改為 else
    else {
      return new Response("❌ 404 Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }, // --- End of fetch function ---
}; // --- End of export default ---


// 📦 通用 Proxy 處理函式
//    增加了對 request 和 env 的傳遞，以支援更多彈性 (例如讀取 client IP 或更多環境變數)
async function proxyRequest(request, env, targetHost, targetPort, basePath) {
  const originalUrl = new URL(request.url); // 使用原始請求的 URL 來建構目標

  // 建構目標 URL
  const targetUrl = new URL(originalUrl); // 複製原始 URL
  targetUrl.hostname = targetHost;
  targetUrl.port = targetPort;
  // 如果 basePath 是根目錄 "/"，則保留原始路徑；否則移除 basePath
  targetUrl.pathname = basePath === "/" ? originalUrl.pathname : (originalUrl.pathname.replace(basePath, "") || "/");
  // 保留原始查詢參數
  targetUrl.search = originalUrl.search;
  // 通常代理到內部服務時，我們可能需要明確指定協議 (http 或 https)
  // 這裡假設後端服務使用 http，如果您的 OMV 使用 https，請改為 'https:'
  // 也可以考慮從環境變數讀取 targetProtocol
  targetUrl.protocol = env.TARGET_PROTO || 'http:'; // 預設為 http

  // 建立到目標的新請求
  const modifiedRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: request.headers, // 先複製原始標頭
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
    redirect: "follow",
  });

  // --- 修改請求標頭 ---
  const mutableHeaders = new Headers(modifiedRequest.headers);
  // 移除 Cloudflare 可能添加的、不應轉發到內部的標頭 (範例)
  mutableHeaders.delete('cf-connecting-ip');
  mutableHeaders.delete('cf-ipcountry');
  mutableHeaders.delete('cf-ray');
  mutableHeaders.delete('cf-visitor');
  mutableHeaders.delete('cdn-loop');
  // 可能需要移除 Host 標頭或設定為目標 Host，取決於後端服務配置
  mutableHeaders.set('Host', targetHost); // 設定 Host 標頭為目標主機

  // 添加轉發標頭 (X-Forwarded-For, X-Real-IP)
  const clientIp = request.headers.get('cf-connecting-ip');
  if (clientIp) {
     // 如果已有 X-Forwarded-For，附加客戶端 IP；否則設定為客戶端 IP
     const existingXff = mutableHeaders.get('X-Forwarded-For');
     mutableHeaders.set('X-Forwarded-For', existingXff ? `${existingXff}, ${clientIp}` : clientIp);
     mutableHeaders.set('X-Real-IP', clientIp); // 設定 X-Real-IP
  }
   // 添加 X-Forwarded-Proto
  const proto = originalUrl.protocol.replace(':', ''); // 'http' or 'https'
  mutableHeaders.set('X-Forwarded-Proto', proto);
  // 根據需要添加 X-Forwarded-Host
  mutableHeaders.set('X-Forwarded-Host', originalUrl.hostname);


  // 建立最終要發送的請求
  const finalRequest = new Request(modifiedRequest, { headers: mutableHeaders });


  // --- 發送請求到目標 ---
  try {
    const response = await fetch(finalRequest); // 使用修改標頭後的請求

    // --- 修改回應標頭 ---
    const newHeaders = new Headers(response.headers);

    // 設定安全性相關標頭
    newHeaders.set("X-Frame-Options", "SAMEORIGIN"); // 改為 SAMEORIGIN 可能對某些 UI 更友好
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    newHeaders.set("Permissions-Policy", "accelerometer=(), camera=(), microphone=()");
    // 調整 CSP 以允許更多內聯元素和 data URI (適用於某些 Web UI)
    newHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' ws: wss:; object-src 'none'; frame-ancestors 'self';"); // 更寬鬆但可能必要的 CSP

    // 設定 CORS 標頭 (與您上次提供的一致)
    newHeaders.set("Access-Control-Allow-Origin", "*"); // 注意：允許任何來源
    newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // 確保 Vary 標頭包含 Origin，如果 Access-Control-Allow-Origin 不是 "*"
    // if (newHeaders.get("Access-Control-Allow-Origin") !== "*") {
    //    newHeaders.append("Vary", "Origin");
    // }


    // 處理 CORS 預檢請求
    if (request.method === "OPTIONS") {
      // 回應預檢請求時，通常不需要 body，狀態碼為 204
      return new Response(null, { status: 204, headers: newHeaders });
    }

    // 回傳從目標服務收到的回應，但使用修改後的標頭
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText, // 保留 statusText
      headers: newHeaders, // 使用修改後的標頭物件
    });

  } catch (error) {
    // 處理代理過程中的錯誤
    console.error(`Proxy error for ${targetUrl.toString()}:`, error);
    // 可以考慮回傳更詳細的錯誤頁面或 JSON
    return new Response(`Tunnel error connecting to backend: ${error.message}`, { status: 502 }); // Bad Gateway
  }
}
