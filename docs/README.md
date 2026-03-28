# 📚 Documentation

Welcome to the Ketesa documentation! This is the central index for all guides covering configuration, supported APIs, and available features.

> 📝 **Note:** Documentation is actively evolving — PRs are greatly appreciated!

---

## ⚙️ Configuration

[Full configuration reference →](./config.md)

Specific topics:

| Guide | What it covers |
|-------|----------------|
| [Customizing CORS credentials](./cors-credentials.md) | Fine-tune cross-origin request behavior |
| [Restricting available homeservers](./restrict-hs.md) | Lock down which homeservers users can connect to |
| [System / Appservice-managed users](./system-users.md) | Protect bridge puppets from accidental edits |
| [Custom menu items](./custom-menu.md) | Add your own links to the navigation menu |
| [External auth provider](./external-auth-provider.md) | Adjust behavior when Synapse delegates auth externally |

---

## 🔌 APIs

* [Supported APIs](./apis.md) — full list of Synapse and MAS endpoints used by Ketesa

---

## ✨ Features

* [User badges](./user-badges.md) — role indicators on user avatars (admin, bot, system-managed, etc.)
* [Prefilling the login form](./prefill-login-form.md) — pre-populate login fields via URL parameters

### 🌟 etke.cc exclusive features

> ⚠️ **Note:** The following features are only available for [etke.cc](https://etke.cc) customers. Due to the specifics of their implementation, they are not available for any other Ketesa deployment.

* [Server Status icon](../src/components/etke.cc/README.md#server-status-icon)
* [Server Status page](../src/components/etke.cc/README.md#server-status-page)
* [Server Actions page](../src/components/etke.cc/README.md#server-actions-page)
* [Server Commands Panel](../src/components/etke.cc/README.md#server-commands-panel)
* [Server Notifications icon](../src/components/etke.cc/README.md#server-notifications-icon)
* [Server Notifications page](../src/components/etke.cc/README.md#server-notifications-page)
* [Billing page](../src/components/etke.cc/README.md#billing-page)
* [Support page](../src/components/etke.cc/README.md#support-page)
* [Instance config](../src/components/etke.cc/README.md#instance-config)

---

## 🚀 Deployment

* [Serving Ketesa behind a reverse proxy](./reverse-proxy.md)
