# External Auth Provider

When you use an external authentication provider (like OIDC, LDAP, etc.) your Ketesa API acts differently,
but unfortunately, the API does not expose which provider is used (and if it is used at all), especially if you use a
seamless/hidden password provider that does not announce itself.

To work around such cases, the `externalAuthProvider` config option can be set to `true` to change Ketesa's
behavior to better suit setups with external auth providers. Currently, the following changes are made:
* Do not require a new password when reactivating a user
* Do not show the guests filter in the users list

Note: For OIDC ("next-gen auth"), Ketesa adjusts its behavior automatically, so this config option is not required.

## Matrix Authentication Service (MAS)

When Synapse uses Matrix Authentication Service (MAS) for OIDC, Ketesa uses the MAS admin API for registration
token management. The MAS admin API is not exposed by default, so it must be reachable from the Ketesa UI.
If the MAS admin API is not exposed, registration token list/create/update/delete operations will fail.

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

This method is used in Ketesa's [Docker images (dist)](../Dockerfile) and [Docker image
(build)](../Dockerfile.build) and is recommended for production deployments.

## Configuration

`externalAuthProvider` accepts a boolean value:
* `true`: Enable external auth provider mode
* `false` (default): Disable external auth provider mode

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
