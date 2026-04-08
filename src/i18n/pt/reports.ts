const reports = {
  name: "Evento reportado |||| Eventos reportados",
  fields: {
    id: "ID",
    received_ts: "Reportado em",
    user_id: "Denunciante",
    name: "Nome da sala",
    score: "Pontuação",
    reason: "Motivo",
    event_id: "ID do evento",
    sender: "Remetente",
  },
  action: {
    erase: {
      title: "Eliminar evento reportado",
      content: "Tem a certeza de que pretende eliminar o evento reportado? Esta ação não pode ser desfeita.",
    },
    event_lookup: {
      label: "Pesquisar evento",
      title: "Pesquisar evento por ID",
      fetch: "Pesquisar",
    },
    fetch_event_error: "Falha ao obter o evento",
  },
};

export default reports;
