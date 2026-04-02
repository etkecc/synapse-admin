import { DeleteParams, HttpError, PaginationPayload, RaRecord, UpdateParams } from "react-admin";
import { useStore } from "react-admin";

import {
  MASCompatSessionListResponse,
  MASCompatSessionResource,
  MASOAuth2SessionListResponse,
  MASOAuth2SessionResource,
  MASPersonalSessionListResponse,
  MASPersonalSessionResource,
  MASPolicyData,
  MASPolicyDataResource,
  MASRegistrationToken,
  MASRegistrationTokenListResponse,
  MASRegistrationTokenResource,
  MASRegistrationTokensResourceType,
  MASUpstreamOAuthLinkListResponse,
  MASUpstreamOAuthLinkResource,
  MASUpstreamOAuthProviderListResponse,
  MASUpstreamOAuthProviderResource,
  MASUserEmailListResponse,
  MASUserEmailResource,
  MASUserListResponse,
  MASUserResource,
  MASUserSessionListResponse,
  MASUserSessionResource,
} from "../types";
import { jsonClient } from "../http";

/**
 * Read the cached MAS flag from localStorage.
 * react-admin's useStore persists under the "RaStore." prefix,
 * so useStore<boolean>('mas', false) reads/writes "RaStore.isMAS".
 * This function is for non-React code (dataProvider, serverVersion).
 */
export const isMAS = (): boolean => {
  // react-admin's useStore serialises values as JSON under "RaStore.<key>"
  return localStorage.getItem("RaStore.isMAS") === "true";
};

/**
 * React hook for components — reactive, backed by react-admin store.
 */
export const useIsMAS = (): boolean => {
  const [value] = useStore<boolean>("isMAS", false);
  return value;
};

/**
 * Set the MAS flag in react-admin store's localStorage slot.
 * The flag means "is MAS AND admin API is available".
 */
export const setIsMAS = (value: boolean): void => {
  localStorage.setItem("RaStore.isMAS", JSON.stringify(value));
};

/**
 * Extract the MAS base URL from the token endpoint
 * e.g., "http://localhost:8007/oauth2/token" -> "http://localhost:8007"
 */
export const getMASBaseUrl = (): string | null => {
  const tokenEndpoint = localStorage.getItem("token_endpoint");
  if (!tokenEndpoint) return null;

  // Remove trailing /oauth2/token to get the base URL
  return tokenEndpoint.replace(/\/oauth2\/token$/, "");
};

/**
 * Convert Unix timestamp (milliseconds) to RFC 3339 formatted string
 * Used for MAS API which expects RFC 3339 format for expiry dates
 */
export const toRfc3339 = (timestamp: number | undefined | null): string | undefined => {
  if (!timestamp) return undefined;
  return new Date(timestamp).toISOString();
};

/**
 * Check if MAS admin API is available by attempting a health check.
 * Only called once at login time, never on page refresh.
 */
export const checkMASAdminApiAvailable = async (): Promise<boolean> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return false;
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/site-config`, { method: "GET" });
    return true;
  } catch {
    return false;
  }
};

/**
 * Detect MAS, check admin API availability, set the cached flag,
 * and initialize the registration tokens resource.
 * Called once at login / OIDC callback.
 */
export const detectAndSetMAS = async (): Promise<void> => {
  const tokenEndpoint = localStorage.getItem("token_endpoint");
  const isMASEndpoint = !!tokenEndpoint && tokenEndpoint.endsWith("/oauth2/token");

  if (isMASEndpoint && (await checkMASAdminApiAvailable())) {
    setIsMAS(true);
  } else {
    setIsMAS(false);
  }
};

/**
 * Get the MAS server version
 */
export const getMASVersion = async (): Promise<string> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return "";
  try {
    const { json } = await jsonClient(`${masBaseUrl}/api/admin/v1/version`);
    return json.version as string;
  } catch {
    return "";
  }
};

/**
 * Revoke or unrevoke a MAS registration token
 */
export const revokeRegistrationToken = async (
  id: string,
  revoke: boolean
): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };

  const action = revoke ? "revoke" : "unrevoke";
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/user-registration-tokens/${encodeURIComponent(id)}/${action}`, {
      method: "POST",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    }
    throw error;
  }
};

