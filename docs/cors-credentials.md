# 🔐 CORS Credentials

Controls how Ketesa sends cookies and credentials when making API requests. Most deployments don't need to touch this — the default works fine for standard setups. You'll typically only need it when adding a reverse-proxy authentication layer in front of your homeserver.

**When to change it:**

- **`include`** — use this when you have cookie-based auth in front of your homeserver (e.g., [ForwardAuth with Authelia](https://github.com/Awesome-Technologies/synapse-admin/issues/655)). Cookies will be forwarded with every request regardless of origin.
- **`omit`** — use this if your setup explicitly must not send any cookies (rare; usually for strict security policies).
- **`same-origin`** — the default; works for the vast majority of deployments.

## ⚙️ Configuration

> 📚 [MDN reference: credentials option](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials)

| Value | When to use | Behavior |
|-------|-------------|----------|
| `same-origin` *(default)* | Standard deployments | Cookies sent only for same-origin requests |
| `include` | Cookie-based auth (ForwardAuth, Authelia, etc.) | Cookies sent with every request |
| `omit` | Strict no-cookie policies | Cookies never sent |

[Configuration options](config.md)

### config.json

```json
{
  "corsCredentials": "include"
}
```

### `/.well-known/matrix/client`

```json
{
  "cc.etke.ketesa": {
    "corsCredentials": "include"
  }
}
```
