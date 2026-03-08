import { PaginationPayload } from "react-admin";

import { MASRegistrationToken, MASRegistrationTokenListResponse, MASRegistrationTokenResource } from "./types";
import { jsonClient } from "./httpClients";

/**
 * Detect if the homeserver is using Matrix Authentication Service (MAS)
 * by checking the token endpoint stored during authentication
 */
export const isMasInstance = (): boolean => {
  const tokenEndpoint = localStorage.getItem("token_endpoint");
  if (!tokenEndpoint) return false;
  // MAS uses /oauth2/token endpoint
  return tokenEndpoint.endsWith("/oauth2/token");
};

/**
 * Extract the MAS base URL from the token endpoint
 * e.g., "http://localhost:8007/oauth2/token" -> "http://localhost:8007"
 */
export const getMasBaseUrl = (): string | null => {
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
 * Check if MAS admin API is available by attempting a health check
 */
export const checkMasAdminApiAvailable = async (): Promise<boolean> => {
  const masBaseUrl = getMasBaseUrl();
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
    // Additional fields for MAS
    last_used_at: resource.attributes.last_used_at,
    revoked_at: resource.attributes.revoked_at,
  };
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const filterUndefined = (obj: Record<string, any>) => {
  return Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined));
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
