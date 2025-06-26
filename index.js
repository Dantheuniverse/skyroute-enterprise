export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 設定您的 Home Assistant 本地 IP 和埠
    const HOME_ASSISTANT_ORIGIN = "http://192.168.31.238:8123";

    // --- 🎯 優先處理特定路徑 ---

    // 根目錄 - 主頁回應 (如果您希望 home.mingleedan.org/ 顯示 Worker 歡迎頁而非 Home Assistant)
    if (url.pathname === "/") {
      return new Response("✅ Cloudflare Worker 正常運作！\n歡迎使用 workerdanver1.haveanewlife.workers.dev", {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // 健康檢查路徑
    if (url.pathname === "/healthcheck") {
      return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // favicon.ico 請求避免 404
    if (url.pathname === "/favicon.ico") {
      return new Response("", { status: 204 });
    }

    // API 路徑示範 (Worker 本身處理的 API)
    if (url.pathname.startsWith("/api/worker/")) { // 修改為 /api/worker/ 避免與 Home Assistant 的 /api/ 衝突
      return new Response(JSON.stringify({ message: "Worker API Endpoint hit!", path: url.pathname }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- 🎯 如果以上路徑都不匹配，則代理到 Home Assistant ---

    // 構建代理目標 URL
    // 確保路徑是正確的，例如 /lovelace 應該被轉發到 http://192.168.31.238:8123/lovelace
    const proxyUrl = new URL(url.pathname + url.search, HOME_ASSISTANT_ORIGIN);

    // 複製原始請求，以便修改 URL 並轉發
    const requestInit = {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.body,
      redirect: 'follow', // 處理重定向，例如 Home Assistant 可能有登入頁面重定向
    };

    // 移除可能導致問題的標頭，例如 host 標頭應該是目標主機的
    // Cloudflare Worker 會自動處理 Host 標頭，但明確刪除有時能避免問題
    requestInit.headers.delete('host'); 
    // 或者，您可以設置為目標的 host
    // requestInit.headers.set('Host', new URL(HOME_ASSISTANT_ORIGIN).host);


    try {
      // 發送請求到 Home Assistant
      const response = await fetch(proxyUrl.toString(), requestInit);

      // 返回 Home Assistant 的回應給使用者
      return response;
    } catch (error) {
      // 處理代理過程中可能發生的錯誤
      console.error("Error proxying to Home Assistant:", error);
      return new Response(`Error proxying request to Home Assistant: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  },
}
