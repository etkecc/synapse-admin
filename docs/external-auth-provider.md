# External Auth Provider

When you use an external authentication provider (like OIDC, LDAP, etc.) your Synapse Admin API acts differently,
but unfortunately, the API does not expose which provider is used (and if it is used at all), especially if you use a
seamless/hidden password provider that does not announce itself.

To workaround such cases, the `externalAuthProvider` config option can be set to `true` to change Synapse Admin's
behavior to better suit setups with external auth providers. Currently, the following changes are made:
* Do not require a new password when reactivating a user
* Do not show guests filter in the users list

Note: for OIDC ("next-gen auth"), Synapse Admin adjusts its behavior automatically, so this config option is not required.

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
