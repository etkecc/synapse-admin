# 🌐 Federation Overview

The Federation overview shows every remote Matrix server your homeserver communicates (or has communicated) with. It is your first stop for diagnosing federation problems — slow message delivery, rooms going out of sync, or servers that seem unreachable.

In Ketesa the section is labelled **Federation** in the navigation menu and maps to the `destinations` resource in the Synapse Admin API.

---

## 📋 Destinations List

The list shows all known federation destinations — remote homeservers your server has attempted to reach. Each row represents one remote server.

| Column | Field | Description |
|---|---|---|
| Destination | `destination` | The hostname of the remote Matrix server (e.g. `matrix.org`). |
| Failure timestamp | `failure_ts` | When the current failure streak started. Empty if the destination is healthy. |
| Last retry timestamp | `retry_last_ts` | When Synapse last attempted to reach the destination after a failure. |
| Retry interval | `retry_interval` | Current backoff interval (in milliseconds) before the next automatic retry. Increases with each failed attempt. |
| Last successful stream | `last_successful_stream_ordering` | The stream ordering value of the last event successfully delivered to this destination. Useful for gauging how far behind a destination has fallen. |

> 📝 The list defaults to ascending alphabetical order by `destination`. Use the search box to filter by server name.

---

## 🔴 Error Indicators

Destinations that are actively failing are visually flagged. When `retry_last_ts` is greater than zero, a red error icon (`ErrorIcon`) is rendered inline next to the destination name in the list. On mobile, the `failure_ts` value is shown beneath the server name alongside the same error icon.

A non-empty `failure_ts` is the authoritative signal that a destination is in an error state. `retry_last_ts > 0` drives the red icon; an empty `retry_last_ts` with a set `failure_ts` indicates a failure that has not yet been retried.

---

## 🗂️ Rooms per Destination

Clicking any destination row opens a detail view with two tabs:

- **Status** — repeats the five fields from the list in a structured layout.
- **Rooms** — lists every room your homeserver shares with that remote server.

The Rooms tab shows:

| Column | Description |
|---|---|
| Room ID | The full Matrix room ID (`!id:server`). |
| Stream | The `stream_ordering` value for this destination/room pair — indicates the event position last synced. |
| Name | The human-readable room name, resolved via a reference lookup. |

Clicking a room row navigates to that room's detail page.

**Why this matters:** When a destination fails, the Rooms tab tells you which rooms are affected and how many. A destination serving a single low-traffic room may not warrant immediate action. A destination that shares dozens of active rooms is a higher-priority investigation.

---

## 🔄 Reconnect Action

The **Reconnect** button appears in the list row and in the detail view toolbar, but only when the destination has an active failure (`failure_ts` is set).

Clicking Reconnect calls the Synapse API to delete the current failure record for that destination. This resets the exponential backoff counter and triggers an immediate connection attempt — Synapse will try to reach the remote server right away instead of waiting for the next scheduled retry.

> 💡 Federation failures are often temporary — Synapse retries automatically with exponential backoff. Use the reconnect action only after you've resolved the underlying issue on your end.

**When to use it:**

- You have fixed a network routing problem or firewall rule.
- A DNS record was updated and the TTL has expired.
- The remote server renewed its TLS certificate and you have confirmed it is reachable.
- You want to test connectivity immediately without waiting for the backoff timer.

> ⚠️ If the underlying problem has not been resolved, the reconnect attempt will fail and Synapse will re-enter the backoff cycle. Repeated forced reconnects do not help and may briefly increase load.

---

## 🔍 How to Identify a Failed Federation Destination

1. Open **Federation** in the left navigation menu.
2. Scan the list for rows with a red error icon next to the destination name.
3. Check the **Failure timestamp** column to see when the failure began.
4. Check the **Last retry timestamp** column to see when Synapse last tried to reconnect.
5. Note the **Retry interval** — a large value means Synapse has been failing for a while and is backing off aggressively.
6. Click the destination to open the detail view and confirm the failure details on the **Status** tab.

---

## 🔌 How to Reconnect a Failed Destination

1. Open **Federation** in the left navigation menu.
2. Find the destination you want to reconnect (use the search box if needed).
3. Confirm the red error icon is present, indicating an active failure.
4. Verify that the root cause (network issue, DNS change, TLS cert) has been resolved.
5. Click the **Reconnect** button in the destination's row.
6. A confirmation notification appears. The row refreshes and the error icon clears if the reconnection succeeds.

Alternatively:
1. Click the destination row to open the detail view.
2. Click the **Reconnect** button in the top toolbar.

---

## 🏠 How to See Which Rooms Are Shared with a Remote Server

1. Open **Federation** in the left navigation menu.
2. Click the destination row for the remote server you are interested in.
3. The detail view opens on the **Status** tab by default.
4. Click the **Rooms** tab (folder icon).
5. Browse the list of shared rooms. Each row shows the room ID, stream ordering, and room name.
6. Click any room row to navigate to that room's full detail page.

---

**See also:** [Room management](./room-management.md) · [Server statistics](./server-statistics.md) · [Documentation index](./README.md)
