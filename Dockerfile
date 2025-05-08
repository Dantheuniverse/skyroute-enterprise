# --------------------------------------------------
# 階段 1：前端建置（frontend-builder）
# --------------------------------------------------
FROM node:18-bookworm-slim AS frontend-builder

WORKDIR /var/app/frontend

# 1. 複製相依定義與 lockfile，執行 npm ci（有 lockfile 才用 ci）
COPY app/frontend/package*.json ./
COPY app/frontend/package-lock.json ./
RUN npm ci

# 2. 複製其餘前端程式碼並 build
COPY app/frontend/ ./
RUN npm run build



# --------------------------------------------------
# 階段 2：最終映像（cloudflared + 前端成果 + 後端）
# --------------------------------------------------
FROM node:18-bookworm-slim

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT
ARG CLOUDFLARED_VERSION=2025.4.2
ARG CLOUDFLARED_BASE_URL="https://github.com/cloudflare/cloudflared/releases/download"

ENV WEBUI_PORT=${WEBUI_PORT:-14333}
ENV METRICS_ENABLE=${METRICS_ENABLE:-"false"}
ENV METRICS_PORT=${METRICS_PORT:-60123}
ENV EDGE_IP_VERSION=auto
ENV PROTOCOL=auto

EXPOSE ${WEBUI_PORT}
EXPOSE ${METRICS_PORT}

WORKDIR /var/app

# 安裝基礎套件
RUN apt update && apt upgrade -y && apt install -y curl

# 安裝 cloudflared
RUN if [ "$TARGETVARIANT" = "v7" ]; then \
      PKG="cloudflared-$TARGETOS-${TARGETARCH}hf.deb"; \
    else \
      PKG="cloudflared-$TARGETOS-$TARGETARCH.deb"; \
    fi && \
    curl -L -o cloudflared.deb "$CLOUDFLARED_BASE_URL/$CLOUDFLARED_VERSION/$PKG" && \
    dpkg -i cloudflared.deb && rm cloudflared.deb

VOLUME /config
VOLUME /root/.cloudflared

# 前端：複製 build 輸出
COPY --from=frontend-builder /var/app/frontend/dist /var/app/frontend/dist

# 後端：copy & 安裝
COPY app/backend /var/app/backend
WORKDIR /var/app/backend
RUN npm ci

ENTRYPOINT ["node", "/var/app/backend/app.js"]
