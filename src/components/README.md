# components/

Shared UI components, organized by feature domain.

## Structure

- `layout/` — App-level layout: AdminLayout, LoginFormBox, EmptyState, Footer
- `users/` — User-related components
  - `buttons/` — Action buttons (DeactivateButton, ResetPasswordButton, …)
  - `fields/` — Display/input fields (AvatarField, …)
- `rooms/` — Room-related components
- `media/` — Media quarantine and deletion components
- `user-import/` — Bulk CSV user import (self-contained, keep as-is)
- `etke.cc/` — ETKE.CC-exclusive features (keep as-is)
- `hooks/` — Shared React hooks

## Sub-directory rule

Add a sub-directory (`buttons/`, `fields/`, `dialogs/`) only when **3 or more** components of the same semantic type exist in a feature. One or two components stay at the feature dir root.
