# External Auth Provider

When you use an external authentication provider (like OIDC, LDAP, etc.) your Synapse Admin API acts differently,
but unfortunately, the API does not expose which provider is used (and if it is used at all), especially if you use a
seamless/hidden password provider that does not announce itself.

To workaround such cases, the `externalAuthProvider` config option can be set to `true` to change Synapse Admin's
behavior to better suit setups with external auth providers. Currently, the following changes are made:
* Do not require a new password when reactivating a user
* Do not show guests filter in the users list

Note: for OIDC ("next-gen auth"), Synapse Admin adjusts its behavior automatically, so this config option is not required.

## Matrix Authentication Service (MAS)

When Synapse uses Matrix Authentication Service (MAS) for OIDC, Synapse Admin uses the MAS admin API for registration
token management. The MAS admin API is not exposed by default, so it must be reachable from the Synapse Admin UI.
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
Depending on your deployment method of Synapse Admin, you may need to either configure your web server to fallback to
`index.html` for this endpoint, or copy the `index.html` file to `auth-callback/index.html` to ensure the endpoint works
correctly.

**Option 1: Web server fallback**

If you are using a web server (like nginx) to serve the Synapse Admin UI, you can configure it to fallback to
`index.html` for the `/auth-callback` endpoint. For example, in nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

This method is used in Synapse Admin's [Docker image (dist)](../Dockerfile) / [Docker image
(build)](../Dockerfile.build) and is recommended for production deployments.

**Option 2: Copy index.html**

Alternatively, you can copy the `index.html` file to `auth-callback/index.html` in the Synapse Admin UI build directory. This way, when the `/auth-callback` endpoint is accessed, it will serve the correct HTML file without needing additional web server configuration.

```bash
cp index.html auth-callback/index.html
sed -i "s|./|/|g" auth-callback/index.html # Adjust relative paths in the copied index.html
```

This method is used in Synapse Admin's CDN deployment.

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
  "cc.etke.synapse-admin": {
    "externalAuthProvider": true
  }
}
```
