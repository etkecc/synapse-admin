# Prefilling the Login Form

In some cases you may wish to prefill/preset the login form fields when sharing a link to a Synapse Admin instance.
This can be done in two ways:

1. **Using URL query parameters** when sharing a link
2. **Using Docker environment variables** for permanent configuration (Docker only)

## URL Query Parameters

You can add the following query parameters to the URL:

* `username` - The username to prefill in the username field.
* `server` - The server to prefill in the homeserver url field.

The following query params will work only if the Synapse Admin is loaded from `localhost` or `127.0.0.1`:

* `password` - The password to prefill in the password field (credentials auth). **NEVER** use this in production.
* `accessToken` - The access token to prefill in the access token field (access token auth). **NEVER** use this in production.

> **WARNING**: Never use the `password` or `accessToken` query parameters in production as they can be easily extracted
from the URL. These are only meant for development purposes and local environments.

## Docker Environment Variables

For permanent configuration when using Docker, you can use the `SERVER_URL` environment variable:

```bash
# Prefill server URL in login form
docker run -p 8080:80 -e SERVER_URL="https://matrix.example.com" ghcr.io/etkecc/synapse-admin
```

This will permanently set the homeserver URL field to `https://matrix.example.com` for all users accessing this instance.

See [Configuration](config.md#docker-environment-variables) for more details about Docker environment variables.

## Examples

### URL Query Parameters - Production

```bash
https://admin.etke.cc?username=admin&server=https://matrix.example.com
```

This will open `Credentials` (username/password) login form with the username field prefilled with `admin` and the
Homeserver URL field prefilled with `https://matrix.example.com`.

### URL Query Parameters - Development and Local environments

**With Password**

```bash
http://localhost:8080?username=admin&server=https://matrix.example.com&password=secret
```

This will open `Credentials` (username/password) login form with the username field prefilled with `admin`, the
Homeserver URL field prefilled with `https://matrix.example.com` and the password field prefilled with `secret`.


**With Access Token**

```bash
http://localhost:8080?server=https://matrix.example.com&accessToken=secret
```

This will open `Access Token` login form with the Homeserver URL field prefilled with `https://matrix.example.com` and
the access token field prefilled with `secret`.