/**
 * Convert MAS registration token format to Synapse format
 */
export const getMASTokenResource = (
  token: MASRegistrationToken | MASRegistrationTokenResource
): MASRegistrationTokenResource => {
  return "data" in token ? token.data : token;
};

export const convertMASTokenToSynapse = (masToken: MASRegistrationToken | MASRegistrationTokenResource) => {
  const resource = getMASTokenResource(masToken);
  return {
    token: resource.attributes.token,
    valid: resource.attributes.valid ?? true,
    uses_allowed: resource.attributes.usage_limit ?? null,
    pending: 0, // MAS doesn't provide pending count, use 0
    completed: resource.attributes.times_used ?? 0,
    expiry_time: resource.attributes.expires_at || null,
    created_at: resource.attributes.created_at,
    last_used_at: resource.attributes.last_used_at,
    revoked_at: resource.attributes.revoked_at,
  };
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const filterUndefined = (obj: Record<string, any>) => {
  return Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined && value !== null));
};

// Generic MAS cursor cache keyed by resource+perPage+filter
const masCursorCache = new Map<string, Map<number, string>>();

export const buildMASCursorKey = (resource: string, perPage: number, filter: Record<string, unknown>): string => {
  return JSON.stringify({ resource, perPage, filter });
};

export const getMASCursor = (cacheKey: string, page: number): string | undefined => {
  return masCursorCache.get(cacheKey)?.get(page);
};

export const setMASCursor = (cacheKey: string, page: number, cursor: string): void => {
  const cache = masCursorCache.get(cacheKey) ?? new Map<number, string>();
  cache.set(page, cursor);
  masCursorCache.set(cacheKey, cache);
};

// Legacy registration-token helpers — delegate to generic functions
export const getMASRegistrationTokensCursorKey = (params: PaginationPayload, valid?: boolean) =>
  buildMASCursorKey("registration_tokens", params.perPage, { valid });

export const getMASRegistrationTokensPageCursor = (cacheKey: string, page: number) => getMASCursor(cacheKey, page);

export const setMASRegistrationTokensPageCursor = (cacheKey: string, page: number, cursor: string) =>
  setMASCursor(cacheKey, page, cursor);

export const getMASNextPageCursor = (json: {
  links?: { next?: string };
  data?: { meta?: { page?: { cursor?: string } }; id?: string }[];
}) => {
  if (json.links?.next) {
    try {
      const url = new URL(json.links.next, "https://example.invalid");
      const cursor = url.searchParams.get("page[after]");
      if (cursor) {
        return cursor;
      }
    } catch {
      // Ignore malformed pagination links.
    }
  }

  const data = json.data;
  if (!Array.isArray(data) || data.length === 0) {
    return undefined;
  }

  const last = data[data.length - 1];
  return last?.meta?.page?.cursor ?? last?.id;
};

export const getMASRegistrationTokensResource = (): MASRegistrationTokensResourceType => ({
  path: "/api/admin/v1/user-registration-tokens",
  isMAS: true,
  map: (token: MASRegistrationToken | MASRegistrationTokenResource) => {
    const resource = getMASTokenResource(token);
    const converted = convertMASTokenToSynapse(resource);
    return { ...converted, id: resource.id || converted.token };
  },
  data: "data",
  total: (json: MASRegistrationTokenListResponse) => json.meta?.count || 0,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[valid]": filter.valid,
      count: "true",
    }),
  create: (params: RaRecord) => ({
    endpoint: "/api/admin/v1/user-registration-tokens",
    body: {
      token: params.token || undefined,
      usage_limit: params.uses_allowed ?? undefined,
      expires_at: toRfc3339(params.expiry_time),
    },
    method: "POST",
  }),
  handleCreateResponse: (token: MASRegistrationToken) => {
    const resource = getMASTokenResource(token);
    const converted = convertMASTokenToSynapse(resource);
    return { ...converted, id: resource.id || converted.token };
  },
  delete: (params: DeleteParams) => ({
    endpoint: `/api/admin/v1/user-registration-tokens/${params.id}/revoke`,
    method: "POST",
  }),
  update: (params: UpdateParams) => ({
    endpoint: `/api/admin/v1/user-registration-tokens/${params.id}`,
    body: {
      usage_limit: params.data.uses_allowed ?? undefined,
      expires_at: toRfc3339(params.data.expiry_time),
    },
    method: "PUT",
  }),
});

