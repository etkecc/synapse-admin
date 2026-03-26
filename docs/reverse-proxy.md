# Serving Ketesa behind a reverse proxy

You are supposed to do so for any service you want to expose to the internet,
and here you can find specific instructions and example configurations for Ketesa.

If you need `/admin`, use the prebuilt `ketesa-subpath-admin` tarball from [GitHub Releases](https://github.com/etkecc/ketesa/releases) or the `dist-admin` artifact from [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml).
For the root path, use the prebuilt `ketesa` tarball from [GitHub Releases](https://github.com/etkecc/ketesa/releases) or the `dist-root` artifact from [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml).


<!-- vim-markdown-toc GFM -->

* [Nginx](#nginx)
  * [Prebuilt tarball](#prebuilt-tarball)
    * [Root path](#root-path)
    * [`/admin` subpath](#admin-subpath)
  * [Docker](#docker)
    * [Root path](#root-path-1)
    * [`/admin` subpath](#admin-subpath-1)
* [Traefik (docker labels)](#traefik-docker-labels)
* [Other reverse proxies](#other-reverse-proxies)

<!-- vim-markdown-toc -->

## Nginx

### Prebuilt tarball

#### Root path

For example, `https://example.com`.

Place the config below into `/etc/nginx/conf.d/ketesa.conf` (don't forget to replace `server_name` and `root`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com; # REPLACE with your domain
    root /var/www/ketesa; # REPLACE with path where you extracted Ketesa
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|ico|woff|woff2|ttf|eot|webp)$ {
        expires 30d; # Set caching for static assets
        add_header Cache-Control "public";
    }

    gzip on;
    gzip_types text/plain application/javascript application/json text/css text/xml application/xml+rss;
    gzip_min_length 1000;
}
```

#### `/admin` subpath

For example, `https://example.com/admin`.

If you are serving Ketesa under `/admin`, extract the `ketesa-subpath-admin` tarball into an `admin/` subdirectory of your web root (e.g. extract into `/var/www/html/admin/`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com; # REPLACE with your domain
    root /var/www/html; # REPLACE with the parent of the admin/ directory
    index index.html;
    location /admin/ {
        try_files $uri $uri/ /admin/index.html;
    }
    location ~* ^/admin/.*\.(?:css|js|jpg|jpeg|gif|png|svg|ico|woff|woff2|ttf|eot|webp)$ {
        expires 30d; # Set caching for static assets
        add_header Cache-Control "public";
    }

    gzip on;
    gzip_types text/plain application/javascript application/json text/css text/xml application/xml+rss;
    gzip_min_length 1000;
}
```

### Docker

The following snippets assume the nginx docker container is used and it is in the same network as Ketesa docker container.

#### Root path

For example, `https://example.com`.

Use Ketesa docker tag **without** the `-subpath-admin` suffix (e.g., `latest`)

```nginx
server {
  listen 80;

  server_name example.com; # REPLACE with your domain

  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_pass http://ketesa:8080;
  }
}
```

#### `/admin` subpath

For example, `https://example.com/admin`.

Use Ketesa docker tag **with** the `-subpath-admin` suffix (e.g., `latest-subpath-admin`)

```nginx
server {
  listen 80;

  server_name example.com; # REPLACE with your domain

  location /admin/ { # Trailing slash required here
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_pass http://ketesa:8080; # NO trailing slash here
  }
}
```

After you've done that, ensure that the configuration is correct by running `nginx -t` and then reload Nginx
(e.g. `systemctl reload nginx`).

> **Note:** This configuration doesn't cover HTTPS, which is highly recommended to use. You can find more information
about setting up HTTPS in the [Nginx documentation](https://nginx.org/en/docs/http/configuring_https_servers.html).

## Traefik (docker labels)

If you are using Traefik as a reverse proxy, you can use the following labels, `docker-compose.yml` example:

```yaml
services:
  ketesa:
    image: ghcr.io/etkecc/ketesa:latest
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ketesa.rule=Host(`example.com`)"
```

## Other reverse proxies

There are no examples for other reverse proxies yet, and PRs are greatly appreciated.
