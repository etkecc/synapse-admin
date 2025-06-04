# Restricting available homeserver

If you want to have your Synapse Admin instance work only with specific homeserver(-s),
you can do that by setting `restrictBaseUrl` in the configuration.

## Configuration

You can do that for a single homeserver or multiple homeservers at once, as `restrictBaseUrl` accepts both a string and
an array of strings.

The examples below contain the configuration settings to restrict the Synapse Admin instance to work only with
`example.com` (with Synapse running at `matrix.example.com`) and
`example.net` (with Synapse running at `synapse.example.net`) homeservers.
Note that the homeserver URL should be the _actual_ homeserver URL, and not the delegated one.

So, if you have a homeserver `example.com` where users have MXIDs like `@user:example.com`,
but actual Synapse is installed on `matrix.example.com` subdomain, you should use `https://matrix.example.com` in the
configuration.

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
  "cc.etke.synapse-admin": {
    "restrictBaseUrl": [
      "https://matrix.example.com",
      "https://synapse.example.net"
    ]
  }
}
```
