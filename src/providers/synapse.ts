import { DeleteParams, HttpError, Identifier, RaRecord, fetchUtils } from "react-admin";

import { jsonClient } from "./httpClients";
import {
  AccountDataModel,
  DeleteMediaParams,
  DeleteMediaResult,
  ExperimentalFeaturesModel,
  RateLimitsModel,
  UsernameAvailabilityResult,
  Destination,
  DestinationRoom,
  ScheduledTask,
  Device,
  EventReport,
  ForwardExtremity,
  Membership,
  Pusher,
  RaServerNotice,
  RegistrationToken,
  Room,
  RoomState,
  SynapseRegistrationTokensResourceType,
  User,
  UserMedia,
  UserMediaStatistic,
  Whois,
} from "./types";
import { returnMXID } from "../utils/mxid";

/**
 * Get Synapse server version via /_synapse/admin/v1/server_version
 */
export const getServerVersion = async (baseUrl: string): Promise<string> => {
  const response = await fetchUtils.fetchJson(`${baseUrl}/_synapse/admin/v1/server_version`, { method: "GET" });
  return response.json.server_version;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const CACHED_MANY_REF: Record<string, any> = {};

export const invalidateManyRefCache = (pattern: string) => {
  for (const key of Object.keys(CACHED_MANY_REF)) {
    if (key.includes(pattern)) {
      delete CACHED_MANY_REF[key];
    }
  }
};

export const synapseRegistrationTokensResource: SynapseRegistrationTokensResourceType = {
  path: "/_synapse/admin/v1/registration_tokens",
  isMAS: false,
  map: (rt: RegistrationToken) => ({ ...rt, id: rt.token }),
  data: "registration_tokens",
  total: json => json.registration_tokens.length,
  create: (params: RaRecord) => ({
    endpoint: "/_synapse/admin/v1/registration_tokens/new",
    body: params,
    method: "POST",
  }), // Synapse accepts Unix timestamps as-is
  delete: (params: DeleteParams) => ({
    endpoint: `/_synapse/admin/v1/registration_tokens/${params.id}`,
  }),
};

export const synapseResourceMap = {
  users: {
    path: "/_synapse/admin/v2/users",
    listPath: "/_synapse/admin/v3/users",
    map: async (u: User) => ({
      ...u,
      id: returnMXID(u.name),
      avatar_src: u.avatar_url ? u.avatar_url : undefined,
      is_guest: !!u.is_guest,
      admin: !!u.admin,
      deactivated: !!u.deactivated,
      shadow_banned: !!u.shadow_banned,
      // need timestamp in milliseconds
      creation_ts_ms: u.creation_ts * 1000,
    }),
    data: "users",
    total: (json: { total: number }) => json.total,
    create: (data: RaRecord) => ({
      endpoint: `/_synapse/admin/v2/users/${encodeURIComponent(returnMXID(data.id))}`,
      body: data,
      method: "PUT",
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/deactivate/${encodeURIComponent(returnMXID(params.id))}`,
      body: { erase: true },
      method: "POST",
    }),
  },
  rooms: {
    path: "/_synapse/admin/v1/rooms",
    map: (r: Room) => ({
      ...r,
      id: r.room_id,
      alias: r.canonical_alias,
      members: r.joined_members,
      is_encrypted: !!r.encryption,
      federatable: !!r.federatable,
      public: !!r.public,
    }),
    data: "rooms",
    total: (json: { total_rooms: number }) => json.total_rooms,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v2/rooms/${params.id}`,
      body: { block: params.meta?.block ?? false },
    }),
  },
  reports: {
    path: "/_synapse/admin/v1/event_reports",
    map: (er: EventReport) => ({ ...er }),
    data: "event_reports",
    total: (json: { total: number }) => json.total,
  },
  devices: {
    map: (d: Device) => ({ ...d, id: d.device_id }),
    data: "devices",
    total: (json: { total: number }) => json.total,
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v2/users/${encodeURIComponent(id)}/devices`,
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v2/users/${encodeURIComponent(params.previousData.user_id)}/devices/${params.id}`,
    }),
  },
  connections: {
    path: "/_synapse/admin/v1/whois",
    map: (c: Whois) => ({ ...c, id: c.user_id }),
    data: "connections",
  },
  room_members: {
    map: (m: string) => ({ id: m }),
    reference: (id: Identifier) => ({ endpoint: `/_synapse/admin/v1/rooms/${id}/members` }),
    data: "members",
    total: (json: { total: number }) => json.total,
  },
  room_media: {
    map: (mediaId: string) => ({
      id: mediaId.replace("mxc://" + localStorage.getItem("home_server") + "/", ""),
      media_id: mediaId.replace("mxc://" + localStorage.getItem("home_server") + "/", ""),
    }),
    reference: (id: Identifier) => ({ endpoint: `/_synapse/admin/v1/room/${id}/media` }),
    total: (json: { total: number }) => json.total,
    data: "local",
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/${localStorage.getItem("home_server")}/${params.id}`,
    }),
  },
  room_state: {
    map: (rs: RoomState) => ({ ...rs, id: rs.event_id }),
    reference: (id: Identifier) => ({ endpoint: `/_synapse/admin/v1/rooms/${id}/state` }),
    data: "state",
    total: (json: { state: unknown[] }) => json.state.length,
  },
  pushers: {
    map: (p: Pusher) => ({ ...p, id: p.pushkey }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/pushers`,
    }),
    data: "pushers",
    total: (json: { total: number }) => json.total,
  },
  joined_rooms: {
    map: (jr: string) => ({ id: jr }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/joined_rooms`,
    }),
    data: "joined_rooms",
    total: (json: { total: number }) => json.total,
  },
  memberships: {
    map: (m: Membership) => ({ ...m }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/memberships`,
    }),
    data: "memberships",
    total: (json: { total: number }) => json.total,
  },
  users_media: {
    map: (um: UserMedia) => ({ ...um, id: um.media_id }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/media`,
    }),
    data: "media",
    total: (json: { total: number }) => json.total,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/${localStorage.getItem("home_server")}/${params.id}`,
    }),
  },
  protect_media: {
    map: (pm: UserMedia) => ({ id: pm.media_id }),
    create: (params: UserMedia) => ({
      endpoint: `/_synapse/admin/v1/media/protect/${params.media_id}`,
      method: "POST",
      response: (data: RaRecord) => ({ ...data, safe_from_quarantine: true }),
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/unprotect/${params.id}`,
      method: "POST",
      response: (data: RaRecord) => ({ ...data, safe_from_quarantine: false }),
    }),
  },
  quarantine_media: {
    map: (qm: UserMedia) => ({ id: qm.media_id }),
    create: (params: UserMedia) => ({
      endpoint: `/_synapse/admin/v1/media/quarantine/${localStorage.getItem("home_server")}/${params.media_id}`,
      method: "POST",
      response: (data: RaRecord) => ({ ...data, quarantined_by: localStorage.getItem("user_id") || "admin" }),
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/unquarantine/${localStorage.getItem("home_server")}/${params.id}`,
      method: "POST",
      response: (data: RaRecord) => ({ ...data, quarantined_by: "" }),
    }),
  },
  servernotices: {
    map: (n: { event_id: string }) => ({ id: n.event_id }),
    create: (data: RaServerNotice) => ({
      endpoint: "/_synapse/admin/v1/send_server_notice",
      body: {
        user_id: returnMXID(data.id),
        content: { msgtype: "m.text", body: data.body },
      },
      method: "POST",
    }),
  },
  user_media_statistics: {
    path: "/_synapse/admin/v1/statistics/users/media",
    map: (usms: UserMediaStatistic) => ({ ...usms, id: returnMXID(usms.user_id) }),
    data: "users",
    total: (json: { total: number }) => json.total,
  },
  forward_extremities: {
    map: (fe: ForwardExtremity) => ({ ...fe, id: fe.event_id }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/forward_extremities`,
    }),
    data: "results",
    total: (json: { count: number }) => json.count,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/rooms/${params.id}/forward_extremities`,
    }),
  },
  destinations: {
    path: "/_synapse/admin/v1/federation/destinations",
    map: (dst: Destination) => ({ ...dst, id: dst.destination }),
    data: "destinations",
    total: (json: { total: number }) => json.total,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/federation/destinations/${params.id}/reset_connection`,
      method: "POST",
    }),
  },
  destination_rooms: {
    map: (dstroom: DestinationRoom) => ({ ...dstroom, id: dstroom.room_id }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/federation/destinations/${id}/rooms`,
    }),
    data: "rooms",
    total: (json: { total: number }) => json.total,
  },
  scheduled_tasks: {
    path: "/_synapse/admin/v1/scheduled_tasks",
    map: (st: ScheduledTask) => ({ ...st }),
    data: "scheduled_tasks",
    total: (json: { scheduled_tasks: unknown[] }) => json.scheduled_tasks.length,
  },
};

