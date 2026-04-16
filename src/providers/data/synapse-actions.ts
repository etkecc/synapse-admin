/**
 * Standalone Synapse admin API action helpers.
 * These are direct async wrappers around Synapse admin endpoints, used as
 * custom dataProvider methods and from lifecycle callbacks.
 */

import { HttpError, Identifier } from "react-admin";

import { jsonClient } from "../http";
import {
  AdminClientConfig,
  AccountDataModel,
  DeleteMediaParams,
  DeleteMediaResult,
  ExperimentalFeaturesModel,
  RateLimitsModel,
  UsernameAvailabilityResult,
} from "../types";
import { returnMXID } from "../../utils/mxid";

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

export const getAdminClientConfig = async () => {
  const base_url = localStorage.getItem("base_url");
  const userId = localStorage.getItem("user_id");
  if (!userId) return { return_soft_failed_events: false, return_policy_server_spammy_events: false };
  try {
    const { json } = await jsonClient(
      `${base_url}/_matrix/client/v3/user/${encodeURIComponent(userId)}/account_data/io.element.synapse.admin_client_config`
    );
    return json as AdminClientConfig;
  } catch {
    return { return_soft_failed_events: false, return_policy_server_spammy_events: false };
  }
};

export const setAdminClientConfig = async (config: AdminClientConfig) => {
  const base_url = localStorage.getItem("base_url");
  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("No user_id");
  await jsonClient(
    `${base_url}/_matrix/client/v3/user/${encodeURIComponent(userId)}/account_data/io.element.synapse.admin_client_config`,
    { method: "PUT", body: JSON.stringify(config) }
  );
};

export const deleteRoomMedia = async (
  roomId: string,
  onProgress?: (current: number, total: number) => void
): Promise<{ total: number }> => {
  const base_url = localStorage.getItem("base_url");
  const { json: listJson } = await jsonClient(`${base_url}/_synapse/admin/v1/room/${encodeURIComponent(roomId)}/media`);
  const localMedia: string[] = listJson.local ?? [];
  // Filter before counting so the progress counter matches actual deletions.
  const validMedia = localMedia.filter(mxc => {
    if (!mxc.startsWith("mxc://")) return false;
    const parts = mxc.split("/");
    return Boolean(parts[2] && parts[3]);
  });
  const total = validMedia.length;
  onProgress?.(0, total);
  let current = 0;
  for (const mxc of validMedia) {
    const parts = mxc.split("/");
    const serverName = parts[2];
    const mediaId = parts[3];
    await jsonClient(
      `${base_url}/_synapse/admin/v1/media/${encodeURIComponent(serverName)}/${encodeURIComponent(mediaId)}`,
      { method: "DELETE" }
    );
    current++;
    onProgress?.(current, total);
  }
  return { total };
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

export const deleteUserMedia = async (id: Identifier): Promise<DeleteMediaResult> => {
  const base_url = localStorage.getItem("base_url");
  const { json } = await jsonClient(`${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/media`, {
    method: "DELETE",
  });
  return json as DeleteMediaResult;
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
