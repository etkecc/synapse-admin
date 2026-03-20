import { DataProvider, DeleteParams, Identifier, RaRecord, UpdateParams } from "react-admin";

export interface MasPaginationLinks {
  self?: string;
  first?: string;
  last?: string;
  next?: string;
  prev?: string;
}

export interface MasPageMeta {
  page?: {
    cursor?: string;
  };
}

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

export interface RoomState {
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

export interface ForwardExtremity {
  event_id: string;
  state_group: number;
  depth: number;
  received_ts: number;
}

export interface EventReport {
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

export interface Threepid {
  medium: string;
  address: string;
  added_at: number;
  validated_at: number;
}

export interface ExternalId {
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

export interface Device {
  device_id: string;
  display_name?: string;
  last_seen_ip?: string;
  last_seen_user_agent?: string;
  last_seen_ts?: number;
  user_id: string;
  dehydrated?: boolean;
}

export interface Connection {
  ip: string;
  last_seen: number;
  user_agent: string;
}

export interface Membership {
  id: string;
  membership: string;
}

export interface Whois {
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

export interface Pusher {
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

export interface UserMedia {
  created_ts: number;
  last_access_ts?: number;
  media_id: string;
  media_length: number;
  media_type: string;
  quarantined_by?: string;
  safe_from_quarantine: boolean;
  upload_name?: string;
}

export interface UserMediaStatistic {
  displayname: string;
  media_count: number;
  media_length: number;
  user_id: string;
}

export interface RegistrationToken {
  token: string;
  uses_allowed: number;
  pending: number;
  completed: number;
  expiry_time?: number;
  // MAS-only fields
  created_at?: string;
  last_used_at?: string;
  revoked_at?: string;
}

export interface MASRegistrationTokenAttributes {
  token: string;
  valid: boolean;
  usage_limit?: number;
  times_used: number;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
  revoked_at?: string;
}

export interface MASRegistrationTokenResource {
  type: string;
  id: string;
  attributes: MASRegistrationTokenAttributes;
  meta?: MasPageMeta;
  links: {
    self: string;
  };
}

export interface MASRegistrationToken {
  data: MASRegistrationTokenResource;
  links: {
    self: string;
  };
}

export interface MASRegistrationTokenListResponse {
  data: MASRegistrationTokenResource[];
  meta?: {
    count?: number;
  };
  links?: MasPaginationLinks;
}

export interface BaseRegistrationTokensResource {
  path: string;
  data: string;
  create: (params: RaRecord) => { endpoint: string; body: object; method: string };
  delete: (params: DeleteParams) => { endpoint: string; method?: string; body?: object };
}

export interface SynapseRegistrationTokensResourceType extends BaseRegistrationTokensResource {
  isMAS: false;
  map: (token: RegistrationToken) => object;
  total: (json: { registration_tokens: unknown[] }) => number;
}

export interface MASRegistrationTokensResourceType extends BaseRegistrationTokensResource {
  isMAS: true;
  map: (token: MASRegistrationToken | MASRegistrationTokenResource) => object;
  total: (json: MASRegistrationTokenListResponse) => number;
  handleCreateResponse: (token: MASRegistrationToken) => object;
  update: (params: UpdateParams) => { endpoint: string; body: object; method: string };
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  buildListQuery: (perPage: number, cursor: string | undefined, filter: Record<string, any>) => Record<string, any>;
}

export type RegistrationTokensResource = SynapseRegistrationTokensResourceType | MASRegistrationTokensResourceType;

export interface RaServerNotice {
  id: string;
  body: string;
}

export interface ScheduledTask {
  id: string;
  action: string;
  status: string;
  timestamp_ms: number;
  resource_id?: string;
  result?: unknown;
  error?: string;
}

export interface Destination {
  destination: string;
  retry_last_ts: number;
  retry_interval: number;
  failure_ts: number;
  last_successful_stream_ordering?: number;
}

export interface DestinationRoom {
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
  invoice_id: string;
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

export interface TimestampToEventResult {
  event_id: string;
  origin_server_ts: number;
}

export interface RoomEvent {
  event_id: string;
  type: string;
  room_id: string;
  sender: string;
  origin_server_ts: number;
  content: Record<string, unknown>;
  state_key?: string;
  unsigned?: Record<string, unknown>;
}

export interface EventContextResult {
  event: RoomEvent;
  events_before: RoomEvent[];
  events_after: RoomEvent[];
  start: string;
  end: string;
  state: RoomEvent[];
}

export interface RoomMessagesResult {
  chunk: RoomEvent[];
  start: string;
  end?: string;
  state?: RoomEvent[];
}

export interface HierarchyRoom {
  room_id: string;
  name?: string;
  topic?: string;
  canonical_alias?: string;
  avatar_url?: string;
  room_type?: string;
  num_joined_members: number;
  join_rule?: string;
  guest_can_join: boolean;
  world_readable: boolean;
  children_state: {
    type: string;
    state_key: string;
    content: Record<string, unknown>;
    sender: string;
    origin_server_ts: number;
  }[];
}

export interface RoomHierarchyResult {
  rooms: HierarchyRoom[];
  next_batch?: string;
}

export interface AdminClientConfig {
  return_soft_failed_events: boolean;
  return_policy_server_spammy_events: boolean;
}

export interface MASUserAttributes {
  username: string;
  created_at: string;
  locked_at: string | null;
  deactivated_at: string | null;
  admin: boolean;
  legacy_guest: boolean;
}

export interface MASUserResource {
  type: "user";
  id: string;
  attributes: MASUserAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASUserResponse {
  data: MASUserResource;
  links: { self: string };
}

export interface MASUserListResponse {
  data: MASUserResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface MASUserEmailAttributes {
  created_at: string;
  user_id: string;
  email: string;
}

export interface MASUserEmailResource {
  type: "user-email";
  id: string;
  attributes: MASUserEmailAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASUserEmailListResponse {
  data: MASUserEmailResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface MASCompatSessionAttributes {
  user_id: string;
  device_id: string | null;
  user_session_id: string | null;
  redirect_uri: string | null;
  created_at: string;
  user_agent: string | null;
  last_active_at: string | null;
  last_active_ip: string | null;
  finished_at: string | null;
  human_name: string | null;
}

export interface MASCompatSessionResource {
  type: "compat-session";
  id: string;
  attributes: MASCompatSessionAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASCompatSessionListResponse {
  data: MASCompatSessionResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface MASOAuth2SessionAttributes {
  created_at: string;
  finished_at: string | null;
  user_id: string | null;
  user_session_id: string | null;
  client_id: string;
  scope: string;
  user_agent: string | null;
  last_active_at: string | null;
  last_active_ip: string | null;
  human_name: string | null;
}

export interface MASOAuth2SessionResource {
  type: "oauth2-session";
  id: string;
  attributes: MASOAuth2SessionAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASOAuth2SessionListResponse {
  data: MASOAuth2SessionResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface MASPersonalSessionAttributes {
  created_at: string;
  revoked_at: string | null;
  owner_user_id: string | null;
  actor_user_id: string | null;
  human_name: string | null;
  scope: string;
  last_active_at: string | null;
  last_active_ip: string | null;
  expires_at: string | null;
  access_token?: string | null;
}

export interface MASPersonalSessionResource {
  type: "personal-session";
  id: string;
  attributes: MASPersonalSessionAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASPersonalSessionListResponse {
  data: MASPersonalSessionResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface MASUserSessionAttributes {
  user_id: string;
  created_at: string;
  finished_at: string | null;
  user_agent: string | null;
  last_active_at: string | null;
  last_active_ip: string | null;
}

export interface MASUserSessionResource {
  type: "browser-session";
  id: string;
  attributes: MASUserSessionAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASUserSessionListResponse {
  data: MASUserSessionResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface MASPolicyDataAttributes {
  created_at: string;
  data: {
    type: string;
    attributes: {
      url: string;
    };
  };
}

export interface MASPolicyDataResource {
  type: "policy-data";
  id: string;
  attributes: MASPolicyDataAttributes;
  links: { self: string };
}

export interface MASPolicyData {
  id: string;
  url: string;
  created_at: string;
}

export interface MASUpstreamOAuthLinkAttributes {
  created_at: string;
  provider_id: string;
  subject: string;
  user_id: string;
  human_account_name: string | null;
}

export interface MASUpstreamOAuthLinkResource {
  type: "upstream-oauth-link";
  id: string;
  attributes: MASUpstreamOAuthLinkAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASUpstreamOAuthLinkListResponse {
  data: MASUpstreamOAuthLinkResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface MASUpstreamOAuthProviderAttributes {
  issuer: string | null;
  human_name: string | null;
  brand_name: string | null;
  created_at: string;
  disabled_at: string | null;
}

export interface MASUpstreamOAuthProviderResource {
  type: "upstream-oauth-provider";
  id: string;
  attributes: MASUpstreamOAuthProviderAttributes;
  links: { self: string };
  meta?: MasPageMeta;
}

export interface MASUpstreamOAuthProviderListResponse {
  data: MASUpstreamOAuthProviderResource[];
  meta?: { count?: number };
  links?: MasPaginationLinks;
}

export interface SynapseDataProvider extends DataProvider {
  deleteMedia: (params: DeleteMediaParams) => Promise<DeleteMediaResult>;
  purgeRemoteMedia: (params: DeleteMediaParams) => Promise<DeleteMediaResult>;
  uploadMedia: (params: UploadMediaParams) => Promise<UploadMediaResult>;
  updateFeatures: (id: Identifier, features: ExperimentalFeaturesModel) => Promise<void>;
  getRateLimits: (id: Identifier) => Promise<RateLimitsModel>;
  setRateLimits: (id: Identifier, rateLimits: RateLimitsModel) => Promise<void>;
  getSentInviteCount: (id: Identifier, fromTs?: number) => Promise<number>;
  getCumulativeJoinedRoomCount: (id: Identifier, fromTs?: number) => Promise<number>;
  getAccountData: (id: Identifier) => Promise<AccountDataModel>;
  checkUsernameAvailability: (username: string) => Promise<UsernameAvailabilityResult>;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  fetchEvent: (eventId: string) => Promise<Record<string, any>>;
  revokeRegistrationToken: (id: string, revoke: boolean) => Promise<{ success: boolean; error?: string }>;
  blockRoom: (roomId: string, block: boolean) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  getRoomBlockStatus: (
    roomId: string
  ) => Promise<{ success: boolean; block: boolean; error?: string; errcode?: string }>;
  deleteDevices: (
    user_id: string,
    devices: string[]
  ) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  joinUserToRoom: (room_id: string, user_id: string) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  makeRoomAdmin: (room_id: string, user_id: string) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  suspendUser: (
    id: Identifier,
    suspendValue: boolean
  ) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  shadowBanUser: (
    id: Identifier,
    shadowBan: boolean
  ) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  resetPassword: (
    id: Identifier,
    newPassword: string,
    logoutDevices?: boolean
  ) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  loginAsUser: (
    id: Identifier,
    validUntilMs?: number
  ) => Promise<{ success: boolean; access_token?: string; error?: string; errcode?: string }>;
  eraseUser: (id: Identifier) => Promise<{ success: boolean; error?: string; errcode?: string }>;
  renewAccountValidity: (
    userId: string,
    expirationTs?: number,
    enableRenewalEmails?: boolean
  ) => Promise<{ success: boolean; expiration_ts?: number; error?: string; errcode?: string }>;
  allowCrossSigningReplacement: (
    userId: string
  ) => Promise<{ success: boolean; updatable_without_uia_before_ms?: number; error?: string; errcode?: string }>;
  findUserByThreepid: (
    medium: string,
    address: string
  ) => Promise<{ success: boolean; user_id?: string; error?: string; errcode?: string }>;
  findUserByAuthProvider: (
    provider: string,
    externalId: string
  ) => Promise<{ success: boolean; user_id?: string; error?: string; errcode?: string }>;
  getEventByTimestamp: (
    roomId: string,
    ts: number,
    dir?: "f" | "b"
  ) => Promise<{ success: boolean; event_id?: string; origin_server_ts?: number; error?: string; errcode?: string }>;
  getEventContext: (
    roomId: string,
    eventId: string,
    limit?: number
  ) => Promise<{ success: boolean; data?: EventContextResult; error?: string; errcode?: string }>;
  getRoomMessages: (
    roomId: string,
    params: { from: string; to?: string; limit?: number; dir?: "f" | "b"; filter?: string }
  ) => Promise<{ success: boolean; data?: RoomMessagesResult; error?: string; errcode?: string }>;
  getRoomHierarchy: (
    roomId: string,
    params?: { from?: string; limit?: number; max_depth?: number }
  ) => Promise<{ success: boolean; data?: RoomHierarchyResult; error?: string; errcode?: string }>;
  quarantineRoomMedia: (
    roomId: string
  ) => Promise<{ success: boolean; num_quarantined: number; error?: string; errcode?: string }>;
  quarantineUserMedia: (
    userId: string
  ) => Promise<{ success: boolean; num_quarantined: number; error?: string; errcode?: string }>;
  purgeHistory: (
    roomId: string,
    purge_up_to_ts: number,
    delete_local_events: boolean
  ) => Promise<{ success: boolean; purge_id?: string; error?: string; errcode?: string }>;
  getPurgeHistoryStatus: (
    purgeId: string
  ) => Promise<{ success: boolean; status?: string; error?: string; errcode?: string }>;
  deleteRoom: (
    roomId: string,
    block: boolean
  ) => Promise<{ success: boolean; delete_id?: string; error?: string; errcode?: string }>;
  getRoomDeleteStatus: (
    deleteId: string
  ) => Promise<{ success: boolean; status?: string; error?: string; errcode?: string }>;
  redactUserEvents: (id: Identifier) => Promise<{ redact_id: string }>;
  getRedactStatus: (redactId: string) => Promise<{
    success: boolean;
    status: string;
    failed_redactions: Record<string, string>;
    error?: string;
    errcode?: string;
  }>;
  getServerRunningProcess: (etkeAdminUrl: string, locale: string) => Promise<ServerProcessResponse>;
  getServerStatus: (etkeAdminUrl: string, locale: string) => Promise<ServerStatusResponse>;
  getServerNotifications: (etkeAdminUrl: string, locale: string) => Promise<ServerNotificationsResponse>;
  deleteServerNotifications: (etkeAdminUrl: string, locale: string) => Promise<{ success: boolean }>;
  getUnits: (etkeAdminUrl: string, locale: string) => Promise<string[]>;
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
  getAdminClientConfig: () => Promise<AdminClientConfig>;
  setAdminClientConfig: (config: AdminClientConfig) => Promise<void>;
  masLockUser: (id: string, lock: boolean) => Promise<{ success: boolean; error?: string }>;
  masDeactivateUser: (id: string, active: boolean) => Promise<{ success: boolean; error?: string }>;
  masSetAdmin: (id: string, admin: boolean) => Promise<{ success: boolean; error?: string }>;
  masSetPassword: (id: string, password: string) => Promise<{ success: boolean; error?: string }>;
  masFinishSession: (
    resource: "mas_compat_sessions" | "mas_oauth2_sessions",
    id: string
  ) => Promise<{ success: boolean; error?: string }>;
  masRevokePersonalSession: (id: string) => Promise<{ success: boolean; error?: string }>;
  masRegeneratePersonalSession: (id: string) => Promise<{ success: boolean; token?: string; error?: string }>;
  masFinishUserSession: (id: string) => Promise<{ success: boolean; error?: string }>;
  getMASPolicyData: () => Promise<MASPolicyData | null>;
  setMASPolicyData: (url: string) => Promise<{ success: boolean; error?: string }>;
}
