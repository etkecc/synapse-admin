// Miscellaneous resources: scheduled_tasks, connections, devices, users_media,
// protect_media, quarantine_media, pushers, servernotices, database_room_statistics,
// user_media_statistics, forward_extremities, room_state, room_media, room_directory,
// destinations, registration_tokens
const misc_resources = {
  scheduled_tasks: {
    name: "Tarefa agendada |||| Tarefas agendadas",
    fields: {
      id: "ID",
      action: "Ação",
      status: "Estado",
      timestamp: "Timestamp",
      resource_id: "ID do recurso",
      result: "Resultado",
      error: "Erro",
      max_timestamp: "Antes da data",
    },
    status: {
      scheduled: "Agendada",
      active: "Ativa",
      complete: "Concluída",
      cancelled: "Cancelada",
      failed: "Falhada",
    },
  },
  connections: {
    name: "Ligações",
    fields: {
      last_seen: "Data",
      ip: "Endereço IP",
      user_agent: "Agente de utilizador",
    },
  },
  devices: {
    name: "Dispositivo |||| Dispositivos",
    fields: {
      device_id: "ID do dispositivo",
      display_name: "Nome do dispositivo",
      last_seen_ts: "Timestamp",
      last_seen_ip: "Endereço IP",
      last_seen_user_agent: "Agente de utilizador",
      dehydrated: "Desidratado",
    },
    action: {
      erase: {
        title: "Remover dispositivo %{id}?",
        title_bulk: "Remover %{smart_count} dispositivo? |||| Remover %{smart_count} dispositivos?",
        content: 'Tem a certeza de que pretende remover o dispositivo "%{name}"?',
        content_bulk:
          "Tem a certeza de que pretende remover %{smart_count} dispositivo? |||| Tem a certeza de que pretende remover %{smart_count} dispositivos?",
        success: "Dispositivo removido com sucesso.",
        failure: "Ocorreu um erro.",
      },
      display_name: {
        success: "Nome do dispositivo atualizado",
        failure: "Falha ao atualizar o nome do dispositivo",
      },
      create: {
        label: "Criar dispositivo",
        title: "Criar novo dispositivo",
        success: "Dispositivo criado",
        failure: "Falha ao criar o dispositivo",
      },
    },
  },
  users_media: {
    name: "Multimédia",
    fields: {
      media_id: "ID do multimédia",
      media_length: "Tamanho do ficheiro (em bytes)",
      media_type: "Tipo",
      upload_name: "Nome do ficheiro",
      quarantined_by: "Colocado em quarentena por",
      safe_from_quarantine: "Protegido de quarentena",
      created_ts: "Criado em",
      last_access_ts: "Último acesso",
    },
    action: {
      open: "Abrir ficheiro multimédia numa nova janela",
    },
  },
  protect_media: {
    action: {
      create: "Proteger",
      delete: "Desproteger",
      none: "Em quarentena",
      send_success: "Estado de proteção alterado com sucesso.",
      send_failure: "Ocorreu um erro.",
    },
  },
  quarantine_media: {
    action: {
      name: "Quarentena",
      create: "Colocar em quarentena",
      delete: "Retirar da quarentena",
      none: "Protegido",
      send_success: "Estado de quarentena alterado com sucesso.",
      send_failure: "Ocorreu um erro: %{error}",
    },
  },
  pushers: {
    name: "Pusher |||| Pushers",
    fields: {
      app: "Aplicação",
      app_display_name: "Nome de apresentação da aplicação",
      app_id: "ID da aplicação",
      device_display_name: "Nome de apresentação do dispositivo",
      kind: "Tipo",
      lang: "Idioma",
      profile_tag: "Etiqueta de perfil",
      pushkey: "Chave push",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "Avisos do servidor",
    send: "Enviar avisos do servidor",
    fields: {
      body: "Mensagem",
    },
    action: {
      send: "Enviar aviso",
      send_success: "Aviso do servidor enviado com sucesso.",
      send_failure: "Ocorreu um erro.",
    },
    helper: {
      send: 'Envia um aviso do servidor aos utilizadores selecionados. A funcionalidade "Avisos do servidor" deve estar ativada no servidor.',
    },
  },
  database_room_statistics: {
    name: "Estatísticas de salas na base de dados",
    fields: {
      room_id: "ID da sala",
      estimated_size: "Tamanho estimado",
    },
    helper: {
      info: "Mostra o espaço em disco estimado utilizado por cada sala na base de dados do Synapse. Estes valores são aproximados.",
    },
  },
  user_media_statistics: {
    name: "Multimédia",
    fields: {
      media_count: "Contagem de multimédia",
      media_length: "Tamanho do multimédia",
    },
  },
  forward_extremities: {
    name: "Extremidades diretas",
    fields: {
      id: "ID do evento",
      received_ts: "Timestamp",
      depth: "Profundidade",
      state_group: "Grupo de estado",
    },
  },
  room_state: {
    name: "Eventos de estado",
    fields: {
      type: "Tipo",
      content: "Conteúdo",
      origin_server_ts: "Enviado em",
      sender: "Remetente",
    },
  },
  room_media: {
    name: "Multimédia",
    fields: {
      media_id: "ID do multimédia",
    },
    helper: {
      info: "Lista todo o multimédia carregado nesta sala. O multimédia alojado em repositórios externos não pode ser eliminado a partir daqui.",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "Diretório de salas",
    fields: {
      world_readable: "Utilizadores convidados podem ver sem entrar",
      guest_can_join: "Utilizadores convidados podem entrar",
    },
    action: {
      title: "Eliminar sala do diretório |||| Eliminar %{smart_count} salas do diretório",
      content:
        "Tem a certeza de que pretende remover esta sala do diretório? |||| Tem a certeza de que pretende remover estas %{smart_count} salas do diretório?",
      erase: "Eliminar do diretório de salas",
      create: "Publicar no diretório de salas",
      send_success: "Sala publicada com sucesso.",
      send_failure: "Ocorreu um erro.",
    },
  },
  destinations: {
    name: "Federação",
    fields: {
      destination: "Destino",
      failure_ts: "Timestamp de falha",
      retry_last_ts: "Timestamp da última tentativa",
      retry_interval: "Intervalo de tentativa",
      last_successful_stream_ordering: "Último fluxo bem-sucedido",
      stream_ordering: "Fluxo",
    },
    action: { reconnect: "Reconectar" },
  },
  registration_tokens: {
    name: "Tokens de registo",
    fields: {
      token: "Token",
      valid: "Token válido",
      uses_allowed: "Utilizações permitidas",
      pending: "Pendente",
      completed: "Concluído",
      expiry_time: "Hora de expiração",
      length: "Comprimento",
      created_at: "Criado em",
      last_used_at: "Última utilização em",
      revoked_at: "Revogado em",
    },
    helper: { length: "O comprimento do token gerado, utilizado quando não é fornecido um valor de token específico." },
    action: {
      revoke: {
        label: "Revogar",
        success: "Token revogado",
      },
      unrevoke: {
        label: "Restaurar",
        success: "Token restaurado",
      },
    },
  },
  account_data: {
    name: "Dados da conta",
  },
  joined_rooms: {
    name: "Salas em que entrou",
  },
  memberships: {
    name: "Associações",
  },
  room_members: {
    name: "Membros",
  },
  destination_rooms: {
    name: "Salas",
  },
};

export default misc_resources;
