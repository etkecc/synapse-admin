# 📦 Availability

This is the canonical reference for obtaining Ketesa.

> ⚠️ Community-maintained and third-party entries may lag behind official releases.
> When in doubt, prefer the official release tarballs, containers, or the hosted instance.

## ✅ Official channels

| Channel | Type | Maintainer | Best for | Notes |
|---|---|---|---|---|
| [etke.cc](https://etke.cc/?utm_source=github&utm_medium=docs&utm_campaign=ketesa) | Managed hosting | Official | Fully managed deployments | Ketesa is [a core component](https://etke.cc/help/faq#what-are-the-base-matrix-components-installed-on-the-server) installed by default |
| [admin.etke.cc](https://admin.etke.cc) | Hosted instance | Official | No installation needed | Always on the latest development version |
| [GitHub Releases](https://github.com/etkecc/ketesa/releases) | Static builds | Official | Self-hosting behind any web server | Includes `ketesa.tar.gz` and `ketesa-subpath-admin.tar.gz` |
| [GHCR](https://github.com/etkecc/ketesa/pkgs/container/ketesa) | Container image | Official | Docker and OCI-based deployments | Main image registry |
| [Docker Hub](https://hub.docker.com/r/etkecc/ketesa/tags) | Container image | Official | Docker-first users | Mirrors the official container images |
| [matrix-docker-ansible-deploy](https://github.com/spantaleev/matrix-docker-ansible-deploy/blob/master/docs/configuring-playbook-ketesa.md) | Ansible integration | Official | Operators using the MDAD playbook | Maintained by the etke.cc team |
| [etkecc/ansible](https://github.com/etkecc/ansible) | Ansible integration | Official | etke.cc-flavoured self-hosted automation | Maintained by the etke.cc team |
| [Source repository](https://github.com/etkecc/ketesa) | Source code | Official | Building from source or contributing | For custom builds and development checkouts |

### Prebuilt distributions

Ketesa publishes two static distributions:

- `ketesa.tar.gz` for root path deployments such as `https://admin.example.com`
- `ketesa-subpath-admin.tar.gz` for `/admin` subpath deployments such as `https://example.com/admin`

For custom prefixes other than `/admin`, build from source with `yarn build --base=/your-prefix/`
or pass the `BASE_PATH` Docker build argument.

## 🌙 Nightly and development builds

To get the latest unreleased changes:

- Use [admin.etke.cc](https://admin.etke.cc) for the hosted development version
- Pull `latest` or `latest-subpath-admin` from [GHCR](https://github.com/etkecc/ketesa/pkgs/container/ketesa) or [Docker Hub](https://hub.docker.com/r/etkecc/ketesa/tags)
- Download `dist-root` or `dist-subpath-admin` from the latest successful [GitHub Actions run](https://github.com/etkecc/ketesa/actions/workflows/workflow.yml)
- Build the `main` branch from [source](https://github.com/etkecc/ketesa)

## 🐧 Distro packages

| Channel | Type | Maintainer | Best for | Notes |
|---|---|---|---|---|
| [Nixpkgs](https://search.nixos.org/packages?channel=unstable&show=ketesa) | Package index | [@Defelo](https://github.com/Defelo) | Nix and NixOS users | |
| [YunoHost](https://apps.yunohost.org/app/ketesa) | App catalog package | [@Josue-T](https://github.com/Josue-T) | YunoHost-based deployments | |

## 🤝 Community-packaged options

| Channel | Type | Maintainer | Best for | Notes |
|---|---|---|---|---|
| [IPFS](#ipfs) | Mirror / alternative delivery | [Fеnикs (@fenuks:sibnsk.net)](https://matrix.to/#/@fenuks:sibnsk.net) | Content-addressed distribution | See the [IPFS](#ipfs) section below for addresses |
| [Arch Linux AUR](https://aur.archlinux.org/packages/synapse-admin-etke-git) | AUR package | [@drygdryg](https://github.com/drygdryg) | Arch users who prefer AUR packaging | Legacy package naming — maintained outside this repository |

## IPFS

> Maintained by [Fеnикs (@fenuks:sibnsk.net)](https://matrix.to/#/@fenuks:sibnsk.net)

**Latest version:** `/ipns/ketesa.sibnsk.net`
(`dnslink` key `/ipns/k51qzi5uqu5dj91scsxoqu0ebmy7uqajrt9ohl98vs7fl7l429h0chgozk58i2`)

**Archive:** `/ipns/ketesa-archive.sibnsk.net`
(`dnslink` key `/ipns/k51qzi5uqu5dhxwc36sld1hn6jn935k71ww8rdyqomrnqcqucixy7re08qeu7z`)

## 📝 Want your package listed?

Open a pull request if you maintain a Ketesa package, mirror, or deployment integration — we welcome all distribution channels.
Please include:

- the package or project link
- whether it is official, community-maintained, or a third-party mirror
- who maintains it
- any important caveats, especially if it still uses legacy `synapse-admin` naming
