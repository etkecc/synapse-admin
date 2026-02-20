import {
  DataProvider,
  DeleteParams,
  DeleteManyParams,
  HttpError,
  Identifier,
  Options,
  PaginationPayload,
  RaRecord,
  SortPayload,
  UpdateParams,
  fetchUtils,
  withLifecycleCallbacks,
} from "react-admin";

import { refreshAccessToken } from "./matrix";
import { GetConfig } from "../utils/config";
import { MatrixError, displayError } from "../utils/error";
import { returnMXID } from "../utils/mxid";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const CACHED_MANY_REF: Record<string, any> = {};

/**
 * Invalidate cached getManyReference data for keys containing the given pattern.
 * @param pattern - substring to match against cache keys (e.g., "joined_rooms")
 */
const invalidateManyRefCache = (pattern: string) => {
  for (const key of Object.keys(CACHED_MANY_REF)) {
    if (key.includes(pattern)) {
      delete CACHED_MANY_REF[key];
    }
  }
};

// Adds the access token to all requests
const jsonClient = async (url: string, options: Options = {}) => {
  // Check if token needs refresh before making the request
  const access_token_expires_at = localStorage.getItem("access_token_expires_at");
  const refreshToken = localStorage.getItem("refresh_token");

  if (access_token_expires_at && refreshToken) {
    const expiresAt = parseInt(access_token_expires_at, 10);
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    // Refresh if token has expired or will expire in less than 2 minutes
    if (timeUntilExpiry < 120000) {
      console.log(`Token ${timeUntilExpiry <= 0 ? "expired" : "expiring soon"}, refreshing before API call...`);
      await refreshAccessToken();
    }
  }

  const token = localStorage.getItem("access_token");
  console.log("httpClient " + url);
  options.credentials = GetConfig().corsCredentials as RequestCredentials;
  if (token !== null) {
    options.user = {
      authenticated: true,
      token: `Bearer ${token}`,
    };
  }
  try {
    const response = await fetchUtils.fetchJson(url, options);
    return response;
  } catch (err) {
    const error = err as HttpError;
    const errorStatus = error.status;
    const errorBody = error.body as MatrixError;
    const errMsg = errorBody?.errcode
      ? displayError(errorBody.errcode, errorStatus, errorBody.error)
      : displayError("M_INVALID", errorStatus, error.message);

    return Promise.reject(new HttpError(errMsg, errorStatus, errorBody));
  }
};

const etkeClient = async (url: string, locale: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return Promise.reject(new Error("Missing access token"));
  }
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (locale) {
    headers.set("Accept-Language", locale);
  }

  return fetch(url, { ...options, headers });
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const filterUndefined = (obj: Record<string, any>) => {
  return Object.fromEntries(Object.entries(obj).filter(([_key, value]) => value !== undefined));
};

export interface Room {
  room_id: string;
  name?: string;
  canonical_alias?: string;
  avatar_url?: string;
  joined_members: number;
  joined_local_members: number;
  version: number;
  creator: string;
  encryption?: string;
  federatable: boolean;
  public: boolean;
  join_rules: "public" | "knock" | "invite" | "private";
  guest_access?: "can_join" | "forbidden";
  history_visibility: "invited" | "joined" | "shared" | "world_readable";
  state_events: number;
  room_type?: string;
}

interface RoomState {
  age: number;
  content: {
    alias?: string;
  };
  event_id: string;
  origin_server_ts: number;
  room_id: string;
  sender: string;
  state_key: string;
  type: string;
  user_id: string;
  unsigned: {
    age?: number;
  };
}

interface ForwardExtremity {
  event_id: string;
  state_group: number;
  depth: number;
  received_ts: number;
}

interface EventReport {
  id: number;
  received_ts: number;
  room_id: string;
  name: string;
  event_id: string;
  user_id: string;
  reason?: string;
  score?: number;
  sender: string;
  canonical_alias?: string;
}

interface Threepid {
  medium: string;
  address: string;
  added_at: number;
  validated_at: number;
}

interface ExternalId {
  auth_provider: string;
  external_id: string;
}

export interface User {
  id?: string;
  name: string;
  displayname?: string;
  threepids: Threepid[];
  avatar_url?: string;
  is_guest: 0 | 1;
  admin: 0 | 1;
  deactivated: 0 | 1;
  erased: boolean;
  shadow_banned: 0 | 1;
  creation_ts: number;
  appservice_id?: string;
  consent_server_notice_sent?: string;
  consent_version?: string;
  consent_ts?: number;
  external_ids: ExternalId[];
  user_type?: string;
  locked: boolean;
  suspended?: boolean;
}

interface Device {
  device_id: string;
  display_name?: string;
  last_seen_ip?: string;
  last_seen_user_agent?: string;
  last_seen_ts?: number;
  user_id: string;
}

interface Connection {
  ip: string;
  last_seen: number;
  user_agent: string;
}

interface Membership {
  id: string;
  membership: string;
}

