const misc_resources = {
  scheduled_tasks: {
    name: "Geplante Aufgabe |||| Geplante Aufgaben",
    fields: {
      id: "ID",
      action: "Aktion",
      status: "Status",
      timestamp: "Zeitstempel",
      resource_id: "Ressourcen-ID",
      result: "Ergebnis",
      error: "Fehler",
      max_timestamp: "Vor Datum",
    },
    status: {
      scheduled: "Geplant",
      active: "Aktiv",
      complete: "Abgeschlossen",
      cancelled: "Abgebrochen",
      failed: "Fehlgeschlagen",
    },
  },
  connections: {
    name: "Verbindungen",
    fields: {
      last_seen: "Datum",
      ip: "IP-Adresse",
      user_agent: "User Agent",
    },
  },
  devices: {
    name: "Gerät |||| Geräte",
    fields: {
      device_id: "Geräte-ID",
      display_name: "Gerätename",
      last_seen_ts: "Zeitstempel",
      last_seen_ip: "IP-Adresse",
      last_seen_user_agent: "User-Agent",
      dehydrated: "Dehydriert",
    },
    action: {
      erase: {
        title: "Entferne %{id}",
        title_bulk: "%{smart_count} Gerät entfernen |||| %{smart_count} Geräte entfernen",
        content: 'Möchten Sie das Gerät "%{name}" wirklich entfernen?',
        content_bulk:
          "Möchten Sie wirklich %{smart_count} Gerät entfernen? |||| Möchten Sie wirklich %{smart_count} Geräte entfernen?",
        success: "Gerät erfolgreich entfernt.",
        failure: "Beim Entfernen ist ein Fehler aufgetreten.",
      },
      display_name: {
        success: "Gerätename aktualisiert",
        failure: "Gerätename konnte nicht aktualisiert werden",
      },
      create: {
        label: "Gerät erstellen",
        title: "Neues Gerät erstellen",
        success: "Gerät erstellt",
        failure: "Gerät konnte nicht erstellt werden",
      },
    },
  },
  users_media: {
    name: "Medien",
    fields: {
      media_id: "Medien-ID",
      media_length: "Größe",
      media_type: "Typ",
      upload_name: "Dateiname",
      quarantined_by: "Zur Quarantäne hinzugefügt",
      safe_from_quarantine: "Schutz vor Quarantäne",
      created_ts: "Erstellt",
      last_access_ts: "Letzter Zugriff",
    },
    action: {
      open: "Mediendatei in neuem Fenster öffnen",
    },
  },
  protect_media: {
    action: {
      create: "Schützen",
      delete: "Schutz aufheben",
      none: "In Quarantäne",
      send_success: "Erfolgreich den Schutz-Status geändert.",
      send_failure: "Beim Versenden ist ein Fehler aufgetreten.",
    },
  },
  quarantine_media: {
    action: {
      name: "Quarantäne",
      create: "Quarantäne",
      delete: "Freigeben",
      none: "Geschützt",
      send_success: "Erfolgreich den Quarantäne-Status geändert.",
      send_failure: "Beim Versenden ist ein Fehler aufgetreten: %{error}",
    },
  },
  pushers: {
    name: "Pusher |||| Pushers",
    fields: {
      app: "App",
      app_display_name: "App-Anzeigename",
      app_id: "App ID",
      device_display_name: "Geräte-Anzeigename",
      kind: "Art",
      lang: "Sprache",
      profile_tag: "Profil-Tag",
      pushkey: "Pushkey",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "Serverbenachrichtigungen",
    send: "Servernachricht versenden",
    fields: {
      body: "Nachricht",
    },
    action: {
      send: "Nachricht senden",
      send_success: "Nachricht erfolgreich versendet.",
      send_failure: "Beim Versenden ist ein Fehler aufgetreten.",
    },
    helper: {
      send: 'Sendet eine Serverbenachrichtigung an die ausgewählten Benutzer. Hierfür muss das Feature "Server Notices" auf dem Server aktiviert sein.',
    },
  },
  database_room_statistics: {
    name: "Datenbank-Raumstatistiken",
    fields: {
      room_id: "Raum-ID",
      estimated_size: "Geschätzte Größe",
    },
    helper: {
      info: "Zeigt den geschätzten Speicherplatz, der von jedem Raum in der Synapse-Datenbank verwendet wird. Die Angaben sind Näherungswerte.",
    },
  },
  user_media_statistics: {
    name: "Benutzerdateien",
    fields: {
      media_count: "Anzahl der Dateien",
      media_length: "Größe der Dateien",
    },
  },
  forward_extremities: {
    name: "Vorderextremitäten",
    fields: {
      id: "Event-ID",
      received_ts: "Zeitstempel",
      depth: "Tiefe",
      state_group: "Zustandsgruppe",
    },
  },
  room_state: {
    name: "Zustandsereignisse",
    fields: {
      type: "Typ",
      content: "Inhalt",
      origin_server_ts: "Sendezeit",
      sender: "Absender",
    },
  },
  room_media: {
    name: "Medien",
    fields: {
      media_id: "Medien-ID",
    },
    helper: {
      info: "Dies ist eine Liste der Medien, die in den Raum hochgeladen wurden. Es ist nicht möglich, Medien zu löschen, die in externen Medien-Repositories hochgeladen wurden.",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "Raumverzeichnis",
    fields: {
      world_readable: "Gastbenutzer dürfen ohne Beitritt lesen",
      guest_can_join: "Gastbenutzer dürfen beitreten",
    },
    action: {
      title: "Raum aus Verzeichnis löschen |||| %{smart_count} Räume aus Verzeichnis löschen",
      content:
        "Möchten Sie den Raum wirklich aus dem Raumverzeichnis löschen? |||| Möchten Sie die %{smart_count} Räume wirklich aus dem Raumverzeichnis löschen?",
      erase: "Aus Verzeichnis löschen",
      create: "Ins Verzeichnis eintragen",
      send_success: "Raum erfolgreich eingetragen.",
      send_failure: "Beim Entfernen ist ein Fehler aufgetreten.",
    },
  },
  destinations: {
    name: "Föderation",
    fields: {
      destination: "Ziel",
      failure_ts: "Fehlerzeitpunkt",
      retry_last_ts: "Letzter Wiederholungsversuch",
      retry_interval: "Wiederholungsintervall",
      last_successful_stream_ordering: "Letzter erfolgreicher Stream",
      stream_ordering: "Stream",
    },
    action: { reconnect: "Neu verbinden" },
  },
  registration_tokens: {
    name: "Registrierungstoken",
    fields: {
      token: "Token",
      valid: "Gültige Token",
      uses_allowed: "Verwendungen erlaubt",
      pending: "Ausstehend",
      completed: "Abgeschlossen",
      expiry_time: "Ablaufzeit",
      length: "Länge",
      created_at: "Erstellt am",
      last_used_at: "Zuletzt verwendet am",
      revoked_at: "Widerrufen am",
    },
    helper: { length: "Länge des Tokens, wenn kein Token vorgegeben wird." },
    action: {
      revoke: {
        label: "Widerrufen",
        success: "Token widerrufen",
      },
      unrevoke: {
        label: "Wiederherstellen",
        success: "Token wiederhergestellt",
      },
    },
  },
};

export default misc_resources;
