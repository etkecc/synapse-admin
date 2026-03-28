# 🏠 Restricting Available Homeservers

By default, Ketesa lets users connect to any Matrix homeserver. For managed deployments, you'll usually want to lock this down so the homeserver field is either hidden or pre-fixed to a known value.

**Common use cases:**

- **Managed hosting** — you deploy Ketesa specifically for one server and don't want users accidentally pointing it at another
- **Public Ketesa instance** — you run `admin.example.com` and want it to only ever talk to `matrix.example.com`
- **Multi-server management** — you manage several homeservers and want to allow exactly those, blocking everything else

When `restrictBaseUrl` is set to a single value, the homeserver field on the login page is pre-filled and locked. When set to an array, users can only choose from that list.

## ⚙️ Configuration

`restrictBaseUrl` accepts both a single string and an array of strings.

> 💡 **Note:** Use the _actual_ homeserver URL, not the delegated one. For example, if you have a homeserver `example.com` where users have MXIDs like `@user:example.com`, but actual Synapse is installed on `matrix.example.com` subdomain, you should use `https://matrix.example.com` in the configuration.

The examples below contain the configuration settings to restrict the Ketesa instance to work only with `example.com` (with Synapse running at `matrix.example.com`) and `example.net` (with Synapse running at `synapse.example.net`) homeservers.

[Configuration options](config.md)

### config.json

```json
{
  "restrictBaseUrl": [
    "https://matrix.example.com",
    "https://synapse.example.net"
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
    ]
  }
}
```
