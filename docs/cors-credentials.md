# CORS Credentials

If you'd like to use cookie-based authentication
(for example, [ForwardAuth with Authelia](https://github.com/Awesome-Technologies/synapse-admin/issues/655)),
you can configure the `corsCredentials` option in the `config.json` file or in the `/.well-known/matrix/client` file.

## Configuration

> [Documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials)

The `corsCredentials` option accepts the following values:

* `same-origin` (default): Cookies will be sent only if the request is made from the same origin as the server.
* `include`: Cookies will be sent regardless of the origin of the request.
* `omit`: Cookies will not be sent with the request.

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
  "cc.etke.synapse-admin": {
    "corsCredentials": "include"
  }
}
```
