const rooms = {
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
    local_members_only: "Solo membri locali",
  },
  helper: {
    forward_extremities:
      "Le Forward Extremities sono gli eventi foglia alla fine di un grafo diretto aciclico (DAG) in una stanza, ovvero eventi senza figli. Più ce ne sono, più Synapse deve eseguire la risoluzione dello stato (operazione costosa). Sebbene Synapse disponga di codice per evitare che ce ne siano troppe in una stanza, a volte dei bug le fanno ricomparire. Se una stanza ha più di 10 Forward Extremities, vale la pena investigare e potenzialmente rimuoverle utilizzando le query SQL citate in #1760.",
  },
  enums: {
    join_rules: {
      public: "Pubblica",
      knock: "Bussa",
      invite: "Invita",
      private: "Privata",
      restricted: "Riservata",
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
    room_type: {
      room: "Stanza",
      space: "Spazio",
    },
  },
  action: {
    erase: {
      title: "Cancella stanza",
      content:
        "È sicuro di voler eliminare questa stanza? Questa azione è definitiva. Tutti i messaggi e i media condivisi in questa stanza verranno eliminati dal server!",
      fields: {
        block: "Blocca e impedisci agli utenti di entrare nella stanza",
      },
      in_progress: "Eliminazione in corso…",
      background_note: "Può chiudere questa finestra, l'eliminazione continuerà in background.",
      success: "Stanza/e eliminata/e con successo.",
      failure: "Impossibile eliminare la stanza/le stanze.",
    },
    make_admin: {
      assign_admin: "Assegna un amministratore",
      title: "Assegna un amministratore alla stanza %{roomName}",
      confirm: "Assegna un amministratore",
      content:
        "Inserisca la MXID completa dell'utente che sarà designato come amministratore.\nAttenzione: perché ciò funzioni, la stanza deve avere almeno un membro locale come amministratore.",
      success: "L'utente è stato designato come amministratore della stanza.",
      failure: "L'utente non può essere designato come amministratore della stanza. %{errMsg}",
    },
    join: {
      label: "Aggiungi utente",
      title: "Aggiungi un utente a %{roomName}",
      confirm: "Aggiungi",
      content:
        "Inserisca la MXID completa dell'utente da unire a questa stanza.\nNota: deve essere nella stanza e avere il permesso di invitare utenti.",
      success: "L'utente è stato aggiunto alla stanza con successo.",
      failure: "Impossibile aggiungere l'utente alla stanza. %{errMsg}",
    },
    block: {
      label: "Blocca",
      title: "Blocca %{room}",
      title_bulk: "Blocca %{smart_count} stanza |||| Blocca %{smart_count} stanze",
      title_by_id: "Blocca una stanza",
      content: "Gli utenti non potranno unirsi a questa stanza.",
      content_bulk:
        "Gli utenti non potranno unirsi a %{smart_count} stanza. |||| Gli utenti non potranno unirsi a %{smart_count} stanze.",
      success: "Stanza bloccata con successo. |||| Stanze bloccate con successo.",
      failure: "Impossibile bloccare la stanza. |||| Impossibile bloccare le stanze.",
    },
    unblock: {
      label: "Sblocca",
      success: "Stanza sbloccata con successo. |||| Stanze sbloccate con successo.",
      failure: "Impossibile sbloccare la stanza. |||| Impossibile sbloccare le stanze.",
    },
    purge_history: {
      label: "Elimina cronologia",
      title: "Elimina cronologia di %{roomName}",
      content:
        "Tutti gli eventi prima della data selezionata verranno eliminati dal database. Lo stato della stanza (ingressi, uscite, argomento) viene sempre preservato. Almeno un messaggio viene sempre mantenuto.\nNota: questa operazione potrebbe richiedere diversi minuti per stanze grandi.",
      date_label: "Elimina eventi prima di",
      delete_local: "Elimina anche gli eventi inviati dagli utenti locali",
      in_progress: "Eliminazione in corso…",
      background_note: "Può chiudere questa finestra in sicurezza, l'eliminazione continuerà in background.",
      success: "Cronologia della stanza eliminata con successo.",
      failure: "Impossibile eliminare la cronologia della stanza. %{errMsg}",
    },
    quarantine_all: {
      label: "Metti in quarantena tutti i media",
      title: "Metti in quarantena tutti i media in %{roomName}",
      content:
        "Tutti i media locali e remoti in questa stanza verranno messi in quarantena. I media in quarantena non saranno più accessibili agli utenti.",
      success:
        "%{smart_count} elemento multimediale messo in quarantena con successo. |||| %{smart_count} elementi multimediali messi in quarantena con successo.",
      failure: "Impossibile mettere in quarantena i media. %{errMsg}",
    },
    delete_all_media: {
      label: "Elimina tutti i media",
      title: "Elimina tutti i media in %{roomName}",
      content:
        "Questa operazione eliminerà definitivamente tutti i media locali in questa stanza. Sono interessati solo i media locali delle stanze non cifrate — i media di server remoti sono esclusi. L'operazione è irreversibile.",
      in_progress_loading: "Recupero dell'elenco dei media…",
      in_progress: "Eliminazione dei media… (%{current} / %{total})",
      do_not_close:
        "Non chiuda questa finestra — l'eliminazione è in esecuzione in primo piano e si interromperà se viene chiusa.",
      success:
        "Eliminazione riuscita di %{smart_count} elemento multimediale. |||| Eliminazione riuscita di %{smart_count} elementi multimediali.",
      failure: "Impossibile eliminare i media. %{errMsg}",
    },
    delete_all_media_bulk: {
      title:
        "Eliminare tutti i media per %{smart_count} stanza? |||| Eliminare tutti i media per %{smart_count} stanze?",
      content:
        "Questa operazione eliminerà definitivamente tutti i media locali nelle stanze selezionate (solo stanze non cifrate). I media di server remoti sono esclusi. L'operazione è irreversibile.",
      success: "Media eliminati per %{success} su %{total} stanze.",
      partial_failure: "Media eliminati per %{success} su %{total} stanze. %{failed} non riusciti.",
    },
    event_context: {
      lookup_title: "Cerca evento per ID",
      jump_to_date: "Vai alla data",
      direction: "Direzione",
      forward: "Avanti",
      backward: "Indietro",
      target_event: "Evento di destinazione",
      events_before: "Eventi precedenti",
      events_after: "Eventi successivi",
      not_found: "Nessun evento trovato all'ora specificata",
      failure: "Impossibile recuperare il contesto dell'evento",
    },
    messages: {
      load_older: "Carica precedenti",
      load_newer: "Carica successivi",
      no_messages: "Nessun messaggio in questa stanza",
      failure: "Impossibile caricare i messaggi",
      filter: "Filtri",
      filter_type: "Tipi di evento",
      filter_sender: "Mittenti",
      advanced_filters: "Filtri avanzati",
      filter_not_type: "Escludi tipi di evento",
      filter_not_sender: "Escludi mittenti",
      contains_url: "Contiene URL",
      any: "Qualsiasi",
      with_url: "Solo con URL",
      without_url: "Solo senza URL",
      apply_filter: "Applica",
      clear_filters: "Cancella",
    },
    hierarchy: {
      load_more: "Carica altro",
      max_depth: "Profondità massima",
      unlimited: "Illimitata",
      refresh: "Aggiorna",
      members: "%{count} membri",
      space: "Spazio",
      room: "Stanza",
      suggested: "Consigliata",
      no_children: "Questa stanza non ha stanze figlie",
      failure: "Impossibile caricare la gerarchia",
    },
  },
};

export default rooms;
