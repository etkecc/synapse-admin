const reports = {
  name: "Événement signalé |||| Événements signalés",
  fields: {
    id: "Identifiant",
    received_ts: "Date du signalement",
    user_id: "Rapporteur",
    name: "Nom du salon",
    score: "Score",
    reason: "Raison",
    event_id: "ID de l'événement",
    sender: "Expéditeur",
  },
  action: {
    erase: {
      title: "Supprimer l’événement signalé",
      content: "Voulez-vous vraiment supprimer l’événement signalé ? Cette action est irréversible.",
    },
    event_lookup: {
      label: "Recherche d'événement",
      title: "Récupérer un événement par ID",
      fetch: "Récupérer",
    },
    fetch_event_error: "Échec de la récupération de l'événement",
  },
};

export default reports;
