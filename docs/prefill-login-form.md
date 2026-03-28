# 🔗 Prefilling the Login Form

Ketesa's login form can be pre-populated via URL query parameters — handy for sharing a direct-access link that drops users straight into the right homeserver, or for bookmarking your admin setup.

**Common use cases:**
- Share a link with your homeserver pre-filled so users don't have to type it: `https://admin.etke.cc?server=https://matrix.example.com`
- Pre-fill both username and server for faster login: `https://admin.etke.cc?username=admin&server=https://matrix.example.com`
- In development, pre-fill all credentials so you don't have to retype them every time

## 📋 Query Parameters

### Always Available

| Parameter | Description |
|-----------|-------------|
| `username` | The username to prefill in the username field. |
| `server` | The server to prefill in the homeserver URL field. |

### Localhost Only

> ⚠️ **Warning:** The following parameters only work when Ketesa is loaded from `localhost` or `127.0.0.1`. Never use these in production as they can be easily extracted from the URL. These are only meant for development purposes and local environments.

| Parameter | Description |
|-----------|-------------|
| `password` | The password to prefill in the password field (credentials auth). |
| `accessToken` | The access token to prefill in the access token field (access token auth). |

## 📖 Examples

### Production

```bash
https://admin.etke.cc?username=admin&server=https://matrix.example.com
```

This will open the `Credentials` (username/password) login form with the username field prefilled with `admin` and the Homeserver URL field prefilled with `https://matrix.example.com`.

### Development and Local Environments

#### With Password

```bash
http://localhost:8080?username=admin&server=https://matrix.example.com&password=secret
```

This will open the `Credentials` (username/password) login form with the username field prefilled with `admin`, the Homeserver URL field prefilled with `https://matrix.example.com`, and the password field prefilled with `secret`.

#### With Access Token

```bash
http://localhost:8080?server=https://matrix.example.com&accessToken=secret
```

This will open the `Access Token` login form with the Homeserver URL field prefilled with `https://matrix.example.com` and the access token field prefilled with `secret`.
