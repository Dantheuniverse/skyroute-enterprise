FROM node:18-bookworm-slim

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT

# 預設版本設定，與您的 GitHub Actions 工作流程中的預設值保持一致
ARG CLOUDFLARED_VERSION=2025.5.0
ARG CLOUDFLARED_BASE_URL="https://github.com/cloudflare/cloudflared/releases/download"

ENV VERSION=$CLOUDFLARED_VERSION

# 變數定義，與 GitHub Actions 中的 build-args 保持一致
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

# 安裝 curl 和必要的升級
RUN apt update && apt upgrade -y && apt install -y curl

# 下載並安裝 cloudflared
# ⭐ 修正：將整個邏輯鏈結在一起，確保 curl 在 RUN 的範圍內
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

# 替換為 Cloudflared 服務的正確啟動指令
ENTRYPOINT ["cloudflared"]
# 💡 請確認您的 CMD 參數，以啟動 Web UI 或 Tunnel 服務
CMD ["--help"]