interface Whois {
  user_id: string;
  devices: Record<
    string,
    {
      sessions: {
        connections: Connection[];
      }[];
    }
  >;
}

interface Pusher {
  app_display_name: string;
  app_id: string;
  data: {
    url?: string;
    format: string;
  };
  url: string;
  format: string;
  device_display_name: string;
  profile_tag: string;
  kind: string;
  lang: string;
  pushkey: string;
}

interface UserMedia {
  created_ts: number;
  last_access_ts?: number;
  media_id: string;
  media_length: number;
  media_type: string;
  quarantined_by?: string;
  safe_from_quarantine: boolean;
  upload_name?: string;
}

interface UserMediaStatistic {
  displayname: string;
  media_count: number;
  media_length: number;
  user_id: string;
}

interface RegistrationToken {
  token: string;
  uses_allowed: number;
  pending: number;
  completed: number;
  expiry_time?: number;
}

interface RaServerNotice {
  id: string;
  body: string;
}

interface Destination {
  destination: string;
  retry_last_ts: number;
  retry_interval: number;
  failure_ts: number;
  last_successful_stream_ordering?: number;
}

interface DestinationRoom {
  room_id: string;
  stream_ordering: number;
}

export interface DeleteMediaParams {
  before_ts: string;
  size_gt: number;
  keep_profiles: boolean;
}

export interface DeleteMediaResult {
  deleted_media: Identifier[];
  total: number;
}

export interface UploadMediaParams {
  file: File;
  filename: string;
  content_type: string;
}

export interface UploadMediaResult {
  content_uri: string;
}

export interface ExperimentalFeaturesModel {
  features: Record<string, boolean>;
}

export interface RateLimitsModel {
  messages_per_second?: number;
  burst_count?: number;
}

export interface AccountDataModel {
  account_data: {
    global: Record<string, object>;
    rooms: Record<string, object>;
  };
}

export interface UsernameAvailabilityResult {
  available?: boolean;
  error?: string;
  errcode?: string;
}

export interface ServerStatusComponent {
  ok: boolean;
  category: string;
  reason: string;
  url: string;
  help: string;
  label: {
    url: string;
    icon: string;
    text: string;
  };
}

export interface ServerStatusResponse {
  success: boolean;
  maintenance?: boolean;
  ok: boolean;
  host: string;
  results: ServerStatusComponent[];
}

export interface ServerProcessResponse {
  locked_at: string;
  command: string;
  maintenance?: boolean;
}

export interface ServerNotification {
  event_id: string;
  output: string;
  sent_at: string;
}

export interface ServerNotificationsResponse {
  success: boolean;
  notifications: ServerNotification[];
}

export interface ServerCommand {
  icon: string;
  name: string;
  description: string;
  args: boolean;
  with_lock: boolean;
  additionalArgs?: string;
}

export type ServerCommandsResponse = Record<string, ServerCommand>;

export interface ScheduledCommand {
  args: string;
  command: string;
  id: string;
  is_recurring: boolean;
  scheduled_at: string;
}

export interface RecurringCommand {
  args: string;
  command: string;
  id: string;
  scheduled_at: string;
  time: string;
}

export interface Payment {
  amount: number;
  currency: string;
  email: string;
  is_subscription: boolean;
  paid_at: string;
  transaction_id: string;
}

export interface PaymentsResponse {
  payments: Payment[];
  maintenance: boolean;
  total: number;
}

