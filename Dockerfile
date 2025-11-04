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
    fi; \  <--- 關鍵修正：將 '&&' 改為 ';'
    curl -L --output cloudflared.deb "$CLOUDFLARED_BASE_URL/$CLOUDFLARED_VERSION/$CLOUDFLARED_PKG" && \
    dpkg -i cloudflared.deb && \
    rm cloudflared.deb

VOLUME /config
VOLUME /root/.cloudflared

# 原本錯誤的 Node.js 應用程式相關指令已移除

# 替換為 Cloudflared 服務的正確啟動指令
ENTRYPOINT ["cloudflared"]
# 💡 請確認您的 CMD 參數，以啟動 Web UI 或 Tunnel 服務
CMD ["--help"]
