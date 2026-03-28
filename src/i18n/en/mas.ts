const mas = {
  mas_users: {
    name: "MAS User |||| MAS Users",
    fields: {
      id: "MAS ID",
      username: "Username",
      admin: "Admin",
      locked: "Locked",
      deactivated: "Deactivated",
      legacy_guest: "Legacy Guest",
      created_at: "Created at",
      locked_at: "Locked at",
      deactivated_at: "Deactivated at",
    },
    filter: {
      status: "Status",
      search: "Search",
      status_active: "Active",
      status_locked: "Locked",
      status_deactivated: "Deactivated",
    },
    action: {
      lock: { label: "Lock", success: "User locked" },
      unlock: { label: "Unlock", success: "User unlocked" },
      deactivate: { label: "Deactivate", success: "User deactivated" },
      reactivate: { label: "Reactivate", success: "User reactivated" },
      set_admin: { label: "Grant Admin", success: "Admin status updated" },
      remove_admin: { label: "Remove Admin", success: "Admin status updated" },
      set_password: {
        label: "Set Password",
        title: "Set Password",
        success: "Password set",
        failure: "Failed to set password",
      },
    },
  },
  mas_user_emails: {
    name: "Email |||| Emails",
    empty: "No emails",
    fields: {
      email: "Email",
      user_id: "User ID",
      created_at: "Created at",
      actions: "Actions",
    },
    action: {
      remove: {
        label: "Remove",
        title: "Remove email",
        content: "Remove %{email}?",
        success: "Email removed",
      },
      create: { success: "Email added" },
    },
  },
  mas_compat_sessions: {
    name: "Compat Session |||| Compat Sessions",
    empty: "No compat sessions",
    fields: {
      user_id: "User ID",
      device_id: "Device ID",
      created_at: "Created at",
      user_agent: "User Agent",
      last_active_at: "Last active",
      last_active_ip: "Last IP",
      finished_at: "Finished at",
      human_name: "Name",
      active: "Active",
    },
    action: {
      finish: {
        label: "Finish",
        title: "Finish session?",
        content: "This will terminate the session.",
        success: "Session finished",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "OAuth2 Session |||| OAuth2 Sessions",
    empty: "No OAuth2 sessions",
    fields: {
      user_id: "User ID",
      client_id: "Client ID",
      scope: "Scope",
      created_at: "Created at",
      user_agent: "User Agent",
      last_active_at: "Last active",
      last_active_ip: "Last IP",
      finished_at: "Finished at",
      human_name: "Name",
      active: "Active",
    },
    action: {
      finish: {
        label: "Finish",
        title: "Finish session?",
        content: "This will terminate the session.",
        success: "Session finished",
      },
    },
  },
  mas_policy_data: {
    name: "Policy Data",
    current_policy: "Current Policy",
    no_policy: "No policy is currently set.",
    set_policy: "Set New Policy",
    invalid_json: "Invalid JSON",
    fields: {
      json_placeholder: "Enter policy data as JSON…",
      created_at: "Created at",
    },
    action: {
      save: {
        label: "Set Policy",
        success: "Policy updated",
        failure: "Failed to update policy",
      },
    },
  },
  mas_user_sessions: {
    name: "Browser Session |||| Browser Sessions",
    fields: {
      user_id: "User ID",
      created_at: "Created at",
      finished_at: "Finished at",
      user_agent: "User Agent",
      last_active_at: "Last active",
      last_active_ip: "Last IP",
      active: "Active",
    },
    action: {
      finish: {
        label: "Finish",
        title: "Finish session?",
        content: "This will terminate the browser session.",
        success: "Session finished",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "Upstream OAuth Link |||| Upstream OAuth Links",
    fields: {
      user_id: "User ID",
      provider_id: "Provider ID",
      subject: "Subject",
      human_account_name: "Account Name",
      created_at: "Created at",
    },
    helper: {
      provider_id: "The ID of the upstream OAuth provider. Find it in the Upstream OAuth Providers list.",
    },
    action: {
      remove: {
        label: "Remove",
        title: "Remove OAuth link?",
        content: "This will remove the upstream OAuth link for this user.",
        success: "OAuth link removed",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "OAuth Provider |||| OAuth Providers",
    fields: {
      issuer: "Issuer",
      human_name: "Name",
      brand_name: "Brand",
      created_at: "Created at",
      disabled_at: "Disabled at",
      enabled: "Enabled",
    },
  },
  mas_personal_sessions: {
    name: "Personal Session |||| Personal Sessions",
    empty: "No personal sessions",
    fields: {
      owner_user_id: "Owner User ID",
      actor_user_id: "User",
      human_name: "Name",
      scope: "Scope",
      created_at: "Created at",
      revoked_at: "Revoked at",
      last_active_at: "Last active",
      last_active_ip: "Last IP",
      expires_at: "Expires at",
      expires_in: "Expires in (seconds)",
      active: "Active",
    },
    helper: {
      expires_in: "Optional. Number of seconds until the token expires. Leave blank for no expiry.",
    },
    action: {
      revoke: {
        label: "Revoke",
        title: "Revoke session?",
        content: "This will revoke the personal access token.",
        success: "Session revoked",
      },
      create: {
        token_title: "Personal Access Token",
        token_content: "Copy this token now — it will not be shown again.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "Active",
      finished: "Finished",
      revoked: "Revoked",
    },
  },
};

export default mas;
