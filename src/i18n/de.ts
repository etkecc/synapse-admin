import { formalGermanMessages } from "@haleos/ra-language-german";

import { SynapseTranslationMessages } from "./types";

const fixedGermanMessages = {
  ...formalGermanMessages,
  ra: {
    ...formalGermanMessages.ra,
    navigation: {
      ...formalGermanMessages.ra.navigation,
      no_filtered_results: "Keine Ergebnisse",
      clear_filters: "Alle Filter entfernen",
      add_filter: "Filter hinzufügen",
    },
    auth: {
      ...formalGermanMessages.ra.auth,
      email: "E-Mail",
    },
    action: {
      ...formalGermanMessages.ra.action,
      update_application: "Anwendung aktualisieren",
      select_all_button: "Alle auswählen",
      search_columns: "Spalten durchsuchen",
    },
    page: {
      ...formalGermanMessages.ra.page,
      empty: "Leer",
      access_denied: "Zugriff verweigert",
      authentication_error: "Authentifizierungsfehler",
    },
    message: {
      ...formalGermanMessages.ra.message,
      access_denied: "Sie haben nicht die erforderlichen Berechtigungen um auf diese Seite zuzugreifen.",
      authentication_error:
        "Der Authentifizierungsserver hat einen Fehler zurückgegeben und Ihre Anmeldedaten konnten nicht überprüft werden.",
      select_all_limit_reached:
        "Es gibt zu viele Elemente, um sie alle auszuwählen. Es wurden nur die ersten %{max} Elemente ausgewählt.",
      placeholder_data_warning: "Netzwerkproblem: Datenaktualisierung fehlgeschlagen.",
    },
    notification: {
      ...formalGermanMessages.ra.notification,
      application_update_available: "Eine neue Version ist verfügbar.",
      offline: "Keine Verbindung. Daten konnten nicht abgerufen werden.",
    },
  },
};

const { add_filter: _deAddFilter, ...deNavigation } = fixedGermanMessages.ra.navigation;

