<p align="center">
  <img alt="Ketesa Logo" src="./public/images/logo.webp" height="140" />
  <h3 align="center">
    Ketesa<br>
    <a href="https://matrix.to/#/#ketesa:etke.cc">
      <img alt="Community room" src="https://img.shields.io/badge/room-community_room-green?logo=matrix&label=%23ketesa%3Aetke.cc">
    </a><br>
    <a href="./LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/etkecc/ketesa">
    </a>
    <a href="https://api.reuse.software/info/github.com/etkecc/ketesa">
      <img alt="REUSE compliance" src="https://api.reuse.software/badge/github.com/etkecc/ketesa">
    </a>
  </h3>
  <p align="center"><strong>Admin UI for Matrix servers, formerly Synapse Admin.</strong></p>
</p>

---

![Login](./screenshots/login.webp)
![Users List](./screenshots/users-list.webp)

[View all screenshots](./screenshots/README.md)

## About

Ketesa is a feature-rich admin UI for Matrix servers, formerly known as Synapse Admin.
What started as a fork of [Awesome-Technologies/synapse-admin](https://github.com/Awesome-Technologies/synapse-admin)
has since grown into an independent project — with a redesigned UI, multi-backend support,
extended management capabilities, visual customization, and much more.

**Ketesa is a fully compatible drop-in replacement for Synapse Admin.** If you're currently
using the original, switching is as simple as changing the image or URL — no configuration
changes needed.

If you have any questions or need help, feel free to join the [community room](https://matrix.to/#/#ketesa:etke.cc)
or create an issue on GitHub.

## Features

### User management
- Suspend, shadow-ban, deactivate, erase users
- Rate limits, experimental features, account data
- 3PIDs, devices (create, rename, delete), room memberships
- Cross-signing reset, account validity renewal
- Bulk registration via CSV import (including 3PIDs)
- Random password generation, password reset
- User badges, avatar, display name

### Room management
- Block/unblock, purge history, delete rooms
- Media tab, messages viewer with filters and jump-to-date
- Room hierarchy tab (for spaces)
- Assign admin, join user to room

### Authentication
- Username/password, access token, OIDC/SSO
- Matrix Authentication Service (MAS) support, including registration tokens
- External auth provider-compatible mode

### Customization
- Logo, colors, custom menu items via `config.json`
- Restrict available homeservers
- Prefill login form via GET parameters or `/.well-known/matrix/client`

### Other
- Mobile-friendly responsive UI
- 9 languages: EN, DE, FR, JA, RU, FA, UK, ZH, IT
- Scheduled tasks list
- Federation overview
- Reports / event lookup
- Admin flags for Matrix Client-Server APIs
- And many, many more features!

## Availability

* As a core/default component on [etke.cc](https://etke.cc/?utm_source=github&utm_medium=readme&utm_campaign=ketesa)
* As a standalone app on [admin.etke.cc](https://admin.etke.cc)
* As a prebuilt distribution on [GitHub Releases](https://github.com/etkecc/ketesa/releases) for root-path (e.g., `https://admin.example.com`, `ketesa.tar.gz`) and `admin` subpath (e.g., `https://example.com/admin`, `ketesa-subpath-admin.tar.gz`) deployment
* As a prebuilt snapshot of the latest development version from [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml) (click on the latest successful workflow run, then scroll down to the "Artifacts" section and download either `dist-root` or `dist-subpath-admin` artifact depending on your desired deployment path)
* As a Docker container on [Docker Hub](https://hub.docker.com/r/etkecc/ketesa) and [GitHub Container Registry](https://github.com/etkecc/ketesa/pkgs/container/ketesa)
* As a component in [Matrix-Docker-Ansible-Deploy Playbook](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-synapse-admin.md)
* As a [Nix package](https://search.nixos.org/packages?show=synapse-admin-etkecc) maintained by [@Defelo](https://github.com/Defelo)
* As an [Arch Linux AUR package](https://aur.archlinux.org/packages/synapse-admin-etke-git) maintained by [@drygdryg](https://github.com/drygdryg)

### Prebuilt distributions

We offer two prebuilt distributions for different deployment paths:
* (default) for root path (e.g., `https://admin.example.com`) as `ketesa.tar.gz`
* for `admin` subpath (e.g., `https://example.com/admin`) as `ketesa-subpath-admin.tar.gz`

You can find the latest **released** versions on the [GitHub Releases](https://github.com/etkecc/ketesa/releases) - download the appropriate `.tar.gz` file and follow the instructions in the [step-by-step installation](#step-by-step-installation) section.

You can find the latest **development (nightly)** versions in the [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml) - click on the latest successful workflow run, then scroll down to the "Artifacts" section and download either `dist-root` or `dist-subpath-admin` artifact depending on your desired deployment path. After that, follow the instructions in the [step-by-step installation](#step-by-step-installation) section.

### Nightly builds

You can try the latest changes before they are released by:
* using [admin.etke.cc](https://admin.etke.cc) - it is automatically updated with the latest development version
* using the `latest` and/or `latest-subpath-admin` tags of the Docker image on [GitHub Container Registry](https://github.com/etkecc/ketesa/pkgs/container/ketesa) or [Docker Hub](https://hub.docker.com/r/etkecc/ketesa/tags) - these tags are automatically updated with the latest development version
* using the `dist-root` and `dist-subpath-admin` artifacts from the latest successful [GitHub Actions workflow run](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml) -
    these artifacts are automatically updated with the latest development version (click on the latest successful
    workflow run, then scroll down to the "Artifacts" section and download either `dist-root` or `dist-subpath-admin`
    artifact depending on your desired deployment path)
* using `main` git branch - you can clone the repository and build the app yourself (see [step-by-step installation](#step-by-step-installation) section for instructions)

### IPFS

> Maintained by [Fеnикs (@fenuks:sibnsk.net)](https://matrix.to/#/@fenuks:sibnsk.net)

**Latest version**

`/ipns/synapse-admin.sibnsk.net` (dnslink key `/ipns/k51qzi5uqu5dj91scsxoqu0ebmy7uqajrt9ohl98vs7fl7l429h0chgozk58i2`)

**Archive**

`/ipns/synapse-admin-archive.sibnsk.net` (dnslink key `/ipns/k51qzi5uqu5dhxwc36sld1hn6jn935k71ww8rdyqomrnqcqucixy7re08qeu7z`)

## Configuration

You can use `config.json` to configure a Ketesa instance,
and `/.well-known/matrix/client` to provide configuration specifically for your homeserver.
In the latter case, any instance of Ketesa will automatically pick up the configuration from the homeserver.
Note that configuration inside `/.well-known/matrix/client` should go under the `cc.etke.ketesa` key,
and it will override the configuration from `config.json`.

> **Note:** The legacy key `cc.etke.synapse-admin` is still supported for backward compatibility, but is deprecated.
> Please migrate to `cc.etke.ketesa` at your convenience.

In case you use [spantaleev/matrix-docker-ansible-deploy](https://github.com/spantaleev/matrix-docker-ansible-deploy) or
[etkecc/ansible](https://github.com/etkecc/ansible),
configuration will be automatically added to the `/.well-known/matrix/client` file.

[Configuration options](./docs/config.md)

The `config.json` can be injected into a Docker container using a bind mount.

```yml
services:
  ketesa:
    ...
    volumes:
      - ./config.json:/var/public/config.json:ro
    ...
```

### Prefilling login form

You can prefill all fields on the login page using GET parameters.

[Documentation](./docs/prefill-login-form.md)

### Restricting available homeserver

You can restrict the homeserver(s), so that the user can no longer define it himself.

[Documentation](./docs/restrict-hs.md)

### Configuring CORS credentials

You can configure the CORS credentials mode for the Ketesa instance.

[Documentation](./docs/cors-credentials.md)

### Protecting appservice managed users

To avoid accidental adjustments of appservice-managed users (e.g., puppets created by a bridge) and breaking the bridge,
you can specify the list of MXIDs (regexp) that should be prohibited from any changes, except display name and avatar.

[Documentation](./docs/system-users.md)

### Adding custom menu items

You can add custom menu items to the main menu by providing a `menu` array in the config.

[Documentation](./docs/custom-menu.md)

### Enabling external auth provider-compatible mode

If you use an external authentication provider (like OIDC, LDAP, etc.) for your Synapse server,
you can enable the `externalAuthProvider` mode to adjust Ketesa's behavior accordingly.

[Documentation](./docs/external-auth-provider.md)

#### Matrix Authentication Service (MAS) specifics

Please see [designated documentation section](./docs/external-auth-provider.md#matrix-authentication-service-mas) for details about using MAS - there are some specific changes that may be needed to enable admin API support in MAS.

## Usage

### Supported APIs

See [Supported APIs](./docs/apis.md) for a full list of API endpoints used by Ketesa.

### Supported Synapse

It needs at least [Synapse](https://github.com/element-hq/synapse) v1.145.0 for all functions to work as expected!

You get your server version with the request `/_synapse/admin/v1/server_version`.
See also [Synapse version API](https://element-hq.github.io/synapse/latest/admin_api/version_api.html).

After entering the URL on the login page of Ketesa the server version appears below the input field.

### Prerequisites

You need access to the following endpoints:

- `/_matrix`
- `/_synapse/admin`

See also [Synapse administration endpoints](https://element-hq.github.io/synapse/latest/reverse_proxy.html#synapse-administration-endpoints)

### Use without install

You can use the current version of Ketesa without your own installation directly
via [admin.etke.cc](https://admin.etke.cc).

**Note:**
If you want to use the deployment, you have to make sure that the admin endpoints (`/_synapse/admin`) are accessible for your browser.
**Remember: You have no need to expose these endpoints to the internet but to your network.**
If you want your own deployment, follow the [step-by-step installation guide](#step-by-step-installation) below.

### Step-by-step installation

You have three options:

1.  [Download the tarball and serve with any webserver](#steps-for-1)
2.  [Download the source code from github and run using nodejs](#steps-for-2)
3.  [Run the Docker container](#steps-for-3)

#### Steps for 1)

- make sure you have a webserver installed that can serve static files (any webserver like nginx or apache will do)
- configure a vhost for Ketesa on your webserver
- download the appropriate `.tar.gz` file [from the latest release](https://github.com/etkecc/ketesa/releases/latest):
- `ketesa.tar.gz` for root path (e.g., `https://admin.example.com`)
- `ketesa-subpath-admin.tar.gz` for `/admin` subpath (e.g., `https://example.com/admin`)
- unpack the .tar.gz
- move or symlink the unpacked directory into your vhost's root directory
- open the url of the vhost in your browser

[Reverse Proxy Documentation with Examples](./docs/reverse-proxy.md)

#### Steps for 2)

- make sure you have installed the following: git, yarn, nodejs
- download the source code: `git clone https://github.com/etkecc/ketesa.git`
- change into downloaded directory: `cd ketesa`
- download dependencies: `yarn install`
- start web server: `yarn start`

#### Steps for 3)

- run the Docker container from the public docker registry: `docker run -p 8080:8080 ghcr.io/etkecc/ketesa` or use the [docker-compose.yml](docker-compose.yml): `docker-compose up -d`

  > note: if you're building on an architecture other than amd64 (for example a raspberry pi), make sure to define a maximum ram for node. otherwise the build will fail.

  > note: if you're running on a ipv4-only system, make sure to set `SERVER_HOST=0.0.0.0` env var. Otherwise Ketesa will not be able to start.

  ```yml
  services:
    ketesa:
      container_name: ketesa
      hostname: ketesa
      build:
        context: https://github.com/etkecc/ketesa.git
        dockerfile: Dockerfile.build
        args:
          - BUILDKIT_CONTEXT_KEEP_GIT_DIR=1
        #   - NODE_OPTIONS="--max_old_space_size=1024"
        #   - BASE_PATH="/ketesa"
      ports:
        - "8080:8080"
      restart: unless-stopped
  ```

- browse to http://localhost:8080

### Serving Ketesa on a different path

The path prefix where Ketesa is served can only be changed during the build step.

If you need `/admin` specifically, use the prebuilt `ketesa-subpath-admin` tarball from [GitHub Releases](https://github.com/etkecc/ketesa/releases) or the `dist-subpath-admin` artifact from [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml), or `*-subpath-admin` tag of the Docker image.
If you need the root path, use the prebuilt `ketesa` tarball from [GitHub Releases](https://github.com/etkecc/ketesa/releases) or the `dist-root` artifact from [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml).
For any other prefix, you must build your own distribution.

If you downloaded the source code, use `yarn build --base=/my-prefix` to set a path prefix.

If you want to build your own Docker container, use the `BASE_PATH` argument.

We do not support directly changing the path where Ketesa is served in the pre-built Docker container. Instead please use a reverse proxy if you need to move Ketesa to a different base path. If you want to serve multiple applications with different paths on the same domain, you need a reverse proxy anyway.

Example for Traefik:

`docker-compose.yml`

```yml
services:
  traefik:
    image: traefik:v3
    restart: unless-stopped
    ports:
      - 80:80
      - 443:443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro

  ketesa:
    image: ghcr.io/etkecc/ketesa:latest
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.admin.rule=Host(`example.com`) && PathPrefix(`/admin`)"
      - "traefik.http.services.admin.loadbalancer.server.port=8080"
      - "traefik.http.middlewares.admin-slashless-redirect.redirectregex.regex=(/admin)$$"
      - "traefik.http.middlewares.admin-slashless-redirect.redirectregex.replacement=$${1}/"
      - "traefik.http.middlewares.admin-strip-prefix.stripprefix.prefixes=/admin"
      - "traefik.http.routers.admin.middlewares=admin-slashless-redirect,admin-strip-prefix"
```

## Development

- See https://yarnpkg.com/getting-started/editor-sdks how to setup your IDE
- Use `yarn lint` to run all style and linter checks
- Use `yarn test` to run all unit tests
- Use `yarn fix` to fix the coding style

`just run-dev` to start the development stack (depending on your system speed, you may want to re-run this command if
   user creation fails)

This command initializes the development environment (local Synapse server, Element Web client app, and Postgres DB),
and launches the app in a dev mode at `http://localhost:5173`

After that open [http://localhost:5173](http://localhost:5173?username=admin&password=admin&server=http://localhost:8008) in your browser,
login using the following credentials:

* Login: admin
* Password: admin
* Homeserver URL: http://localhost:8008

Element Web runs on http://localhost:8080
