import {
  DataProvider,
  DeleteManyParams,
  DeleteParams,
  HttpError,
  Identifier,
  PaginationPayload,
  RaRecord,
  SortPayload,
  UpdateParams,
  withLifecycleCallbacks,
} from "react-admin";

import { jsonClient } from "../http";
import {
  getMASBaseUrl,
  getMASNextPageCursor,
  buildMASCursorKey,
  getMASCursor,
  setMASCursor,
  filterUndefined,
  revokeRegistrationToken,
  isMAS,
  getMASRegistrationTokensResource,
  getMASUsersResource,
  getMASUsersAsMainResource,
  getMASUserEmailsResource,
  getMASCompatSessionsResource,
  getMASAuth2SessionsResource,
  getMASPersonalSessionsResource,
  getMASUserSessionsResource,
  getMASUpstreamOAuthLinksResource,
  getMASUpstreamOAuthProvidersResource,
  masLockUser,
  masDeactivateUser,
  masSetAdmin,
  masSetPassword,
  masFinishSession,
  masRevokePersonalSession,
  masRegeneratePersonalSession,
  masFinishUserSession,
  getMASPolicyData,
  setMASPolicyData,
} from "./mas";
import { synapseResourceMap } from "./synapse";
import {
  synapseRegistrationTokensResource,
  deleteMedia,
  purgeRemoteMedia,
  getFeatures,
  updateFeatures,
  getRateLimits,
  setRateLimits,
  getSentInviteCount,
  getCumulativeJoinedRoomCount,
  getAccountData,
  checkUsernameAvailability,
  blockRoom,
  deleteDevices,
  getRoomBlockStatus,
  joinUserToRoom,
  makeRoomAdmin,
  quarantineRoomMedia,
  quarantineUserMedia,
  purgeHistory,
  getPurgeHistoryStatus,
  deleteRoom,
  getRoomDeleteStatus,
  suspendUser,
  shadowBanUser,
  resetPassword,
  loginAsUser,
  eraseUser,
  renewAccountValidity,
  allowCrossSigningReplacement,
  findUserByThreepid,
  findUserByAuthProvider,
  getEventByTimestamp,
  getEventContext,
  getRoomMessages,
  getRoomHierarchy,
  getAdminClientConfig,
  setAdminClientConfig,
  deleteUserMedia,
  redactUserEvents,
  getRedactStatus,
  fetchEvent,
} from "./synapse";
import { uploadMedia } from "../matrix";
import { CACHED_MANY_REF, invalidateManyRefCache, resourceMap } from "../../resourceMap";
import { etkeProviderMethods } from "./etke";
import { SynapseDataProvider } from "../types";
import { isSystemUser, getLocalpart } from "../../utils/mxid";

/**
 * Initialize all flag-dependent resources and patch them into resourceMap.
 * Reads the cached MAS flag synchronously — no HTTP calls needed.
 * Add new MAS-dependent resources here as they are introduced.
 */
export const initResources = () => {
  if (isMAS()) {
    resourceMap.registration_tokens = getMASRegistrationTokensResource();
    // Swap users to MAS-backed resource; Synapse tabs still work because id = @user:homeserver
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).users = getMASUsersAsMainResource();
    // mas_users registered with ULID ids for ReferenceInput in user-email create
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_users = getMASUsersResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_user_emails = getMASUserEmailsResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_compat_sessions = getMASCompatSessionsResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_oauth2_sessions = getMASAuth2SessionsResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_personal_sessions = getMASPersonalSessionsResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_user_sessions = getMASUserSessionsResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_upstream_oauth_links = getMASUpstreamOAuthLinksResource();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).mas_upstream_oauth_providers = getMASUpstreamOAuthProvidersResource();
  } else {
    resourceMap.registration_tokens = synapseRegistrationTokensResource;
    // Restore Synapse users resource
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (resourceMap as any).users = synapseResourceMap.users;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_users;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_user_emails;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_compat_sessions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_oauth2_sessions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_personal_sessions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_user_sessions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_upstream_oauth_links;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (resourceMap as any).mas_upstream_oauth_providers;
  }
};

// Initialize on module load to handle page refresh when already logged in
if (localStorage.getItem("access_token")) {
  initResources();
}

