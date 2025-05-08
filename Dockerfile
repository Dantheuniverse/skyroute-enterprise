# --------------------------------------------------
# 階段 1：前端建置（frontend-builder）
# --------------------------------------------------
FROM node:18-bookworm-slim AS frontend-builder

WORKDIR /var/app/frontend

# 1. 只複製相依定義檔，安裝依賴（若 package*.json 無改動，命中 cache）
COPY app/frontend/package*.json ./
RUN npm ci

# 2. 再複製其餘原始碼並打包（只有 code 變動才重跑）
COPY app/frontend/ ./
RUN npm run build



# --------------------------------------------------
# 階段 2：最終映像（含 cloudflared、後端、前端成果）
# --------------------------------------------------
FROM node:18-bookworm-slim

ARG TARGETOS
ARG TARGETARCH
ARG TARGETVARIANT
ARG CLOUDFLARED_VERSION=2025.4.2
ARG CLOUDFLARED_BASE_URL="https://github.com/cloudflare/cloudflared/releases/download"

ENV VERSION=$CLOUDFLARED_VERSION  
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
      CLOUDFLARED_PKG="cloudflared-$TARGETOS-${TARGETARCH}hf.deb"; \
    else \
      CLOUDFLARED_PKG="cloudflared-$TARGETOS-$TARGETARCH.deb"; \
    fi && \
    curl -L -o cloudflared.deb "$CLOUDFLARED_BASE_URL/$CLOUDFLARED_VERSION/$CLOUDFLARED_PKG" && \
    dpkg -i cloudflared.deb && rm cloudflared.deb

# 保留設定目錄掛載點
VOLUME /config
VOLUME /root/.cloudflared

# 複製並部署前端打包成果
COPY --from=frontend-builder /var/app/frontend/dist /var/app/frontend/dist

# 複製後端程式碼並安裝依賴
COPY app/backend /var/app/backend
WORKDIR /var/app/backend
RUN npm ci

# 啟動後端
ENTRYPOINT ["node", "/var/app/backend/app.js"]
