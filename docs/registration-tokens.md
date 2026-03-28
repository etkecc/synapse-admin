# 🎟️ Registration Tokens

Registration tokens are invite codes that users must provide during account registration. They let you control who can sign up on your server — useful for private or invite-only communities, onboarding specific groups, or preventing open registration while still allowing specific users to join.

Each token can be used a limited or unlimited number of times, and can optionally expire after a set datetime. The admin UI supports registration tokens for both **Synapse** and **MAS** (Matrix Authentication Service) backends.

---

## 🔀 Synapse vs MAS

The features available for registration tokens depend on which authentication backend your homeserver uses.

| Feature | Synapse | MAS |
|---|---|---|
| Usage counter (`uses_allowed`) | ✅ | ✅ |
| Expiry datetime (`expiry_time`) | ✅ | ✅ |
| Pending uses (`pending`) | ✅ | ✅ |
| Completed uses (`completed`) | ✅ | ✅ |
| Creation timestamp (`created_at`) | ❌ | ✅ |
| Last-used timestamp (`last_used_at`) | ❌ | ✅ |
| Revocation timestamp (`revoked_at`) | ❌ | ✅ |
| Revoke / unrevoke | ❌ | ✅ |
| Delete | ✅ | ❌ |

> 📝 Which backend is active depends on your homeserver configuration. See [External auth provider](./external-auth-provider.md).

---

## 📋 Token Fields

| Field | Backend | Editable | Description |
|---|---|---|---|
| `token` | Both | No | The token string users enter during registration. Consists of characters `A-Z`, `a-z`, `0-9`, `.`, `_`, `~`, `-`, up to 64 characters. |
| `uses_allowed` | Both | Yes | Maximum number of times this token may be used. Leave empty for unlimited uses. |
| `pending` | Both | No | Number of registrations that started using this token but have not yet completed. |
| `completed` | Both | No | Number of registrations that successfully completed using this token. |
| `expiry_time` | Both | Yes | Date and time after which the token is no longer valid. Leave empty for no expiry. |
| `created_at` | MAS only | No | Timestamp when the token was created. |
| `last_used_at` | MAS only | No | Timestamp when the token was last used for a registration. |
| `revoked_at` | MAS only | No | Timestamp when the token was revoked. Empty if the token has not been revoked. |

> 💡 On mobile, the token list shows `token`, `uses_allowed`, `completed`, and `expiry_time`. All fields are available in the detail/edit view.

---

## ➕ How to Create a Token

1. Navigate to **Registration Tokens** in the sidebar.
2. Click **Create**.
3. Fill in the form fields as needed (all fields are optional — you can save immediately to generate a token with default settings):

   | Field | Required | Notes |
   |---|---|---|
   | `token` | No | A custom token string. Must match `^[A-Za-z0-9._~-]{0,64}$`. If left empty, a token is auto-generated. |
   | `length` | No | Length of the auto-generated token (max 64). Only applies when `token` is not specified. |
   | `uses_allowed` | No | Maximum number of registrations allowed. Leave empty for unlimited. |
   | `expiry_time` | No | Date and time when the token expires. Leave empty for no expiry. |

4. Click **Save**.

> 💡 If you leave all fields empty and click **Save**, the server will auto-generate a random token with unlimited uses and no expiry.

> ⚠️ The `length` field only takes effect when `token` is empty. If you provide a custom `token` string, `length` is ignored.

---

## ✏️ How to Edit a Token

1. Navigate to **Registration Tokens** in the sidebar.
2. Click on the token you want to edit.
3. Modify the editable fields:

   | Field | Editable | Notes |
   |---|---|---|
   | `token` | No | Read-only after creation. |
   | `pending` | No | Reflects live registration state. |
   | `completed` | No | Reflects live registration state. |
   | `uses_allowed` | Yes | Update to change the usage cap. Set to empty for unlimited. |
   | `expiry_time` | Yes | Update or clear to change when the token expires. |
   | `created_at` | No | MAS only. Set at creation time. |
   | `last_used_at` | No | MAS only. Updated automatically. |
   | `revoked_at` | No | MAS only. Reflects revocation state. |

4. Click **Save**.

> 📝 Usage counters (`pending`, `completed`) are read-only and updated automatically by the server as registrations proceed.

---

## 🚫 How to Revoke a MAS Token (and Unrevoke)

Revoking a token immediately prevents it from being used for new registrations, without deleting it. The token remains visible in the list and its usage history is preserved.

**To revoke:**

1. Open the token in the edit view.
2. Click **Revoke** in the toolbar.
3. The `revoked_at` field will be populated with the current timestamp.

**To unrevoke:**

1. Open a revoked token in the edit view.
2. Click **Unrevoke** in the toolbar.
3. The `revoked_at` field will be cleared and the token becomes valid again (subject to its `uses_allowed` and `expiry_time` constraints).

> 💡 Use revoke instead of delete when you want to retain a record of the token and its usage history, or when you may want to re-enable it later.

> ⚠️ Revoke and unrevoke are only available on the MAS backend. Synapse tokens use delete instead.

---

## 🗑️ How to Delete a Synapse Token

Deleting a token permanently removes it from the server. This action cannot be undone.

**From the list view:**

1. Navigate to **Registration Tokens** in the sidebar.
2. On mobile, use the delete button shown in the token row. On desktop, open the token and use the **Delete** button in the edit toolbar.

**From the edit view:**

1. Open the token you want to delete.
2. Click **Delete** in the toolbar.
3. Confirm the deletion in the dialog.

> ⚠️ Deletion is permanent. If you need to keep a record of the token or may want to re-enable it later, consider using a token with `uses_allowed` set to `0` or setting an `expiry_time` in the past instead.

> 📝 Delete is only available on the Synapse backend. MAS tokens use revoke instead.

---

## 🔍 Filtering the Token List

The token list includes a **Valid** filter that controls which tokens are shown.

| Filter value | Tokens shown |
|---|---|
| **Valid: Yes** (default) | Tokens that are currently usable — not expired, not fully used, and not revoked (MAS). |
| **Valid: No** | Tokens that are expired, fully used, or revoked (MAS). |
| *(filter cleared)* | All tokens regardless of validity. |

> 💡 The list defaults to showing only valid tokens. Toggle or clear the **Valid** filter to see expired or exhausted tokens.

---

**See also:** [External auth provider / MAS](./external-auth-provider.md) · [Documentation index](./README.md)