/* eslint-disable @typescript-eslint/no-explicit-any */

// Helper shared between getMASUsersResource and getMASUsersAsMainResource
const mapMASUserItem = (item: MASUserResource, homeserverId?: string) => {
  const homeserver = homeserverId || localStorage.getItem("home_server") || "";
  return {
    id: item.id, // ULID — for mas_users data resource (ReferenceInput)
    mas_id: item.id,
    username: item.attributes.username,
    admin: item.attributes.admin,
    locked: !!item.attributes.locked_at,
    deactivated: !!item.attributes.deactivated_at,
    created_at: item.attributes.created_at,
    locked_at: item.attributes.locked_at,
    deactivated_at: item.attributes.deactivated_at,
    legacy_guest: item.attributes.legacy_guest,
    // Synapse-compatible fields
    name: `@${item.attributes.username}:${homeserver}`,
  };
};

export const getMASUsersResource = () => ({
  path: "/api/admin/v1/users",
  isMAS: true,
  map: (item: MASUserResource | { data: MASUserResource }) => {
    const u = "data" in item ? item.data : item;
    return mapMASUserItem(u);
  },
  data: "data",
  total: (json: MASUserListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[search]": filter.search,
      "filter[status]": filter.status,
      "filter[admin]": filter.admin,
      count: "true",
    }),
  create: (params: RaRecord) => ({
    endpoint: "/api/admin/v1/users",
    body: { username: params.username },
    method: "POST",
  }),
  update: (params: UpdateParams) => ({
    endpoint: `/api/admin/v1/users/${params.id}`,
    method: "GET",
  }),
  handleCreateResponse: (item: { data: MASUserResource }) => mapMASUserItem(item.data),
});

/**
 * MAS users resource for use as the main "users" resource in MAS mode.
 * Maps user IDs to Synapse-compatible format (@username:homeserver) so
 * all existing Synapse tabs (devices, rooms, connections, etc.) continue to work.
 * The MAS ULID is stored as mas_id for use by MAS action APIs.
 */
