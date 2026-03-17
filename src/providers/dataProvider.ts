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

import { jsonClient } from "./httpClients";
import {
  getMASBaseUrl,
  getMasNextPageCursor,
  getMasRegistrationTokensCursorKey,
  getMasRegistrationTokensPageCursor,
  setMasRegistrationTokensPageCursor,
  filterUndefined,
  revokeRegistrationToken,
  isMAS,
  getMASRegistrationTokensResource,
} from "./mas";
import {
  synapseRegistrationTokensResource,
  deleteMedia,
  purgeRemoteMedia,
  getFeatures,
  updateFeatures,
  getRateLimits,
  setRateLimits,
  getAccountData,
  checkUsernameAvailability,
  blockRoom,
  deleteDevices,
  getRoomBlockStatus,
  joinUserToRoom,
  makeRoomAdmin,
  purgeHistory,
  getPurgeHistoryStatus,
  suspendUser,
  shadowBanUser,
  resetPassword,
  loginAsUser,
  eraseUser,
  deleteUserMedia,
  redactUserEvents,
} from "./synapse";
import { uploadMedia } from "./matrix";
import { CACHED_MANY_REF, invalidateManyRefCache, resourceMap } from "./resourceMap";
import { etkeProviderMethods } from "./etkeProvider";
import { MASRegistrationTokenListResponse, SynapseDataProvider } from "./types";

/**
 * Initialize all flag-dependent resources and patch them into resourceMap.
 * Reads the cached MAS flag synchronously — no HTTP calls needed.
 * Add new MAS-dependent resources here as they are introduced.
 */
