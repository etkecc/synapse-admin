FROM ghcr.io/static-web-server/static-web-server:2

ENV SERVER_ROOT=/app
ENV SERVER_FALLBACK_PAGE=/app/index.html

COPY ./dist /app
