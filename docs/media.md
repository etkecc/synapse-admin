# 🖼️ Media Management

Ketesa provides granular media controls at the file, user, and room level — useful for content moderation and storage management. You can quarantine harmful content, protect important media from accidental quarantine, delete individual files or entire user libraries, and purge the remote media cache.

---

## 🗂️ Concepts

| Operation | What it does | Reversible? |
|-----------|-------------|-------------|
| Quarantine | Blocks access to the media for all users | ✅ Yes (unquarantine) |
| Protect | Prevents the media from being quarantined | ✅ Yes (unprotect) |
| Delete | Permanently removes the media from the server | ❌ No |
| Purge remote cache | Removes locally cached copies of media fetched from remote servers | ❌ No |

> 📝 Quarantine and protect are mutually exclusive states for a single file. A protected file cannot be quarantined, and an already-quarantined file cannot be protected until it is first unquarantined.

---

## 📄 Per-file Operations

Per-file actions are available in two places:

- **User edit page → Media tab** — shows all media uploaded by the user, with per-row action buttons
- **Room show page → Media tab** — shows all media uploaded into the room, with a per-row delete button

The following buttons appear on each file row in the user Media tab:

| Button label | What it does | When it appears |
|--------------|-------------|-----------------|
| Quarantine | Quarantines the file, blocking all access | File is not protected and not already quarantined |
| Unquarantine | Lifts the quarantine on the file | File is currently quarantined |
| Protect | Marks the file as safe from quarantine | File is not quarantined and not already protected |
| Unprotect | Removes the protection flag | File is currently protected |
| Delete | Permanently deletes the individual file | Always visible |

> 📝 The quarantine button is replaced by a disabled "Protected" indicator when the file is safe from quarantine. The protect button is replaced by a disabled "In quarantine" indicator when the file is already quarantined.

---

## 👤 Per-user Operations

**Location:** Users → select a user → Edit → **Media** tab

