const reports = {
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
};

export default reports;