export interface SupportRequest {
  id: number;
  subject: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupportMessage {
  id?: number;
  type: string;
  text: string;
  created_by?: {
    firstName: string;
    avatarUrl?: string;
    email?: string;
  };
  created_at?: string;
}

export interface SupportRequestDetail extends SupportRequest {
  messages: SupportMessage[];
}

export interface SynapseDataProvider extends DataProvider {
  deleteMedia: (params: DeleteMediaParams) => Promise<DeleteMediaResult>;
  purgeRemoteMedia: (params: DeleteMediaParams) => Promise<DeleteMediaResult>;
  uploadMedia: (params: UploadMediaParams) => Promise<UploadMediaResult>;
  updateFeatures: (id: Identifier, features: ExperimentalFeaturesModel) => Promise<void>;
  getRateLimits: (id: Identifier) => Promise<RateLimitsModel>;
  setRateLimits: (id: Identifier, rateLimits: RateLimitsModel) => Promise<void>;
  getAccountData: (id: Identifier) => Promise<AccountDataModel>;
  checkUsernameAvailability: (username: string) => Promise<UsernameAvailabilityResult>;
  makeRoomAdmin: (room_id: string, user_id: string) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  suspendUser: (
    id: Identifier,
    suspendValue: boolean
  ) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  eraseUser: (id: Identifier) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  getServerRunningProcess: (etkeAdminUrl: string, locale: string) => Promise<ServerProcessResponse>;
  getServerStatus: (etkeAdminUrl: string, locale: string) => Promise<ServerStatusResponse>;
  getServerNotifications: (etkeAdminUrl: string, locale: string) => Promise<ServerNotificationsResponse>;
  deleteServerNotifications: (etkeAdminUrl: string, locale: string) => Promise<{ success: boolean }>;
  getServerCommands: (
    etkeAdminUrl: string,
    locale: string
  ) => Promise<{ maintenance: boolean; commands: ServerCommandsResponse[] }>;
  getScheduledCommands: (etkeAdminUrl: string, locale: string) => Promise<ScheduledCommand[]>;
  getRecurringCommands: (etkeAdminUrl: string, locale: string) => Promise<RecurringCommand[]>;
  createScheduledCommand: (
    etkeAdminUrl: string,
    locale: string,
    command: Partial<ScheduledCommand>
  ) => Promise<ScheduledCommand>;
  updateScheduledCommand: (
    etkeAdminUrl: string,
    locale: string,
    command: ScheduledCommand
  ) => Promise<ScheduledCommand>;
  deleteScheduledCommand: (etkeAdminUrl: string, locale: string, id: string) => Promise<{ success: boolean }>;
  createRecurringCommand: (
    etkeAdminUrl: string,
    locale: string,
    command: Partial<RecurringCommand>
  ) => Promise<RecurringCommand>;
  updateRecurringCommand: (
    etkeAdminUrl: string,
    locale: string,
    command: RecurringCommand
  ) => Promise<RecurringCommand>;
  deleteRecurringCommand: (etkeAdminUrl: string, locale: string, id: string) => Promise<{ success: boolean }>;
  getPayments: (etkeAdminUrl: string, locale: string) => Promise<PaymentsResponse>;
  getInvoice: (etkeAdminUrl: string, locale: string, transactionId: string) => Promise<void>;
  getSupportRequests: (etkeAdminUrl: string, locale: string) => Promise<SupportRequest[]>;
  getSupportRequest: (etkeAdminUrl: string, locale: string, id: string) => Promise<SupportRequestDetail>;
  createSupportRequest: (
    etkeAdminUrl: string,
    locale: string,
    subject: string,
    message: string
  ) => Promise<SupportRequest>;
  postSupportMessage: (etkeAdminUrl: string, locale: string, id: string, message: string) => Promise<SupportMessage>;
}

const resourceMap = {
  users: {
    path: "/_synapse/admin/v2/users",
    map: async (u: User) => ({
      ...u,
      id: returnMXID(u.name),
      avatar_src: u.avatar_url ? u.avatar_url : undefined,
      is_guest: !!u.is_guest,
      admin: !!u.admin,
      deactivated: !!u.deactivated,
      // need timestamp in milliseconds
      creation_ts_ms: u.creation_ts * 1000,
    }),
    data: "users",
    total: json => json.total,
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
    total: json => json.total_rooms,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v2/rooms/${params.id}`,
      body: { block: params.meta?.block ?? false },
    }),
  },
  reports: {
    path: "/_synapse/admin/v1/event_reports",
    map: (er: EventReport) => ({ ...er }),
    data: "event_reports",
    total: json => json.total,
  },
  devices: {
    map: (d: Device) => ({
      ...d,
      id: d.device_id,
    }),
    data: "devices",
    total: json => json.total,
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v2/users/${encodeURIComponent(id)}/devices`,
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v2/users/${encodeURIComponent(params.previousData.user_id)}/devices/${params.id}`,
    }),
  },
  connections: {
    path: "/_synapse/admin/v1/whois",
    map: (c: Whois) => ({
      ...c,
      id: c.user_id,
    }),
    data: "connections",
  },
  room_members: {
    map: (m: string) => ({
      id: m,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/members`,
    }),
    data: "members",
    total: json => json.total,
  },
  room_media: {
    map: (mediaId: string) => ({
      id: mediaId.replace("mxc://" + localStorage.getItem("home_server") + "/", ""),
      media_id: mediaId.replace("mxc://" + localStorage.getItem("home_server") + "/", ""),
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/room/${id}/media`,
    }),
    total: json => json.total,
    data: "local",
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/${localStorage.getItem("home_server")}/${params.id}`,
    }),
  },
  room_state: {
    map: (rs: RoomState) => ({
      ...rs,
      id: rs.event_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/state`,
    }),
    data: "state",
    total: json => json.state.length,
  },
  pushers: {
    map: (p: Pusher) => ({
      ...p,
      id: p.pushkey,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/pushers`,
    }),
    data: "pushers",
    total: json => json.total,
  },
  joined_rooms: {
    map: (jr: string) => ({
      id: jr,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/joined_rooms`,
    }),
    data: "joined_rooms",
    total: json => json.total,
  },
  memberships: {
    map: (m: Membership) => ({
      ...m,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(id)}/memberships`,
    }),
    data: "memberships",
    total: json => json.total,
  },
  users_media: {
    map: (um: UserMedia) => ({
      ...um,
      id: um.media_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/media`,
    }),
    data: "media",
    total: json => json.total,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/${localStorage.getItem("home_server")}/${params.id}`,
    }),
  },
  protect_media: {
    map: (pm: UserMedia) => ({ id: pm.media_id }),
    create: (params: UserMedia) => ({
      endpoint: `/_synapse/admin/v1/media/protect/${params.media_id}`,
      method: "POST",
      empty_response: true,
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/unprotect/${params.id}`,
      method: "POST",
      empty_response: true,
    }),
  },
  quarantine_media: {
    map: (qm: UserMedia) => ({ id: qm.media_id }),
    create: (params: UserMedia) => ({
      endpoint: `/_synapse/admin/v1/media/quarantine/${localStorage.getItem("home_server")}/${params.media_id}`,
      method: "POST",
      empty_response: true,
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/media/unquarantine/${localStorage.getItem("home_server")}/${params.id}`,
      method: "POST",
      empty_response: true,
    }),
  },
  servernotices: {
    map: (n: { event_id: string }) => ({ id: n.event_id }),
    create: (data: RaServerNotice) => ({
      endpoint: "/_synapse/admin/v1/send_server_notice",
      body: {
        user_id: returnMXID(data.id),
        content: {
          msgtype: "m.text",
          body: data.body,
        },
      },
      method: "POST",
    }),
  },
  user_media_statistics: {
    path: "/_synapse/admin/v1/statistics/users/media",
    map: (usms: UserMediaStatistic) => ({
      ...usms,
      id: returnMXID(usms.user_id),
    }),
    data: "users",
    total: json => json.total,
  },
  forward_extremities: {
    map: (fe: ForwardExtremity) => ({
      ...fe,
      id: fe.event_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/rooms/${id}/forward_extremities`,
    }),
    data: "results",
    total: json => json.count,
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/rooms/${params.id}/forward_extremities`,
    }),
  },
  room_directory: {
    path: "/_matrix/client/v3/publicRooms",
    map: (rd: Room) => ({
      ...rd,
      id: rd.room_id,
      public: !!rd.public,
      guest_access: !!rd.guest_access,
      avatar_src: rd.avatar_url ? rd.avatar_url : undefined,
    }),
    data: "chunk",
    total: json => json.total_room_count_estimate,
    create: (params: RaRecord) => ({
      endpoint: `/_matrix/client/v3/directory/list/room/${params.id}`,
      body: { visibility: "public" },
      method: "PUT",
      empty_response: true,
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_matrix/client/v3/directory/list/room/${params.id}`,
      body: { visibility: "private" },
      method: "PUT",
    }),
  },
  destinations: {
    path: "/_synapse/admin/v1/federation/destinations",
    map: (dst: Destination) => ({
      ...dst,
      id: dst.destination,
    }),
    data: "destinations",
    total: json => json.total,
    delete: params => ({
      endpoint: `/_synapse/admin/v1/federation/destinations/${params.id}/reset_connection`,
      method: "POST",
    }),
  },
  destination_rooms: {
    map: (dstroom: DestinationRoom) => ({
      ...dstroom,
      id: dstroom.room_id,
    }),
    reference: (id: Identifier) => ({
      endpoint: `/_synapse/admin/v1/federation/destinations/${id}/rooms`,
    }),
    data: "rooms",
    total: json => json.total,
  },
  registration_tokens: {
    path: "/_synapse/admin/v1/registration_tokens",
    map: (rt: RegistrationToken) => ({
      ...rt,
      id: rt.token,
    }),
    data: "registration_tokens",
    total: json => json.registration_tokens.length,
    create: (params: RaRecord) => ({
      endpoint: "/_synapse/admin/v1/registration_tokens/new",
      body: params,
      method: "POST",
    }),
    delete: (params: DeleteParams) => ({
      endpoint: `/_synapse/admin/v1/registration_tokens/${params.id}`,
    }),
  },
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
    const {
      user_id,
      name,
      guests,
      deactivated,
      locked,
      suspended,
      search_term,
      destination,
      valid,
      public_rooms,
      empty_rooms,
    } = params.filter;
    const { page, perPage } = params.pagination as PaginationPayload;
    const { field, order } = params.sort as SortPayload;
    const from = (page - 1) * perPage;
    const query = {
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
      valid: valid,
      order_by: field,
      dir: getSearchOrder(order),
      public_rooms: public_rooms,
      empty_rooms: empty_rooms,
    };
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    const url = `${endpoint_url}?${new URLSearchParams(filterUndefined(query)).toString()}`;

    const { json } = await jsonClient(url);
    const formattedData = await json[res.data].map(res.map);

    return {
      data: formattedData,
      total: res.total(json, from, perPage),
    };
  },

  getOne: async (resource, params) => {
    console.log("getOne " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`);
    return { data: res.map(json) };
  },

  getMany: async (resource, params) => {
    console.log("getMany " + resource);
    const base_url = localStorage.getItem("base_url");
    const homeserver = localStorage.getItem("home_server");
    if (!base_url || !(resource in resourceMap)) throw Error("base_url not set");

    const res = resourceMap[resource];

    const endpoint_url = base_url + res.path;
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
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const from = (page - 1) * perPage;
    const query = {
      from: from,
      limit: perPage,
      order_by: field,
      dir: getSearchOrder(order),
    };

    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

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
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;

    const { json } = await jsonClient(`${endpoint_url}/${encodeURIComponent(params.id)}`, {
      method: "PUT",
      body: JSON.stringify(params.data, filterNullValues),
    });
    return { data: res.map(json) };
  },

  updateMany: async (resource, params) => {
    console.log("updateMany " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    const endpoint_url = homeserver + res.path;
    const responses = await Promise.all(
      params.ids.map(id => jsonClient(`${endpoint_url}/${encodeURIComponent(id)}`), {
        method: "PUT",
        body: JSON.stringify(params.data, filterNullValues),
      })
    );
    return { data: responses.map(({ json }) => json) };
  },

  create: async (resource, params) => {
    console.log("create " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];
    if (!("create" in res)) return Promise.reject();

    const create = res.create(params.data);
    const endpoint_url = homeserver + create.endpoint;
    const { json } = await jsonClient(endpoint_url, {
      method: create.method,
      body: JSON.stringify(create.body, filterNullValues),
    });

    // for some resources, the response is empty, so we return the input data as response
    if (create?.empty_response) {
      return { data: params.data };
    }

    return { data: res.map(json) };
  },

  createMany: async (resource: string, params: { ids: Identifier[]; data: RaRecord }) => {
    console.log("createMany " + resource);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];
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
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    if ("delete" in res) {
      const del = res.delete(params);
      const endpoint_url = homeserver + del.endpoint;
      const { json } = await jsonClient(endpoint_url, {
        method: "method" in del ? del.method : "DELETE",
        body: "body" in del ? JSON.stringify(del.body) : null,
      });
      if (del?.empty_response) {
        return { data: params.previousData };
      }

      return { data: json };
    } else {
      const endpoint_url = homeserver + res.path;
      const { json } = await jsonClient(`${endpoint_url}/${params.id}`, {
        method: "DELETE",
        body: JSON.stringify(params.previousData, filterNullValues),
      });
      return { data: json };
    }
  },

  deleteMany: async (resource, params) => {
    console.log("deleteMany " + resource, "params", params);
    const homeserver = localStorage.getItem("base_url");
    if (!homeserver || !(resource in resourceMap)) throw Error("Homeserver not set");

    const res = resourceMap[resource];

    if ("delete" in res) {
      const responses = await Promise.all(
        params.ids.map(id => {
          const del = res.delete({ ...params, id: id });
          const endpoint_url = homeserver + del.endpoint;
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
      const endpoint_url = homeserver + res.path;
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
   *
   * @param before_ts Unix timestamp in milliseconds. Files that were last used before this timestamp will be deleted. It is the timestamp of last access, not the timestamp when the file was created.
   * @param size_gt   Size of the media in bytes. Files that are larger will be deleted.
   * @param keep_profiles Switch to also delete files that are still used in image data (e.g user profile, room avatar). If false these files will be deleted.
   * @returns
   */
  deleteMedia: async ({ before_ts, size_gt = 0, keep_profiles = true }) => {
    const homeserver = localStorage.getItem("home_server"); // TODO only required for synapse < 1.78.0
    const endpoint = `/_synapse/admin/v1/media/${homeserver}/delete?before_ts=${before_ts}&size_gt=${size_gt}&keep_profiles=${keep_profiles}`;

    const base_url = localStorage.getItem("base_url");
    const endpoint_url = base_url + endpoint;
    const { json } = await jsonClient(endpoint_url, { method: "POST" });
    return json as DeleteMediaResult;
  },

  /**
   * Purge remote media by date
   *
   * @link https://element-hq.github.io/synapse/latest/admin_api/media_admin_api.html#purge-remote-media-api
   *
   * @param before_ts Unix timestamp in milliseconds. Files that were last used before this timestamp will be deleted. It is the timestamp of last access, not the timestamp when the file was created.
   * @returns
   */
  purgeRemoteMedia: async ({ before_ts }) => {
    const endpoint = `/_synapse/admin/v1/purge_media_cache?before_ts=${before_ts}`;

    const base_url = localStorage.getItem("base_url");
    const endpoint_url = base_url + endpoint;
    const { json } = await jsonClient(endpoint_url, { method: "POST" });
    return json as DeleteMediaResult;
  },

  uploadMedia: async ({ file, filename, content_type }: UploadMediaParams) => {
    const base_url = localStorage.getItem("base_url");
    const uploadMediaURL = `${base_url}/_matrix/media/v3/upload`;

    const { json } = await jsonClient(`${uploadMediaURL}?filename=${filename}`, {
      method: "POST",
      body: file,
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": content_type,
      }) as Headers,
    });
    return json as UploadMediaResult;
  },
  getFeatures: async (id: Identifier) => {
    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/experimental_features/${encodeURIComponent(returnMXID(id))}`;
    const { json } = await jsonClient(endpoint_url);
    return json.features as ExperimentalFeaturesModel;
  },
  updateFeatures: async (id: Identifier, features: ExperimentalFeaturesModel) => {
    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/experimental_features/${encodeURIComponent(returnMXID(id))}`;
    await jsonClient(endpoint_url, { method: "PUT", body: JSON.stringify({ features }) });
  },
  getRateLimits: async (id: Identifier) => {
    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/override_ratelimit`;
    const { json } = await jsonClient(endpoint_url);
    return json as RateLimitsModel;
  },
  getAccountData: async (id: Identifier) => {
    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/accountdata`;
    const { json } = await jsonClient(endpoint_url);
    return json as AccountDataModel;
  },
  setRateLimits: async (id: Identifier, rateLimits: RateLimitsModel) => {
    const filtered = Object.entries(rateLimits)
      .filter(([_key, value]) => value !== null && value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/override_ratelimit`;
    if (Object.keys(filtered).length === 0) {
      await jsonClient(endpoint_url, { method: "DELETE" });
      return;
    }

    await jsonClient(endpoint_url, { method: "POST", body: JSON.stringify(filtered) });
  },
  checkUsernameAvailability: async (username: string) => {
    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/username_available?username=${encodeURIComponent(username)}`;
    try {
      const { json } = await jsonClient(endpoint_url);
      return json as UsernameAvailabilityResult;
    } catch (error) {
      if (error instanceof HttpError) {
        return { available: false, error: error.body.error, errcode: error.body.errcode } as UsernameAvailabilityResult;
      }
      throw error;
    }
  },
  makeRoomAdmin: async (room_id: string, user_id: string) => {
    const base_url = localStorage.getItem("base_url");

    const endpoint_url = `${base_url}/_synapse/admin/v1/rooms/${encodeURIComponent(room_id)}/make_room_admin`;
    try {
      await jsonClient(endpoint_url, { method: "POST", body: JSON.stringify({ user_id }) });
      return { success: true };
    } catch (error) {
      if (error instanceof HttpError) {
        return { success: false, error: error.body.error, errcode: error.body.errcode };
      }
      throw error;
    }
  },
  suspendUser: async (id: Identifier, suspendValue: boolean) => {
    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/suspend/${encodeURIComponent(returnMXID(id))}`;
    try {
      await jsonClient(endpoint_url, {
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
  },
  eraseUser: async (id: Identifier) => {
    const base_url = localStorage.getItem("base_url");
    const endpoint_url = `${base_url}/_synapse/admin/v1/deactivate/${encodeURIComponent(returnMXID(id))}`;
    try {
      await jsonClient(endpoint_url, {
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
  },
  getServerRunningProcess: async (
    etkeAdminUrl: string,
    locale: string,
    burstCache = false
  ): Promise<ServerProcessResponse> => {
    const locked_at = "";
    const command = "";

    let serverURL = `${etkeAdminUrl}/lock`;
    if (burstCache) {
      serverURL += `?time=${new Date().getTime()}`;
    }

    try {
      const response = await etkeClient(serverURL, locale);

      if (response.status === 503) {
        return { locked_at, command, maintenance: true };
      }

      if (!response.ok) {
        console.error(`Error getting server running process: ${response.status} ${response.statusText}`);
        return { locked_at, command, maintenance: false };
      }
      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return json as { locked_at: string; command: string };
      }
      if (status === 204) {
        return { locked_at, command, maintenance: false };
      }
    } catch (error) {
      console.error("Error getting server running process", error);
    }

    return { locked_at, command, maintenance: false };
  },
  getServerStatus: async (etkeAdminUrl: string, locale: string, burstCache = false): Promise<ServerStatusResponse> => {
    let serverURL = `${etkeAdminUrl}/status`;
    if (burstCache) {
      serverURL += `?time=${new Date().getTime()}`;
    }

    try {
      const response = await etkeClient(serverURL, locale);

      if (response.status === 503) {
        return { success: false, ok: false, host: "", results: [], maintenance: true };
      }

      if (!response.ok) {
        console.error(`Error getting server status: ${response.status} ${response.statusText}`);
        return { success: false, ok: false, host: "", results: [] };
      }

      const status = response.status;
      if (status === 200) {
        const json = await response.json();
        const result = { success: true, ...json } as ServerStatusResponse;
        return result;
      }
    } catch (error) {
      console.error("Error getting server status", error);
    }

    return { success: false, ok: false, host: "", results: [] };
  },
  getServerNotifications: async (
    etkeAdminUrl: string,
    locale: string,
    burstCache = false
  ): Promise<ServerNotificationsResponse> => {
    let serverURL = `${etkeAdminUrl}/notifications`;
    if (burstCache) {
      serverURL += `?time=${new Date().getTime()}`;
    }

    try {
      const response = await etkeClient(serverURL, locale);
      if (response.status === 503) {
        return { success: false, notifications: [] };
      }
      if (!response.ok) {
        console.error(`Error getting server notifications: ${response.status} ${response.statusText}`);
        return { success: false, notifications: [] };
      }

      const status = response.status;
      if (status === 204) {
        return { success: true, notifications: [] };
      }

      if (status === 200) {
        const json = await response.json();
        const result = { success: true, notifications: json } as ServerNotificationsResponse;
        return result;
      }

      return { success: true, notifications: [] };
    } catch (error) {
      console.error("Error getting server notifications", error);
    }

    return { success: false, notifications: [] };
  },
  deleteServerNotifications: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/notifications`, locale, {
        method: "DELETE",
      });
      if (!response.ok) {
        console.error(`Error deleting server notifications: ${response.status} ${response.statusText}`);
        return { success: false };
      }

      const status = response.status;
      if (status === 204) {
        const result = { success: true };
        return result;
      }
    } catch (error) {
      console.error("Error deleting server notifications", error);
    }

    return { success: false };
  },
  getServerCommands: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/commands`, locale);

      if (response.status === 503) {
        return { maintenance: true, commands: [] };
      }

      if (!response.ok) {
        console.error(`Error fetching server commands: ${response.status} ${response.statusText}`);
        return { maintenance: false, commands: [] };
      }

      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return { maintenance: false, commands: json };
      }

      return { maintenance: false, commands: [] };
    } catch (error) {
      console.error("Error fetching server commands:", error);
    }

    return { maintenance: false, commands: [] };
  },
  runServerCommand: async (serverCommandsUrl: string, command: string, additionalArgs: Record<string, any> = {}) => {
    const endpoint_url = `${serverCommandsUrl}/commands`;
    const body = {
      command: command,
      ...additionalArgs,
    };
    const response = await fetch(endpoint_url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    if (response.status === 503) {
      return {
        success: false,
        maintenance: true,
      };
    }

    if (!response.ok) {
      console.error(`Error running server command: ${response.status} ${response.statusText}`);
      return {
        success: false,
        maintenance: false,
      };
    }

    const status = response.status;

    if (status === 204) {
      return {
        success: true,
        maintenance: false,
      };
    }

    return {
      success: false,
      maintenance: false,
    };
  },
  getScheduledCommands: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/schedules`, locale);
      if (response.status === 503) {
        return [];
      }

      if (!response.ok) {
        console.error(`Error fetching scheduled commands: ${response.status} ${response.statusText}`);
        return [];
      }

      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return json as ScheduledCommand[];
      }

      return [];
    } catch (error) {
      console.error("Error fetching scheduled commands:", error);
    }
    return [];
  },
  getRecurringCommands: async (etkeAdminUrl: string, locale: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings`, locale);

      if (response.status === 503) {
        return [];
      }

      if (!response.ok) {
        console.error(`Error fetching recurring commands: ${response.status} ${response.statusText}`);
        return [];
      }

      const status = response.status;

      if (status === 200) {
        const json = await response.json();
        return json as RecurringCommand[];
      }

      return [];
    } catch (error) {
      console.error("Error fetching recurring commands:", error);
    }
    return [];
  },
  createScheduledCommand: async (etkeAdminUrl: string, locale: string, command: Partial<ScheduledCommand>) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/schedules`, locale, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        console.error(`Error creating scheduled command: ${response.status} ${response.statusText}`);
        throw new Error("Failed to create scheduled command");
      }

      if (response.status === 204) {
        return command as ScheduledCommand;
      }

      const json = await response.json();
      return json as ScheduledCommand;
    } catch (error) {
      console.error("Error creating scheduled command", error);
      throw error;
    }
  },
  updateScheduledCommand: async (etkeAdminUrl: string, locale: string, command: ScheduledCommand) => {
    try {
      // Use the base endpoint without ID and use PUT for upsert
      const response = await etkeClient(`${etkeAdminUrl}/schedules`, locale, {
        method: "PUT", // Using PUT on the base endpoint
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        const jsonErr = JSON.parse(await response.text());
        console.error(`Error updating scheduled command: ${response.status} ${response.statusText}`);
        throw new Error(jsonErr.error);
      }

      // According to docs, successful response is 204 No Content
      if (response.status === 204) {
        // Return the command object we sent since the server doesn't return data
        return command;
      }

      // If server does return data (though docs suggest it returns 204)
      const json = await response.json();
      console.log("JSON", json);
      return json as ScheduledCommand;
    } catch (error) {
      console.error("Error updating scheduled command", error);
      throw error;
    }
  },
  deleteScheduledCommand: async (etkeAdminUrl: string, locale: string, id: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/schedules/${id}`, locale, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(`Error deleting scheduled command: ${response.status} ${response.statusText}`);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting scheduled command", error);
      return { success: false };
    }
  },
  createRecurringCommand: async (etkeAdminUrl: string, locale: string, command: Partial<RecurringCommand>) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings`, locale, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        console.error(`Error creating recurring command: ${response.status} ${response.statusText}`);
        throw new Error("Failed to create recurring command");
      }

      if (response.status === 204) {
        // Return the command object we sent since the server doesn't return data
        return command as RecurringCommand;
      }

      const json = await response.json();
      return json as RecurringCommand;
    } catch (error) {
      console.error("Error creating recurring command", error);
      throw error;
    }
  },
  updateRecurringCommand: async (etkeAdminUrl: string, locale: string, command: RecurringCommand) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings`, locale, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        console.error(`Error updating recurring command: ${response.status} ${response.statusText}`);
        throw new Error("Failed to update recurring command");
      }

      if (response.status === 204) {
        // Return the command object we sent since the server doesn't return data
        return command as RecurringCommand;
      }

      const json = await response.json();
      return json as RecurringCommand;
    } catch (error) {
      console.error("Error updating recurring command", error);
      throw error;
    }
  },
  deleteRecurringCommand: async (etkeAdminUrl: string, locale: string, id: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/recurrings/${id}`, locale, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error(`Error deleting recurring command: ${response.status} ${response.statusText}`);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting recurring command", error);
      return { success: false };
    }
  },
  getPayments: async (etkeAdminUrl: string, locale: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/payments`, locale);

    if (response.status === 503) {
      return { payments: [], total: 0, maintenance: true };
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch payments: ${response.status} ${response.statusText}`);
    }

    const status = response.status;

    if (status === 200) {
      const json = await response.json();
      return json as PaymentsResponse;
    }

    if (status === 204) {
      return { payments: [], total: 0, maintenance: false };
    }

    throw new Error(`${response.status} ${response.statusText}`); // Handle unexpected status codes
  },
  getInvoice: async (etkeAdminUrl: string, locale: string, transactionId: string) => {
    try {
      const response = await etkeClient(`${etkeAdminUrl}/payments/${transactionId}/invoice`, locale);

      if (!response.ok) {
        let errorMessage = `Error fetching invoice: ${response.status} ${response.statusText}`;

        // Handle specific error codes
        switch (response.status) {
          case 404:
            errorMessage = "Invoice not found for this transaction";
            break;
          case 500:
            errorMessage = "Server error while generating invoice. Please try again later";
            break;
          case 401:
            errorMessage = "Unauthorized access. Please check your permissions";
            break;
          case 403:
            errorMessage = "Access forbidden. You don't have permission to download this invoice";
            break;
          default:
            errorMessage = `Failed to fetch invoice (${response.status}): ${response.statusText}`;
        }

        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Get the file as a blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Try to get filename from response headers
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `invoice_${transactionId}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      throw error; // Re-throw to let the UI handle the error
    }
  },
  getSupportRequests: async (etkeAdminUrl: string, locale: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support`, locale);
    if (response.status === 204) {
      return [];
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch support requests: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return (json.requests ?? json) as SupportRequest[];
  },
  getSupportRequest: async (etkeAdminUrl: string, locale: string, id: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support/${id}`, locale);
    if (!response.ok) {
      throw new Error(`Failed to fetch support request: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json as SupportRequestDetail;
  },
  createSupportRequest: async (etkeAdminUrl: string, locale: string, subject: string, message: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support`, locale, {
      method: "POST",
      body: JSON.stringify({ subject, message }),
    });
    if (!response.ok) {
      throw new Error(`Failed to create support request: ${response.status} ${response.statusText}`);
    }
    const json = await response.json();
    return json as SupportRequest;
  },
  postSupportMessage: async (etkeAdminUrl: string, locale: string, id: string, message: string) => {
    const response = await etkeClient(`${etkeAdminUrl}/support/${id}`, locale, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`Failed to post support message: ${response.status} ${response.statusText}`);
    }
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as SupportMessage;
    }
    const json = await response.json();
    return json as SupportMessage;
  },
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
      if (params.meta?.deleteMedia) {
        const base_url = localStorage.getItem("base_url");
        const endpoint_url = `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(params.id))}/media`;
        await jsonClient(endpoint_url, { method: "DELETE" });
      }

      if (params.meta?.redactEvents) {
        const base_url = localStorage.getItem("base_url");
        const endpoint_url = `${base_url}/_synapse/admin/v1/user/${encodeURIComponent(returnMXID(params.id))}/redact`;
        await jsonClient(endpoint_url, { method: "POST", body: JSON.stringify({ rooms: [] }) });
      }

      return params;
    },
    beforeDeleteMany: async (params: DeleteManyParams<any>, _dataProvider: DataProvider) => {
      await Promise.all(
        params.ids.map(async id => {
          if (params.meta?.deleteMedia) {
            const base_url = localStorage.getItem("base_url");
            const endpoint_url = `${base_url}/_synapse/admin/v1/users/${encodeURIComponent(returnMXID(id))}/media`;
            await jsonClient(endpoint_url, { method: "DELETE" });
          }

          if (params.meta?.redactEvents) {
            const base_url = localStorage.getItem("base_url");
            const endpoint_url = `${base_url}/_synapse/admin/v1/user/${encodeURIComponent(returnMXID(id))}/redact`;
            await jsonClient(endpoint_url, { method: "POST", body: JSON.stringify({ rooms: [] }) });
          }
        })
      );
      return params;
    },
  },
]);

export default dataProvider;
