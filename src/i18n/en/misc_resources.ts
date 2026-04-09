// Miscellaneous resources: scheduled_tasks, connections, devices, users_media,
// protect_media, quarantine_media, pushers, servernotices, database_room_statistics,
// user_media_statistics, forward_extremities, room_state, room_media, room_directory,
// destinations, registration_tokens
const misc_resources = {
  scheduled_tasks: {
    name: "Scheduled task |||| Scheduled tasks",
    fields: {
      id: "ID",
      action: "Action",
      status: "Status",
      timestamp: "Timestamp",
      resource_id: "Resource ID",
      result: "Result",
      error: "Error",
      max_timestamp: "Before date",
    },
    status: {
      scheduled: "Scheduled",
      active: "Active",
      complete: "Complete",
      cancelled: "Cancelled",
      failed: "Failed",
    },
  },
  connections: {
    name: "Connections",
    fields: {
      last_seen: "Date",
      ip: "IP address",
      user_agent: "User agent",
    },
  },
  devices: {
    name: "Device |||| Devices",
    fields: {
      device_id: "Device ID",
      display_name: "Device name",
      last_seen_ts: "Timestamp",
      last_seen_ip: "IP address",
      last_seen_user_agent: "User agent",
      dehydrated: "Dehydrated",
    },
    action: {
      erase: {
        title: "Remove device %{id}?",
        title_bulk: "Remove %{smart_count} device? |||| Remove %{smart_count} devices?",
        content: 'Are you sure you want to remove the device "%{name}"?',
        content_bulk:
          "Are you sure you want to remove %{smart_count} device? |||| Are you sure you want to remove %{smart_count} devices?",
        success: "Device successfully removed.",
        failure: "An error has occurred.",
      },
      display_name: {
        success: "Device name updated",
        failure: "Failed to update device name",
      },
      create: {
        label: "Create device",
        title: "Create new device",
        success: "Device created",
        failure: "Failed to create device",
      },
    },
  },
  users_media: {
    name: "Media",
    fields: {
      media_id: "Media ID",
      media_length: "File Size (in Bytes)",
      media_type: "Type",
      upload_name: "File name",
      quarantined_by: "Quarantined by",
      safe_from_quarantine: "Safe from quarantine",
      created_ts: "Created",
      last_access_ts: "Last access",
    },
    action: {
      open: "Open media file in a new window",
    },
  },
  protect_media: {
    action: {
      create: "Protect",
      delete: "Unprotect",
      none: "In quarantine",
      send_success: "Successfully changed the protection status.",
      send_failure: "An error has occurred.",
    },
  },
  quarantine_media: {
    action: {
      name: "Quarantine",
      create: "Quarantine",
      delete: "Unquarantine",
      none: "Protected",
      send_success: "Successfully changed the quarantine status.",
      send_failure: "An error has occurred: %{error}",
    },
  },
  pushers: {
    name: "Pusher |||| Pushers",
    fields: {
      app: "App",
      app_display_name: "App display name",
      app_id: "App ID",
      device_display_name: "Device display name",
      kind: "Kind",
      lang: "Language",
      profile_tag: "Profile tag",
      pushkey: "Pushkey",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "Server Notices",
    send: "Send server notices",
    fields: {
      body: "Message",
    },
    action: {
      send: "Send note",
      send_success: "Server notice successfully sent.",
      send_failure: "An error has occurred.",
    },
    helper: {
      send: 'Sends a server notice to the selected users. The feature "Server Notices" must be enabled on the server.',
    },
  },
  database_room_statistics: {
    name: "Database room statistics",
    fields: {
      room_id: "Room ID",
      estimated_size: "Estimated size",
    },
    helper: {
      info: "Shows the estimated disk space used by each room in the Synapse database. These numbers are approximate.",
    },
  },
  user_media_statistics: {
    name: "Media",
    fields: {
      media_count: "Media count",
      media_length: "Media length",
    },
  },
  forward_extremities: {
    name: "Forward Extremities",
    fields: {
      id: "Event ID",
      received_ts: "Timestamp",
      depth: "Depth",
      state_group: "State group",
    },
  },
  room_state: {
    name: "State events",
    fields: {
      type: "Type",
      content: "Content",
      origin_server_ts: "Sent at",
      sender: "Sender",
    },
  },
  room_media: {
    name: "Media",
    fields: {
      media_id: "Media ID",
    },
    helper: {
      info: "This lists all media uploaded to this room. Media hosted on external repositories cannot be deleted from here.",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "Room directory",
    fields: {
      world_readable: "Guest users may view without joining",
      guest_can_join: "Guest users may join",
    },
    action: {
      title: "Delete room from directory |||| Delete %{smart_count} rooms from directory",
      content:
        "Are you sure you want to remove this room from the directory? |||| Are you sure you want to remove these %{smart_count} rooms from the directory?",
      erase: "Delete from room directory",
      create: "Publish in room directory",
      send_success: "Room successfully published.",
      send_failure: "An error has occurred.",
    },
  },
  destinations: {
    name: "Federation",
    fields: {
      destination: "Destination",
      failure_ts: "Failure timestamp",
      retry_last_ts: "Last retry timestamp",
      retry_interval: "Retry interval",
      last_successful_stream_ordering: "Last successful stream",
      stream_ordering: "Stream",
    },
    action: { reconnect: "Reconnect" },
  },
  registration_tokens: {
    name: "Registration tokens",
    fields: {
      token: "Token",
      valid: "Valid token",
      uses_allowed: "Uses allowed",
      pending: "Pending",
      completed: "Completed",
      expiry_time: "Expiry time",
      length: "Length",
      created_at: "Created at",
      last_used_at: "Last used at",
      revoked_at: "Revoked at",
    },
    helper: { length: "The length of the generated token, used when no specific token value is provided." },
    action: {
      revoke: {
        label: "Revoke",
        success: "Token revoked",
      },
      unrevoke: {
        label: "Restore",
        success: "Token restored",
      },
    },
  },
  account_data: {
    name: "Account data",
  },
  joined_rooms: {
    name: "Joined rooms",
  },
  memberships: {
    name: "Memberships",
  },
  room_members: {
    name: "Members",
  },
  destination_rooms: {
    name: "Rooms",
  },
};

export default misc_resources;
