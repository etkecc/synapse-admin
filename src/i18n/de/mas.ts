const mas = {
  mas_users: {
    name: "MAS-Benutzer |||| MAS-Benutzer",
    fields: {
      id: "MAS-ID",
      username: "Benutzername",
      admin: "Administrator",
      locked: "Gesperrt",
      deactivated: "Deaktiviert",
      legacy_guest: "Legacy-Gast",
      created_at: "Erstellt am",
      locked_at: "Gesperrt am",
      deactivated_at: "Deaktiviert am",
    },
    filter: {
      status: "Status",
      search: "Suche",
      status_active: "Aktiv",
      status_locked: "Gesperrt",
      status_deactivated: "Deaktiviert",
    },
    action: {
      lock: { label: "Sperren", success: "Benutzer gesperrt" },
      unlock: { label: "Entsperren", success: "Benutzer entsperrt" },
      deactivate: { label: "Deaktivieren", success: "Benutzer deaktiviert" },
      reactivate: { label: "Reaktivieren", success: "Benutzer reaktiviert" },
      set_admin: { label: "Admin erteilen", success: "Admin-Status aktualisiert" },
      remove_admin: { label: "Admin entziehen", success: "Admin-Status aktualisiert" },
      set_password: {
        label: "Passwort setzen",
        title: "Passwort setzen",
        success: "Passwort gesetzt",
        failure: "Passwort konnte nicht gesetzt werden",
      },
    },
  },
  mas_user_emails: {
    name: "E-Mail |||| E-Mails",
    empty: "Keine E-Mails",
    fields: {
      email: "E-Mail",
      user_id: "Benutzer-ID",
      created_at: "Erstellt am",
      actions: "Aktionen",
    },
    action: {
      remove: {
        label: "Entfernen",
        title: "E-Mail entfernen",
        content: "%{email} entfernen?",
        success: "E-Mail entfernt",
      },
      create: { success: "E-Mail hinzugefügt" },
    },
  },
  mas_compat_sessions: {
    name: "Compat-Sitzung |||| Compat-Sitzungen",
    empty: "Keine Compat-Sitzungen",
    fields: {
      user_id: "Benutzer-ID",
      device_id: "Geräte-ID",
      created_at: "Erstellt am",
      user_agent: "User Agent",
      last_active_at: "Zuletzt aktiv",
      last_active_ip: "Letzte IP",
      finished_at: "Beendet am",
      human_name: "Name",
      active: "Aktiv",
    },
    action: {
      finish: {
        label: "Beenden",
        title: "Sitzung beenden?",
        content: "Diese Sitzung wird beendet.",
        success: "Sitzung beendet",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "OAuth2-Sitzung |||| OAuth2-Sitzungen",
    empty: "Keine OAuth2-Sitzungen",
    fields: {
      user_id: "Benutzer-ID",
      client_id: "Client-ID",
      scope: "Berechtigungsbereich",
      created_at: "Erstellt am",
      user_agent: "User Agent",
      last_active_at: "Zuletzt aktiv",
      last_active_ip: "Letzte IP",
      finished_at: "Beendet am",
      human_name: "Name",
      active: "Aktiv",
    },
    action: {
      finish: {
        label: "Beenden",
        title: "Sitzung beenden?",
        content: "Diese Sitzung wird beendet.",
        success: "Sitzung beendet",
      },
    },
  },
  mas_policy_data: {
    name: "Richtliniendaten",
    current_policy: "Aktuelle Richtlinie",
    no_policy: "Aktuell ist keine Richtlinie gesetzt.",
    set_policy: "Neue Richtlinie setzen",
    invalid_json: "Ungültiges JSON",
    fields: {
      json_placeholder: "Richtliniendaten als JSON eingeben…",
      created_at: "Erstellt am",
    },
    action: {
      save: {
        label: "Richtlinie setzen",
        success: "Richtlinie aktualisiert",
        failure: "Richtlinie konnte nicht aktualisiert werden",
      },
    },
  },
  mas_user_sessions: {
    name: "Browser-Sitzung |||| Browser-Sitzungen",
    fields: {
      user_id: "Benutzer-ID",
      created_at: "Erstellt am",
      finished_at: "Beendet am",
      user_agent: "User Agent",
      last_active_at: "Zuletzt aktiv",
      last_active_ip: "Letzte IP",
      active: "Aktiv",
    },
    action: {
      finish: {
        label: "Beenden",
        title: "Sitzung beenden?",
        content: "Diese Browser-Sitzung wird beendet.",
        success: "Sitzung beendet",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "Upstream-OAuth-Verknüpfung |||| Upstream-OAuth-Verknüpfungen",
    fields: {
      user_id: "Benutzer-ID",
      provider_id: "Anbieter-ID",
      subject: "Betreff",
      human_account_name: "Kontoname",
      created_at: "Erstellt am",
    },
    helper: {
      provider_id: "Die ID des Upstream-OAuth-Anbieters. In der Liste der Upstream-OAuth-Anbieter zu finden.",
    },
    action: {
      remove: {
        label: "Entfernen",
        title: "OAuth-Verknüpfung entfernen?",
        content: "Die Upstream-OAuth-Verknüpfung für diesen Benutzer wird entfernt.",
        success: "OAuth-Verknüpfung entfernt",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "OAuth-Anbieter |||| OAuth-Anbieter",
    fields: {
      issuer: "Aussteller",
      human_name: "Name",
      brand_name: "Marke",
      created_at: "Erstellt am",
      disabled_at: "Deaktiviert am",
      enabled: "Aktiv",
    },
  },
  mas_personal_sessions: {
    name: "Persönliche Sitzung |||| Persönliche Sitzungen",
    empty: "Keine persönlichen Sitzungen",
    fields: {
      owner_user_id: "Eigentümer-ID",
      actor_user_id: "Benutzer",
      human_name: "Name",
      scope: "Berechtigungsbereich",
      created_at: "Erstellt am",
      revoked_at: "Widerrufen am",
      last_active_at: "Zuletzt aktiv",
      last_active_ip: "Letzte IP",
      expires_at: "Läuft ab am",
      expires_in: "Läuft ab in (Sekunden)",
      active: "Aktiv",
    },
    helper: {
      expires_in: "Optional. Anzahl der Sekunden bis zum Ablauf. Leer lassen für kein Ablaufdatum.",
    },
    action: {
      revoke: {
        label: "Widerrufen",
        title: "Sitzung widerrufen?",
        content: "Das Zugriffstoken wird dauerhaft widerrufen.",
        success: "Sitzung widerrufen",
      },
      create: {
        token_title: "Zugriffstoken erstellt",
        token_content: "Kopieren Sie dieses Token. Es wird nach dem Schließen dieses Dialogs nicht mehr angezeigt.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "Aktiv",
      finished: "Beendet",
      revoked: "Widerrufen",
    },
  },
};

export default mas;
