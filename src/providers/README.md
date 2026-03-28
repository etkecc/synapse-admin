# providers/

API integration layer. Provides data and authentication to the React-Admin app.

## Structure

- `data/` — DataProvider: `index.ts` (routing/dispatch), `synapse.ts` (Synapse API), `mas.ts` (MAS API), `etke.ts` (ETKE.CC API)
- `auth/` — AuthProvider: `index.ts`
- `types/` — TypeScript types split by domain: `users.ts`, `rooms.ts`, `mas.ts`, `reports.ts`, `destinations.ts`, `etke.ts`, `common.ts`, `index.ts`
- `http.ts` — HTTP client factory
- `matrix.ts` — Matrix protocol utilities
- `serverVersion.ts` — Server version detection

## Conventions

- `types/index.ts` re-exports all types — import from `providers/types`, never from domain files directly
- `data/index.ts` is the DataProvider export — import from `providers/data`
- `auth/index.ts` is the AuthProvider export — import from `providers/auth`