export const getMASUsersAsMainResource = () => ({
  path: "/api/admin/v1/users",
  isMAS: true,
  map: (item: MASUserResource | { data: MASUserResource }) => {
    const u = "data" in item ? item.data : item;
    const homeserver = localStorage.getItem("home_server") || "";
    return {
      ...mapMASUserItem(u, homeserver),
      id: `@${u.attributes.username}:${homeserver}`,
    };
  },
  enrichList: async (records: RaRecord[]) => {
    const synapseBaseUrl = localStorage.getItem("base_url") || "";
    return Promise.all(
      records.map(async record => {
        try {
          const matrixId = encodeURIComponent(record.id);
          const { json } = await jsonClient(`${synapseBaseUrl}/_synapse/admin/v2/users/${matrixId}`);
          return {
            ...record,
            avatar_src: json.avatar_url ?? null,
            displayname: json.displayname ?? null,
          };
        } catch {
          return record;
        }
      })
    );
  },
  data: "data",
  total: (json: MASUserListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      // support Synapse-style "name" search filter as well as MAS "search"
      "filter[search]": filter.name || filter.search,
      "filter[status]": filter.status,
      "filter[admin]": filter.admin !== undefined ? filter.admin : undefined,
      count: "true",
    }),
  getOne: async (params: { id: string | number }) => {
    const id = String(params.id);
    const username = id.startsWith("@") ? id.slice(1).split(":")[0] : id;
    const homeserver = localStorage.getItem("home_server") || "";
    const masBaseUrl = getMASBaseUrl();
    if (!masBaseUrl) throw new Error("MAS base URL not found");

    // Fetch MAS user data
    const query = filterUndefined({ "page[first]": 10, "filter[search]": username, count: "true" });
    const masUrl = `${masBaseUrl}/api/admin/v1/users?${new URLSearchParams(query as Record<string, string>).toString()}`;
    const { json } = await jsonClient(masUrl);

    const items: MASUserResource[] = (json?.data as MASUserResource[]) || [];
    const item = items.find(u => u.attributes.username === username);
    if (!item) throw new Error(`MAS user not found: ${username}`);

    const masRecord = { ...mapMASUserItem(item, homeserver), id: `@${item.attributes.username}:${homeserver}` };

    // Merge Synapse profile data (avatar, displayname, creation_ts_ms, suspended, shadow_banned)
    try {
      const synapseBaseUrl = localStorage.getItem("base_url") || "";
      const matrixId = encodeURIComponent(masRecord.id);
      const { json: synapseJson } = await jsonClient(`${synapseBaseUrl}/_synapse/admin/v2/users/${matrixId}`);
      return {
        ...masRecord,
        avatar_src: synapseJson.avatar_url ?? null,
        displayname: synapseJson.displayname ?? null,
        creation_ts_ms: synapseJson.creation_ts != null ? synapseJson.creation_ts * 1000 : null,
        suspended: !!synapseJson.suspended,
        shadow_banned: !!synapseJson.shadow_banned,
      };
    } catch {
      // Synapse data unavailable — return MAS-only record; UI gracefully shows what it has
      return masRecord;
    }
  },
  create: (params: RaRecord) => ({
    endpoint: "/api/admin/v1/users",
    body: {
      username:
        params.username ||
        (String(params.id || "").startsWith("@") ? String(params.id).slice(1).split(":")[0] : params.id),
    },
    method: "POST",
  }),
  handleCreateResponse: (item: { data: MASUserResource }) => {
    const homeserver = localStorage.getItem("home_server") || "";
    return { ...mapMASUserItem(item.data, homeserver), id: `@${item.data.attributes.username}:${homeserver}` };
  },
  // Re-fetch after beforeUpdate has dispatched MAS action calls
  update: (params: UpdateParams) => ({
    endpoint: `/api/admin/v1/users/${params.previousData.mas_id}`,
    method: "GET",
  }),
});

export const getMASUserEmailsResource = () => ({
  path: "/api/admin/v1/user-emails",
  isMAS: true,
  map: (item: MASUserEmailResource | { data: MASUserEmailResource }) => {
    const e = "data" in item ? item.data : item;
    return {
      id: e.id,
      email: e.attributes.email,
      user_id: e.attributes.user_id,
      created_at: e.attributes.created_at,
    };
  },
  data: "data",
  total: (json: MASUserEmailListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[user]": filter.user_id,
      "filter[email]": filter.email,
      count: "true",
    }),
  create: (params: RaRecord) => ({
    endpoint: "/api/admin/v1/user-emails",
    body: { user_id: params.user_id, email: params.email },
    method: "POST",
  }),
  handleCreateResponse: (item: { data: MASUserEmailResource }) => {
    const e = item.data;
    return { id: e.id, email: e.attributes.email, user_id: e.attributes.user_id, created_at: e.attributes.created_at };
  },
  delete: (params: DeleteParams) => ({
    endpoint: `/api/admin/v1/user-emails/${params.id}`,
    method: "DELETE",
  }),
});

export const getMASCompatSessionsResource = () => ({
  path: "/api/admin/v1/compat-sessions",
  isMAS: true,
  map: (item: MASCompatSessionResource | { data: MASCompatSessionResource }) => {
    const s = "data" in item ? item.data : item;
    return {
      id: s.id,
      user_id: s.attributes.user_id,
      device_id: s.attributes.device_id,
      created_at: s.attributes.created_at,
      user_agent: s.attributes.user_agent,
      last_active_at: s.attributes.last_active_at,
      last_active_ip: s.attributes.last_active_ip,
      finished_at: s.attributes.finished_at,
      human_name: s.attributes.human_name,
      active: !s.attributes.finished_at,
    };
  },
  data: "data",
  total: (json: MASCompatSessionListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[user]": filter.user_id,
      "filter[status]": filter.status,
      count: "true",
    }),
});