The Media tab on the user edit page shows all media uploaded by that user, with per-file action buttons (see [Per-file Operations](#-per-file-operations) above).

At the top of the tab, bulk action buttons are available:

| Button label | What it does | When it appears |
|--------------|-------------|-----------------|
| Quarantine all media | Quarantines every media file uploaded by the user, after confirmation | Always visible |
| Delete all media | Permanently deletes every media file uploaded by the user, after confirmation | Always visible |

> ⚠️ **Quarantine all media** affects every file the user has ever uploaded to the server. This cannot be undone in bulk — you would need to unquarantine each file individually. Use with care.

> ⚠️ **Delete all media** permanently removes all media uploaded by the user. This cannot be undone. The dialog runs in the foreground — do not close it until deletion is complete.

---

## 🚪 Per-room Operations

**Location:** Rooms → select a room → Show → **Media** tab

The Media tab on the room show page lists all media uploaded into that room. Each row has an individual **Delete** button.

At the top of the tab, bulk action buttons are available:

| Button label | What it does | When it appears |
|--------------|-------------|-----------------|
| Quarantine all media | Quarantines every media file uploaded in the room, after confirmation | Always visible |
| Delete all media | Permanently deletes all local media in the room, after confirmation | Only for unencrypted rooms |

> ⚠️ **Quarantine all media** affects all files uploaded to the room by all members. Use this for rooms with reported illegal or harmful content.

> ⚠️ **Delete all media** permanently removes all local media in the room. Only local media from unencrypted rooms is affected — media from external servers and encrypted rooms is excluded. The dialog runs in the foreground and shows live progress — do not close it until deletion is complete.

> 📝 It is not possible to delete media that has been uploaded to external media repositories. Only media hosted on your own server is affected.

---

## 🌐 Purge Remote Media Cache

**Location:** Statistics → Users' media → toolbar → **Purge remote media** button

When your server federates with other Matrix homeservers, it caches copies of media (avatars, images, files) from those remote servers. Over time this cache can grow large. The purge remote media action removes these locally cached copies.

> 📝 This action only affects your server's local cache of remote media. It does not affect media uploaded to your own server's media repository, and does not delete the originals from their source servers. Remote users can re-fetch media after a purge.

**Dialog options:**

| Field | Description |
|-------|-------------|
| last access before | Only purge remote media that has not been accessed since this date/time. Leave at the default (epoch) to purge all cached remote media. |

---

## 🗑️ Delete Local Media

**Location:** Statistics → Users' media → toolbar → **Delete media** button

This action deletes local media from your server's disk, including thumbnails and downloaded copies of remote media. It does not affect media uploaded to external media repositories.

**Dialog options:**

| Field | Description |
|-------|-------------|
| last access before | Only delete media that has not been accessed since this date/time |
| Larger than (in bytes) | Only delete media files larger than this size. Step size is 1024 bytes. |
| Keep profile images | When enabled, profile avatars are excluded from deletion (default: on) |

> ⚠️ Deleted media cannot be recovered. Files that match all specified criteria are removed permanently from disk.

---

## 🔒 How to Quarantine a File

1. Navigate to **Users** and open the user who uploaded the file.
2. Click **Edit**, then open the **Media** tab.
3. Find the file in the list. The **Quarantine** button appears on rows where the file is not protected and not already quarantined.
4. Click **Quarantine**. The button changes to **Unquarantine** immediately on success.

> 💡 To undo, click the **Unquarantine** button on the same row.

---

## 🛡️ How to Protect Media from Accidental Quarantine

1. Navigate to **Users** and open the user who uploaded the file.
2. Click **Edit**, then open the **Media** tab.
3. Find the file in the list. The **Protect** button appears on rows where the file is not quarantined and not already protected.
4. Click **Protect**. The button changes to **Unprotect** immediately on success.

> 💡 A protected file cannot be quarantined — the quarantine button is replaced by a disabled "Protected" indicator. To remove protection later, click **Unprotect**.

---

## 🗑️ How to Delete All Media for a User

> ⚠️ Deletion is irreversible. All files are permanently removed from disk. There is no undo.

**Single user:**

1. Navigate to **Users** and open the user.
2. Click **Edit**, then open the **Media** tab.
3. Click **Delete all media** at the top of the tab.
4. Confirm in the dialog. The dialog runs in the foreground — do not close it until complete.

**Multiple users at once (bulk):**

1. Navigate to **Users**.
2. Select the users using the checkboxes on the left.
3. Click **Delete all media** in the bulk action toolbar that appears at the top.
4. Confirm in the dialog. A summary notification reports how many succeeded and how many failed.

**Server-wide delete by age/size (Statistics):**

The **Delete media** button (found in Statistics → Users' media toolbar) deletes media server-wide based on age and size filters:

1. Navigate to **Statistics → Users' media**.
2. Click **Delete media** in the top toolbar.
3. Set a **last access before** date to target old unused files.
4. Optionally set a **Larger then (in bytes)** threshold to target large files only.
5. Toggle **Keep profile images** off if you also want to remove avatars.
6. Click **Delete media** to confirm.

> 💡 Run with conservative filters first (e.g., a recent cutoff date and large size threshold) to limit the blast radius before doing a broad sweep.

---

## 🚪 How to Delete All Media for a Room

> ⚠️ Only local media from unencrypted rooms is affected. Media from encrypted rooms and external servers is excluded. Deletion is irreversible.

**Single room:**

1. Navigate to **Rooms** and open an unencrypted room.
2. Click **Show**, then open the **Media** tab.
3. Click **Delete all media** at the top of the tab.
4. Confirm in the dialog. The dialog shows live progress and runs in the foreground — do not close it until complete.

**Multiple rooms at once (bulk):**

1. Navigate to **Rooms**.
2. Select the rooms using the checkboxes on the left.
3. Click **Delete all media** in the bulk action toolbar that appears at the top.
4. Confirm in the dialog. Encrypted rooms are skipped automatically. A summary notification reports the result.

---

**See also:** [User management](./user-management.md) · [Room management](./room-management.md) · [Server statistics](./server-statistics.md) · [Documentation index](./README.md)