export const deleteMedia = async ({
  before_ts,
  size_gt = 0,
  keep_profiles = true,
}: DeleteMediaParams): Promise<DeleteMediaResult> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(
    `${base_url}/_synapse/admin/v1/media/delete?before_ts=${before_ts}&size_gt=${size_gt}&keep_profiles=${keep_profiles}`,
    { method: "POST" }
  );
  return json as DeleteMediaResult;
};

export const purgeRemoteMedia = async ({
  before_ts,
}: Pick<DeleteMediaParams, "before_ts">): Promise<DeleteMediaResult> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(`${base_url}/_synapse/admin/v1/purge_media_cache?before_ts=${before_ts}`, {
    method: "POST",
  });
  return json as DeleteMediaResult;
};

export const getFeatures = async (id: Identifier): Promise<ExperimentalFeaturesModel> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(
    `${base_url}/_synapse/admin/v1/experimental_features/${encodeURIComponent(returnMXID(id))}`
  );
  return json.features as ExperimentalFeaturesModel;
};

export const updateFeatures = async (id: Identifier, features: ExperimentalFeaturesModel): Promise<void> => {
  const base_url = localStorage.getItem("base_url");
  await jsonClient(`${base_url}/_synapse/admin/v1/experimental_features/${encodeURIComponent(returnMXID(id))}`, {
    method: "PUT",
    body: JSON.stringify({ features }),
  });
};

