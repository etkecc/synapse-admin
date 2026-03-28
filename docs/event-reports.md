# 🚨 Event Reports

Event reports are abuse reports submitted by Matrix users via their client apps. When a user flags a message or event as harmful, inappropriate, or otherwise policy-violating, a report is created on the homeserver. Ketesa lets you review those reports, investigate the flagged content, and dismiss reports once you have handled them.

> 📝 Reports in this view correspond to Matrix's `/report` endpoint. Only events reported by users on your homeserver appear here.

---

## 📋 Reports List

The reports list displays all pending abuse reports, sorted by most recent first by default.

### 🗂️ Columns

| Column | Field | Description |
|---|---|---|
| **ID** | `id` | Unique numeric identifier for the report. |
| **Report Time** | `received_ts` | Date and time the report was received by the homeserver. |
| **Reporter** | `user_id` | The Matrix user who submitted the report. |
| **Room Name** | `name` | Display name of the room containing the flagged event. |
| **Score** | `score` | Severity score assigned by the reporter (see [Severity Score](#-severity-score) below). |

> 📝 The reporting user's ID and the room name are truncated in the list view. Click a report to see full values.

---

## 🔢 Severity Score

The **Score** field is a numeric value set by the reporter at the time they submitted the report. Per the Matrix specification, the range is **−100 to 0**, where −100 represents the most severe content and 0 represents the least. Not all clients enforce this range — some may send positive values or omit the field entirely.

> ⚠️ The score reflects the reporter's subjective judgement, not an objective severity level. Use it as a triage signal, but always review the actual event content before taking action.

Common guidance (for spec-compliant clients):

| Score range | Typical reporter intent |
|---|---|
| −100 to −71 | High concern — serious violations (e.g. harassment, illegal content) |
| −70 to −31 | Moderate concern — clearly unwanted or offensive content |
| −30 to 0 | Low concern — mildly inappropriate or borderline content |

---

## 🔍 Report Detail View

Click any row in the reports list to open the detail view for that report. The detail view has two tabs.

### 🗒️ Basic Tab

The **Basic** tab displays report metadata and links to the involved parties.

| Field | Description |
|---|---|
| **ID** | Numeric report ID. |
| **Report Time** | Timestamp the report was received. |
| **Score** | Severity score set by the reporter. |
| **Reason** | Free-text reason provided by the reporter (may be empty). |
| **Announcer** | The user who filed the report — clicking their avatar or ID navigates to their user detail page. |
| **Sender** | The user who sent the flagged event — clicking their avatar or ID navigates to their user detail page. |
| **Room** | The room containing the flagged event — clicking navigates to the room detail page. |
| **Event ID** | The Matrix event ID of the flagged event. |

> 💡 Use the direct links to the reporter, sender, and room to jump straight to the relevant resource without leaving the workflow.

### 🧾 Details Tab

The **Details** tab shows the raw JSON of the flagged event (`event_json`). This is the full Matrix event object as stored by the homeserver — including the event type, content, sender, timestamps, and signatures.

Use this tab to see the exact message or media content that was reported without having to look it up elsewhere.

> 📝 If the event JSON is absent (e.g. the event has been redacted or is no longer available), the Details tab will be empty.

---

## 🔎 Event Lookup Tool

The **Event Lookup** tool lets you retrieve any event by its ID, independent of reports. It is useful when you have an event ID from another source (e.g. a user complaint, a log entry, or another admin tool) and want to inspect its content.

**Location:** The "Event Lookup" button is in the toolbar at the top-right of the reports list page.

**How it works:** Clicking the button opens a dialog. Enter the event ID and press **Fetch** (or press Enter). The raw event JSON is displayed inline in the dialog.

> 💡 The Event Lookup tool queries the homeserver directly and is not limited to reported events. You can look up any event ID your admin account has access to.

---

## 📖 How to Review a Report

1. Open **Reported Events** from the left navigation menu.
2. Find the report you want to review. You can sort by **Report Time** to prioritise the most recent ones.
3. Click the report row to open the detail view.
4. Read the **Basic** tab: note the reporter (**Announcer**), the message author (**Sender**), and the **Reason** provided.
5. Switch to the **Details** tab to read the raw event JSON and see the exact content that was flagged.
6. If you need more context, use the links on the **Basic** tab to navigate to the sender's user page or the room page.
7. Take any necessary moderation action on the user or room (e.g. deactivate account, kick from room) through the respective management pages.
8. Return to the report detail view and delete the report to dismiss it (see [How to Delete a Report](#-how-to-delete-a-report)).

---

## 🔎 How to Use the Event Lookup Tool

1. Open **Reported Events** from the left navigation menu.
2. Click the **Event Lookup** button in the top-right toolbar.
3. In the dialog that opens, paste or type the event ID into the **Event ID** field.
4. Press **Fetch** or hit Enter.
5. The raw event JSON is displayed in the dialog.
6. Review the content as needed, then click **Cancel** to close the dialog.

> 💡 If the event cannot be found or your account lacks access, an error message is shown in the dialog.

---

## 🗑️ How to Delete a Report

1. Open the report detail view by clicking the report in the list.
2. Click the **Delete** button in the top-right toolbar of the detail view.
3. A confirmation dialog appears asking you to confirm the deletion.
4. Confirm the deletion.

> 📝 Deleting a report removes it from the list but does not affect the reported user or the event itself. Take any moderation action on the user or room separately.

---

**See also:** [Room management](./room-management.md) · [Documentation index](./README.md)