export const getMASAuth2SessionsResource = () => ({
  path: "/api/admin/v1/oauth2-sessions",
  isMAS: true,
  map: (item: MASOAuth2SessionResource | { data: MASOAuth2SessionResource }) => {
    const s = "data" in item ? item.data : item;
    return {
      id: s.id,
      user_id: s.attributes.user_id,
      client_id: s.attributes.client_id,
      scope: s.attributes.scope,
      created_at: s.attributes.created_at,
      finished_at: s.attributes.finished_at,
      user_agent: s.attributes.user_agent,
      last_active_at: s.attributes.last_active_at,
      last_active_ip: s.attributes.last_active_ip,
      human_name: s.attributes.human_name,
      active: !s.attributes.finished_at,
    };
  },
  data: "data",
  total: (json: MASOAuth2SessionListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[user]": filter.user_id,
      "filter[status]": filter.status,
      count: "true",
    }),
});

export const getMASPersonalSessionsResource = () => ({
  path: "/api/admin/v1/personal-sessions",
  isMAS: true,
  map: (item: MASPersonalSessionResource | { data: MASPersonalSessionResource }) => {
    const s = "data" in item ? item.data : item;
    return {
      id: s.id,
      owner_user_id: s.attributes.owner_user_id,
      human_name: s.attributes.human_name,
      scope: s.attributes.scope,
      created_at: s.attributes.created_at,
      revoked_at: s.attributes.revoked_at,
      last_active_at: s.attributes.last_active_at,
      last_active_ip: s.attributes.last_active_ip,
      expires_at: s.attributes.expires_at,
      active: !s.attributes.revoked_at,
    };
  },
  data: "data",
  total: (json: MASPersonalSessionListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[user]": filter.user_id,
      "filter[status]": filter.status,
      count: "true",
    }),
  create: (params: RaRecord) => ({
    endpoint: "/api/admin/v1/personal-sessions",
    body: filterUndefined({
      actor_user_id: params.actor_user_id,
      scope: params.scope,
      human_name: params.human_name,
      expires_in: params.expires_in ? Number(params.expires_in) : undefined,
    }),
    method: "POST",
  }),
  handleCreateResponse: (item: { data: MASPersonalSessionResource }) => {
    const s = item.data;
    return {
      id: s.id,
      owner_user_id: s.attributes.owner_user_id,
      human_name: s.attributes.human_name,
      scope: s.attributes.scope,
      created_at: s.attributes.created_at,
      revoked_at: s.attributes.revoked_at,
      last_active_at: s.attributes.last_active_at,
      last_active_ip: s.attributes.last_active_ip,
      expires_at: s.attributes.expires_at,
      active: !s.attributes.revoked_at,
      access_token: s.attributes.access_token,
    };
  },
  delete: (params: DeleteParams) => ({
    endpoint: `/api/admin/v1/personal-sessions/${params.id}/revoke`,
    method: "POST",
  }),
});

/* eslint-enable @typescript-eslint/no-explicit-any */

export const getMASUserSessionsResource = () => ({
  path: "/api/admin/v1/user-sessions",
  isMAS: true,
  map: (item: MASUserSessionResource | { data: MASUserSessionResource }) => {
    const s = "data" in item ? item.data : item;
    return {
      id: s.id,
      user_id: s.attributes.user_id,
      created_at: s.attributes.created_at,
      finished_at: s.attributes.finished_at,
      user_agent: s.attributes.user_agent,
      last_active_at: s.attributes.last_active_at,
      last_active_ip: s.attributes.last_active_ip,
      active: !s.attributes.finished_at,
    };
  },
  data: "data",
  total: (json: MASUserSessionListResponse) => json.meta?.count || 0,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[user]": filter.user_id,
      "filter[status]": filter.status,
      count: "true",
    }),
});