const de: SynapseTranslationMessages = {
  ...fixedGermanMessages,
  ra: {
    ...fixedGermanMessages.ra,
    navigation: deNavigation,
    action: {
      ...fixedGermanMessages.ra.action,
      reset: "Zurücksetzen",
    },
    guesser: {
      empty: {
        title: "Keine Daten zum Anzeigen",
        message: "Bitte prüfen Sie Ihren Datenanbieter",
      },
    },
    validation: {
      ...fixedGermanMessages.ra.validation,
      unique: "Muss eindeutig sein",
    },
  },
  ketesa: {
    auth: {
      base_url: "Heimserver URL",
      welcome: "Willkommen bei %{name}",
      server_version: "Synapse Version",
      supports_specs: "unterstützt Matrix-Specs",
      username_error: "Bitte vollständigen Nutzernamen angeben: '@user:domain'",
      protocol_error: "Die URL muss mit 'http://' oder 'https://' beginnen",
      url_error: "Keine gültige Matrix Server URL",
      sso_sign_in: "Anmeldung mit SSO",
      credentials: "Anmeldedaten",
      access_token: "Zugriffstoken",
      logout_acces_token_dialog: {
        title: "Sie verwenden ein bestehendes Matrix-Zugriffstoken.",
        content:
          "Möchten Sie diese Sitzung (die anderswo, z.B. in einem Matrix-Client, verwendet werden könnte) beenden oder sich nur vom Admin-Panel abmelden?",
        confirm: "Sitzung beenden",
        cancel: "Nur vom Admin-Panel abmelden",
      },
    },
    users: {
      invalid_user_id: "Lokaler Anteil der Matrix Benutzer-ID ohne Homeserver.",
      tabs: { sso: "SSO", experimental: "Experimentell", limits: "Rate Limits", account_data: "Kontodaten" },
      danger_zone: "Gefahrenzone",
    },
    rooms: {
      details: "Raumdetails",
      tabs: {
        basic: "Allgemein",
        members: "Mitglieder",
        detail: "Details",
        permission: "Berechtigungen",
        media: "Medien",
        messages: "Nachrichten",
        hierarchy: "Hierarchie",
      },
    },
    reports: { tabs: { basic: "Allgemein", detail: "Details" } },
    admin_config: {
      soft_failed_events: "Soft-fehlgeschlagene Ereignisse",
      spam_flagged_events: "Als Spam markierte Ereignisse",
      success: "Admin-Konfiguration aktualisiert",
      failure: "Admin-Konfiguration konnte nicht aktualisiert werden",
    },
  },
  import_users: {
    error: {
      at_entry: "Bei Eintrag %{entry}: %{message}",
      error: "Fehler",
      required_field: "Pflichtfeld '%{field}' fehlt",
      invalid_value:
        "Ungültiger Wert in Zeile %{row}. Feld '%{field}' darf nur die Werte 'true' oder 'false' enthalten",
      unreasonably_big: "Datei ist zu groß für den Import (%{size} Megabytes)",
      already_in_progress: "Es läuft bereits ein Import",
      id_exits: "ID %{id} existiert bereits",
    },
    title: "Benutzer aus CSV importieren",
    goToPdf: "Gehe zum PDF",
    cards: {
      importstats: {
        header: "Geparste Benutzer für den Import",
        users_total: "%{smart_count} Benutzer in der CSV Datei |||| %{smart_count} Benutzer in der CSV Datei",
        guest_count: "%{smart_count} Gast |||| %{smart_count} Gäste",
        admin_count: "%{smart_count} Server Administrator |||| %{smart_count} Server Administratoren",
      },
      conflicts: {
        header: "Konfliktstrategie",
        mode: {
          stop: "Stoppe bei Fehlern",
          skip: "Zeige Fehler und überspringe fehlerhafte Einträge",
        },
      },
      ids: {
        header: "IDs",
        all_ids_present: "IDs in jedem Eintrag vorhanden",
        count_ids_present: "%{smart_count} Eintrag mit ID |||| %{smart_count} Einträge mit IDs",
        mode: {
          ignore: "Ignoriere IDs der CSV-Datei und erstelle neue",
          update: "Aktualisiere existierende Benutzer",
        },
      },
      passwords: {
        header: "Passwörter",
        all_passwords_present: "Passwörter in jedem Eintrag vorhanden",
        count_passwords_present: "%{smart_count} Eintrag mit Passwort |||| %{smart_count} Einträge mit Passwörtern",
        use_passwords: "Verwende Passwörter aus der CSV Datei",
      },
      upload: {
        header: "CSV Datei importieren",
        explanation:
          "Hier können Sie eine Datei mit kommagetrennten Daten hochladen, die verwendet werden um Benutzer anzulegen oder zu ändern. Die Datei muss mindestens die Felder 'id' und 'displayname' enthalten. Hier können Sie eine Beispieldatei herunterladen und anpassen: ",
      },
      startImport: {
        simulate_only: "Nur simulieren",
        run_import: "Importieren",
      },
      results: {
        header: "Ergebnis",
        total: "%{smart_count} Eintrag insgesamt |||| %{smart_count} Einträge insgesamt",
        successful: "%{smart_count} Einträge erfolgreich importiert",
        skipped: "%{smart_count} Einträge übersprungen",
        download_skipped: "Übersprungene Einträge herunterladen",
        with_error: "%{smart_count} Eintrag mit Fehlern ||| %{smart_count} Einträge mit Fehlern",
        simulated_only: "Import-Vorgang war nur simuliert",
      },
    },
  },
  delete_media: {
    name: "Medien",
    fields: {
      before_ts: "Letzter Zugriff vor",
      size_gt: "Größer als (in Bytes)",
      keep_profiles: "Behalte Profilbilder",
    },
    action: {
      send: "Medien löschen",
      send_success:
        "%{smart_count} Mediendatei erfolgreich gelöscht. |||| %{smart_count} Mediendateien erfolgreich gelöscht.",
      send_success_none: "Keine Mediendateien entsprachen den angegebenen Kriterien. Es wurde nichts gelöscht.",
      send_failure: "Beim Versenden ist ein Fehler aufgetreten.",
    },
    helper: {
      send: "Diese API löscht die lokalen Medien von der Festplatte des eigenen Servers. Dies umfasst alle lokalen Miniaturbilder und Kopien von Medien. Diese API wirkt sich nicht auf Medien aus, die sich in externen Medien-Repositories befinden.",
    },
  },
  purge_remote_media: {
    name: "Externe Medien",
    fields: {
      before_ts: "letzter Zugriff vor",
    },
    action: {
      send: "Externe Medien löschen",
      send_success:
        "%{smart_count} externe Mediendatei erfolgreich gelöscht. |||| %{smart_count} externe Mediendateien erfolgreich gelöscht.",
      send_success_none:
        "Keine externen Mediendateien entsprachen den angegebenen Kriterien. Es wurde nichts gelöscht.",
      send_failure: "Bei der Anfrage zum Löschen externer Medien ist ein Fehler aufgetreten.",
    },
    helper: {
      send: "Diese API löscht den externen Medien-Cache von der Festplatte Ihres eigenen Servers. Dazu gehören alle lokalen Thumbnails und Kopien heruntergeladener Medien. Diese API beeinflusst nicht die Medien, die in das eigene Medienarchiv des Servers hochgeladen wurden.",
    },
  },
  resources: {
    users: {
      name: "Benutzer",
      email: "E-Mail",
      msisdn: "Telefon",
      threepid: "E-Mail / Telefon",
      membership: "Mitgliedschaft |||| Mitgliedschaften",
      fields: {
        avatar: "Avatar",
        id: "Benutzer-ID",
        name: "Name",
        is_guest: "Gast",
        admin: "Server Administrator",
        locked: "Gesperrt",
        suspended: "Suspendiert",
        shadow_banned: "Schattengebannt",
        deactivated: "Deaktiviert",
        erased: "Gelöscht",
        show_guests: "Zeige Gäste",
        show_deactivated: "Nur deaktivierte anzeigen",
        show_locked: "Zeige gesperrte Benutzer",
        filter_user_all: "Alle",
        filter_deactivated_false: "Aktiv",
        filter_deactivated_true: "Deaktiviert",
        filter_locked_false: "Gesperrte ausschließen",
        filter_locked_true: "Gesperrte einschließen",
        filter_guests_false: "Gäste ausschließen",
        filter_guests_true: "Gäste einschließen",
        show_system_users: "Systembenutzer anzeigen",
        filter_system_users_false: "Systembenutzer ausblenden",
        filter_system_users_true: "Nur Systembenutzer",
        show_suspended: "Zeige suspendierte Benutzer",
        show_shadow_banned: "Zeige schattengebannte Benutzer",
        user_id: "Suche Benutzer",
        displayname: "Anzeigename",
        password: "Passwort",
        avatar_url: "Avatar URL",
        avatar_src: "Avatar",
        medium: "Medium",
        threepids: "3PIDs",
        address: "Adresse",
        creation_ts_ms: "Zeitpunkt der Erstellung",
        consent_version: "Zugestimmte Geschäftsbedingungen",
        sent_invite_count: "Gesendete Einladungen",
        cumulative_joined_room_count: "Kumulierte beigetretene Räume",
        auth_provider: "Provider",
        user_type: "Benutzertyp",
      },
      helper: {
        password: "Durch die Änderung des Passworts wird der Benutzer von allen Sitzungen abgemeldet.",
        password_required_for_reactivation: "Sie müssen ein Passwort angeben, um ein Konto wieder zu aktivieren.",
        create_password: "Generiere ein starkes und sicheres Passwort mit dem Button unten.",
        deactivate: "Sie müssen ein Passwort angeben, um ein Konto wieder zu aktivieren.",
        suspend:
          "Ein gesperrter Benutzer kann sich nicht mehr anmelden und wird in den schreibgeschützten Modus versetzt.",
        shadow_ban:
          "Ein schattengebannter Benutzer erhält erfolgreiche Antworten, aber seine Ereignisse werden nicht in Räume übertragen. Nur als letztes Mittel verwenden.",
        erase: "DSGVO konformes Löschen der Benutzerdaten.",
        admin: "Ein Serveradministrator hat volle Kontrolle über den Server und seine Benutzer.",
        lock: "Verhindert, dass der Benutzer den Server nutzen kann. Dies ist eine nicht-destruktive Aktion, die rückgängig gemacht werden kann.",
        erase_text:
          "Das bedeutet, dass die von dem/den Benutzer(n) gesendeten Nachrichten für alle, die zum Zeitpunkt des Sendens im Raum waren, sichtbar bleiben, aber für Benutzer, die dem Raum später beitreten, nicht sichtbar sind.",
        erase_admin_error: "Das Löschen des eigenen Benutzers ist nicht erlaubt.",
        modify_managed_user_error: "Das Ändern eines vom System verwalteten Benutzers ist nicht zulässig.",
        username_available: "Benutzername verfügbar",
        sent_invite_count: "Gesamtzahl der von diesem Benutzer in allen Räumen gesendeten Einladungen.",
        cumulative_joined_room_count:
          "Gesamtzahl der Räume, denen dieser Benutzer jemals beigetreten ist, einschließlich Räume, die er verlassen hat oder aus denen er verbannt wurde.",
      },
      badge: {
        you: "Sie",
        bot: "Bot",
        admin: "Administrator",
        support: "Unterstützung",
        regular: "Normaler Benutzer",
        federated: "Föderierter Benutzer",
        system_managed: "Systemverwalteter Benutzer",
      },
      action: {
        erase: "Lösche Benutzerdaten",
        erase_avatar: "Avatar löschen",
        delete_media: "Alle von dem/den Benutzer(n) hochgeladenen Medien löschen",
        redact_events: "Schwärzen aller vom Benutzer gesendeten Ereignisse (-s)",
        redact_in_progress: "Schwärzung läuft\u2026",
        redact_background_note:
          "Sie können diesen Dialog bedenkenlos schließen, die Schwärzung wird im Hintergrund fortgesetzt.",
        redact_success: "Alle Ereignisse wurden erfolgreich geschwärzt.",
        redact_failure:
          "Schwärzung mit %{smart_count} fehlgeschlagenem Ereignis abgeschlossen. |||| Schwärzung mit %{smart_count} fehlgeschlagenen Ereignissen abgeschlossen.",
        generate_password: "Passwort generieren",
        reset_password: {
          label: "Passwort zurücksetzen",
          title: "Passwort zurücksetzen",
          helper: "Passwort von %{user} ändern",
          password: "Passwort",
          logout_devices: "Von allen Geräten abmelden",
          success: "Passwort wurde erfolgreich zurückgesetzt",
          failure: "Passwort konnte nicht zurückgesetzt werden",
          error_no_password: "Passwort ist erforderlich",
        },
        login_as: {
          label: "Als Benutzer anmelden",
          title: "Als Benutzer anmelden",
          helper:
            "Zugriffstoken erhalten, um sich als %{user} zu authentifizieren. Diese Aktion erstellt kein neues Gerät für den Benutzer und erscheint daher nicht in der Geräte-/Sitzungsliste. Der Zielbenutzer sollte in der Regel nicht erkennen können, dass jemand sich als er angemeldet hat.",
          valid_until: "Ablaufdatum festlegen",
          success: "Zugriffstoken erfolgreich erstellt",
          failure: "Zugriffstoken konnte nicht erstellt werden",
          result_title: "Zugriffstoken von %{user}",
          access_token: "Zugriffstoken",
          expires_at: "Dieses Zugriffstoken läuft am %{date} ab",
        },
        overwrite_title: "Warnung!",
        overwrite_content:
          "Dieser Benutzername ist bereits vergeben. Sind Sie sicher, dass Sie den vorhandenen Benutzer überschreiben möchten?",
        overwrite_cancel: "Abbrechen",
        overwrite_confirm: "Überschreiben",
        quarantine_all: {
          label: "Alle Medien unter Quarantäne stellen",
          title: "Alle Medien von %{userName} unter Quarantäne stellen",
          content:
            "Alle lokalen Medien dieses Benutzers werden unter Quarantäne gestellt. Unter Quarantäne gestellte Medien sind für andere Benutzer nicht mehr zugänglich.",
          success:
            "%{smart_count} Medienelement erfolgreich unter Quarantäne gestellt. |||| %{smart_count} Medienelemente erfolgreich unter Quarantäne gestellt.",
          failure: "Quarantäne fehlgeschlagen. %{errMsg}",
        },
        allow_cross_signing: {
          label: "Cross-Signing-Reset erlauben",
          title: "Cross-Signing-Schlüsselersatz erlauben",
          content:
            "Soll %{user} erlaubt werden, ihre Cross-Signing-Schlüssel ohne benutzerinteraktive Authentifizierung zu ersetzen? Dies öffnet ein temporäres Fenster, in dem die Schlüssel ersetzt werden können.",
          success: "Cross-Signing-Schlüsselersatz erlaubt bis %{deadline}",
          failure: "Cross-Signing-Ersatz konnte nicht erlaubt werden",
          no_key: "Benutzer hat keinen Master-Cross-Signing-Schlüssel",
        },
        find_user: {
          label: "Benutzer suchen",
          title: "Benutzer suchen",
          lookup_type: "Suchart",
          by_threepid: "Per E-Mail / Telefonnummer",
          by_auth_provider: "Per Authentifizierungsanbieter",
          provider: "Authentifizierungsanbieter-ID",
          external_id: "Externe ID",
          search: "Suchen",
          not_found: "Benutzer nicht gefunden",
          failure: "Benutzersuche fehlgeschlagen",
        },
        renew_account: {
          label: "Konto erneuern",
          title: "Kontogültigkeit erneuern",
          content:
            "Erneuert die Kontogültigkeit für %{user}. Optional kann ein benutzerdefiniertes Ablaufdatum festgelegt werden. Wenn leer gelassen, wird der standardmäßige Erneuerungszeitraum des Servers verwendet.",
          expiration: "Ablaufdatum",
          expiration_helper: "Leer lassen, um den standardmäßigen Erneuerungszeitraum des Servers zu verwenden",
          renewal_emails: "Erneuerungs-Benachrichtigungs-E-Mails senden",
          success: "Kontogültigkeit bis %{date} erneuert",
          failure: "Erneuerung der Kontogültigkeit fehlgeschlagen",
        },
        system_users_scan_in_progress:
          "Einen Moment – es werden noch passende Benutzer gesucht, die Seite wird gleich geladen",
      },
      limits: {
        messages_per_second: "Nachrichten pro Sekunde",
        messages_per_second_text: "Die Anzahl der Aktionen, die in einer Sekunde durchgeführt werden können.",
        burst_count: "Burst-Anzahl",
        burst_count_text: "Die Anzahl der Aktionen, die vor der Begrenzung durchgeführt werden können.",
      },
      account_data: {
        title: "Kontodaten",
        global: "Globale",
        rooms: "Räume",
      },
    },
    rooms: {
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
          background_note:
            "Sie können dieses Fenster bedenkenlos schließen, die Löschung wird im Hintergrund fortgesetzt.",
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
    },
    reports: {
      name: "Gemeldetes Ereignis |||| Gemeldete Ereignisse",
      fields: {
        id: "ID",
        received_ts: "Meldezeit",
        user_id: "Meldender",
        name: "Raumname",
        score: "Bewertung",
        reason: "Grund",
        event_id: "Event-ID",
        sender: "Absender",
      },
      action: {
        erase: {
          title: "Gemeldetes Event löschen",
          content:
            "Sind Sie sicher, dass Sie das gemeldete Event löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
        },
        event_lookup: {
          label: "Event-Suche",
          title: "Event nach ID abrufen",
          fetch: "Abrufen",
        },
        fetch_event_error: "Fehler beim Abrufen des Events",
      },
    },
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
        media_id: "Medien ID",
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
        send: "Sende Nachricht",
        send_success: "Nachricht erfolgreich versendet.",
        send_failure: "Beim Versenden ist ein Fehler aufgetreten.",
      },
      helper: {
        send: 'Sendet eine Serverbenachrichtigung an die ausgewählten Nutzer. Hierfür muss das Feature "Server Notices" auf dem Server aktiviert sein.',
      },
    },
    user_media_statistics: {
      name: "Benutzer Dateien",
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
        media_id: "Medien ID",
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
        last_successful_stream_ordering: "letzte erfogreicher Stream",
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
  },
  etkecc: {
    billing: {
      name: "Abrechnung",
      title: "Zahlungshistorie",
      no_payments: "Keine Zahlungen gefunden.",
      no_payments_helper: "Wenn Sie glauben, dass das ein Fehler ist, kontaktieren Sie bitte den etke.cc-Support unter",
      description1:
        "Hier können Sie Zahlungen einsehen und Rechnungen erstellen. Mehr zur Verwaltung von Abonnements erfahren Sie unter",
      description2:
        "Wenn Sie Ihre Abrechnungs-E-Mail ändern oder Firmendaten hinzufügen möchten, kontaktieren Sie bitte den etke.cc-Support unter",
      fields: {
        transaction_id: "Transaktions-ID",
        email: "E-Mail",
        type: "Typ",
        amount: "Betrag",
        paid_at: "Bezahlt am",
        invoice: "Rechnung",
      },
      enums: {
        type: {
          subscription: "Abonnement",
          one_time: "Einmalig",
        },
      },
      helper: {
        download_invoice: "Rechnung herunterladen",
        downloading: "Wird heruntergeladen...",
        download_started: "Der Rechnungsdownload wurde gestartet.",
        invoice_not_available: "Ausstehend",
        loading: "Abrechnungsinformationen werden geladen...",
        loading_failed1: "Beim Laden der Abrechnungsinformationen ist ein Problem aufgetreten.",
        loading_failed2: "Bitte versuchen Sie es später erneut.",
        loading_failed3: "Wenn das Problem weiterhin besteht, kontaktieren Sie bitte den etke.cc-Support unter",
        loading_failed4: "mit der folgenden Fehlermeldung:",
      },
    },
    status: {
      name: "Serverstatus",
      badge: {
        default: "Klicken, um den Serverstatus anzuzeigen",
        running: "Läuft: %{command}. %{text}",
      },
      category: {
        "Host Metrics": "Host-Metriken",
        Network: "Netzwerk",
        HTTP: "HTTP",
        Matrix: "Matrix",
      },
      status: "Status",
      error: "Fehler",
      loading: "Echtzeit-Serverzustand wird abgerufen... Einen Moment!",
      intro1: "Dies ist ein Echtzeit-Monitoringbericht Ihres Servers. Mehr dazu finden Sie unter",
      intro2: 'Falls ein Status nicht "OK" anzeigen sollte, prüfen Sie bitte die empfohlenen Maßnahmen unter',
      help: "Hilfe",
    },
    maintenance: {
      title: "Das System befindet sich derzeit im Wartungsmodus.",
      try_again: "Bitte versuchen Sie es später erneut.",
      note: "Sie müssen den Support hierzu nicht kontaktieren — wir arbeiten bereits daran!",
    },
    actions: {
      name: "Serverbefehle",
      available_title: "Verfügbare Befehle",
      available_description: "Die folgenden Befehle können ausgeführt werden.",
      available_help_intro: "Weitere Details zu jedem Befehl finden Sie unter",
      scheduled_title: "Geplante Befehle",
      scheduled_description:
        "Die folgenden Befehle sind zu bestimmten Zeiten geplant. Sie können Details ansehen und sie bei Bedarf ändern.",
      recurring_title: "Wiederkehrende Befehle",
      recurring_description:
        "Die folgenden Befehle sind so eingerichtet, dass sie wöchentlich an einem bestimmten Wochentag und zu einer bestimmten Uhrzeit laufen. Sie können Details ansehen und sie bei Bedarf ändern.",
      scheduled_help_intro: "Weitere Details zu diesem Modus finden Sie unter",
      recurring_help_intro: "Weitere Details zu diesem Modus finden Sie unter",
      maintenance_title: "Das System befindet sich derzeit im Wartungsmodus.",
      maintenance_try_again: "Bitte versuchen Sie es später erneut.",
      maintenance_note: "Sie müssen den Support hierzu nicht kontaktieren — wir arbeiten bereits daran!",
      maintenance_commands_blocked: "Befehle können erst ausgeführt werden, wenn der Wartungsmodus deaktiviert ist.",
      table: {
        command: "Befehl",
        description: "Beschreibung",
        arguments: "Argumente",
        is_recurring: "Wiederkehrend?",
        run_at: "Ausführung (lokale Zeit)",
        next_run_at: "Nächste Ausführung (lokale Zeit)",
        time_utc: "Uhrzeit (UTC)",
        time_local: "Uhrzeit (lokale Zeit)",
      },
      buttons: {
        create: "Erstellen",
        update: "Aktualisieren",
        back: "Zurück",
        delete: "Löschen",
        run: "Ausführen",
      },
      command_scheduled: "Befehl geplant: %{command}",
      command_scheduled_args: "mit zusätzlichen Argumenten: %{args}",
      expect_prefix: "Das Ergebnis erscheint in Kürze auf der Seite",
      expect_suffix: ".",
      notifications_link: "Benachrichtigungen",
      command_help_title: "%{command} Hilfe",
      scheduled_title_create: "Geplanten Befehl erstellen",
      scheduled_title_edit: "Geplanten Befehl bearbeiten",
      recurring_title_create: "Wiederkehrenden Befehl erstellen",
      recurring_title_edit: "Wiederkehrenden Befehl bearbeiten",
      scheduled_details_title: "Details des geplanten Befehls",
      recurring_warning:
        "Geplante Befehle, die aus einem wiederkehrenden erstellt wurden, sind nicht bearbeitbar, da sie automatisch neu erstellt werden. Bitte bearbeiten Sie stattdessen den wiederkehrenden Befehl.",
      command_details_intro: "Weitere Details zum Befehl finden Sie unter",
      form: {
        id: "ID",
        command: "Befehl",
        scheduled_at: "Geplant für",
        day_of_week: "Wochentag",
      },
      delete_scheduled_title: "Geplanten Befehl löschen",
      delete_recurring_title: "Wiederkehrenden Befehl löschen",
      delete_confirm: "Möchten Sie den Befehl wirklich löschen: %{command}?",
      errors: {
        unknown: "Unbekannter Fehler ist aufgetreten",
        delete_failed: "Fehler: %{error}",
      },
      days: {
        monday: "Montag",
        tuesday: "Dienstag",
        wednesday: "Mittwoch",
        thursday: "Donnerstag",
        friday: "Freitag",
        saturday: "Samstag",
        sunday: "Sonntag",
      },
      scheduled: {
        action: {
          create_success: "Geplanter Befehl erfolgreich erstellt.",
          update_success: "Geplanter Befehl erfolgreich aktualisiert.",
          update_failure: "Es ist ein Fehler aufgetreten.",
          delete_success: "Geplanter Befehl erfolgreich gelöscht.",
          delete_failure: "Es ist ein Fehler aufgetreten.",
        },
      },
      recurring: {
        action: {
          create_success: "Wiederkehrender Befehl erfolgreich erstellt.",
          update_success: "Wiederkehrender Befehl erfolgreich aktualisiert.",
          update_failure: "Es ist ein Fehler aufgetreten.",
          delete_success: "Wiederkehrender Befehl erfolgreich gelöscht.",
          delete_failure: "Es ist ein Fehler aufgetreten.",
        },
      },
    },
    notifications: {
      title: "Benachrichtigungen",
      new_notifications: "%{smart_count} neue Benachrichtigung |||| %{smart_count} neue Benachrichtigungen",
      no_notifications: "Noch keine Benachrichtigungen",
      see_all: "Alle anzeigen",
      clear_all: "Alle löschen",
      ago: "vor",
    },
    currently_running: {
      command: "Derzeit läuft:",
      started_ago: "(vor %{time} gestartet)",
    },
    time: {
      less_than_minute: "ein paar Sekunden",
      minutes: "%{smart_count} Minute |||| %{smart_count} Minuten",
      hours: "%{smart_count} Stunde |||| %{smart_count} Stunden",
      days: "%{smart_count} Tag |||| %{smart_count} Tage",
      weeks: "%{smart_count} Woche |||| %{smart_count} Wochen",
      months: "%{smart_count} Monat |||| %{smart_count} Monate",
    },
    support: {
      name: "Support",
      menu_label: "Support kontaktieren",
      description:
        "Öffnen Sie eine Support-Anfrage oder verfolgen Sie eine bestehende. Unser Team wird so schnell wie möglich antworten.",
      create_title: "Neue Support-Anfrage",
      no_requests: "Noch keine Support-Anfragen.",
      no_messages: "Noch keine Nachrichten.",
      closed_message:
        "Diese Anfrage ist geschlossen. Wenn Sie weiterhin ein Problem haben, öffnen Sie bitte eine neue.",
      fields: {
        subject: "Betreff",
        message: "Nachricht",
        reply: "Antwort",
        status: "Status",
        created_at: "Erstellt",
        updated_at: "Zuletzt aktualisiert",
      },
      status: {
        active: "Warte auf Betreiber",
        open: "Offen",
        closed: "Geschlossen",
        pending: "Wartet auf Sie",
      },
      buttons: {
        new_request: "Neue Anfrage",
        submit: "Absenden",
        cancel: "Abbrechen",
        send: "Senden",
        back: "Zurück zum Support",
      },
      helper: {
        loading: "Support-Anfragen werden geladen...",
        reply_hint: "Strg+Eingabe zum Senden",
        reply_placeholder: "Bitte geben Sie so viele Details wie möglich an.",
        before_contact_title: "Bevor Sie uns kontaktieren",
        help_pages_prompt: "Bitte lesen Sie zuerst unsere Hilfeseiten:",
        services_prompt: "Wir bieten nur die auf der Serviceseite aufgeführten Leistungen an:",
        topics_prompt: "Wir können nur zu unterstützten Themen helfen:",
        scope_confirm_label:
          "Ich habe die Hilfeseiten gelesen und bestätige, dass diese Anfrage zu den unterstützten Themen gehört.",
        english_only_notice: "Support wird nur auf Englisch angeboten.",
        response_time_prompt: "Antwort innerhalb von 48 Stunden. Benötigen Sie schnellere Antwortzeiten? Siehe:",
      },
      actions: {
        create_success: "Support-Anfrage erfolgreich erstellt.",
        create_failure: "Support-Anfrage konnte nicht erstellt werden.",
        send_failure: "Nachricht konnte nicht gesendet werden.",
      },
    },
  },
};
export default de;
