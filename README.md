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
  <p align="center"><strong>The evolution of Synapse Admin. Manage, monitor, and maintain your Matrix homeserver from one clean interface. Built for small private servers and large federated communities alike. Formerly Synapse Admin.</strong></p>
</p>

---

![Login](./docs/screenshots/light/login.webp)
![Users List](./docs/screenshots/light/users-list.webp)

[View all screenshots →](./docs/screenshots/README.md)

## 📖 About

Ketesa is the evolution of Synapse Admin — a fully independent admin interface for Matrix homeservers.
What began as a fork of [Awesome-Technologies/synapse-admin](https://github.com/Awesome-Technologies/synapse-admin)
has grown into its own project, with a redesigned interface, comprehensive API coverage,
multi-language support, and powerful management tools that go far beyond the original.

**Ketesa is a fully compatible drop-in replacement for Synapse Admin.** Migration is straightforward
and requires no configuration changes:

| | Method | How |
|---|---|---|
| ☁️ | **Hosted (CDN)** | Use [admin.etke.cc](https://admin.etke.cc) — nothing to install |
| 🐳 | **Docker** | Replace the image tag with `ghcr.io/etkecc/ketesa:latest` |
| 📦 | **Static files** | Replace your existing dist directory with the Ketesa release tarball |

Whether you're managing a small private server or a large federated community, Ketesa gives you
the visibility and control you need — all from a clean, responsive web interface.

> 💬 Questions? Join the [community room](https://matrix.to/#/#ketesa:etke.cc) or open an issue on GitHub.

---

## ✨ Features

### 👥 Complete user management

Ketesa covers the full lifecycle of a Matrix user account. You can suspend, [shadow-ban](./docs/user-management.md#-shadow-ban),
[deactivate, or permanently erase](./docs/user-management.md#-deactivation-vs-erasure) users. Fine-grained controls let you manage [rate limits](./docs/user-management.md#-rate-limits),
[experimental features](./docs/user-management.md#-experimental-features), and [account data](./docs/user-management.md#-account-data). You can view and manage third-party identifiers,
connected devices (create, rename, delete), room memberships, and cross-signing keys — all
from one place. Need to onboard many users at once? [Bulk registration via CSV import](./docs/csv-import.md) handles
it, including third-party identifiers. Passwords can be generated randomly or reset manually.
User avatars carry [role badges](./docs/user-badges.md) (admin, bot, support, federated, system-managed)
so you can identify account types at a glance.

When [Matrix Authentication Service (MAS)](https://github.com/element-hq/matrix-authentication-service)
is in use, Ketesa extends user management with [MAS-native capabilities](./docs/user-management.md#-mas-user-management): browsing and revoking
active sessions (compat, OAuth2, and personal), managing linked email addresses, reviewing
upstream OAuth provider links, and creating users through MAS directly.

[📄 User management guide](./docs/user-management.md)

### 🏠 Powerful room management

Get a full picture of every room on your server. Block or unblock rooms, purge history,
and delete rooms entirely. The [messages viewer](./docs/room-management.md#-messages-viewer) lets you browse room history with filters
and jump-to-date navigation. [Spaces are handled natively](./docs/room-management.md#-room-hierarchy) with a dedicated room hierarchy
tab. You can assign room admins and join users to rooms directly from the UI.
[Media](./docs/media.md) can be quarantined, protected, or deleted at file, user, or room scope.

[📄 Room management guide](./docs/room-management.md) · [📄 Media management guide](./docs/media.md)

### 🔐 Flexible authentication

Log in with a username and password, a raw access token, or via OIDC/SSO — whatever your
server setup requires. Ketesa has first-class support for [Matrix Authentication Service (MAS)](https://github.com/element-hq/matrix-authentication-service),
including full session management and [registration token administration](./docs/registration-tokens.md). It also ships a
dedicated [external auth provider mode](./docs/external-auth-provider.md) that adapts the interface
when Synapse delegates authentication to an external system.

[📄 Registration tokens guide](./docs/registration-tokens.md)

### ⚙️ Deep customization

Every data table in Ketesa is built with [react-admin's Configurable](https://marmelab.com/react-admin/Configurable.html)
component, so users can show, hide, and reorder columns to match their workflow — no code changes needed.

[📄 Configurable columns guide](./docs/configurable-columns.md)

Beyond the per-user table preferences, Ketesa can be tailored at the deployment level through a
[`config.json`](./docs/config.md) file (or via `/.well-known/matrix/client`):
[restrict which homeservers](./docs/restrict-hs.md) users can connect to,
[add custom navigation menu items](./docs/custom-menu.md),
[pre-fill the login form](./docs/prefill-login-form.md),
[configure CORS credentials](./docs/cors-credentials.md),
and [protect appservice-managed users](./docs/system-users.md) (bridge puppets) from accidental edits.

### 📊 Server statistics and insights

Monitor your server with built-in statistics views: [per-user media usage and database room
stats](./docs/server-statistics.md) give you a clear picture of what's consuming space. The [federation overview](./docs/federation.md) shows
the health and reachability of remote destinations. [Reported events](./docs/event-reports.md) can be reviewed and
acted upon directly from the reports list.

[📄 Server statistics guide](./docs/server-statistics.md) · [📄 Federation guide](./docs/federation.md) · [📄 Event reports guide](./docs/event-reports.md)

### 🌍 Available in 9 languages

Ketesa ships with full translations in English, German, French, Japanese, Russian, Persian,
Ukrainian, Chinese, and Italian — every string is fully translated, with no untranslated
English stubs left behind.

### 📱 Mobile-friendly by design

The interface is fully responsive. Wherever you are, you can manage your server from a
phone or tablet without sacrificing functionality. Tables collapse to readable mobile lists,
long identifiers wrap gracefully, and every action is reachable on small screens.

### 🌟 Built by etke.cc — and it shows

Ketesa is built and actively maintained by [etke.cc](https://etke.cc/?utm_source=github&utm_medium=readme&utm_campaign=ketesa),
a managed Matrix hosting provider with a genuine [open-source-first](https://github.com/etkecc) philosophy.
Every feature in this project is open source, developed in the open, and free to use by anyone.

If you run your Matrix server on etke.cc, Ketesa becomes something even more powerful: a **unified
control plane for your entire server**. Instead of juggling separate dashboards, log files, and support
channels, everything you need is right here — in the same interface you already use for user and room
management:

| | Feature | What it does |
|---|---|---|
| 🟢 | **Server health** | Live status badge in the toolbar + a full dashboard showing every server component with color-coded indicators, error details, and suggested actions. Know what's wrong before your users do. |
| 🔔 | **Notifications** | Important server events surface as an in-app feed with an unread badge — nothing slips through the cracks. |
| ⚡ | **Server actions** | Trigger management commands on demand, schedule them for a precise date and time, or set up recurring weekly jobs. Routine maintenance becomes a few clicks, not a cron job. |
| 💳 | **Billing** | View payment history, transaction details, and download invoices without ever leaving the admin panel. |
| 💬 | **Support** | Open support requests, track their progress, and exchange messages with the etke.cc team — right from the interface you use every day. |
| 🎨 | **White-labelling** | Custom name, logo, favicon, and background applied automatically from the platform. No extra configuration, no deploy step. |

> 💡 **Interested?** [Learn more about etke.cc managed Matrix hosting →](https://etke.cc/?utm_source=github&utm_medium=readme&utm_campaign=ketesa)

---

## 📦 Availability

| | Where | Details |
|---|---|---|
| 🏠 | **[etke.cc](https://etke.cc/?utm_source=github&utm_medium=readme&utm_campaign=ketesa)** | Core component of the managed hosting platform |
| 🌐 | **[admin.etke.cc](https://admin.etke.cc)** | Hosted instance, always on the latest version |
| 📦 | **[GitHub Releases](https://github.com/etkecc/ketesa/releases)** | Prebuilt tarballs for root-path and `/admin` subpath deployment |
| 🐳 | **[Docker Hub](https://hub.docker.com/r/etkecc/ketesa) / [GHCR](https://github.com/etkecc/ketesa/pkgs/container/ketesa)** | Official Docker images |
| 🤖 | **[matrix-docker-ansible-deploy](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-ketesa.md)** | Ansible playbook component |
| ❄️ | **[Nix package](https://search.nixos.org/packages?show=synapse-admin-etkecc)** | Maintained by [@Defelo](https://github.com/Defelo) |
| 🐧 | **[Arch Linux AUR](https://aur.archlinux.org/packages/synapse-admin-etke-git)** | Maintained by [@drygdryg](https://github.com/drygdryg) |
| 🌊 | **[IPFS](https://ipfs.io)** | Maintained by [Fеnикs (@fenuks:sibnsk.net)](https://matrix.to/#/@fenuks:sibnsk.net) — see [details below](#ipfs) |

### Prebuilt distributions

We offer two prebuilt distributions for different deployment paths:

- **`ketesa.tar.gz`** — for root path deployment (e.g., `https://admin.example.com`)
- **`ketesa-subpath-admin.tar.gz`** — for `/admin` subpath deployment (e.g., `https://example.com/admin`)

Find the latest **released** versions on [GitHub Releases](https://github.com/etkecc/ketesa/releases).
Find the latest **development (nightly)** builds in [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml)
— click the latest successful run and download `dist-root` or `dist-subpath-admin` from the Artifacts section.

### 🌙 Nightly builds

Stay on the bleeding edge:

- 🌐 **[admin.etke.cc](https://admin.etke.cc)** — always running the latest development version
- 🐳 **Docker** — use the `latest` or `latest-subpath-admin` image tags on [GHCR](https://github.com/etkecc/ketesa/pkgs/container/ketesa) or [Docker Hub](https://hub.docker.com/r/etkecc/ketesa/tags)
- 📦 **Artifacts** — `dist-root` / `dist-subpath-admin` from the latest [GitHub Actions run](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml)
- 🔧 **Source** — clone the `main` branch and build it yourself

### IPFS

> Maintained by [Fеnикs (@fenuks:sibnsk.net)](https://matrix.to/#/@fenuks:sibnsk.net)

**Latest version:** `/ipns/synapse-admin.sibnsk.net`
(dnslink key `/ipns/k51qzi5uqu5dj91scsxoqu0ebmy7uqajrt9ohl98vs7fl7l429h0chgozk58i2`)

**Archive:** `/ipns/synapse-admin-archive.sibnsk.net`
(dnslink key `/ipns/k51qzi5uqu5dhxwc36sld1hn6jn935k71ww8rdyqomrnqcqucixy7re08qeu7z`)

---

## ⚙️ Configuration

Ketesa can be configured via a `config.json` file placed in the deployment root.
Additionally, your homeserver's `/.well-known/matrix/client` file can carry Ketesa-specific
configuration under the `cc.etke.ketesa` key — any instance of Ketesa will pick it up
automatically, making it easy to distribute settings to your users without touching the
deployment itself. Settings in `/.well-known/matrix/client` take precedence over `config.json`.

> **Note:** The legacy key `cc.etke.synapse-admin` is still supported for backward compatibility, but is deprecated.
> Please migrate to `cc.etke.ketesa` at your convenience.

If you use [spantaleev/matrix-docker-ansible-deploy](https://github.com/spantaleev/matrix-docker-ansible-deploy) or
[etkecc/ansible](https://github.com/etkecc/ansible),
configuration is automatically written to `/.well-known/matrix/client` for you.

[📄 Full configuration reference](./docs/config.md)

To inject a `config.json` into a Docker container, use a bind mount:

```yml
services:
  ketesa:
    ...
    volumes:
      - ./config.json:/var/public/config.json:ro
    ...
```

### 🔗 Prefilling the login form

Every field on the login page can be pre-filled via URL query parameters — handy for
sharing direct-access links with your users.

[Documentation](./docs/prefill-login-form.md)

### 🔒 Restricting available homeservers

Lock down the homeserver selection so users can only connect to servers you approve.
Useful for managed deployments where the homeserver should never change.

[Documentation](./docs/restrict-hs.md)

### 🌐 Configuring CORS credentials

Fine-tune the CORS credentials mode for your Ketesa deployment to match your server's
cross-origin policies.

[Documentation](./docs/cors-credentials.md)

### 🛡️ Protecting appservice-managed users

Bridge puppets and other appservice-managed accounts can be shielded from accidental
edits. Specify a list of MXID patterns (as regular expressions) to be restricted to
display name and avatar changes only.

[Documentation](./docs/system-users.md)

### 📋 Adding custom menu items

Extend the navigation menu with links to your own tools or documentation — no rebuild required.

[Documentation](./docs/custom-menu.md)

### 🔑 External auth provider mode

When Synapse delegates authentication to an external provider (OIDC, LDAP, and similar),
enable this mode to adjust Ketesa's behavior accordingly and avoid confusing UI elements
that don't apply in your setup.

[Documentation](./docs/external-auth-provider.md)

#### Matrix Authentication Service (MAS)

MAS requires a small amount of additional configuration to enable its admin API. See the
[designated MAS section](./docs/external-auth-provider.md#matrix-authentication-service-mas) for the details.

---

## 🚀 Usage

### Supported APIs

See [📄 Supported APIs](./docs/apis.md) for a full list of API endpoints used by Ketesa.

### Supported Synapse versions

Ketesa requires [Synapse](https://github.com/element-hq/synapse) **v1.150.0 or newer** for all
features to work correctly.

You can verify your server version by calling `/_synapse/admin/v1/server_version`,
or simply look at the version indicator that appears below the homeserver URL field on
the Ketesa login page.

See also: [Synapse version API](https://element-hq.github.io/synapse/latest/admin_api/version_api.html)

### Prerequisites

Your browser needs access to the following endpoints on your homeserver:

- `/_matrix`
- `/_synapse/admin`

See also: [Synapse administration endpoints](https://element-hq.github.io/synapse/latest/reverse_proxy.html#synapse-administration-endpoints)

### ☁️ Use without installing anything

The hosted version at [admin.etke.cc](https://admin.etke.cc) is always up to date and
requires no installation. Just open it in your browser, enter your homeserver URL, and
log in with your admin account.

> 🔒 Your browser must be able to reach `/_synapse/admin` on your homeserver. The endpoints
> do not need to be exposed to the public internet — access from your local network is sufficient.

### 📥 Step-by-step installation

Choose your preferred method:

| | Method | Best for |
|---|---|---|
| [1️⃣](#steps-for-1) | **Tarball + webserver** | Any static hosting, full control |
| [2️⃣](#steps-for-2) | **Source + Node.js** | Development or custom builds |
| [3️⃣](#steps-for-3) | **Docker** | Containerized deployments |

#### Steps for 1)

- Make sure you have a webserver installed that can serve static files (nginx, Apache, Caddy, or anything else will work)
- Configure a virtual host for Ketesa on your webserver
- Download the appropriate `.tar.gz` from the [latest release](https://github.com/etkecc/ketesa/releases/latest):
  - `ketesa.tar.gz` for root path deployment (e.g., `https://admin.example.com`)
  - `ketesa-subpath-admin.tar.gz` for `/admin` subpath deployment (e.g., `https://example.com/admin`)
- Unpack the archive and place the contents in your virtual host's document root
- Open the URL in your browser

[📄 Reverse proxy configuration examples](./docs/reverse-proxy.md)

#### Steps for 2)

- Make sure you have git, yarn, and Node.js installed
- Clone the repository: `git clone https://github.com/etkecc/ketesa.git`
- Enter the directory: `cd ketesa`
- Install dependencies: `yarn install`
- Start the development server: `yarn start`

#### Steps for 3)

- Run the Docker container: `docker run -p 8080:8080 ghcr.io/etkecc/ketesa`

  Or use the provided [docker-compose.yml](docker/docker-compose.yml):

  ```sh
  docker-compose -f docker/docker-compose.yml up -d
  ```

  > **Note:** If you're building on a non-amd64 architecture (e.g., Raspberry Pi), set a Node.js
  > memory cap to prevent OOM failures during the build: `NODE_OPTIONS="--max_old_space_size=1024"`.

  > **Note:** On IPv4-only systems, set `SERVER_HOST=0.0.0.0` so Ketesa binds correctly.

  To build your own image from source:

  ```yml
  services:
    ketesa:
      container_name: ketesa
      hostname: ketesa
      build:
        context: https://github.com/etkecc/ketesa.git
        dockerfile: docker/Dockerfile.build
        args:
          - BUILDKIT_CONTEXT_KEEP_GIT_DIR=1
        #   - NODE_OPTIONS="--max_old_space_size=1024"
        #   - BASE_PATH="/ketesa"
      ports:
        - "8080:8080"
      restart: unless-stopped
  ```

- Open http://localhost:8080 in your browser

### 🛤️ Serving Ketesa under a custom path

The base path is baked in at build time and cannot be changed at runtime.

- For `/admin` specifically: use the prebuilt `ketesa-subpath-admin` tarball from [GitHub Releases](https://github.com/etkecc/ketesa/releases) or the `dist-subpath-admin` artifact from [GitHub Actions](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml), or the `*-subpath-admin` Docker image tag.
- For root path: use `ketesa.tar.gz` or the `dist-root` artifact.
- For any other prefix: build from source with `yarn build --base=/my-prefix`, or pass the `BASE_PATH` build argument to Docker.

If you need a reverse proxy to expose Ketesa under a different base path without rebuilding,
here is a Traefik example:

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

---

## 🛠️ Development

- See https://yarnpkg.com/getting-started/editor-sdks for IDE setup instructions

| Command | What it does |
|---|---|
| `yarn lint` | Run all style and linter checks |
| `yarn test` | Run all unit tests |
| `yarn fix` | Auto-fix coding style issues |
| `just run-dev` | Spin up the full local development stack |

`just run-dev` launches a complete local environment: a Synapse homeserver, Element Web, and a Postgres
database. The app starts in development mode at `http://localhost:5173`.
(If user creation fails on first run, re-run the command — the server may still be starting up.)

Open [http://localhost:5173](http://localhost:5173?username=admin&password=admin&server=http://localhost:8008) and log in with:

| Field | Value |
|---|---|
| Login | `admin` |
| Password | `admin` |
| Homeserver URL | `http://localhost:8008` |

Element Web is available at http://localhost:8080.