export const masLockUser = async (id: string, lock: boolean): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  const action = lock ? "lock" : "unlock";
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/${action}`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masDeactivateUser = async (id: string, active: boolean): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  const action = active ? "reactivate" : "deactivate";
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/${action}`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masSetAdmin = async (id: string, admin: boolean): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/set-admin`, {
      method: "POST",
      body: JSON.stringify({ admin }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masSetPassword = async (id: string, password: string): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/users/${encodeURIComponent(id)}/set-password`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masFinishSession = async (
  resource: "mas_compat_sessions" | "mas_oauth2_sessions",
  id: string
): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  const apiPath = resource === "mas_compat_sessions" ? "compat-sessions" : "oauth2-sessions";
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/${apiPath}/${encodeURIComponent(id)}/finish`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masRevokePersonalSession = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/personal-sessions/${encodeURIComponent(id)}/revoke`, {
      method: "POST",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const masFinishUserSession = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/user-sessions/${encodeURIComponent(id)}/finish`, { method: "POST" });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

export const getMASPolicyData = async (): Promise<MASPolicyData | null> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return null;
  try {
    const { json } = await jsonClient(`${masBaseUrl}/api/admin/v1/policy-data/latest`);
    const d = json.data as MASPolicyDataResource;
    return { id: d.id, data: d.attributes.data, created_at: d.attributes.created_at };
  } catch {
    return null;
  }
};

export const setMASPolicyData = async (data: unknown): Promise<{ success: boolean; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    await jsonClient(`${masBaseUrl}/api/admin/v1/policy-data`, {
      method: "POST",
      body: JSON.stringify({ data }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getMASUpstreamOAuthLinksResource = () => ({
  path: "/api/admin/v1/upstream-oauth-links",
  isMAS: true,
  map: (item: MASUpstreamOAuthLinkResource | { data: MASUpstreamOAuthLinkResource }) => {
    const l = "data" in item ? item.data : item;
    return {
      id: l.id,
      user_id: l.attributes.user_id,
      provider_id: l.attributes.provider_id,
      subject: l.attributes.subject,
      human_account_name: l.attributes.human_account_name,
      created_at: l.attributes.created_at,
    };
  },
  data: "data",
  total: (json: MASUpstreamOAuthLinkListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[user]": filter.user_id,
      "filter[provider]": filter.provider_id,
      count: "true",
    }),
  create: (params: RaRecord) => ({
    endpoint: "/api/admin/v1/upstream-oauth-links",
    body: filterUndefined({
      user_id: params.user_id,
      provider_id: params.provider_id,
      subject: params.subject,
      human_account_name: params.human_account_name || undefined,
    }),
    method: "POST",
  }),
  handleCreateResponse: (item: { data: MASUpstreamOAuthLinkResource }) => {
    const l = item.data;
    return {
      id: l.id,
      user_id: l.attributes.user_id,
      provider_id: l.attributes.provider_id,
      subject: l.attributes.subject,
      human_account_name: l.attributes.human_account_name,
      created_at: l.attributes.created_at,
    };
  },
  delete: (params: DeleteParams) => ({
    endpoint: `/api/admin/v1/upstream-oauth-links/${params.id}`,
    method: "DELETE",
  }),
});

export const getMASUpstreamOAuthProvidersResource = () => ({
  path: "/api/admin/v1/upstream-oauth-providers",
  isMAS: true,
  map: (item: MASUpstreamOAuthProviderResource | { data: MASUpstreamOAuthProviderResource }) => {
    const p = "data" in item ? item.data : item;
    return {
      id: p.id,
      issuer: p.attributes.issuer,
      human_name: p.attributes.human_name,
      brand_name: p.attributes.brand_name,
      created_at: p.attributes.created_at,
      disabled_at: p.attributes.disabled_at,
      enabled: !p.attributes.disabled_at,
    };
  },
  data: "data",
  total: (json: MASUpstreamOAuthProviderListResponse) => json.meta?.count || 0,
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) =>
    filterUndefined({
      "page[first]": perPage,
      "page[after]": cursor,
      "filter[enabled]": filter.enabled,
      count: "true",
    }),
});
/* eslint-enable @typescript-eslint/no-explicit-any */

export const masRegeneratePersonalSession = async (
  id: string
): Promise<{ success: boolean; token?: string; error?: string }> => {
  const masBaseUrl = getMASBaseUrl();
  if (!masBaseUrl) return { success: false, error: "MAS base URL not found" };
  try {
    const { json } = await jsonClient(
      `${masBaseUrl}/api/admin/v1/personal-sessions/${encodeURIComponent(id)}/regenerate`,
      { method: "POST" }
    );
    return { success: true, token: json?.data?.attributes?.token };
  } catch (error) {
    if (error instanceof HttpError) return { success: false, error: error.body?.errors?.[0]?.title || error.message };
    throw error;
  }
};
