# Documentation

Synapse Admin documentation is under construction right now, so PRs are greatly appreciated!

Table of contents:
<!-- vim-markdown-toc GFM -->

* [Configuration](#configuration)
* [Features](#features)
* [Deployment](#deployment)

<!-- vim-markdown-toc -->

## Configuration

[Full configuration documentation](./config.md)

Specific configuration options:

* [Restricting available homeserver](./restrict-hs.md)
* [System / Appservice-managed Users](./system-users.md)
* [Custom Menu Items](./custom-menu.md)

## Features

* [User Badges](./user-badges.md)
* [Prefilling the Login Form](./prefill-login-form.md)

for [etke.cc](https://etke.cc) customers only:

> **Note:** The following features are only available for etke.cc customers. Due to specifics of the implementation,
they are not available for any other Synapse Admin deployments.

* [Server Status icon](../src/components/etke.cc/README.md#server-status-icon)
* [Server Status page](../src/components/etke.cc/README.md#server-status-page)

## Deployment

* [Serving Synapse Admin behind a reverse proxy](./reverse-proxy.md)
