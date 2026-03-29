const misc_resources = {
  scheduled_tasks: {
    name: "Attività pianificata |||| Attività pianificate",
    fields: {
      id: "ID",
      action: "Azione",
      status: "Stato",
      timestamp: "Timestamp",
      resource_id: "ID risorsa",
      result: "Risultato",
      error: "Errore",
      max_timestamp: "Prima della data",
    },
    status: {
      scheduled: "Pianificata",
      active: "Attiva",
      complete: "Completata",
      cancelled: "Annullata",
      failed: "Fallita",
    },
  },
  connections: {
    name: "Connessioni",
    fields: {
      last_seen: "Data",
      ip: "Indirizzo IP",
      user_agent: "User agent",
    },
  },
  devices: {
    name: "Dispositivo |||| Dispositivi",
    fields: {
      device_id: "ID del dispositivo",
      display_name: "Nome del dispositivo",
      last_seen_ts: "Timestamp",
      last_seen_ip: "Indirizzo IP",
      last_seen_user_agent: "User agent",
      dehydrated: "Disidratato",
    },
    action: {
      erase: {
        title: "Rimozione del dispositivo %{id}",
        title_bulk: "Rimozione di %{smart_count} dispositivo |||| Rimozione di %{smart_count} dispositivi",
        content: 'È sicuro di voler rimuovere il dispositivo "%{name}"?',
        content_bulk:
          "È sicuro di voler rimuovere %{smart_count} dispositivo? |||| È sicuro di voler rimuovere %{smart_count} dispositivi?",
        success: "Dispositivo rimosso con successo.",
        failure: "C'è stato un errore.",
      },
      display_name: {
        success: "Nome del dispositivo aggiornato",
        failure: "Aggiornamento del nome del dispositivo non riuscito",
      },
      create: {
        label: "Crea dispositivo",
        title: "Crea nuovo dispositivo",
        success: "Dispositivo creato",
        failure: "Creazione del dispositivo non riuscita",
      },
    },
  },
  users_media: {
    name: "Media",
    fields: {
      media_id: "ID del media",
      media_length: "Peso del file (in Byte)",
      media_type: "Tipo",
      upload_name: "Nome del file",
      quarantined_by: "In quarantena da",
      safe_from_quarantine: "Protetto dalla quarantena",
      created_ts: "Creato",
      last_access_ts: "Ultimo accesso",
    },
    action: {
      open: "Apri il file multimediale in una nuova finestra",
    },
  },
  protect_media: {
    action: {
      create: "Proteggere",
      delete: "Rimuovi protezione",
      none: "In quarantena",
      send_success: "Stato della protezione cambiato con successo.",
      send_failure: "C'è stato un errore.",
    },
  },
  quarantine_media: {
    action: {
      name: "Quarantina",
      create: "Quarantena",
      delete: "Rimuovi quarantena",
      none: "Protetto",
      send_success: "Stato della quarantena cambiato con successo.",
      send_failure: "C'è stato un errore: %{error}",
    },
  },
  pushers: {
    name: "Pusher |||| Pusher",
    fields: {
      app: "App",
      app_display_name: "Nome dell'app",
      app_id: "ID dell'app",
      device_display_name: "Nome del dispositivo",
      kind: "Tipo",
      lang: "Lingua",
      profile_tag: "Tag del profilo",
      pushkey: "Pushkey",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "Avvisi del server",
    send: "Invia avvisi",
    fields: {
      body: "Messaggio",
    },
    action: {
      send: "Invia nota",
      send_success: "Avviso inviato con successo.",
      send_failure: "C'è stato un errore.",
    },
    helper: {
      send: 'Invia un avviso dal server agli utenti selezionati. La feature "Avvisi del server" è stata attivata sul server.',
    },
  },
  database_room_statistics: {
    name: "Statistiche database delle stanze",
    fields: {
      room_id: "ID stanza",
      estimated_size: "Dimensione stimata",
    },
    helper: {
      info: "Mostra lo spazio su disco stimato utilizzato da ogni stanza nel database Synapse. I valori sono approssimativi.",
    },
  },
  user_media_statistics: {
    name: "Media degli utenti",
    fields: {
      media_count: "Numero media",
      media_length: "Lunghezza media",
    },
  },
  forward_extremities: {
    name: "Invia estremità",
    fields: {
      id: "Event ID",
      received_ts: "Timestamp",
      depth: "Profondità",
      state_group: "State group",
    },
  },
  room_state: {
    name: "Eventi di stato",
    fields: {
      type: "Tipo",
      content: "Contenuto",
      origin_server_ts: "Ora dell'invio",
      sender: "Mittente",
    },
  },
  room_media: {
    name: "Media",
    fields: {
      media_id: "ID Media",
    },
    helper: {
      info: "Questo è un elenco dei media caricati nella stanza. Non è possibile eliminare i media caricati su repository esterni.",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "Elenco delle stanze",
    fields: {
      world_readable: "Gli utenti ospite possono vedere senza entrare",
      guest_can_join: "Gli utenti ospite possono entrare",
    },
    action: {
      title: "Cancella stanza dall'elenco |||| Cancella %{smart_count} stanze dall'elenco",
      content:
        "È sicuro di voler rimuovere questa stanza dall'elenco? |||| È sicuro di voler rimuovere %{smart_count} stanze dall'elenco?",
      erase: "Rimuovi dall'elenco",
      create: "Crea",
      send_success: "Stanza creata con successo.",
      send_failure: "C'è stato un errore.",
    },
  },
  destinations: {
    name: "Federazione",
    fields: {
      destination: "Destinazione",
      failure_ts: "Timestamp dell'errore",
      retry_last_ts: "Tentativo ultimo timestamp",
      retry_interval: "Intervallo dei tentativi",
      last_successful_stream_ordering: "Ultimo flusso riuscito con successo",
      stream_ordering: "Flusso",
    },
    action: { reconnect: "Riconnetti" },
  },
  registration_tokens: {
    name: "Token di registrazione",
    fields: {
      token: "Token",
      valid: "Token valido",
      uses_allowed: "Usi permessi",
      pending: "In attesa",
      completed: "Completato",
      expiry_time: "Data della scadenza",
      length: "Lunghezza",
      created_at: "Data di creazione",
      last_used_at: "Ultimo utilizzo",
      revoked_at: "Data di revoca",
    },
    helper: { length: "Lunghezza del token se non viene dato alcun token." },
    action: {
      revoke: {
        label: "Revoca",
        success: "Token revocato",
      },
      unrevoke: {
        label: "Ripristina",
        success: "Token ripristinato",
      },
    },
  },
};

export default misc_resources;
