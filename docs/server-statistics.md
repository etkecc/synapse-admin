# 📊 Server Statistics & Scheduled Tasks

Ketesa exposes three read-focused views that help administrators understand server health, storage consumption, and background job status without querying the database directly.

---

## 🗄️ Database Room Statistics

### 📋 What it shows

The **Statistics → Database Rooms** page lists every room that exists on your homeserver, ranked by its estimated footprint in the Synapse database. This helps you identify which rooms are consuming the most storage and decide whether to purge history, restrict membership, or take other remediation steps.

> 📝 The size shown is an *estimate* produced by Synapse — it reflects database row sizes and may not map 1:1 to disk usage reported by your storage backend.

### 📐 Columns

| Column | Description |
|--------|-------------|
| Avatar | Room avatar image |
| `room_id` | Fully-qualified Matrix room ID |
| `canonical_alias` | Human-readable alias for the room, if set |
| `name` | Display name of the room |
| `joined_members` | Number of currently joined members |
| `estimated_size` | Estimated database storage consumed (formatted, e.g. `1.4 GB`) |

### 📤 Export

An **Export** button is available in the toolbar. It is enabled only when data is present. The export downloads all rows in CSV format.

### 🔍 How to identify large rooms

1. Navigate to **Statistics → Database Rooms** in the left sidebar.
2. The list is returned sorted by `estimated_size` descending by default — the largest rooms appear first.
3. Click any row to open the full room detail page where you can inspect members, aliases, and history-purge options.

---

## 🖼️ User Media Statistics

### 📋 What it shows

The **Statistics → User Media** page lists local users ordered by total media storage they have uploaded. Use this view to spot users with abnormally large media footprints before storage becomes a problem.

> 📝 The default sort is `media_length` descending, so the heaviest users appear immediately without any manual sort step.

### 📐 Columns

| Column | Description |
|--------|-------------|
| Avatar | User profile picture |
| `user_id` | Fully-qualified Matrix user ID |
| `displayname` | User's display name |
| `media_count` | Number of media items uploaded by this user |
| `media_length` | Total size of all uploaded media (formatted, e.g. `820 MB`) |
| `is_guest` | Whether the account is a guest account |
| `deactivated` | Whether the account has been deactivated |
| `locked` | Whether the account is currently locked |
| `erased` | Whether the account has been erased |

### 🎛️ Filters

A **Search** input is always visible in the toolbar. It filters the list by user ID or display name.

### 🔧 Direct media management actions

> 💡 The User Media statistics page has direct **Manage media** action buttons per user — you can jump straight to quarantine or delete a user's media without navigating to their profile first. See [Media management](./media.md).

The toolbar contains two global media action buttons that apply across all listed users:

- **Delete media** — permanently remove local media files.
- **Purge remote media** — remove cached copies of media that originated on remote servers.

Clicking a row navigates directly to that user's media management page (`/users/<id>/media`), where per-file actions are available.

### 📤 Export

An **Export** button is available in the toolbar alongside the media action buttons. It is enabled only when data is present and downloads all rows in CSV format.

### 🔍 How to find users with excessive media

1. Navigate to **Statistics → User Media** in the left sidebar.
2. The list is already sorted by `media_length` descending — the users consuming the most storage appear first.
3. Use the **Search** filter to narrow by a specific user if needed.
4. Click a row to open that user's media management page, or use the toolbar **Delete media** / **Purge remote media** buttons to act immediately.

---

## ⏱️ Scheduled Tasks

### 📋 What it is

The **Scheduled Tasks** page is a read-only view of background jobs that Synapse registers and executes internally. Common examples include room history purges, user media cleanup, and federation catch-up tasks. Administrators cannot create or cancel tasks from this view — it is intended for inspection and debugging only.

> ⚠️ This page reflects the state Synapse reports via its Admin API. Tasks that complete very quickly may already be gone from the list by the time you look.

### 📐 Fields

| Field | Source key | Description |
|-------|-----------|-------------|
| ID | `id` | Internal numeric task identifier |
| Action | `action` | Name of the background action being executed (e.g. `purge_history`) |
| Status | `status` | Current lifecycle state — see status values below |
| Timestamp | `timestamp_ms` | Date and time when the task was last updated |
| Resource ID | `resource_id` | Matrix ID (room, user, etc.) the task is operating on |
| Result | `result` | Structured JSON result payload returned on completion |
| Error | `error` | Error message if the task failed |

### 🔴 Status values

| Status | Colour | Meaning |
|--------|--------|---------|
| `scheduled` | grey | Task is queued and waiting to start |
| `active` | blue | Task is currently running |
| `complete` | green | Task finished successfully |
| `cancelled` | yellow | Task was cancelled before completion |
| `failed` | red | Task encountered an error and did not complete |

### 🔎 Filter options

| Filter | Input type | Description |
|--------|-----------|-------------|
| Status | Dropdown (select) | Filter to tasks with a specific lifecycle state |
| Action | Text | Filter by action name (e.g. `purge_history`) |
| Resource ID | Text | Filter by the Matrix ID the task is associated with |
| Max timestamp | Date/time picker | Show only tasks updated at or before this date and time |

### 💡 When to use scheduled tasks

- **Debugging a stuck job** — filter by `status = active` and look for tasks that have been running longer than expected.
- **Verifying a purge completed** — filter by action name (`purge_history`) and check for `status = complete` alongside the relevant `resource_id`.
- **Diagnosing a failed background operation** — filter by `status = failed` and inspect the `error` field for details.
- **Auditing recent activity** — use the **Max timestamp** filter together with a status filter to review what ran during a specific window.

---

**See also:** [Media management](./media.md) · [Documentation index](./README.md)
