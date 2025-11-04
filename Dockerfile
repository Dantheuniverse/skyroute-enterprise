FROM node:18-bookworm-slim

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT

ARG CLOUDFLARED_VERSION=2025.5.0
ARG CLOUDFLARED_BASE_URL="https://github.com/cloudflare/cloudflared/releases/download"

ENV VERSION=$CLOUDFLARED_VERSION

ARG WEBUI_PORT=14333

ARG METRICS_ENABLE="false"
ARG METRICS_PORT=60123
ENV WEBUI_PORT=${WEBUI_PORT}
ENV METRICS_ENABLE=${METRICS_ENABLE}
ENV METRICS_PORT=${METRICS_PORT}

ENV EDGE_IP_VERSION=auto
ENV PROTOCOL=auto

EXPOSE ${WEBUI_PORT}
EXPOSE ${METRICS_PORT}

USER root
WORKDIR /var/app

RUN apt update && apt upgrade -y && apt install -y curl

# 下載並安裝 cloudflared
RUN if [ "$TARGETVARIANT" = "v7" ]; then \
        CLOUDFLARED_PKG="cloudflared-$TARGETOS-${TARGETARCH}hf.deb"; \
    else \
        CLOUDFLARED_PKG="cloudflared-$TARGETOS-$TARGETARCH.deb"; \
    fi && \
    curl -L --output cloudflared.deb "$CLOUDFLARED_BASE_URL/$CLOUDFLARED_VERSION/$CLOUDFLARED_PKG" && \
    dpkg -i cloudflared.deb && \
    rm cloudflared.deb

VOLUME /config
VOLUME /root/.cloudflared

# ===================================================
# ⛔ 已移除的程式碼：這是導致錯誤的原因
# 這些行會導致 Docker 在倉庫根目錄尋找不存在的資料夾。
# COPY backend /var/app/backend
# COPY frontend /var/app/frontend
# RUN cd /var/app/frontend && npm install && npm run build
# RUN cd /var/app/backend && npm install
# ENTRYPOINT node /var/app/backend/app.js
# ===================================================

# 替換為 Cloudflared 服務的正確啟動指令
# (這裡假設您想使用 cloudflared 作為啟動點)
ENTRYPOINT ["cloudflared"]
CMD ["--help"] 
# 💡 提示：您需要根據您的 cloudflared 服務需求，將 CMD 替換為實際的啟動參數，
# 例如：CMD ["tunnel", "run", "YOUR_TUNNEL_NAME"] 或其他 Web UI 啟動參數。
