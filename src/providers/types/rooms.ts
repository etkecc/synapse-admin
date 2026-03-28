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
