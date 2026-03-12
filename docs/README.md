# Documentation

Synapse Admin documentation is currently under construction, so PRs are greatly appreciated!

Table of contents:
<!-- vim-markdown-toc GFM -->

* [Configuration](#configuration)
* [Features](#features)
* [Deployment](#deployment)

<!-- vim-markdown-toc -->

## Configuration

[Full configuration documentation](./config.md)

Specific configuration options:

* [Customizing CORS credentials](./cors-credentials.md)
* [Restricting available homeserver](./restrict-hs.md)
* [System / Appservice-managed Users](./system-users.md)
* [Custom Menu Items](./custom-menu.md)
* [External Auth Provider](./external-auth-provider.md)

## APIs

* [Supported APIs](./apis.md)

## Features

* [User Badges](./user-badges.md)
* [Prefilling the Login Form](./prefill-login-form.md)

For [etke.cc](https://etke.cc) customers only:

> **Note:** The following features are only available for etke.cc customers. Due to specifics of the implementation,
they are not available for any other Synapse Admin deployments.

* [Server Status icon](../src/components/etke.cc/README.md#server-status-icon)
* [Server Status page](../src/components/etke.cc/README.md#server-status-page)
* [Server Actions page](../src/components/etke.cc/README.md#server-actions-page)
* [Server Commands Panel](../src/components/etke.cc/README.md#server-commands-panel)
* [Server Notifications icon](../src/components/etke.cc/README.md#server-notifications-icon)
* [Server Notifications page](../src/components/etke.cc/README.md#server-notifications-page)
* [Billing Page](../src/components/etke.cc/README.md#billing-page)
* [Support Page](../src/components/etke.cc/README.md#support-page)
* [Instance config](../src/components/etke.cc/README.md#instance-config)

## Deployment

* [Serving Synapse Admin behind a reverse proxy](./reverse-proxy.md)
