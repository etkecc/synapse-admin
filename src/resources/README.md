# resources/

React-Admin resource definitions. Each resource is its own directory.

## Structure

Each resource directory contains:
- `index.ts` — barrel export (the only file consumers should import from)
- `List.tsx`, `Show.tsx`, `Edit.tsx`, `Create.tsx` — one file per CRUD view

## Conventions

- Directory names: kebab-case (`registration-tokens/`, `room-directory/`)
- File names: PascalCase for components (`List.tsx`, `Show.tsx`)
- Always re-export from `index.ts` when adding a new export
- Import from the directory, never from individual files:
  `import { UserList } from "../resources/users"`
