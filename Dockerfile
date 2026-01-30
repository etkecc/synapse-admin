FROM ghcr.io/static-web-server/static-web-server:2-alpine

# You can set environment variables as `docker run` arguments too,
# full list: https://static-web-server.net/configuration/environment-variables/
ENV SERVER_FALLBACK_PAGE=/var/public/index.html
ENV SERVER_PORT=8080

USER $SERVER_USER_NAME:$SERVER_GROUP_NAME

COPY --chown=$SERVER_USER_NAME:$SERVER_GROUP_NAME ./dist /home/$SERVER_USER_NAME/public
