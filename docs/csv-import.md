# 🎯 Bulk CSV User Import

The bulk CSV import feature lets you create many Matrix user accounts at once by uploading a structured CSV file. Instead of manually creating accounts one by one through the UI, you can prepare a spreadsheet, export it as CSV, and provision hundreds of users in a single operation — ideal for onboarding a new organisation, migrating users from another platform, or pre-seeding accounts before launch.

## ✨ Overview / Capabilities

- Upload any RFC-4180 CSV file with standard user fields
- Validate the file and preview parsed statistics before committing any changes
- Dry-run mode: simulate the full import without writing anything to the server
- Three conflict modes to control what happens when a user ID already exists
- Automatic random password generation for rows that have no password
- Automatic random MXID generation for rows that have no ID
- Third-party ID (3PID, e.g. email) provisioning via a compact inline syntax
- Download a CSV of skipped records after the import so you can fix and re-run them

---

## 📋 CSV Format

The CSV file must have a header row. Column names are **case-insensitive** and leading/trailing whitespace is stripped automatically.

### 🔑 Required columns

| Column | Description |
|---|---|
| `id` | Matrix user ID. Accepts a full MXID (`@alice:example.com`) or a bare localpart (`alice`). If empty or missing per-row, a random MXID is generated (see [User ID mode](#️-import-options)). |
| `displayname` | Human-readable display name shown in Matrix clients. |

> ⚠️ The import will be rejected immediately if either `id` or `displayname` is missing from the header row.

### 🗂️ Optional columns

| Column | Type | Description |
|---|---|---|
| `password` | string | Plaintext password for the account. If empty, a random password is generated (controlled by [Password mode](#️-import-options)). |
| `admin` | boolean | Whether the user is a server administrator. Accepts `1`, `true`, `yes`, `on` for true; `0`, `false`, `no`, `off`, `null`, `undefined`, or empty for false. |
| `is_guest` | boolean | Whether the account is a guest. Same boolean values as `admin`. |
| `deactivated` | boolean | Whether the account is deactivated on creation. Same boolean values as `admin`. |
| `avatar_url` | string | `mxc://` URI for the user's avatar image. |
| `user_type` | string | Synapse user type identifier (e.g. `bot`). Leave empty for a regular user. |
| `threepids` | string | Comma-separated list of third-party identifiers in `medium:address` format (e.g. `email:alice@example.com,msisdn:+1234567890`). Pairs with an invalid format are silently ignored. |

> 📝 The columns `name` and `is_admin` are recognised as legacy aliases produced by earlier react-admin CSV exports and are silently discarded during import. Use `id` and `admin` respectively.

> 💡 Column order in the CSV does not matter. Extra columns not listed above are passed through to the server as-is.

### 📄 Example

```csv
id,displayname,password,admin,is_guest,deactivated,avatar_url,threepids
alice,Alice Example,s3cr3t,false,false,false,,email:alice@example.com
bob,Bob Example,,false,false,false,,
@carol:example.com,Carol Example,hunter2,true,false,false,mxc://example.com/abc123,email:carol@example.com
```

---

## ⚙️ Import Options

These options are presented in the UI after a valid CSV has been loaded, before the import is started.

| Option | UI control | Values | Default | Description |
|---|---|---|---|---|
| **Dry-run mode** | Checkbox | enabled / disabled | enabled | When enabled, the import runs through all validation and conflict checks but does **not** create any accounts on the server. Always recommended for a first pass. |
| **Conflict mode** | Dropdown | `stop`, `skip` | `stop` | What to do when a user ID from the CSV already exists on the server (see [Handling conflicts](#-how-to-handle-conflicts)). |
| **Password mode** | Checkbox | enabled / disabled | enabled | When enabled, passwords supplied in the CSV are used as-is and missing passwords get a randomly generated one. When disabled, no password is set or updated for any user. |
| **User ID mode** | Dropdown | `ignore`, `update` | `update` | Controls whether IDs present in the CSV are used (`update`) or discarded in favour of freshly generated random MXIDs (`ignore`). Only shown when at least one row in the CSV has a non-empty `id` value. |

---

## 🛠️ How to Import Users

1. **Navigate to the import page.** In the left sidebar, open **Users**, then click **Import**.
2. **Prepare your CSV.** Create a file with at minimum the `id` and `displayname` columns. Add any optional columns you need (see [CSV Format](#-csv-format)).
3. **Upload the file.** Click the file input and select your CSV. The file is parsed immediately in the browser — no data is sent to the server yet.
4. **Review the parsed statistics.** The stats card shows the total number of users found, how many have guest or admin flags set, how many have explicit IDs, and how many have passwords. Verify these numbers match your expectations.
5. **Configure import options.** Set conflict mode, password mode, and user ID mode as needed (see [Import Options](#️-import-options)).
6. **Run a dry run first.** Make sure the **Simulate only** checkbox is ticked, then click **Run import**. Review the results — check the success count and whether any records were skipped.
7. **Run the real import.** Uncheck **Simulate only**, then click **Run import** again. Progress is shown inline as records are processed.
8. **Review results.** The results card appears when the import completes (see [Reading the Results](#-how-to-read-results)).

> ⚠️ Files larger than 100 MB are rejected. For very large imports, split the CSV into chunks below this limit.

> 💡 The dry run uses the exact same logic as the real import, including conflict detection. If the dry run shows zero skipped records, the real run will also skip none — assuming no concurrent changes on the server.

---

## ⚔️ How to Handle Conflicts

A conflict occurs when the `id` of a CSV row resolves to a Matrix user that already exists on the server. The **Conflict mode** setting controls what happens:

| Mode | Value | Behaviour | When to use |
|---|---|---|---|
| **Stop** | `stop` | The import halts immediately at the first conflicting record. Records processed before the conflict are kept (or simulated). The offending ID is reported in the error card. | Safe default. Use when your CSV should contain only new users and any existing ID indicates a data problem. |
| **Skip** | `skip` | Conflicting records are silently skipped and added to the skipped-records list. The import continues with the remaining rows. | Use when you are re-running a partially completed import or when your CSV intentionally mixes new and existing users. |

> 📝 In `skip` mode, all skipped records are available for download as a CSV after the import finishes (see [Reading the Results](#-how-to-read-results)). You can edit the downloaded file and re-import only the skipped rows.

> ⚠️ There is no **Update** conflict mode. Existing user accounts are never modified by the import, regardless of conflict mode setting. To modify existing users, use the user edit form or the user list bulk actions.

---

## 📊 How to Read Results

When the import finishes the results card replaces the import controls and shows:

| Item | Description |
|---|---|
| **Total** | The total number of rows that were processed from the CSV. |
| **Successful** | The count of accounts that were (or would be, in dry-run) successfully created. A list of their display names is shown below the count. |
| **Skipped** | The count of records that were skipped due to a conflict (only in `skip` conflict mode). A **Download skipped records** button appears — clicking it downloads `skippedRecords.csv` containing those rows in the original CSV format. |
| **Errored** | The count of records that could not be processed due to an error. |
| **Simulated only** warning | A yellow alert is shown when the results are from a dry run and no accounts were actually created. |

After reviewing the results, click **Back** to return to the user list.

> 💡 The downloaded `skippedRecords.csv` is a valid import CSV. You can correct it and upload it for a follow-up import without needing to filter out the already-successful rows from your original file.

---

**See also:** [User management](./user-management.md) · [Documentation index](./README.md)
