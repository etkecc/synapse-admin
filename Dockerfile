# syntax=docker/dockerfile:1
# check=skip=SecretsUsedInArgOrEnv

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and yarn.lock first for better caching
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile --prefer-offline --network-timeout=300000

# Copy remaining files
COPY . .

# Allow version to be passed as build arg
ARG SYNAPSE_ADMIN_VERSION
ENV SYNAPSE_ADMIN_VERSION=$SYNAPSE_ADMIN_VERSION

# Set dummy values before build for later injection
ENV VITE_SERVER_URL="INJECT_ENV__SERVER_URL"

# Build the application
RUN yarn build --base=/INJECT_ENV__BASE_URL/

# Remove leading slash from INJECT_ENV__BASE_URL placeholder in built files
# Vite requires a leading slash for the build --base parameter,
# but we need to remove it so the runtime injection script can properly replace
# the placeholder with the actual BASE_URL value
RUN find /app/dist -type f -exec grep -Iq . {} \; -print | \
    xargs sed -i \
        -e 's|/INJECT_ENV__BASE_URL|INJECT_ENV__BASE_URL|g' \
        -e 's|//INJECT_ENV__BASE_URL|/INJECT_ENV__BASE_URL|g' \
        -e 's|INJECT_ENV__BASE_URL//|INJECT_ENV__BASE_URL/|g'

# Production stage
FROM nginx:alpine AS production

# Copy built files from build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Set default values for environment variables
ARG SERVER_URL=""
ENV SERVER_URL=$SERVER_URL
ARG BASE_URL=""
ENV BASE_URL=$BASE_URL

# Copy environment injection script
COPY scripts/inject-env.sh /docker-entrypoint.d/40-inject-env.sh
RUN chmod +x /docker-entrypoint.d/40-inject-env.sh

# Configure nginx for SPA
COPY <<EOF /etc/nginx/templates/default.conf.template
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  # Enable gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  gzip_comp_level 6;
  gzip_min_length 256;

  # Set BASE_URL to nginx variable so we can use it in the if statement below
  set \$base_url "\${BASE_URL}";

  # SPA routing - redirect all non-file requests to index.html
  location / {
    if (\$base_url != "") {
      rewrite ^\${BASE_URL}/(.+) /\$1 last;
      rewrite ^\${BASE_URL}$ / last;
    }

    try_files \$uri \$uri.html /index.html;
  }
}
EOF

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
