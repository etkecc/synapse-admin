# Test Coverage TODO — Tier 4

These areas were intentionally deferred after the Tier 1–3 coverage pass.
Each item requires heavier mocking infrastructure than the earlier tiers.

## Data Providers

All files below share the same mocking strategy:
mock `jsonClient` / `httpClient` from `src/providers/http.ts` with `vi.mock`, then test
each exported function / resource operation in isolation.

### `src/providers/data/etke.ts`
- etke.cc-specific CRUD and action endpoints
- Test: get, list, create, update, delete operations

### `src/providers/data/synapse.ts`
- Synapse admin API resource CRUD (users, rooms, media, etc.)
- Test: each resource's getList/getOne/create/update/delete handlers

### `src/providers/data/mas.ts`
- MAS resource CRUD (users, sessions, registration tokens, policy data)
- Test: each resource's getList/getOne/create/update/delete handlers
- Mock `getMASBaseUrl()` via localStorage

### `src/providers/data/synapse-actions.ts`
- One-shot admin actions (reset password, deactivate user, purge media, etc.)
- Test: each exported action function with success and error paths

### `src/providers/data/mas-actions.ts`
- MAS admin actions (lock/unlock user, revoke session, etc.)
- Test: each exported action function with success and error paths

### `src/providers/data/lifecycle.ts`
- Provider lifecycle hooks (login, logout, checkAuth, checkError, getPermissions)
- Mock fetch + localStorage

### `src/providers/auth/index.ts`
- OIDC / password auth provider
- Test: login, logout, checkAuth, handleCallback, token refresh
- Mock fetch + localStorage

### `src/providers/serverVersion.ts`
- Synapse and MAS version polling hook
- Mock `jsonClient`; test version extraction and MAS detection logic

### `src/providers/http.ts`
- `jsonClient` and `httpClient` wrappers
- Test: Authorization header injection, base_url construction, error handling
- Mock `fetch` with `vi.stubGlobal`

---

## Resource Pages / Views

All resource pages should be wrapped in `AdminContext` with a mocked `dataProvider` and
the English `i18nProvider` (same pattern as `LoginPage.test.tsx` and `MASPolicyDataPage.test.tsx`).

### `src/resources/users/` (UserList, UserCreate, UserEdit, UserShow)
- List: renders user rows, filter by admin/guest/deactivated
- Create: form validation, password generation button, device ID field
- Edit: avatar upload, rate limit fields, device management

### `src/resources/rooms/` (RoomList, RoomShow)
- List: renders room rows, filter
- Show: members tab, state events tab, event lookup dialog

### `src/resources/destinations/`
- List, Show with federation retry button

### `src/resources/reports/`
- List, Show with user/room detail links

### `src/resources/registration-tokens/`
- List: MAS vs Synapse token rendering
- Create/Edit: expiry date, uses_allowed, revoke button

### `src/resources/statistics/`
- Media stats page

### `src/resources/mas/` (users, sessions, compat-sessions, oauth-sessions)
- List, Show, Edit for each resource

---

## Complex Hooks

These hooks require rendering inside a full react-admin context tree.
Use `renderHook` wrapped in a custom `AdminContext` + mocked `dataProvider`.

### `src/components/etke.cc/hooks/useServerCommands.ts`
Required mocks: `useDataProvider`, `useInstanceConfig`, `useAppContext`
- Returns empty list when data provider throws
- Filters commands based on `disabled` config flags
- Enables maintenance mode commands when `maintenance` is true

### `src/components/etke.cc/hooks/useUnits.ts`
Required mocks: `useDataProvider`, `useLocale`
- Returns empty map when data provider throws
- Maps unit identifiers to human-readable labels via `toHumanReadable`

### `src/components/user-import/useImportFile.tsx` (hook itself, not pure functions)
The pure helper functions (`anyToBoolean`, `validateCsvImport`) are already covered in
`useImportFile.test.ts`. The hook itself needs:
Required mocks: `useDataProvider`, `useNotify`, `useTranslate` (all from react-admin)
- Parses CSV and sets csvData / stats state
- Reports errors for invalid CSV
- Progress updates during bulk import
- Final success / failure notification

---

## Notes on Test Patterns

```ts
// Standard mocking for a data provider method
const dataProvider = {
  ...minimalDataProvider,
  getMASPolicyData: vi.fn().mockResolvedValue(policyData),
};

// Wrap a component under test
render(
  <AdminContext i18nProvider={i18nProvider} dataProvider={dataProvider}>
    <ComponentUnderTest />
  </AdminContext>
);

// Mock jsonClient for provider unit tests
vi.mock("../../http", () => ({ jsonClient: vi.fn() }));
import { jsonClient } from "../../http";
vi.mocked(jsonClient).mockResolvedValue({ json: { ... }, status: 200, headers: new Headers() });
```
