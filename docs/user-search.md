# 🔍 User Search

The Users list includes a search field that filters by MXID (user ID) and display name.

## Normal search

Type a term (e.g. `bot`) to show only users whose MXID or display name **contains** that term.

## Reverse search

Prefix the term with `!` (e.g. `!bot`) to show users whose MXID and display name **do not contain** the term.

The search field will display a ⏳ hourglass icon when reverse search is active to indicate the operation may take longer than a regular search — the server must be fully scanned to exclude matches.

> 💡 Reverse search works in both native Synapse and MAS-backed deployments.