export const initResources = () => {
  if (isMAS()) {
    resourceMap.registration_tokens = getMASRegistrationTokensResource();
  } else {
    resourceMap.registration_tokens = synapseRegistrationTokensResource;
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

const baseDataProvider: SynapseDataProvider = {
  getList: async (resource, params) => {
    console.log("getList " + resource, params);
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
    } = params.filter;
    const { page, perPage } = params.pagination as PaginationPayload;
    const { field, order } = params.sort as SortPayload;
    const from = (page - 1) * perPage;

    // Build query based on API type
    let query: Record<string, any>;
    if (res.isMAS) {
      const cursorKey = getMasRegistrationTokensCursorKey({ page, perPage }, valid);
      const pageAfter = page > 1 ? getMasRegistrationTokensPageCursor(cursorKey, page) : undefined;

      // MAS API uses different pagination parameters
      query = {
        "page[first]": perPage,
        "page[after]": pageAfter,
        "filter[valid]": valid,
        count: "true",
      };
    } else {
      // Synapse API
      query = {
        from: from,
        limit: perPage,
        user_id: user_id,
        search_term: search_term,
        name: name,
        destination: destination,
        guests: guests,
        deactivated: deactivated,
        locked: locked,
        suspended: suspended,
        shadow_banned: shadow_banned,
        valid: valid,
        order_by: field,
        dir: getSearchOrder(order),
        public_rooms: public_rooms,
        empty_rooms: empty_rooms,
      };
    }

    const endpoint_url = baseUrl + (res.listPath || res.path);
    const url = `${endpoint_url}?${new URLSearchParams(filterUndefined(query)).toString()}`;

    const { json } = await jsonClient(url);
    const formattedData = json[res.data].map(res.map);

    if (res.isMAS) {
      const cursorKey = getMasRegistrationTokensCursorKey({ page, perPage }, valid);
      const nextCursor = getMasNextPageCursor(json as MASRegistrationTokenListResponse);
      if (nextCursor) {
        setMasRegistrationTokensPageCursor(cursorKey, page + 1, nextCursor);
      }
    }

    return {
      data: formattedData,
      total: res.total(json, from, perPage),
    };
  },

  getOne: async (resource, params) => {
    console.log("getOne " + resource);
    const { res, baseUrl } = resolveResource(resource);
    const endpoint_url = baseUrl + res.path;
    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`);
    return { data: res.map(json) };
  },

  getMany: async (resource, params) => {
    console.log("getMany " + resource);
    const { res, baseUrl } = resolveResource(resource);
    const homeserver = localStorage.getItem("home_server");
    const endpoint_url = baseUrl + res.path;
    const responses = await Promise.all(
      params.ids.map(async id => {
        // edge case: when user is external / federated, homeserver will return error, as querying external users via
        // /_synapse/admin/v2/users is not allowed.
        // That leads to an issue when a user is referenced (e.g., in room state datagrid) - the user cell is just empty.
        // To avoid that, we fake the response with one specific field (name) which is used in the datagrid.
        if (homeserver && resource === "users") {
          if (!(id as string).endsWith(homeserver)) {
            const json = {
              name: id,
            };
            return { json };
          }
        }
        try {
          return await jsonClient(`${endpoint_url}/${encodeURIComponent(id)}`);
        } catch (error) {
          // Handle deleted/non-existent resources gracefully by returning minimal data
          // This can happen when a room is deleted but still referenced in joined_rooms
          if (error instanceof HttpError && error.status === 404) {
            const json = resource === "rooms" ? { room_id: id, name: id } : { id };
            return { json };
          }
          throw error;
        }
      })
    );
    return {
      data: responses.map(({ json }) => res.map(json)),
      total: responses.length,
    };
  },

  getManyReference: async (resource, params) => {
    console.log("getManyReference " + resource);
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
      jsonData = CACHED_MANY_REF[CACHE_KEY]["data"].slice(from, from + perPage);
      total = CACHED_MANY_REF[CACHE_KEY]["total"];
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
        jsonData = jsonData.slice(from, from + perPage);
      }
    }

    return {
      data: jsonData.map(res.map),
      total: total,
    };
  },

  update: async (resource, params) => {
    console.log("update " + resource);
    const { res, baseUrl } = resolveResource(resource);
    const endpoint_url = baseUrl + res.path;

    // Handle special case for MAS registration tokens which have custom update method
    if (res.update) {
      const upd = res.update(params);
      const { json } = await jsonClient(baseUrl + upd.endpoint, {
        method: upd.method,
        body: JSON.stringify(upd.body, filterNullValues),
      });
      return { data: res.map(json) };
    }

    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`, {
      method: "PUT",
      body: JSON.stringify(params.data, filterNullValues),
    });
    return { data: res.map(json) };
  },

  updateMany: async (resource, params) => {
    console.log("updateMany " + resource);
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
    console.log("create " + resource);
    const { res, baseUrl } = resolveResource(resource);
    if (!("create" in res)) return Promise.reject(new Error(`Create not supported for ${resource}`));

    const create = res.create(params.data);
    const endpoint_url = baseUrl + create.endpoint;
    const { json } = await jsonClient(endpoint_url, {
      method: create.method,
      body: JSON.stringify(create.body, filterNullValues),
    });

    // for some resources, the response is empty, so we return the input data as response
    if (create?.empty_response) {
      return { data: params.data };
    }

    // Use custom response handler if provided (e.g., for MAS)
    if (res.handleCreateResponse) {
      const converted = res.handleCreateResponse(json);
      return { data: converted };
    }

    return { data: res.map(json) };
  },

  createMany: async (resource: string, params: { ids: Identifier[]; data: RaRecord }) => {
    console.log("createMany " + resource);
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
    console.log("delete " + resource);
    const { res, baseUrl } = resolveResource(resource);

    if ("delete" in res) {
      const del = res.delete(params);
      const endpoint_url = baseUrl + del.endpoint;
      const { json } = await jsonClient(endpoint_url, {
        method: "method" in del ? del.method : "DELETE",
        body: "body" in del ? JSON.stringify(del.body) : null,
      });
      if (del?.empty_response) {
        return { data: params.previousData };
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
    console.log("deleteMany " + resource, "params", params);
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
  getFeatures,
  updateFeatures,
  getRateLimits,
  setRateLimits,
  getAccountData,
  checkUsernameAvailability,
  blockRoom,
  deleteDevices,
  getRoomBlockStatus,
  joinUserToRoom,
  makeRoomAdmin,
  purgeHistory,
  getPurgeHistoryStatus,
  suspendUser,
  shadowBanUser,
  resetPassword,
  loginAsUser,
  eraseUser,
  revokeRegistrationToken,

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
      if (params.meta?.redactEvents) await redactUserEvents(params.id);
      return params;
    },
    beforeDeleteMany: async (params: DeleteManyParams<any>, _dataProvider: DataProvider) => {
      await Promise.all(
        params.ids.map(async id => {
          if (params.meta?.deleteMedia) await deleteUserMedia(id);
          if (params.meta?.redactEvents) await redactUserEvents(id);
        })
      );
      return params;
    },
  },
]);

export default dataProvider;