const resolveResource = (resource: string) => {
  const homeserver = localStorage.getItem("base_url");
  if (!homeserver) throw Error("Homeserver not set");
  if (!(resource in resourceMap)) throw Error(`Resource ${resource} not found`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = resourceMap[resource as keyof typeof resourceMap] as any;
  const baseUrl = res.isMAS ? getMASBaseUrl() : homeserver;
  return { res, baseUrl, homeserver };
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
function filterNullValues(key: string, value: any) {
  // Filtering out null properties
  // to reset user_type from user, it must be null
  if (value === null && key !== "user_type") {
    return undefined;
  }
  return value;
}

function getSearchOrder(order: "ASC" | "DESC") {
  if (order === "DESC") {
    return "b";
  } else {
    return "f";
  }
}

const buildSynapseListQuery = (
  params: {
    user_id: unknown;
    search_term: unknown;
    name: unknown;
    destination: unknown;
    guests: unknown;
    deactivated: unknown;
    locked: unknown;
    suspended: unknown;
    shadow_banned: unknown;
    valid: unknown;
    public_rooms: unknown;
    empty_rooms: unknown;
    action_name: unknown;
    resource_id: unknown;
    status: unknown;
    max_timestamp: unknown;
  },
  from: number,
  limit: number,
  field: string,
  order: "ASC" | "DESC"
) => ({
  from,
  limit,
  user_id: params.user_id,
  search_term: params.search_term,
  name: params.name,
  destination: params.destination,
  guests: isMAS() ? false : params.guests,
  deactivated: params.deactivated,
  locked: params.locked,
  suspended: params.suspended,
  shadow_banned: params.shadow_banned,
  valid: params.valid,
  order_by: field === "creation_ts_ms" ? "creation_ts" : field,
  dir: getSearchOrder(order),
  public_rooms: params.public_rooms,
  empty_rooms: params.empty_rooms,
  action_name: params.action_name,
  resource_id: params.resource_id,
  status: params.status,
  max_timestamp: params.max_timestamp,
});

const SYSTEM_USERS_SCAN_CHUNK_SIZE = 250;

interface SystemUsersScanCacheEntry {
  // Whether the backend list has been fully scanned for this filter/sort combination.
  backendExhausted: boolean;
  // Raw backend offset already consumed while building the filtered virtual dataset.
  backendOffset: number;
  // Filtered users accumulated so later pages can reuse prior scan work.
  filteredRecords: RaRecord[];
}

const systemUsersScanCache = new Map<string, SystemUsersScanCacheEntry>();

export const clearSystemUsersScanCache = () => {
  systemUsersScanCache.clear();
};

const reverseSearchScanCache = new Map<string, SystemUsersScanCacheEntry>();

export const clearReverseSearchScanCache = () => {
  reverseSearchScanCache.clear();
};

const getReverseSearchScanCacheKey = (
  resource: string,
  baseUrl: string,
  query: Record<string, any>,
  field: string,
  order: "ASC" | "DESC",
  excludeTerm: string
) => JSON.stringify({ resource, baseUrl, query: filterUndefined(query), field, order, excludeTerm });

let _dataProviderNotifier: ((key: string) => void) | null = null;

export const setDataProviderNotifier = (fn: (key: string) => void) => {
  _dataProviderNotifier = fn;
};

// Cache key for the client-side system_users virtual dataset. It must vary with every
// server-side filter/sort input because those affect which backend users are scanned.
const getSystemUsersScanCacheKey = (
  resource: string,
  baseUrl: string,
  query: Record<string, any>,
  field: string,
  order: "ASC" | "DESC",
  wantSystem: boolean
) =>
  JSON.stringify({
    resource,
    baseUrl,
    query: filterUndefined(query),
    field,
    order,
    wantSystem,
  });

import createLogger from "../../utils/logger";

const log = createLogger("data");

const baseDataProvider: SynapseDataProvider = {
  getList: async (resource, params) => {
    const { res, baseUrl } = resolveResource(resource);

    const {
      user_id,
      name,
      guests,
      deactivated,
      locked,
      suspended,
      shadow_banned,
      search_term,
      destination,
      valid,
      public_rooms,
      empty_rooms,
      action_name,
      resource_id,
      status,
      max_timestamp,
      system_users,
    } = params.filter;
    const { page, perPage } = params.pagination as PaginationPayload;
    log.debug("getList", resource, { page, perPage, filter: params.filter });
    const { field, order } = params.sort as SortPayload;
    const from = (page - 1) * perPage;

    // Determine reverse search flag before res.getList delegation
    const isReverseSearch = resource === "users" && typeof name === "string" && name.startsWith("!");

    // Allow resource to override getList entirely (e.g. MAS users Synapse-first sort)
    // Skip when reverse search is active — handled below for both modes.
    if (!isReverseSearch && res.getList) {
      const result = await res.getList({
        pagination: params.pagination as PaginationPayload,
        sort: params.sort as SortPayload,
        filter: params.filter,
      });
      if (result !== null) return result;
    }

    // Build query based on API type
    let query: Record<string, any>;
    if (res.isMAS) {
      const cursorKey = buildMASCursorKey(resource, perPage, params.filter);
      const pageAfter = page > 1 ? getMASCursor(cursorKey, page) : undefined;
      query = res.buildListQuery(perPage, pageAfter, params.filter);
    } else {
      // Synapse API
      query = buildSynapseListQuery(
        {
          user_id,
          search_term,
          name,
          destination,
          guests,
          deactivated,
          locked,
          suspended,
          shadow_banned,
          valid,
          public_rooms,
          empty_rooms,
          action_name,
          resource_id,
          status,
          max_timestamp,
        },
        from,
        perPage,
        field,
        order
      );
    }

    // Client-side post-filter for system (appservice-managed) users
    const shouldFilterSystemUsers =
      resource === "users" && !res.isMAS && system_users !== undefined && system_users !== null;
    if (shouldFilterSystemUsers) {
      const wantSystem = system_users === true || system_users === "true";
      const endpoint_url = baseUrl + (res.listPath || res.path);
      const pageStart = from;
      const pageEnd = pageStart + perPage;
      // One extra filtered record is enough to tell React Admin that another page exists.
      const nextPageThreshold = pageEnd + 1;
      const scanQuery = buildSynapseListQuery(
        {
          user_id,
          search_term,
          name,
          destination,
          guests,
          deactivated,
          locked,
          suspended,
          shadow_banned,
          valid,
          public_rooms,
          empty_rooms,
          action_name,
          resource_id,
          status,
          max_timestamp,
        },
        0,
        0,
        field,
        order
      );
      const cacheKey = getSystemUsersScanCacheKey(resource, String(baseUrl), scanQuery, field, order, wantSystem);
      const cachedScan = systemUsersScanCache.get(cacheKey);
      const scanState: SystemUsersScanCacheEntry = cachedScan || {
        backendExhausted: false,
        backendOffset: 0,
        filteredRecords: [],
      };

      let loopRequestCount = 0;
      while (!scanState.backendExhausted && scanState.filteredRecords.length < nextPageThreshold) {
        loopRequestCount++;
        if (loopRequestCount === 3) {
          _dataProviderNotifier?.("resources.users.action.system_users_scan_in_progress");
        }
        // Fetch backend users in larger chunks to avoid many small round-trips when the
        // UI-only filter removes most records from a page.
        const backendLimit = Math.max(perPage, SYSTEM_USERS_SCAN_CHUNK_SIZE);
        const pagedQuery = buildSynapseListQuery(
          {
            user_id,
            search_term,
            name,
            destination,
            guests,
            deactivated,
            locked,
            suspended,
            shadow_banned,
            valid,
            public_rooms,
            empty_rooms,
            action_name,
            resource_id,
            status,
            max_timestamp,
          },
          scanState.backendOffset,
          backendLimit,
          field,
          order
        );
        const pagedUrl = `${endpoint_url}?${new URLSearchParams(filterUndefined(pagedQuery)).toString()}`;
        const { json } = await jsonClient(pagedUrl);
        const rawData = json[res.data] || [];
        const resolvedData = await Promise.all(rawData.map(res.map));
        const filteredData = resolvedData.filter(record => isSystemUser(record.id) === wantSystem);
        scanState.filteredRecords.push(...filteredData);
        scanState.backendOffset += rawData.length;

        const serverTotal = res.total(json, scanState.backendOffset, backendLimit);
        scanState.backendExhausted =
          rawData.length === 0 || scanState.backendOffset >= serverTotal || rawData.length < backendLimit;
      }

      systemUsersScanCache.set(cacheKey, scanState);
      // Paginate over the filtered virtual dataset, not over raw backend pages.
      const pagedData = scanState.filteredRecords.slice(pageStart, pageEnd);
      const hasNextPage = scanState.backendExhausted
        ? scanState.filteredRecords.length > pageEnd
        : scanState.filteredRecords.length >= nextPageThreshold;

      return {
        data: pagedData as any,
        total: scanState.backendExhausted ? scanState.filteredRecords.length : undefined,
        pageInfo: {
          hasPreviousPage: page > 1,
          hasNextPage,
        },
      };
    }

    if (isReverseSearch) {
      const excludeTerm = name.slice(1).toLowerCase();
      // MAS mode: scan Synapse v3 directly (getMASUsersAsMainResource is Synapse-first)
      const synapseBaseUrl = res.isMAS ? localStorage.getItem("base_url") || "" : String(baseUrl);
      const scanEndpoint = res.isMAS
        ? `${synapseBaseUrl}/_synapse/admin/v3/users`
        : synapseBaseUrl + (res.listPath || res.path);

      // Use Synapse user map/data/total — both modes scan the same Synapse v3 API
      const scanMap = synapseResourceMap.users.map;
      const scanDataKey = synapseResourceMap.users.data;
      const scanTotal = synapseResourceMap.users.total;

      const pageStart = from;
      const pageEnd = pageStart + perPage;
      const nextPageThreshold = pageEnd + 1;

      const scanQuery = buildSynapseListQuery(
        {
          user_id,
          search_term,
          name: undefined,
          destination,
          guests: res.isMAS ? false : guests,
          deactivated,
          locked,
          suspended,
          shadow_banned,
          valid,
          public_rooms,
          empty_rooms,
          action_name,
          resource_id,
          status,
          max_timestamp,
        },
        0,
        0,
        field,
        order
      );
      const cacheKey = getReverseSearchScanCacheKey(resource, synapseBaseUrl, scanQuery, field, order, excludeTerm);
      const cachedScan = reverseSearchScanCache.get(cacheKey);
      const scanState: SystemUsersScanCacheEntry = cachedScan || {
        backendExhausted: false,
        backendOffset: 0,
        filteredRecords: [],
      };

      const MAX_REVERSE_SCAN_REQUESTS = 100;
      let loopRequestCount = 0;
      while (
        !scanState.backendExhausted &&
        scanState.filteredRecords.length < nextPageThreshold &&
        loopRequestCount < MAX_REVERSE_SCAN_REQUESTS
      ) {
        loopRequestCount++;
        if (loopRequestCount === 3) {
          _dataProviderNotifier?.("resources.users.action.reverse_search_scan_in_progress");
        }
        const backendLimit = Math.max(perPage, SYSTEM_USERS_SCAN_CHUNK_SIZE);
        const pagedQuery = buildSynapseListQuery(
          {
            user_id,
            search_term,
            name: undefined,
            destination,
            guests: res.isMAS ? false : guests,
            deactivated,
            locked,
            suspended,
            shadow_banned,
            valid,
            public_rooms,
            empty_rooms,
            action_name,
            resource_id,
            status,
            max_timestamp,
          },
          scanState.backendOffset,
          backendLimit,
          field,
          order
        );
        const pagedUrl = `${scanEndpoint}?${new URLSearchParams(filterUndefined(pagedQuery)).toString()}`;
        const { json } = await jsonClient(pagedUrl);
        const rawData = json[scanDataKey] || [];
        const resolvedData = await Promise.all(rawData.map(scanMap));

        // Exclude users whose localpart or displayname contains the term
        const filteredData = resolvedData.filter(record => {
          const localpartLower = String(getLocalpart(record.id || "")).toLowerCase();
          const displayLower = String(record.displayname || "").toLowerCase();
          return !localpartLower.includes(excludeTerm) && !displayLower.includes(excludeTerm);
        });

        scanState.filteredRecords.push(...filteredData);
        scanState.backendOffset += rawData.length;
        const serverTotal = scanTotal(json);
        scanState.backendExhausted =
          rawData.length === 0 || scanState.backendOffset >= serverTotal || rawData.length < backendLimit;
      }

      reverseSearchScanCache.set(cacheKey, scanState);
      // eslint-disable-next-line prefer-const
      let pagedData: RaRecord[] = scanState.filteredRecords.slice(pageStart, pageEnd);

      // For MAS mode: enrich final page with MAS-specific fields (locked, mas_id, etc.)
      if (res.enrichList) {
        pagedData = await res.enrichList(pagedData);
      }

      const hasNextPage = scanState.backendExhausted
        ? scanState.filteredRecords.length > pageEnd
        : scanState.filteredRecords.length >= nextPageThreshold;

      return {
        data: pagedData as any,
        total: scanState.backendExhausted ? scanState.filteredRecords.length : undefined,
        pageInfo: {
          hasPreviousPage: page > 1,
          hasNextPage,
        },
      };
    }

    const endpoint_url = baseUrl + (res.listPath || res.path);
    const url = res.noQueryParams
      ? endpoint_url
      : `${endpoint_url}?${new URLSearchParams(filterUndefined(query)).toString()}`;

    let json: Record<string, any>;
    try {
      ({ json } = await jsonClient(url));
    } catch (error) {
      // Some resources map known server errors to an empty result rather than
      // propagating the error to React-Admin (which would prevent the empty
      // state from rendering).  E.g. Synapse returns 500 for
      // database_room_statistics when the stats table hasn't been populated yet.
      // See: https://github.com/element-hq/synapse/issues/19561
      if (res.ignoredErrors?.includes((error as any)?.status)) {
        return { data: [], total: 0 };
      }
      throw error;
    }
    let formattedData = json[res.data].map(res.map);

    if (res.isMAS) {
      const cursorKey = buildMASCursorKey(resource, perPage, params.filter);
      const nextCursor = getMASNextPageCursor(json);
      if (nextCursor) {
        setMASCursor(cursorKey, page + 1, nextCursor);
      }
    }

    if (res.enrichList) {
      formattedData = await res.enrichList(formattedData);
    }

    return {
      data: formattedData,
      total: res.total(json, from, perPage),
    };
  },

  getOne: async (resource, params) => {
    log.debug("getOne", resource, params.id);
    const { res, baseUrl } = resolveResource(resource);

    // Allow resource configs to provide a custom async getOne (e.g. MAS users by Matrix ID)
    if (res.getOne) {
      const data = await res.getOne(params);
      return { data };
    }

    const endpoint_url = baseUrl + res.path;
    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`);
    return { data: res.map(json) };
  },

  getMany: async (resource, params) => {
    log.debug("getMany", resource, `${params.ids.length} ids`);
    const { res, baseUrl } = resolveResource(resource);
    const homeserver = localStorage.getItem("home_server");

    // If the resource provides a custom getOne (e.g. MAS users, which use ULIDs and can't be
    // fetched by Matrix ID via the standard path), delegate each lookup to it.
    if (res.getOne) {
      const data = await Promise.all(
        params.ids.map(async id => {
          // external/federated users are not on this homeserver — return stub as in Synapse path
          if (homeserver && resource === "users" && !(id as string).endsWith(homeserver)) {
            return { id, name: id } as RaRecord;
          }
          try {
            return (await res.getOne({ id })) as RaRecord;
          } catch {
            return { id } as RaRecord;
          }
        })
      );
      return { data, total: data.length };
    }

    const endpoint_url = baseUrl + res.path;
    const data = await Promise.all(
      params.ids.map(async id => {
        // Federated/external users can't be queried via the Synapse admin API.
        // Return a minimal stub without going through res.map — this prevents res.map
        // from setting boolean fields like is_guest: false on records that have no real data.
        if (homeserver && resource === "users" && !(id as string).endsWith(homeserver)) {
          return { id, name: id } as RaRecord;
        }
        try {
          const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(id)}`);
          return (await Promise.resolve(res.map(json))) as RaRecord;
        } catch (error) {
          // Handle deleted/non-existent resources gracefully by returning minimal data
          // This can happen when a room is deleted but still referenced in joined_rooms
          if (error instanceof HttpError && error.status === 404) {
            const json = resource === "rooms" ? { room_id: id, name: id } : { id };
            return (await Promise.resolve(res.map(json))) as RaRecord;
          }
          throw error;
        }
      })
    );
    return { data: data as any[], total: data.length };
  },

  getManyReference: async (resource, params) => {
    log.debug("getManyReference", resource, `ref=${params.id}`);
    const { res, homeserver } = resolveResource(resource);
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const from = (page - 1) * perPage;
    const query = {
      from: from,
      limit: perPage,
      order_by: field,
      dir: getSearchOrder(order),
    };

    const ref = res.reference(params.id);

    const endpoint_url = `${homeserver}${ref.endpoint}?${new URLSearchParams(filterUndefined(query)).toString()}`;
    const CACHE_KEY = ref.endpoint;
    let jsonData: any[];
    let total: number;

    if (CACHED_MANY_REF[CACHE_KEY]) {
      let allData: any[] = CACHED_MANY_REF[CACHE_KEY]["data"];
      // Apply localOnly filter for room_members: exclude federated users
      if (resource === "room_members" && params.filter?.localOnly) {
        const hs = localStorage.getItem("home_server") || "";
        allData = allData.filter((m: any) => String(m).endsWith(`:${hs}`));
      }
      total = allData.length;
      const safeFrom = from < total ? from : 0;
      jsonData = allData.slice(safeFrom, safeFrom + perPage);
    } else {
      const { json } = await jsonClient(endpoint_url);
      jsonData = json[res.data];

      // memberships endpoint needs special handling
      if (resource === "memberships") {
        jsonData = Object.entries(jsonData).map(([room_id, membership]) => ({
          id: room_id,
          membership: membership,
        }));
      }

      total = res.total(json, from, perPage);

      // only cache if the endpoint returned all data (no server-side pagination)
      if (jsonData.length >= total) {
        CACHED_MANY_REF[CACHE_KEY] = { data: jsonData, total: total };
        // Apply localOnly filter for room_members: exclude federated users
        if (resource === "room_members" && params.filter?.localOnly) {
          const hs = localStorage.getItem("home_server") || "";
          jsonData = jsonData.filter((m: any) => String(m).endsWith(`:${hs}`));
        }
        total = jsonData.length;
        const safeFrom = from < total ? from : 0;
        jsonData = jsonData.slice(safeFrom, safeFrom + perPage);
      }
    }

    return {
      data: jsonData.map(res.map),
      total: total,
    };
  },

  update: async (resource, params) => {
    log.debug("update", resource, params.id);
    const { res, baseUrl } = resolveResource(resource);
    const endpoint_url = baseUrl + res.path;

    if (res.update) {
      const upd = res.update(params);
      const options: { method: string; body?: string } = { method: upd.method };
      if (upd.method !== "GET" && "body" in upd) {
        options.body = JSON.stringify(upd.body, filterNullValues);
      }
      const { json } = await jsonClient(baseUrl + upd.endpoint, options);
      return { data: res.map(json) };
    }

    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`, {
      method: "PUT",
      body: JSON.stringify(params.data, filterNullValues),
    });
    return { data: res.map(json) };
  },

  updateMany: async (resource, params) => {
    log.debug("updateMany", resource, `${params.ids.length} ids`);
    const { res, homeserver } = resolveResource(resource);
    const endpoint_url = homeserver + res.path;
    const responses = await Promise.all(
      params.ids.map(id =>
        jsonClient(`${endpoint_url}/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: JSON.stringify(params.data, filterNullValues),
        })
      )
    );
    return { data: responses.map(({ json }) => json) };
  },

  create: async (resource, params) => {
    log.debug("create", resource);
    const { res, baseUrl } = resolveResource(resource);
    if (!("create" in res)) return Promise.reject(new Error(`Create not supported for ${resource}`));

    const create = res.create(params.data);
    const endpoint_url = baseUrl + create.endpoint;
    const { json } = await jsonClient(endpoint_url, {
      method: create.method,
      body: JSON.stringify(create.body, filterNullValues),
    });

    // for some resources, the response is empty, so we return the adjusted input data as response
    if (create?.response) {
      return { data: create.response(params.data) };
    }

    // Use custom response handler if provided (e.g., for MAS)
    if (res.handleCreateResponse) {
      const converted = res.handleCreateResponse(json);
      return { data: converted };
    }

    return { data: res.map(json) };
  },

  createMany: async (resource: string, params: { ids: Identifier[]; data: RaRecord }) => {
    log.debug("createMany", resource, `${params.ids.length} ids`);
    const { res, homeserver } = resolveResource(resource);
    if (!("create" in res)) throw Error(`Create ${resource} is not allowed`);

    const responses = await Promise.all(
      params.ids.map(id => {
        params.data.id = id;
        const cre = res.create(params.data);
        const endpoint_url = homeserver + cre.endpoint;
        return jsonClient(endpoint_url, {
          method: cre.method,
          body: JSON.stringify(cre.body, filterNullValues),
        });
      })
    );
    return { data: responses.map(({ json }) => json) };
  },

  delete: async (resource, params) => {
    log.debug("delete", resource, params.id);
    const { res, baseUrl } = resolveResource(resource);

    if ("delete" in res) {
      const del = res.delete(params);
      const endpoint_url = baseUrl + del.endpoint;
      const { json } = await jsonClient(endpoint_url, {
        method: "method" in del ? del.method : "DELETE",
        body: "body" in del ? JSON.stringify(del.body) : null,
      });
      if (del?.response) {
        return { data: del.response(params.previousData) };
      }

      return { data: json };
    } else {
      const endpoint_url = baseUrl + res.path;
      const { json } = await jsonClient(`${endpoint_url}/${params.id}`, {
        method: "DELETE",
        body: JSON.stringify(params.previousData, filterNullValues),
      });
      return { data: json };
    }
  },

  deleteMany: async (resource, params) => {
    log.debug("deleteMany", resource, `${params.ids.length} ids`);
    const { res, baseUrl } = resolveResource(resource);

    if ("delete" in res) {
      const responses = await Promise.all(
        params.ids.map(id => {
          const del = res.delete({ ...params, id: id });
          const endpoint_url = baseUrl + del.endpoint;
          return jsonClient(endpoint_url, {
            method: "method" in del ? del.method : "DELETE",
            body: "body" in del ? JSON.stringify(del.body) : null,
          });
        })
      );

      return {
        data: responses.map(({ json }) => json),
      };
    } else {
      const endpoint_url = baseUrl + res.path;
      const responses = await Promise.all(
        params.ids.map(id =>
          jsonClient(`${endpoint_url}/${id}`, {
            method: "DELETE",
            // body: JSON.stringify(params.data, filterNullValues),  @FIXME
          })
        )
      );
      return { data: responses.map(({ json }) => json) };
    }
  },

  // Custom methods (https://marmelab.com/react-admin/DataProviders.html#adding-custom-methods)

  /**
   * Delete media by date or size
   *
   * @link https://matrix-org.github.io/synapse/latest/admin_api/media_admin_api.html#delete-local-media-by-date-or-size
   */
  deleteMedia,
  purgeRemoteMedia,
  uploadMedia,
  fetchEvent,
  getFeatures,
  updateFeatures,
  getRateLimits,
  setRateLimits,
  getSentInviteCount,
  getCumulativeJoinedRoomCount,
  getAccountData,
  checkUsernameAvailability,
  blockRoom,
  deleteDevices,
  getRoomBlockStatus,
  joinUserToRoom,
  makeRoomAdmin,
  quarantineRoomMedia,
  quarantineUserMedia,
  purgeHistory,
  getPurgeHistoryStatus,
  deleteRoom,
  getRoomDeleteStatus,
  redactUserEvents,
  getRedactStatus,
  suspendUser,
  shadowBanUser,
  resetPassword,
  loginAsUser,
  eraseUser,
  renewAccountValidity,
  allowCrossSigningReplacement,
  findUserByThreepid,
  findUserByAuthProvider,
  getEventByTimestamp,
  getEventContext,
  getRoomMessages,
  getRoomHierarchy,
  getAdminClientConfig,
  setAdminClientConfig,
  revokeRegistrationToken,
  masLockUser,
  masDeactivateUser,
  masSetAdmin,
  masSetPassword,
  masFinishSession,
  masRevokePersonalSession,
  masRegeneratePersonalSession,
  masFinishUserSession,
  getMASPolicyData,
  setMASPolicyData,

  ...etkeProviderMethods,
};