export const getRateLimits = async (id: Identifier): Promise<RateLimitsModel> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(
    `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/override_ratelimit`
  );
  return json as RateLimitsModel;
};

export const setRateLimits = async (id: Identifier, rateLimits: RateLimitsModel): Promise<void> => {
  const filtered = Object.fromEntries(
    Object.entries(rateLimits).filter(([_key, value]) => value !== null && value !== undefined)
  );
  const base_url = localStorage.getItem("base_url");
  const endpoint_url = `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/override_ratelimit`;
  if (Object.keys(filtered).length === 0) {
    await jsonClient(endpoint_url, { method: "DELETE" });
    return;
  }
  await jsonClient(endpoint_url, { method: "POST", body: JSON.stringify(filtered) });
};

export const getSentInviteCount = async (id: Identifier, fromTs = 0): Promise<number> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(
    `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/sent_invite_count?from_ts=${fromTs}`
  );
  return json.invite_count as number;
};

export const getCumulativeJoinedRoomCount = async (id: Identifier, fromTs = 0): Promise<number> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(
    `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/cumulative_joined_room_count?from_ts=${fromTs}`
  );
  return json.cumulative_joined_room_count as number;
};

export const getAccountData = async (id: Identifier): Promise<AccountDataModel> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(
    `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/accountdata`
  );
  return json as AccountDataModel;
};

