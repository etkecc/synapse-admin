# 🔍 Well-Known Discovery

By default, Ketesa resolves the homeserver URL you enter on the login page via `/.well-known/matrix/client`, replacing it with the `m.homeserver.base_url` value advertised by the server. This follows the [Matrix spec](https://spec.matrix.org/v1.17/client-server-api/#getwell-knownmatrixclient) and is the correct behavior for most setups.

The same lookup runs when you type a full Matrix ID (e.g. `@user:example.com`) — Ketesa fetches well-known for `example.com` and auto-fills the homeserver URL field.

## When to disable

Some deployments restrict access to `/_synapse/admin` to a separate domain that is **not** advertised in well-known — for example, a VPN-only endpoint. In these cases the automatic URL rewrite replaces your intended admin domain with the public Matrix URL, making it impossible to connect.

Setting `wellKnownDiscovery: false` disables this rewrite:

- The homeserver URL field is **not** modified after entry — what you type is what gets used.
- When you type a full Matrix ID, the homeserver URL is derived directly from the MXID domain (`https://<domain>`) without a well-known lookup.

> 📝 **Note:** This only affects URL canonicalization on the login page. Ketesa configuration (e.g. `restrictBaseUrl`, `menu`) is still loaded from `/.well-known/matrix/client` as usual.

## ⚙️ Configuration

`wellKnownDiscovery` accepts a boolean value:

| Value | Behavior |
|---|---|
| `true` (default) | Resolve homeserver URL via `/.well-known/matrix/client` |
| `false` | Use the entered URL as-is, skip well-known lookup |

[Configuration options](config.md)

### config.json

```json
{
  "wellKnownDiscovery": false
}
```

### `/.well-known/matrix/client`

```json
{
  "cc.etke.ketesa": {
    "wellKnownDiscovery": false
  }
}
```
