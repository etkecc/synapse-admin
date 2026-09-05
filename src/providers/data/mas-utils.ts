// MAS (Matrix Authentication Service) utility functions, shared by mas.ts, mas-actions.ts, and index.ts.

import { HttpError, useStore } from "react-admin";

import { jsonClient } from "../http";
import { MASRegistrationToken, MASRegistrationTokenResource } from "../types";

// Reads the cached MAS flag for non-React code (dataProvider, serverVersion); components use useIsMAS instead.
export const isMAS = (): boolean => {
  return localStorage.getItem("RaStore.isMAS") === "true";
};

// Reactive counterpart to isMAS, backed by react-admin's store.
export const useIsMAS = (): boolean => {
  const [value] = useStore<boolean>("isMAS", false);
  return value;
};

// Flag semantics: MAS is active AND its admin API responded to a health check.
export const setIsMAS = (value: boolean): void => {
  localStorage.setItem("RaStore.isMAS", JSON.stringify(value));
};

// Extracts the MAS base URL from the token endpoint, e.g. ".../oauth2/token" -> the origin without that suffix.
export const getMASBaseUrl = (): string | null => {
  const tokenEndpoint = localStorage.getItem("token_endpoint");
  if (!tokenEndpoint) return null;

  return tokenEndpoint.replace(/\/oauth2\/token$/, "");
};

// Converts a Unix ms timestamp to RFC 3339, the format the MAS API expects for expiry dates.
export const toRfc3339 = (timestamp: number | undefined | null): string | undefined => {
  if (!timestamp) return undefined;
  return new Date(timestamp).toISOString();
};

// Only called once at login time, never on page refresh.
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

// Detects MAS and admin API availability, then sets the cached flag; called once at login/OIDC callback.
export const detectAndSetMAS = async (): Promise<void> => {
  const tokenEndpoint = localStorage.getItem("token_endpoint");
  const isMASEndpoint = !!tokenEndpoint && tokenEndpoint.endsWith("/oauth2/token");

  if (isMASEndpoint && (await checkMASAdminApiAvailable())) {
    setIsMAS(true);
  } else {
    setIsMAS(false);
  }
};

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

// Unwraps a MAS registration token's JSON:API resource object, if wrapped.
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

// Maps MAS status/admin filters to Synapse v3 params; locked needs client-side filtering.
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const mapMASUserListFilterToSynapse = (filter: Record<string, any>) => {
  const status = filter.status;
  return {
    deactivated: status === "active" ? false : status === "deactivated" ? true : filter.deactivated,
    locked: status === "active" ? false : status === "locked" ? true : filter.locked,
    admins: filter.admin,
  };
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

// Legacy registration-token helpers; delegate to generic functions
export const getMASRegistrationTokensCursorKey = (params: { perPage: number }, valid?: boolean) =>
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
