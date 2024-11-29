FROM node:18-alpine AS builder

WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY src ./src
COPY public ./public
COPY index.html ./index.html
COPY vite.config.ts ./vite.config.ts

RUN yarn run build --base=./

FROM ghcr.io/static-web-server/static-web-server:2

ENV SERVER_ROOT=/app

COPY --from=builder /build/dist /app