export const checkUsernameAvailability = async (username: string): Promise<UsernameAvailabilityResult> => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/username_available?username=${encodeURIComponent(username)}`
    );
    return json as UsernameAvailabilityResult;
  } catch (error) {
    if (error instanceof HttpError) {
      return { available: false, error: error.body.error, errcode: error.body.errcode } as UsernameAvailabilityResult;
    }
    throw error;
  }
};

export const blockRoom = async (roomId: string, block: boolean) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(roomId)}/block`, {
      method: "PUT",
      body: JSON.stringify({ block }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getRoomBlockStatus = async (roomId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(`${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(roomId)}/block`);
    return { success: true, block: json.block as boolean };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, block: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const deleteDevices = async (user_id: string, devices: string[]) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v2/users/${encodeURIComponent(user_id)}/delete_devices`, {
      method: "POST",
      body: JSON.stringify({ devices }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const joinUserToRoom = async (room_id: string, user_id: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v1/join/${encodeURIComponent(room_id)}`, {
      method: "POST",
      body: JSON.stringify({ user_id }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const makeRoomAdmin = async (room_id: string, user_id: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(room_id)}/make_room_admin`, {
      method: "POST",
      body: JSON.stringify({ user_id }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const suspendUser = async (id: Identifier, suspendValue: boolean) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v1/suspend/${encodeURIComponent(returnMXID(id))}`, {
      method: "PUT",
      body: JSON.stringify({ suspend: suspendValue }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const shadowBanUser = async (id: Identifier, shadowBan: boolean) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/shadow_ban`, {
      method: shadowBan ? "POST" : "DELETE",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const resetPassword = async (id: Identifier, newPassword: string, logoutDevices = true) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v1/reset_password/${encodeURIComponent(returnMXID(id))}`, {
      method: "POST",
      body: JSON.stringify({ new_password: newPassword, logout_devices: logoutDevices }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const loginAsUser = async (id: Identifier, validUntilMs?: number) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const body: Record<string, unknown> = {};
    if (validUntilMs !== undefined) {
      body.valid_until_ms = validUntilMs;
    }
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/login`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    return { success: true, access_token: json.access_token };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const eraseUser = async (id: Identifier) => {
  const base_url = localStorage.getItem("base_url");
  try {
    await jsonClient(`${base_url}/_synapse/admin/v1/deactivate/${encodeURIComponent(returnMXID(id))}`, {
      method: "POST",
      body: JSON.stringify({ erase: true }),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const findUserByThreepid = async (medium: string, address: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/threepid/${encodeURIComponent(medium)}/users/${encodeURIComponent(address)}`
    );
    return { success: true, user_id: json.user_id as string };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const renewAccountValidity = async (userId: string, expirationTs?: number, enableRenewalEmails = true) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const body: Record<string, unknown> = {
      user_id: returnMXID(userId),
      enable_renewal_emails: enableRenewalEmails,
    };
    if (expirationTs !== undefined) {
      body.expiration_ts = expirationTs;
    }
    const { json } = await jsonClient(`${base_url}/_synapse/admin/v1/account_validity/validity`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { success: true, expiration_ts: json.expiration_ts as number };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const allowCrossSigningReplacement = async (userId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(userId))}/_allow_cross_signing_replacement_without_uia`,
      { method: "POST", body: JSON.stringify({}) }
    );
    return { success: true, updatable_without_uia_before_ms: json.updatable_without_uia_before_ms as number };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const findUserByAuthProvider = async (provider: string, externalId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/auth_providers/${encodeURIComponent(provider)}/users/${encodeURIComponent(externalId)}`
    );
    return { success: true, user_id: json.user_id as string };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getEventByTimestamp = async (roomId: string, ts: number, dir: "f" | "b" = "f") => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(roomId)}/timestamp_to_event?ts=${ts}&dir=${dir}`
    );
    return { success: true, event_id: json.event_id as string, origin_server_ts: json.origin_server_ts as number };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getEventContext = async (roomId: string, eventId: string, limit = 5) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(roomId)}/context/${encodeURIComponent(eventId)}?limit=${limit}`
    );
    return { success: true, data: json };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getRoomMessages = async (
  roomId: string,
  params: { from: string; to?: string; limit?: number; dir?: "f" | "b"; filter?: string }
) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const query = new URLSearchParams({ from: params.from });
    if (params.to) query.set("to", params.to);
    if (params.limit) query.set("limit", String(params.limit));
    if (params.dir) query.set("dir", params.dir);
    if (params.filter) query.set("filter", params.filter);
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(roomId)}/messages?${query}`
    );
    return { success: true, data: json };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getRoomHierarchy = async (
  roomId: string,
  params?: { from?: string; limit?: number; max_depth?: number }
) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const query = new URLSearchParams();
    if (params?.from) query.set("from", params.from);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.max_depth !== undefined) query.set("max_depth", String(params.max_depth));
    const qs = query.toString();
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(roomId)}/hierarchy${qs ? `?${qs}` : ""}`
    );
    return { success: true, data: json };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const quarantineRoomMedia = async (roomId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/room/${encodeURIComponent(roomId)}/media/quarantine`,
      { method: "POST", body: "{}" }
    );
    return { success: true, num_quarantined: json.num_quarantined as number };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, num_quarantined: 0, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const quarantineUserMedia = async (userId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/user/${encodeURIComponent(userId)}/media/quarantine`,
      { method: "POST", body: "{}" }
    );
    return { success: true, num_quarantined: json.num_quarantined as number };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, num_quarantined: 0, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const purgeHistory = async (roomId: string, purge_up_to_ts: number, delete_local_events: boolean) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(`${base_url}/_synapse/admin/v1/purge_history/${encodeURIComponent(roomId)}`, {
      method: "POST",
      body: JSON.stringify({ purge_up_to_ts, delete_local_events }),
    });
    return { success: true, purge_id: json.purge_id as string };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getPurgeHistoryStatus = async (purgeId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/purge_history_status/${encodeURIComponent(purgeId)}`
    );
    return { success: true, status: json.status as string, error: json.error as string | undefined };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, status: "failed", error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const deleteUserMedia = async (id: Identifier): Promise<void> => {
  const base_url = localStorage.getItem("base_url");
  await jsonClient(`${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/media`, {
    method: "DELETE",
  });
};

export const fetchEvent = async (eventId: string) => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(`${base_url}/_synapse/admin/v1/fetch_event/${encodeURIComponent(eventId)}`);
  return json.event;
};

export const redactUserEvents = async (id: Identifier) => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(`${base_url}/_synapse/admin/v1/user/${encodeURIComponent(returnMXID(id))}/redact`, {
    method: "POST",
    body: JSON.stringify({ rooms: [] }),
  });
  return { redact_id: json.redact_id as string };
};

export const deleteRoom = async (roomId: string, block: boolean) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(`${base_url}/_synapse/admin/v2/rooms/${encodeURIComponent(roomId)}`, {
      method: "DELETE",
      body: JSON.stringify({ block }),
    });
    return { success: true, delete_id: json.delete_id as string };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getRoomDeleteStatus = async (deleteId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v2/rooms/delete_status/${encodeURIComponent(deleteId)}`
    );
    return { success: true, status: json.status as string, error: json.error as string | undefined };
  } catch (error) {
    if (error instanceof HttpError) {
      return { success: false, status: "failed", error: error.body.error, errcode: error.body.errcode };
    }
    throw error;
  }
};

export const getRedactStatus = async (redactId: string) => {
  const base_url = localStorage.getItem("base_url");
  try {
    const { json } = await jsonClient(
      `${base_url}/_synapse/admin/v1/user/redact_status/${encodeURIComponent(redactId)}`
    );
    return {
      success: true,
      status: json.status as string,
      failed_redactions: json.failed_redactions as Record<string, string>,
    };
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        success: false,
        status: "failed",
        failed_redactions: {},
        error: error.body.error,
        errcode: error.body.errcode,
      };
    }
    throw error;
  }
};
