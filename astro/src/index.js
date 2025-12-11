import { json, notFound, error } from "./utils/responses.js";
import { router } from "./utils/router.js";

export default {
  async fetch(request, env, ctx) {
    const route = router(request);

    // 健康檢查
    if (route("/health")) {
      return json({ ok: true, worker: "skyroute-enterprise", ts: Date.now() });
    }

    // Token 驗證端點（未實作，保留）
    if (route("/api/token/verify")) {
      return json({ ok: false, message: "Token verification not implemented yet" }, 501);
    }

    // Tunnels（未實作，保留）
    if (route("/api/tunnels")) {
      return json({ ok: false, message: "Tunnel API not implemented yet" }, 501);
    }

    // Proxy（未實作）
    if (route("/proxy")) {
      return json({ ok: false, message: "Proxy not implemented yet" }, 501);
    }

    return notFound();
  },
};
