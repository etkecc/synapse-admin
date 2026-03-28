const rooms = {
  name: "Raum |||| Räume",
  fields: {
    room_id: "Raum-ID",
    name: "Name",
    canonical_alias: "Alias",
    joined_members: "Mitglieder",
    joined_local_members: "Lokale Mitglieder",
    joined_local_devices: "Lokale Endgeräte",
    state_events: "Zustandsereignisse / Komplexität",
    version: "Version",
    is_encrypted: "Verschlüsselt",
    encryption: "Verschlüsselungs-Algorithmus",
    federatable: "Fö­de­rierbar",
    public: "Sichtbar im Raumverzeichnis",
    creator: "Ersteller",
    join_rules: "Beitrittsregeln",
    guest_access: "Gastzugriff",
    history_visibility: "Historie-Sichtbarkeit",
    topic: "Thema",
    avatar: "Avatar",
    actions: "Aktionen",
  },
  filter: {
    public_rooms: "Öffentliche Räume",
    empty_rooms: "Leere Räume",
  },
  helper: {
    forward_extremities:
      "Vorderextremitäten sind Blatt-Ereignisse am Ende eines gerichteten azyklischen Graphens (DAG) in einem Raum, auch bekannt als Ereignisse ohne Nachkommen. Je mehr in einem Raum existieren, umso mehr Zustandsauflösungen muss Synapse absolvieren (Hinweis: dies ist eine sehr aufwendige Operation). Obwohl Synapse Code hat um zu verhindern, dass zuviele davon gleichzeitig in einem Raum existieren, können Bugs manchmal dafür sorgen, dass sie sich ansammeln. Wenn ein Raum >10 Vorderextremitäten hat ist es sinnvoll zu überprüfen um welchen Raum es sich handelt und sie gegebenenfalls, wie in #1769 beschrieben, mittels SQL-Queries zu entfernen.",
  },
  enums: {
    join_rules: {
      public: "Öffentlich",
      knock: "Auf Anfrage",
      invite: "Nur auf Einladung",
      private: "Privat",
    },
    guest_access: {
      can_join: "Gäste können beitreten",
      forbidden: "Gäste können nicht beitreten",
    },
    history_visibility: {
      invited: "Ab Einladung",
      joined: "Ab Beitritt",
      shared: "Ab Setzen der Einstellung",
      world_readable: "Jeder",
    },
    unencrypted: "Nicht verschlüsselt",
  },
  action: {
    erase: {
      title: "Raum löschen",
      content:
        "Sind Sie sicher, dass Sie den Raum löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden. Alle Nachrichten und Medien, die der Raum beinhaltet werden vom Server gelöscht!",
      fields: {
        block: "Blockieren und Benutzer daran hindern, dem Raum beizutreten",
      },
      in_progress: "Löschung läuft…",
      background_note: "Sie können dieses Fenster bedenkenlos schließen, die Löschung wird im Hintergrund fortgesetzt.",
      success: "Raum/Räume erfolgreich gelöscht.",
      failure: "Der/die Raum/Räume konnten nicht gelöscht werden.",
    },
    make_admin: {
      assign_admin: "Raumadministrator zuweisen",
      title: "Raumadministrator zu %{roomName} zuweisen",
      confirm: "Raumadministrator zuweisen",
      content:
        "Geben Sie die vollständige MXID des Benutzers an, der als Administrator gesetzt werden soll.\nWarnung: Damit dies funktioniert, muss der Raum mindestens ein lokales Mitglied als Administrator haben.",
      success: "Der/die Benutzer wurde/n als Raumadministrator gesetzt.",
      failure: "Der/die Benutzer konnte/n nicht als Raumadministrator gesetzt werden. %{errMsg}",
    },
    join: {
      label: "Benutzer beitreten",
      title: "Benutzer zu %{roomName} beitreten lassen",
      confirm: "Beitreten",
      content:
        "Geben Sie die vollständige MXID des Benutzers ein, der diesem Raum beitreten soll.\nHinweis: Sie müssen im Raum sein und die Berechtigung haben, Benutzer einzuladen.",
      success: "Benutzer ist dem Raum erfolgreich beigetreten.",
      failure: "Benutzer konnte dem Raum nicht beitreten. %{errMsg}",
    },
    block: {
      label: "Sperren",
      title: "%{room} sperren",
      title_bulk: "%{smart_count} Raum sperren |||| %{smart_count} Räume sperren",
      title_by_id: "Raum sperren",
      content: "Benutzer werden daran gehindert, diesem Raum beizutreten.",
      content_bulk:
        "Benutzer werden daran gehindert, %{smart_count} Raum beizutreten. |||| Benutzer werden daran gehindert, %{smart_count} Räumen beizutreten.",
      success: "Raum erfolgreich gesperrt. |||| Räume erfolgreich gesperrt.",
      failure: "Raum konnte nicht gesperrt werden. |||| Räume konnten nicht gesperrt werden.",
    },
    unblock: {
      label: "Entsperren",
      success: "Raum erfolgreich entsperrt. |||| Räume erfolgreich entsperrt.",
      failure: "Raum konnte nicht entsperrt werden. |||| Räume konnten nicht entsperrt werden.",
    },
    purge_history: {
      label: "Verlauf bereinigen",
      title: "Verlauf von %{roomName} bereinigen",
      content:
        "Alle Ereignisse vor dem ausgewählten Datum werden aus der Datenbank gelöscht. Raumstatus (Beitritte, Austritte, Thema) bleibt erhalten. Mindestens eine Nachricht bleibt immer erhalten.\nHinweis: Dieser Vorgang kann bei großen Räumen mehrere Minuten dauern.",
      date_label: "Ereignisse bereinigen vor",
      delete_local: "Auch von lokalen Benutzern gesendete Ereignisse löschen",
      in_progress: "Bereinigung läuft…",
      background_note:
        "Sie können dieses Fenster bedenkenlos schließen, die Bereinigung wird im Hintergrund fortgesetzt.",
      success: "Raumverlauf erfolgreich bereinigt.",
      failure: "Bereinigung des Raumverlaufs fehlgeschlagen. %{errMsg}",
    },
    quarantine_all: {
      label: "Alle Medien unter Quarantäne stellen",
      title: "Alle Medien in %{roomName} unter Quarantäne stellen",
      content:
        "Alle lokalen und remote Medien in diesem Raum werden unter Quarantäne gestellt. Unter Quarantäne gestellte Medien sind für Benutzer nicht mehr zugänglich.",
      success:
        "%{smart_count} Medienelement erfolgreich unter Quarantäne gestellt. |||| %{smart_count} Medienelemente erfolgreich unter Quarantäne gestellt.",
      failure: "Quarantäne fehlgeschlagen. %{errMsg}",
    },
    event_context: {
      jump_to_date: "Zu Datum springen",
      direction: "Richtung",
      forward: "Vorwärts",
      backward: "Rückwärts",
      target_event: "Zielereignis",
      events_before: "Ereignisse davor",
      events_after: "Ereignisse danach",
      not_found: "Kein Ereignis zum angegebenen Zeitpunkt gefunden",
      failure: "Ereigniskontext konnte nicht abgerufen werden",
    },
    messages: {
      load_older: "Ältere laden",
      load_newer: "Neuere laden",
      no_messages: "Keine Nachrichten in diesem Raum",
      failure: "Nachrichten konnten nicht geladen werden",
      filter: "Filter",
      filter_type: "Ereignistypen",
      filter_sender: "Absender",
      advanced_filters: "Erweiterte Filter",
      filter_not_type: "Ereignistypen ausschließen",
      filter_not_sender: "Absender ausschließen",
      contains_url: "Enthält URL",
      any: "Beliebig",
      with_url: "Nur mit URL",
      without_url: "Nur ohne URL",
      apply_filter: "Anwenden",
      clear_filters: "Zurücksetzen",
    },
    hierarchy: {
      load_more: "Mehr laden",
      max_depth: "Maximale Tiefe",
      unlimited: "Unbegrenzt",
      refresh: "Aktualisieren",
      members: "%{count} Mitglieder",
      space: "Space",
      room: "Raum",
      suggested: "Empfohlen",
      no_children: "Dieser Raum hat keine Hierarchie",
      failure: "Hierarchie konnte nicht geladen werden",
    },
  },
};

export default rooms;
