# Supported APIs

Synapse Admin uses various APIs to manage Matrix homeservers and related services.
This document lists all supported APIs and their usage status.

> **Note:** This file was compiled based on Synapse v1.149.1 and MAS v1.13.0 documentation.
> It is not updated often and is provided just for reference purposes.

Legend: ✅ fully implemented, 🟡 in progress, ❌ not implemented, ⏭️ superseded (newer version available)


<!-- vim-markdown-toc GFM -->

* [🟡 Synapse Admin API](#-synapse-admin-api)
    * [✅ Server Version](#-server-version)
    * [✅ Users](#-users)
    * [✅ User Devices](#-user-devices)
    * [✅ Rooms](#-rooms)
    * [✅ Registration Tokens](#-registration-tokens)
    * [✅ Media](#-media)
    * [✅ Event Reports](#-event-reports)
    * [✅ Server Notices](#-server-notices)
    * [✅ Federation](#-federation)
    * [✅ Experimental Features](#-experimental-features)
    * [🟡 Statistics](#-statistics)
    * [✅ Account Validity](#-account-validity)
    * [✅ Purge History](#-purge-history)
    * [✅ Fetch Event](#-fetch-event)
    * [⏭️ Register (Shared-Secret Registration) — superseded](#-register-shared-secret-registration--superseded)
    * [✅ Room Membership](#-room-membership)
    * [✅ Scheduled Tasks](#-scheduled-tasks)
    * [✅ Client-Server API Extensions](#-client-server-api-extensions)
* [🟡 Matrix Authentication Service (MAS) Admin API](#-matrix-authentication-service-mas-admin-api)
    * [✅ OAuth 2.0](#-oauth-20)
    * [✅ Server](#-server)
    * [✅ Registration Tokens](#-registration-tokens-1)
    * [✅ Users](#-users-1)
    * [✅ User Emails](#-user-emails)
    * [✅ Compat Sessions](#-compat-sessions)
    * [✅ OAuth 2.0 Sessions](#-oauth-20-sessions)
    * [✅ Personal Sessions](#-personal-sessions)
    * [✅ Browser Sessions](#-browser-sessions)
    * [✅ Upstream OAuth Links](#-upstream-oauth-links)
    * [✅ Upstream OAuth Providers](#-upstream-oauth-providers)
    * [✅ Policy Data](#-policy-data)

<!-- vim-markdown-toc -->

## 🟡 Synapse Admin API

[Synapse Admin API documentation](https://element-hq.github.io/synapse/latest/usage/administration/admin_api/index.html)

### ✅ Server Version

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/server_version` | GET | Get running Synapse version | ✅ |

### ✅ Users

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v2/users` | GET | List all local user accounts | ⏭️ |
| `/_synapse/admin/v3/users` | GET | List all local user accounts (v3) | ✅ |
| `/_synapse/admin/v2/users/<user_id>` | GET | Query user account details | ✅ |
| `/_synapse/admin/v2/users/<user_id>` | PUT | Create or modify user account | ✅ |
| `/_synapse/admin/v1/whois/<user_id>` | GET | Query user sessions/connections | ✅ |
| `/_synapse/admin/v1/deactivate/<user_id>` | POST | Deactivate/erase user account | ✅ |
| `/_synapse/admin/v1/suspend/<user_id>` | PUT | Suspend or unsuspend user | ✅ |
| `/_synapse/admin/v1/reset_password/<user_id>` | POST | Reset user password | ✅ |
| `/_synapse/admin/v1/users/<user_id>/admin` | GET | Check if user is admin | ⏭️ |
| `/_synapse/admin/v1/users/<user_id>/admin` | PUT | Change user admin status | ⏭️ |
| `/_synapse/admin/v1/users/<user_id>/joined_rooms` | GET | List user's joined rooms | ✅ |
| `/_synapse/admin/v1/users/<user_id>/memberships` | GET | List user's room memberships | ✅ |
| `/_synapse/admin/v1/users/<user_id>/media` | GET | List media uploaded by user | ✅ |
| `/_synapse/admin/v1/users/<user_id>/media` | DELETE | Delete all media uploaded by user | ✅ |
| `/_synapse/admin/v1/users/<user_id>/accountdata` | GET | Get user account data | ✅ |
| `/_synapse/admin/v1/users/<user_id>/pushers` | GET | List user pushers | ✅ |
| `/_synapse/admin/v1/users/<user_id>/override_ratelimit` | GET | Get user ratelimit overrides | ✅ |
| `/_synapse/admin/v1/users/<user_id>/override_ratelimit` | POST | Set user ratelimit overrides | ✅ |
| `/_synapse/admin/v1/users/<user_id>/override_ratelimit` | DELETE | Delete user ratelimit overrides | ✅ |
| `/_synapse/admin/v1/users/<user_id>/login` | POST | Login as user (get access token) | ✅ |
| `/_synapse/admin/v1/users/<user_id>/shadow_ban` | POST | Shadow-ban a user | ✅ |
| `/_synapse/admin/v1/users/<user_id>/shadow_ban` | DELETE | Remove shadow-ban from user | ✅ |
| `/_synapse/admin/v1/users/<user_id>/_allow_cross_signing_replacement_without_uia` | POST | Allow cross-signing replacement without UIA | ✅ |
| `/_synapse/admin/v1/users/<user_id>/sent_invite_count` | GET | Count invites sent by user | ✅ |
| `/_synapse/admin/v1/users/<user_id>/cumulative_joined_room_count` | GET | Cumulative joined room count | ✅ |
| `/_synapse/admin/v1/username_available` | GET | Check username availability | ✅ |
| `/_synapse/admin/v1/auth_providers/<provider>/users/<external_id>` | GET | Find user by auth provider ID | ✅ |
| `/_synapse/admin/v1/threepid/<medium>/users/<address>` | GET | Find user by third-party ID | ✅ |
| `/_synapse/admin/v1/user/<user_id>/redact` | POST | Redact all events from a user | ✅ |
| `/_synapse/admin/v1/user/redact_status/<redact_id>` | GET | Check user redaction status | ✅ |

### ✅ User Devices

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v2/users/<user_id>/devices` | GET | List all devices for user | ✅ |
| `/_synapse/admin/v2/users/<user_id>/devices` | POST | Create a device for user | ✅ |
| `/_synapse/admin/v2/users/<user_id>/devices/<device_id>` | GET | Get single device info | ⏭️ |
| `/_synapse/admin/v2/users/<user_id>/devices/<device_id>` | PUT | Update device metadata | ✅ |
| `/_synapse/admin/v2/users/<user_id>/devices/<device_id>` | DELETE | Delete a device | ✅ |
| `/_synapse/admin/v2/users/<user_id>/delete_devices` | POST | Delete multiple devices | ✅ |

### ✅ Rooms

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/rooms` | GET | List rooms on server | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>` | GET | Get room details | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/members` | GET | Get room members | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/state` | GET | Get room state events | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/messages` | GET | Get messages from a room | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/timestamp_to_event` | GET | Find event by timestamp | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/context/<event_id>` | GET | Get event context | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/hierarchy` | GET | Get space/room hierarchy | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/block` | PUT | Block or unblock a room | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>/block` | GET | Get room block status | ✅ |
| `/_synapse/admin/v1/rooms/<room_id>` | DELETE | Delete a room (v1, synchronous) | ⏭️ |
| `/_synapse/admin/v2/rooms/<room_id>` | DELETE | Delete a room (v2, asynchronous) | ✅ |
| `/_synapse/admin/v2/rooms/<room_id>/delete_status` | GET | Query room delete status | ⏭️ |
| `/_synapse/admin/v2/rooms/delete_status/<delete_id>` | GET | Query delete status by ID | ✅ |
| `/_synapse/admin/v1/rooms/<room_id_or_alias>/make_room_admin` | POST | Grant user highest power level | ✅ |
| `/_synapse/admin/v1/rooms/<room_id_or_alias>/forward_extremities` | GET | Check forward extremities | ✅ |
| `/_synapse/admin/v1/rooms/<room_id_or_alias>/forward_extremities` | DELETE | Delete forward extremities | ✅ |

### ✅ Registration Tokens

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/registration_tokens` | GET | List all registration tokens | ✅ |
| `/_synapse/admin/v1/registration_tokens/<token>` | GET | Get specific registration token | ✅ |
| `/_synapse/admin/v1/registration_tokens/new` | POST | Create a registration token | ✅ |
| `/_synapse/admin/v1/registration_tokens/<token>` | PUT | Update a registration token | ✅ |
| `/_synapse/admin/v1/registration_tokens/<token>` | DELETE | Delete a registration token | ✅ |

### ✅ Media

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/room/<room_id>/media` | GET | List all media in a room | ✅ |
| `/_synapse/admin/v1/media/<origin>/<media_id>` | GET | Query media by ID | ⏭️ |
| `/_synapse/admin/v1/media/<server_name>/<media_id>` | DELETE | Delete specific local media | ✅ |
| `/_synapse/admin/v1/media/delete` | POST | Delete local media by date or size | ✅ |
| `/_synapse/admin/v1/media/<server_name>/delete` | POST | Delete local media by date or size (deprecated) | ⏭️ |
| `/_synapse/admin/v1/purge_media_cache` | POST | Purge old cached remote media | ✅ |
| `/_synapse/admin/v1/media/quarantine/<server_name>/<media_id>` | POST | Quarantine media by ID | ✅ |
| `/_synapse/admin/v1/media/unquarantine/<server_name>/<media_id>` | POST | Remove media from quarantine | ✅ |
| `/_synapse/admin/v1/room/<room_id>/media/quarantine` | POST | Quarantine all media in a room | ✅ |
| `/_synapse/admin/v1/quarantine_media/<room_id>` | POST | Quarantine room media (deprecated) | ⏭️ |
| `/_synapse/admin/v1/user/<user_id>/media/quarantine` | POST | Quarantine all media of a user | ✅ |
| `/_synapse/admin/v1/media/protect/<media_id>` | POST | Protect media from quarantine | ✅ |
| `/_synapse/admin/v1/media/unprotect/<media_id>` | POST | Unprotect media from quarantine | ✅ |

### ✅ Event Reports

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/event_reports` | GET | List reported events | ✅ |
| `/_synapse/admin/v1/event_reports/<report_id>` | GET | Get specific event report details | ✅ |
| `/_synapse/admin/v1/event_reports/<report_id>` | DELETE | Delete a specific event report | ✅ |

### ✅ Server Notices

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/send_server_notice` | POST | Send a server notice to a user | ✅ |
| `/_synapse/admin/v1/send_server_notice/{txnId}` | PUT | Send server notice with transaction ID | ⏭️ |

### ✅ Federation

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/federation/destinations` | GET | List federation destinations | ✅ |
| `/_synapse/admin/v1/federation/destinations/<destination>` | GET | Get destination details | ✅ |
| `/_synapse/admin/v1/federation/destinations/<destination>/rooms` | GET | List rooms for destination | ✅ |
| `/_synapse/admin/v1/federation/destinations/<destination>/reset_connection` | POST | Reset federation connection | ✅ |

### ✅ Experimental Features

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/experimental_features/<user_id>` | GET | List experimental features for user | ✅ |
| `/_synapse/admin/v1/experimental_features/<user_id>` | PUT | Enable/disable experimental features | ✅ |

### 🟡 Statistics

Largest rooms by database size - [#1082](https://github.com/etkecc/synapse-admin/pull/1082)

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/statistics/users/media` | GET | Get users' media usage statistics | ✅ |
| `/_synapse/admin/v1/statistics/database/rooms` | GET | Get largest rooms by database size | 🟡 |

### ✅ Account Validity

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/account_validity/validity` | POST | Renew account validity | ✅ |

### ✅ Purge History

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/purge_history/<room_id>[/<event_id>]` | POST | Purge room history | ✅ |
| `/_synapse/admin/v1/purge_history_status/<purge_id>` | GET | Query purge status | ✅ |

### ✅ Fetch Event

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/fetch_event/<event_id>` | GET | Fetch event by ID | ✅ |

### ⏭️ Register (Shared-Secret Registration) — superseded

Superseded: redundant with existing user creation via User Admin API (already implemented). Shared-secret registration is designed for CLI bootstrapping without an admin token — pointless when already authenticated in synapse-admin.

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/register` | GET | Get registration nonce | ⏭️ |
| `/_synapse/admin/v1/register` | POST | Create user via shared-secret | ⏭️ |

### ✅ Room Membership

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/join/<room_id_or_alias>` | POST | Join a user to a room | ✅ |

### ✅ Scheduled Tasks

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_synapse/admin/v1/scheduled_tasks` | GET | Show scheduled tasks | ✅ |

### ✅ Client-Server API Extensions

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/_matrix/client/v3/user/<user_id>/account_data/io.element.synapse.admin_client_config` | GET | Get admin client configuration | ✅ |
| `/_matrix/client/v3/user/<user_id>/account_data/io.element.synapse.admin_client_config` | PUT | Set admin client configuration | ✅ |

## 🟡 Matrix Authentication Service (MAS) Admin API

[MAS Admin API specification](https://element-hq.github.io/matrix-authentication-service/api/spec.json)

### ✅ OAuth 2.0

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/oauth2/token` | POST | Refresh access token | ✅ |

### ✅ Server

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/site-config` | GET | Retrieve instance configuration | ✅ |
| `/api/admin/v1/version` | GET | Retrieve the currently running version | ✅ |

### ✅ Registration Tokens

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/user-registration-tokens` | GET | List registration tokens | ✅ |
| `/api/admin/v1/user-registration-tokens/{id}` | GET | Get a registration token | ✅ |
| `/api/admin/v1/user-registration-tokens` | POST | Create a registration token | ✅ |
| `/api/admin/v1/user-registration-tokens/{id}` | PUT | Update a registration token | ✅ |
| `/api/admin/v1/user-registration-tokens/{id}/revoke` | POST | Revoke a registration token | ✅ |
| `/api/admin/v1/user-registration-tokens/{id}/unrevoke` | POST | Unrevoke a registration token | ✅ |

### ✅ Users

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/users` | GET | List users | ✅ |
| `/api/admin/v1/users` | POST | Create a new user | ✅ |
| `/api/admin/v1/users/{id}` | GET | Get user by ID | ✅ |
| `/api/admin/v1/users/by-username/{username}` | GET | Get user by username | ⏭️ |
| `/api/admin/v1/users/{id}/set-password` | POST | Set user password | ✅ |
| `/api/admin/v1/users/{id}/set-admin` | POST | Toggle admin flag | ✅ |
| `/api/admin/v1/users/{id}/deactivate` | POST | Deactivate user | ✅ |
| `/api/admin/v1/users/{id}/reactivate` | POST | Reactivate user | ✅ |
| `/api/admin/v1/users/{id}/lock` | POST | Lock user | ✅ |
| `/api/admin/v1/users/{id}/unlock` | POST | Unlock user | ✅ |

### ✅ User Emails

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/user-emails` | GET | List user emails | ✅ |
| `/api/admin/v1/user-emails` | POST | Add email to user | ✅ |
| `/api/admin/v1/user-emails/{id}` | GET | Get email details | ✅ |
| `/api/admin/v1/user-emails/{id}` | DELETE | Remove email from user | ✅ |

### ✅ Compat Sessions

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/compat-sessions` | GET | List compatibility sessions | ✅ |
| `/api/admin/v1/compat-sessions/{id}` | GET | Get a compatibility session | ✅ |
| `/api/admin/v1/compat-sessions/{id}/finish` | POST | Terminate a compatibility session | ✅ |

### ✅ OAuth 2.0 Sessions

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/oauth2-sessions` | GET | List OAuth 2.0 sessions | ✅ |
| `/api/admin/v1/oauth2-sessions/{id}` | GET | Get an OAuth 2.0 session | ✅ |
| `/api/admin/v1/oauth2-sessions/{id}/finish` | POST | Terminate an OAuth 2.0 session | ✅ |

### ✅ Personal Sessions

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/personal-sessions` | GET | List personal sessions | ✅ |
| `/api/admin/v1/personal-sessions` | POST | Create a personal session | ✅ |
| `/api/admin/v1/personal-sessions/{id}` | GET | Get personal session details | ✅ |
| `/api/admin/v1/personal-sessions/{id}/revoke` | POST | Revoke a personal session | ✅ |
| `/api/admin/v1/personal-sessions/{id}/regenerate` | POST | Regenerate personal session token | ✅ |

### ✅ Browser Sessions

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/user-sessions` | GET | List browser sessions | ✅ |
| `/api/admin/v1/user-sessions/{id}` | GET | Get a browser session | ✅ |
| `/api/admin/v1/user-sessions/{id}/finish` | POST | Terminate a browser session | ✅ |

### ✅ Upstream OAuth Links

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/upstream-oauth-links` | GET | List upstream OAuth links | ✅ |
| `/api/admin/v1/upstream-oauth-links` | POST | Create an upstream OAuth link | ✅ |
| `/api/admin/v1/upstream-oauth-links/{id}` | GET | Get an upstream OAuth link | ✅ |
| `/api/admin/v1/upstream-oauth-links/{id}` | DELETE | Remove an upstream OAuth link | ✅ |

### ✅ Upstream OAuth Providers

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/upstream-oauth-providers` | GET | List upstream OAuth providers | ✅ |
| `/api/admin/v1/upstream-oauth-providers/{id}` | GET | Get an upstream OAuth provider | ✅ |

### ✅ Policy Data

| Endpoint | Method | Description | Status |
|----------|--------|-------------|:------:|
| `/api/admin/v1/policy-data` | POST | Set policy data | ✅ |
| `/api/admin/v1/policy-data/latest` | GET | Get latest policy data | ✅ |
| `/api/admin/v1/policy-data/{id}` | GET | Get policy data by ID | ⏭️ |
