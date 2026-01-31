import italianMessages from "ra-language-italian";

import { SynapseTranslationMessages } from ".";

const it: SynapseTranslationMessages = {
  ...italianMessages,
  synapseadmin: {
    auth: {
      base_url: "URL dell'homeserver",
      welcome: "Benvenuto in %{name}",
      server_version: "Versione di Synapse",
      username_error: "Per favore inserisci un ID utente completo: '@utente:dominio'",
      protocol_error: "L'URL deve iniziare per 'http://' o 'https://'",
      url_error: "URL del server Matrix non valido",
      sso_sign_in: "Accedi con SSO",
      credentials: "Credenziali",
      access_token: "Token di accesso",
      logout_acces_token_dialog: {
        title: "Stai utilizzando un token di accesso Matrix esistente.",
        content:
          "Vuoi distruggere questa sessione (che potrebbe essere utilizzata altrove, ad esempio in un client Matrix) o semplicemente disconnetterti dal pannello di amministrazione?",
        confirm: "Distruggi sessione",
        cancel: "Disconnetti solo dal pannello di amministrazione",
      },
    },
    users: {
      invalid_user_id: "ID utente non valido su questo homeserver.",
      tabs: { sso: "SSO", experimental: "Sperimentale", limits: "Limiti", account_data: "Dati del profilo" },
    },
    rooms: {
      tabs: {
        basic: "Semplice",
        members: "Membro",
        detail: "Dettagli",
        permission: "Permessi",
        media: "Media",
      },
    },
    reports: { tabs: { basic: "Semplice", detail: "Dettagli" } },
  },
  import_users: {
    error: {
      at_entry: "Alla voce %{entry}: %{message}",
      error: "Errore",
      required_field: "Il campo '%{field}' non è presente",
      invalid_value: "Valore non valido alla riga %{row}. '%{field}' Il campo può essere solo 'true' o 'false'",
      unreasonably_big: "Impossibile caricare un file così grosso (%{size} megabyte)",
      already_in_progress: "Un import è attualmente già in caricamento",
      id_exits: "L'ID %{id} è già presente",
    },
    title: "Importa utenti tramite file CSV",
    goToPdf: "Vai al PDF",
    cards: {
      importstats: {
        header: "Utenti analizzati per l'importazione",
        users_total: "%{smart_count} utente nel file CSV |||| %{smart_count} utenti nel file CSV",
        guest_count: "%{smart_count} ospite |||| %{smart_count} ospiti",
        admin_count: "%{smart_count} amministratore |||| %{smart_count} amministratori",
      },
      conflicts: {
        header: "Strategia di conflitto",
        mode: {
          stop: "Stoppa al conflitto",
          skip: "Mostra l'errore e ignora il conflitto",
        },
      },
      ids: {
        header: "ID",
        all_ids_present: "ID presenti in ogni voce",
        count_ids_present: "%{smart_count} voce con ID |||| %{smart_count} voci con ID",
        mode: {
          ignore: "Ignora gli ID nel file CSV e creane di nuovi",
          update: "Aggiorna le voci esistenti",
        },
      },
      passwords: {
        header: "Passwords",
        all_passwords_present: "Password presenti in ogni voce",
        count_passwords_present: "%{smart_count} voce con password |||| %{smart_count} voci con password",
        use_passwords: "Usa le password dal file CSV",
      },
      upload: {
        header: "Input file CSV",
        explanation:
          "Qui puoi caricare un file con valori separati da virgole che verrà poi utilizzato per creare o aggiornare gli utenti. Il file deve includere i campi 'id' and 'displayname'. Puoi scaricare un file di esempio per adattarlo: ",
      },
      startImport: {
        simulate_only: "Solo simulazione",
        run_import: "Importa",
      },
      results: {
        header: "Importa i risultati",
        total: "%{smart_count} voce in totale |||| %{smart_count} voci in totale",
        successful: "%{smart_count} voci importate con successo",
        skipped: "%{smart_count} voci ignorate",
        download_skipped: "Scarica le voci ignorate",
        with_error: "%{smart_count} voce con errori ||| %{smart_count} voci con errori",
        simulated_only: "Il processo era stato solamente simulato",
      },
    },
  },
  delete_media: {
    name: "Media",
    fields: {
      before_ts: "ultimo accesso effettuato prima",
      size_gt: "Più grande di (in byte)",
      keep_profiles: "Mantieni le immagini del profilo",
    },
    action: {
      send: "Cancella media",
      send_success: "Richiesta inviata con successo.",
      send_failure: "C'è stato un errore.",
    },
    helper: {
      send: "Questa API cancella i media locali dal disco del tuo server. Questo include anche ogni miniatura e copia del media scaricato. Questa API non inciderà sui media che sono stati caricati nei repository esterni.",
    },
  },
  purge_remote_media: {
    name: "Media Remoti",
    fields: {
      before_ts: "ultimo accesso prima di",
    },
    action: {
      send: "Elimina media remoti",
      send_success: "La richiesta per eliminare i media remoti è stata inviata.",
      send_failure: "Si è verificato un errore con la richiesta di eliminazione dei media remoti.",
    },
    helper: {
      send: "Questa API elimina la cache dei media remoti dal disco del tuo server. Questo include qualsiasi miniatura locale e copie di media scaricati. Questa API non influirà sui media che sono stati caricati nel repository multimediale del server.",
    },
  },
  resources: {
    users: {
      name: "Utente |||| Utenti",
      email: "Email",
      msisdn: "Telefono",
      threepid: "Email / Telefono",
      membership: "Membro |||| Membri",
      fields: {
        avatar: "Avatar",
        id: "ID utente",
        name: "Nome",
        is_guest: "Ospite",
        admin: "Amministratore",
        locked: "Bloccato",
        suspended: "Sospeso",
        deactivated: "Disattivato",
        show_guests: "Mostra gli ospiti",
        show_deactivated: "Mostra gli utenti disattivati",
        show_locked: "Mostra gli utenti bloccati",
        show_suspended: "Mostra gli utenti sospesi",
        user_id: "Cerca utente",
        displayname: "Nickname",
        password: "Password",
        avatar_url: "URL dell'avatar",
        avatar_src: "Avatar",
        medium: "Medium",
        threepids: "3PID",
        address: "Indirizzo",
        creation_ts_ms: "Creazione del timestamp",
        consent_version: "Versione minima richiesta",
        auth_provider: "Provider",
        user_type: "Tipo d'utente",
      },
      helper: {
        password: "Cambiando la password l'utente verrà disconnesso da tutte le sessioni attive.",
        password_required_for_reactivation: "Devi fornire una password per riattivare l'account.",
        create_password: "Genera una password forte e sicura utilizzando il pulsante sottostante.",
        deactivate: "Devi fornire una password per riattivare l'account.",
        suspend: "Sospendi l'utente",
        erase: "Constrassegna l'utente come cancellato dal GDPR",
        admin: "Un amministratore del server ha controllo totale sul server e sui suoi utenti.",
        lock: "Impedisce all'utente di utilizzare il server. Questa è un'azione non distruttiva che può essere annullata.",
        erase_text:
          "Ciò significa che i messaggi inviati dall'utente (o dagli utenti) saranno ancora visibili da chiunque si trovasse nella stanza al momento dell'invio, ma saranno nascosti agli utenti che si uniranno alla stanza in seguito.",
        erase_admin_error: "Non è consentito eliminare il proprio utente.",
        modify_managed_user_error: "La modifica di un utente gestito dal sistema non è consentita.",
        username_available: "Nome utente disponibile",
      },
      badge: {
        you: "Tu",
        bot: "Bot",
        admin: "Amministratore",
        support: "Supporto",
        regular: "Utente normale",
        federated: "Federato",
        system_managed: "Gestito dal sistema",
      },
      action: {
        erase: "Cancella i dati dell'utente",
        erase_avatar: "Cancella l'avatar dell'utente",
        delete_media: "Elimina tutti i media caricati dall'utente(-s)",
        redact_events: "Ridurre tutti gli eventi inviati dall'utente(-s)",
        generate_password: "Genera password",
        overwrite_title: "Attenzione!",
        overwrite_content:
          "Questo nome utente è già stato utilizzato. Sei sicuro di voler sovrascrivere l'utente esistente?",
        overwrite_cancel: "Annulla",
        overwrite_confirm: "Sovrascrivi",
      },
      limits: {
        messages_per_second: "Messaggi al secondo",
        messages_per_second_text: "Il numero di azioni che l'utente può eseguire al secondo.",
        burst_count: "Burst-conteggio",
        burst_count_text: "Il numero di azioni che l'utente può eseguire prima di essere limitato.",
      },
      account_data: {
        title: "Dati del profilo",
        global: "Globale",
        rooms: "Stanza",
      },
    },
    rooms: {
      name: "Stanza |||| Stanze",
      fields: {
        room_id: "ID della stanza",
        name: "Nome",
        canonical_alias: "Alias",
        joined_members: "Membri",
        joined_local_members: "Membri locali",
        joined_local_devices: "Dispositivi locali",
        state_events: "Eventi di stato / Complessità",
        version: "Versione",
        is_encrypted: "Criptato",
        encryption: "Crittografia",
        federatable: "Federabile",
        public: "Visibile nella cartella della stanza",
        creator: "Creatore",
        join_rules: "Regole per entrare",
        guest_access: "Entra come ospite",
        history_visibility: "Visibilità temporale",
        topic: "Topic",
        avatar: "Avatar",
        actions: "Azioni",
      },
      filter: {
        public_rooms: "Stanze pubbliche",
        empty_rooms: "Stanze vuote",
      },
      helper: {
        /*        forward_extremities:
                  "Forward extremities are the leaf events at the end of a Directed acyclic graph (DAG) in a room, aka events that have no children. The more exist in a room, the more state resolution that Synapse needs to perform (hint: it's an expensive operation). While Synapse has code to prevent too many of these existing at one time in a room, bugs can sometimes make them crop up again. If a room has >10 forward extremities, it's worth checking which room is the culprit and potentially removing them using the SQL queries mentioned in #1760.", */
      },
      enums: {
        join_rules: {
          public: "Pubblica",
          knock: "Bussa",
          invite: "Invita",
          private: "Privata",
        },
        guest_access: {
          can_join: "Gli utenti ospiti possono entrare",
          forbidden: "Gli utenti ospiti non possono entrare",
        },
        history_visibility: {
          invited: "Dall'invito",
          joined: "Dall'entrata",
          shared: "Dalla condivisione",
          world_readable: "Chiunque",
        },
        unencrypted: "Non criptata",
      },
      action: {
        erase: {
          title: "Cancella stanza",
          content:
            "Sei sicuro di voler eliminare questa stanza? Questa azione è definitiva. Tutti i messaggi e i media condivisi in questa stanza verranno eliminati dal server!",
        },
        make_admin: {
          assign_admin: "Assegna un amministratore",
          title: "Assegna un amministratore alla stanza %{roomName}",
          confirm: "Assegna un amministratore",
          content:
            "Inserisci la MXID completa dell'utente che sarà designato come amministratore.\nAttenzione: per questo funzionare, la stanza deve avere almeno un membro locale come amministratore.",
          success: "L'utente è stato designato come amministratore della stanza.",
          failure: "L'utente non può essere designato come amministratore della stanza. %{errMsg}",
        },
      },
    },
    reports: {
      name: "Evento segnalato |||| Eventi segnalati",
      fields: {
        id: "ID",
        received_ts: "Orario del report",
        user_id: "richiedente",
        name: "nome della stanza",
        score: "punteggio",
        reason: "ragione",
        event_id: "ID dell'evento",
        event_json: {
          origin: "server di origine",
          origin_server_ts: "ora dell'invio",
          type: "tipo di evento",
          content: {
            msgtype: "tipo di contenuto",
            body: "contenuto",
            format: "formato",
            formatted_body: "contenuto formattato",
            algorithm: "algoritmo",
          },
        },
      },
    },
    connections: {
      name: "Connessioni",
      fields: {
        last_seen: "Data",
        ip: "Indirizzo IP",
        user_agent: "agente utente",
      },
    },
    devices: {
      name: "Dispositivo |||| Dispositivi",
      fields: {
        device_id: "ID del dispositivo",
        display_name: "Nome del dispositivo",
        last_seen_ts: "Timestamp",
        last_seen_ip: "Indirizzo IP",
      },
      action: {
        erase: {
          title: "Rimozione del dispositivo %{id}",
          content: 'Sei sicuro di voler rimuovere il dispositivo "%{name}"?',
          success: "Dispositivo rimosso con successo.",
          failure: "C'è stato un errore.",
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
    },
    protect_media: {
      action: {
        create: "Non protetto, proteggi",
        delete: "Protetto, rimuovi protezione",
        none: "In quarantena",
        send_success: "Stato della protezione cambiato con successo.",
        send_failure: "C'è stato un errore.",
      },
    },
    quarantine_media: {
      action: {
        name: "Quarantina",
        create: "Aggiungi alla quarantena",
        delete: "In quarantena, rimuovi dalla quarantena",
        none: "Protetto dalla quarantena",
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
        world_readable: "gli utenti ospite possono vedere senza entrare",
        guest_can_join: "gli utenti ospite possono entrare",
      },
      action: {
        title: "Cancella stanza dall'elenco |||| Cancella %{smart_count} stanze dall'elenco",
        content:
          "Sei sicuro di voler rimuovere questa stanza dall'elenco? |||| Sei sicuro di voler rimuovere %{smart_count} stanze dall'elenco?",
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
      },
      helper: { length: "Lunghezza del token se non viene dato alcun token." },
    },
  },
  etkecc: {
    billing: {
      name: "Fatturazione",
      title: "Cronologia pagamenti",
      no_payments: "Nessun pagamento trovato.",
      no_payments_helper: "Se ritieni che si tratti di un errore, contatta l’assistenza etke.cc a",
      description1:
        "Da qui puoi visualizzare i pagamenti e generare le fatture. Puoi saperne di più sulla gestione degli abbonamenti su",
      description2:
        "Se desideri modificare l’email di fatturazione o aggiungere i dati aziendali, contatta l’assistenza etke.cc a",
      fields: {
        transaction_id: "ID transazione",
        email: "Email",
        type: "Tipo",
        amount: "Importo",
        paid_at: "Pagato il",
        invoice: "Fattura",
      },
      enums: {
        type: {
          subscription: "Abbonamento",
          one_time: "Una tantum",
        },
      },
      helper: {
        download_invoice: "Scarica fattura",
        downloading: "Download in corso...",
        download_started: "Il download della fattura è iniziato.",
        loading: "Caricamento delle informazioni di fatturazione...",
        loading_failed1: "Si è verificato un problema durante il caricamento delle informazioni di fatturazione.",
        loading_failed2: "Riprova più tardi.",
        loading_failed3: "Se il problema persiste, contatta l’assistenza etke.cc a",
        loading_failed4: "con il seguente messaggio di errore:",
      },
    },
    maintenance: {
      title: "Il sistema è attualmente in modalità manutenzione.",
      try_again: "Riprova più tardi.",
      note: "Non è necessario contattare l’assistenza per questo: ci stiamo già lavorando!",
    },
  },
};
export default it;
