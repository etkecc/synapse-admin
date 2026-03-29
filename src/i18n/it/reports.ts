const reports = {
  name: "Evento segnalato |||| Eventi segnalati",
  fields: {
    id: "ID",
    received_ts: "Orario del report",
    user_id: "Richiedente",
    name: "Nome della stanza",
    score: "Punteggio",
    reason: "Ragione",
    event_id: "ID dell'evento",
    sender: "Mittente",
  },
  action: {
    erase: {
      title: "Elimina evento segnalato",
      content: "È sicuro di voler eliminare l'evento segnalato? Questa azione è irreversibile.",
    },
    event_lookup: {
      label: "Ricerca evento",
      title: "Recupera evento per ID",
      fetch: "Recupera",
    },
    fetch_event_error: "Impossibile recuperare l'evento",
  },
};

export default reports;
