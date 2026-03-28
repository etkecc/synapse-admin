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