const dataProvider = withLifecycleCallbacks(baseDataProvider, [
  {
    resource: "rooms",
    afterDelete: async result => {
      // Invalidate the joined_rooms cache after room deletion
      invalidateManyRefCache("joined_rooms");
      return result;
    },
    afterDeleteMany: async result => {
      // Invalidate the joined_rooms cache after room deletion
      invalidateManyRefCache("joined_rooms");
      return result;
    },
  },
  {
    resource: "users",
    beforeUpdate: async (params: UpdateParams<any>, dataProvider: DataProvider) => {
      // In MAS mode: dispatch MAS auth-field changes and skip Synapse-only logic
      if (isMAS()) {
        const masId = params.previousData.mas_id as string;
        const prev = params.previousData;
        const next = params.data;

        // MAS-managed fields — only fire when the field was actually submitted (not disabled/omitted).
        // Disabled BooleanInputs (e.g. admin editing their own account) are excluded from react-hook-form
        // submission, leaving the value as undefined. Guarding with !== undefined prevents spurious API
        // calls that would e.g. strip admin from the current user or unlock an already-unlocked account.
        // Also normalise to strict booleans to guard against undefined/null from incomplete cache data.
        const prevAdmin = prev.admin === true;
        const nextAdmin = next.admin === true;
        if (next.admin !== undefined && prevAdmin !== nextAdmin)
          await (dataProvider as SynapseDataProvider).masSetAdmin(masId, nextAdmin);

        const prevLocked = prev.locked === true;
        const nextLocked = next.locked === true;
        if (next.locked !== undefined && prevLocked !== nextLocked)
          await (dataProvider as SynapseDataProvider).masLockUser(masId, nextLocked);

        const prevDeactivated = prev.deactivated === true;
        const nextDeactivated = next.deactivated === true;
        if (next.deactivated !== undefined && prevDeactivated !== nextDeactivated)
          // masDeactivateUser(id, active): true = reactivate, false = deactivate
          await (dataProvider as SynapseDataProvider).masDeactivateUser(masId, !nextDeactivated);

        // Synapse-managed profile fields (not disabled by MSC3861)
        if (prev.suspended !== next.suspended && next.suspended !== undefined)
          await (dataProvider as SynapseDataProvider).suspendUser(params.id, next.suspended);
        if (prev.shadow_banned !== next.shadow_banned && next.shadow_banned !== undefined)
          await (dataProvider as SynapseDataProvider).shadowBanUser(params.id, next.shadow_banned);

        // Handle avatar upload / erase before the Synapse profile PUT
        const avatarFile = next.avatar_file?.rawFile;
        const avatarErase = next.avatar_erase;
        if (avatarErase) {
          next.avatar_src = null;
        } else if (avatarFile instanceof File) {
          const uploaded = await (dataProvider as SynapseDataProvider).uploadMedia({
            file: avatarFile,
            filename: next.avatar_file.title,
            content_type: avatarFile.type,
          });
          next.avatar_src = uploaded.content_uri;
        }

        // Synapse-managed profile fields sent via main PUT /_synapse/admin/v2/users/...
        const synapseProfileChanged = prev.displayname !== next.displayname || prev.avatar_src !== next.avatar_src;
        if (synapseProfileChanged) {
          const baseUrl = localStorage.getItem("base_url") || "";
          const matrixId = encodeURIComponent(String(params.id));

          const body: Record<string, any> = {};
          if (prev.displayname !== next.displayname) body.displayname = next.displayname ?? "";
          if (prev.avatar_src !== next.avatar_src) body.avatar_url = next.avatar_src ?? "";
          await jsonClient(`${baseUrl}/_synapse/admin/v2/users/${matrixId}`, {
            method: "PUT",
            body: JSON.stringify(body),
          });
        }

        return params;
      }

      const avatarFile = params.data.avatar_file?.rawFile;
      const avatarErase = params.data.avatar_erase;
      const rates = params.data.rates;
      const suspended = params.data.suspended;
      const previousSuspended = params.previousData?.suspended;
      const shadowBanned = params.data.shadow_banned;
      const previousShadowBanned = params.previousData?.shadow_banned;
      const deactivated = params.data.deactivated;
      const erased = params.data.erased;

      if (rates) {
        await dataProvider.setRateLimits(params.id, rates);
        delete params.data.rates;
      }

      if (suspended !== undefined && suspended !== previousSuspended) {
        await (dataProvider as SynapseDataProvider).suspendUser(params.id, suspended);
        delete params.data.suspended;
      }

      if (shadowBanned !== undefined && shadowBanned !== previousShadowBanned) {
        await (dataProvider as SynapseDataProvider).shadowBanUser(params.id, shadowBanned);
        delete params.data.shadow_banned;
      }

      if (deactivated !== undefined && erased !== undefined) {
        await (dataProvider as SynapseDataProvider).eraseUser(params.id);
        delete params.data.deactivated;
        delete params.data.erased;
      }

      if (avatarErase) {
        params.data.avatar_url = "";
        return params;
      }

      if (avatarFile instanceof File) {
        const response = await dataProvider.uploadMedia({
          file: avatarFile,
          filename: params.data.avatar_file.title,
          content_type: params.data.avatar_file.rawFile.type,
        });
        params.data.avatar_url = response.content_uri;
      }
      return params;
    },
    beforeDelete: async (params: DeleteParams<any>, _dataProvider: DataProvider) => {
      if (params.meta?.deleteMedia) await deleteUserMedia(params.id);
      return params;
    },
    beforeDeleteMany: async (params: DeleteManyParams<any>, _dataProvider: DataProvider) => {
      await Promise.all(
        params.ids.map(async id => {
          if (params.meta?.deleteMedia) await deleteUserMedia(id);
        })
      );
      return params;
    },
  },
]);

export default dataProvider;
