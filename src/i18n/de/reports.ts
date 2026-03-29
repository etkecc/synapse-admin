const reports = {
  name: "Gemeldetes Ereignis |||| Gemeldete Ereignisse",
  fields: {
    id: "ID",
    received_ts: "Meldezeit",
    user_id: "Meldender",
    name: "Raumname",
    score: "Bewertung",
    reason: "Grund",
    event_id: "Ereignis-ID",
    sender: "Absender",
  },
  action: {
    erase: {
      title: "Gemeldetes Ereignis löschen",
      content:
        "Sind Sie sicher, dass Sie das gemeldete Ereignis löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    },
    event_lookup: {
      label: "Ereignis-Suche",
      title: "Ereignis nach ID abrufen",
      fetch: "Abrufen",
    },
    fetch_event_error: "Fehler beim Abrufen des Ereignisses",
  },
};

export default reports;
