import { DeleteParams, HttpError, PaginationPayload, RaRecord, UpdateParams } from "react-admin";
import { useStore } from "react-admin";

import {
  MASRegistrationToken,
  MASRegistrationTokenListResponse,
  MASRegistrationTokenResource,
  MASRegistrationTokensResourceType,
} from "./types";
import { jsonClient } from "./httpClients";

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
  const isMasEndpoint = !!tokenEndpoint && tokenEndpoint.endsWith("/oauth2/token");

  if (isMasEndpoint && (await checkMASAdminApiAvailable())) {
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
export const getMasTokenResource = (
  token: MASRegistrationToken | MASRegistrationTokenResource
): MASRegistrationTokenResource => {
  return "data" in token ? token.data : token;
};

export const convertMasTokenToSynapse = (masToken: MASRegistrationToken | MASRegistrationTokenResource) => {
  const resource = getMasTokenResource(masToken);
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

// Cursor-based pagination state for MAS registration tokens
const masRegistrationTokensPageCursors = new Map<string, Map<number, string>>();

export const getMasRegistrationTokensCursorKey = (params: PaginationPayload, valid?: boolean) => {
  return JSON.stringify({
    perPage: params.perPage,
    valid,
  });
};

export const getMasRegistrationTokensPageCursor = (cacheKey: string, page: number) => {
  return masRegistrationTokensPageCursors.get(cacheKey)?.get(page);
};

export const setMasRegistrationTokensPageCursor = (cacheKey: string, page: number, cursor: string) => {
  const cache = masRegistrationTokensPageCursors.get(cacheKey) ?? new Map<number, string>();
  cache.set(page, cursor);
  masRegistrationTokensPageCursors.set(cacheKey, cache);
};

export const getMasNextPageCursor = (json: MASRegistrationTokenListResponse) => {
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
    const resource = getMasTokenResource(token);
    const converted = convertMasTokenToSynapse(resource);
    return { ...converted, id: resource.id || converted.token };
  },
  data: "data",
  total: (json: MASRegistrationTokenListResponse) => json.meta?.count || 0,
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
    const resource = getMasTokenResource(token);
    const converted = convertMasTokenToSynapse(resource);
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
