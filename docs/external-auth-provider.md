# 🔑 External Auth Provider

When Synapse delegates authentication to an external provider (OIDC, LDAP, and similar), the Synapse API doesn't announce which provider is in use — especially with seamless/hidden password providers that don't announce themselves. Ketesa needs a hint to adapt its interface accordingly.

Setting `externalAuthProvider: true` tells Ketesa to adjust its behavior for these setups. Currently, it makes the following changes:

- **No password required when reactivating a user** — because the password lives in the external provider, not in Synapse
- **Hides the guests filter** in the users list — external auth providers typically don't support guest accounts

> 📝 **Note:** For OIDC ("next-gen auth" / MAS), Ketesa adjusts its behavior automatically — this config option is not required for those setups.

## 🔐 Matrix Authentication Service (MAS)

When Synapse uses Matrix Authentication Service (MAS) for OIDC, Ketesa detects this automatically and activates
the full MAS integration: registration token management, the MAS user management panel (sessions, emails,
upstream OAuth links, policy data), and adapted create/edit workflows for users.
See the [MAS user management guide](./user-management.md#-mas-user-management) for the full feature list.

Ketesa detects MAS by probing two endpoints in parallel when you enter a homeserver URL:

- `/_matrix/client/v3/login` — checks for the `org.matrix.msc3824.delegated_oidc_compatibility` flag on the SSO flow
- `/_matrix/client/v1/auth_metadata` — the stable OAuth 2.0 server metadata endpoint defined in [Matrix spec v1.14](https://spec.matrix.org/v1.18/client-server-api/#get_matrixclientv1auth_metadata)

Either signal is sufficient to enable the OIDC login button. This means Ketesa correctly handles both configurations:
- Synapse with MAS where `/_matrix/client/v3/login` is **disabled** (the default MAS behaviour, which previously caused the OIDC button not to appear)
- Synapse with MAS where `/_matrix/client/v3/login` is still active and advertises the MSC3824 flag

The MAS admin API is not exposed by default, so it must be reachable from the Ketesa UI.

> ⚠️ **Warning:** If the MAS admin API is not exposed, MAS-specific operations (registration tokens, sessions, emails, etc.) will fail.

```yaml
http:
  listeners:
  - name: web
    resources:
    # ...
    - name: adminapi # Add this
    binds:
    - address: '0.0.0.0:8080'
# ...
```

### /auth-callback

When using MAS, the `/auth-callback` endpoint is used for handling OIDC callbacks.
The Ketesa build includes a dedicated `auth-callback/index.html`, so this endpoint is served as a real static
page and does not require SPA fallbacks or copying `index.html`.

**Web server configuration**

If you are using a web server (like nginx) to serve the Ketesa UI, make sure the `/auth-callback` path serves
`auth-callback/index.html` from the build output. A standard static file config already does this. For example, in nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

> 💡 This method is used in Ketesa's [Docker images (dist)](../docker/Dockerfile) and [Docker image (build)](../docker/Dockerfile.build) and is recommended for production deployments.

## ⚙️ Configuration

`externalAuthProvider` accepts a boolean value:

| Value | Behavior |
|---|---|
| `true` | Enable external auth provider mode |
| `false` (default) | Disable external auth provider mode |

[Configuration options](config.md)

### config.json

```json
{
  "externalAuthProvider": true
}
```

### `/.well-known/matrix/client`

```json
{
  "cc.etke.ketesa": {
    "externalAuthProvider": true
  }
}
```
