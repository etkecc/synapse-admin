# ⚙️ Configuration

Ketesa is flexible by design — configure it once and let it work across any number of deployments or homeservers.

There are two ways to configure Ketesa (both are optional, and both can be used together):

| Method | Best for |
|--------|----------|
| `config.json` alongside the deployment ([example](https://admin.etke.cc/config.json)) | Self-hosted deployments where you control the Ketesa files |
| `cc.etke.ketesa` key in `/.well-known/matrix/client` ([example](https://demo.etke.host/.well-known/matrix/client)) | Any homeserver — works even if you don't host Ketesa yourself |

> 📝 **Existing configurations using the legacy `cc.etke.synapse-admin` key continue to work** — Ketesa reads both keys automatically and you don't need to change anything. Migrating to `cc.etke.ketesa` is optional and can be done at your convenience.

If you are an [etke.cc](https://etke.cc) customer,
or use [spantaleev/matrix-docker-ansible-deploy](https://github.com/spantaleev/matrix-docker-ansible-deploy),
or [etkecc/ansible](https://github.com/etkecc/ansible),
configuration is added automatically to the `/.well-known/matrix/client` file.

> 💡 **Why `/.well-known/matrix/client`?**
>
> Because any instance of Ketesa will automatically pick up the configuration from the homeserver.
> A common use case is when you have a Synapse server running, but don't want (or can't) to deploy Ketesa alongside it.
> In this case, you could provide the configuration in the `/.well-known/matrix/client` file,
> and any Ketesa instance (e.g., [admin.etke.cc](https://admin.etke.cc)) will pick it up.
>
> Another common case is when you have multiple Synapse servers running and want to use a single Ketesa instance to manage them all.
> In this case, you could provide the configuration in the `/.well-known/matrix/client` file for each of the servers.

## 🔧 Configuration options

* `restrictBaseUrl` — restricts the Ketesa instance to work only with specific homeserver(-s).
  Accepts both a string and an array of strings.
  The homeserver URL should be the _actual_ homeserver URL, and not the delegated one.
  Example: `https://matrix.example.com` or `https://synapse.example.net`
  [More details](restrict-hs.md)

* `externalAuthProvider` — set if an external authentication provider is used (e.g., OIDC, LDAP, etc).
  Accepts a boolean value.
  [More details](external-auth-provider.md)

* `wellKnownDiscovery` — control automatic URL canonicalization via `/.well-known/matrix/client`.
  Accepts a boolean value. Default: `true` (discovery enabled, per Matrix spec).
  Set to `false` when the `/_synapse/admin` API is hosted on a separate domain not advertised
  in well-known (e.g. a VPN-only admin endpoint). When disabled, MXID-based URL auto-fill
  uses the domain portion of the MXID directly without a well-known lookup.
  [More details](well-known-discovery.md)

* `corsCredentials` — configure the CORS credentials for the Ketesa instance.
  Accepts the following values:

  | Value | Behavior |
  |---|---|
  | `same-origin` (default) | Cookies are sent only if the request is made from the same origin as the server |
  | `include` | Cookies are sent regardless of the origin of the request |
  | `omit` | Cookies are not sent with the request |

  [More details](cors-credentials.md)

* `asManagedUsers` — protect system user accounts managed by appservices (such as bridges) / system (such as bots) from accidental changes.
  By defining a list of MXID regex patterns, you can protect these accounts from accidental changes.
  Example: `^@baibot:example\\.com$`, `^@slackbot:example\\.com$`, `^@slack_[a-zA-Z0-9\\-]+:example\\.com$`, `^@telegrambot:example\\.com$`, `^@telegram_[a-zA-Z0-9]+:example\\.com$`
  [More details](system-users.md)

* `menu` — add custom menu items to the main menu (sidebar) by providing a `menu` array in the config.
  Each `menu` item can contain the following fields:

  | Field | Required | Description |
  |---|---|---|
  | `label` | ✅ Yes | The text to display in the menu |
  | `icon` | No | Icon name from [src/utils/icons.ts](../src/utils/icons.ts); falls back to a default icon |
  | `url` | ✅ Yes | The URL to navigate to when the menu item is clicked |

  [More details](custom-menu.md)

## 📋 Examples

### config.json

```json
{
  "restrictBaseUrl": [
    "https://matrix.example.com",
    "https://synapse.example.net"
  ],
  "asManagedUsers": [
    "^@baibot:example\\.com$",
    "^@slackbot:example\\.com$",
    "^@slack_[a-zA-Z0-9\\-]+:example\\.com$",
    "^@telegrambot:example\\.com$",
    "^@telegram_[a-zA-Z0-9]+:example\\.com$"
  ],
  "menu": [
    {
      "label": "Contact support",
      "icon": "SupportAgent",
      "url": "https://github.com/etkecc/ketesa/issues"
    }
  ]
}
```

### `/.well-known/matrix/client`

```json
{
  "cc.etke.ketesa": {
    "restrictBaseUrl": [
      "https://matrix.example.com",
      "https://synapse.example.net"
    ],
    "asManagedUsers": [
      "^@baibot:example\\.com$",
      "^@slackbot:example\\.com$",
      "^@slack_[a-zA-Z0-9\\-]+:example\\.com$",
      "^@telegrambot:example\\.com$",
      "^@telegram_[a-zA-Z0-9]+:example\\.com$"
    ],
    "menu": [
      {
        "label": "Contact support",
        "icon": "SupportAgent",
        "url": "https://github.com/etkecc/ketesa/issues"
      }
    ]
  }
}
```
