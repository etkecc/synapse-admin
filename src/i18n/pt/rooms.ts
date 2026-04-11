const rooms = {
  name: "Sala |||| Salas",
  fields: {
    room_id: "ID da sala",
    name: "Nome",
    canonical_alias: "Alias",
    joined_members: "Membros",
    joined_local_members: "Membros locais",
    joined_local_devices: "Dispositivos locais",
    state_events: "Eventos de estado / Complexidade",
    version: "Versão",
    is_encrypted: "Encriptado",
    encryption: "Encriptação",
    federatable: "Federável",
    public: "Visível no diretório de salas",
    creator: "Criador",
    join_rules: "Regras de entrada",
    guest_access: "Acesso de convidados",
    history_visibility: "Visibilidade do histórico",
    topic: "Tópico",
    avatar: "Avatar",
    actions: "Ações",
  },
  filter: {
    public_rooms: "Salas públicas",
    empty_rooms: "Salas vazias",
    local_members_only: "Apenas membros locais",
  },
  helper: {
    forward_extremities:
      "As extremidades diretas são os eventos folha no final de um grafo acíclico dirigido (DAG) numa sala, ou seja, eventos sem filhos. Quanto mais existirem numa sala, mais resolução de estado o Synapse precisa de realizar (nota: esta é uma operação dispendiosa). Embora o Synapse tenha código para evitar demasiadas extremidades ao mesmo tempo, erros podem fazê-las reaparecer. Se uma sala tiver mais de 10 extremidades diretas, vale a pena verificar qual é a sala culpada e potencialmente removê-las usando as consultas SQL mencionadas em #1760.",
  },
  enums: {
    join_rules: {
      public: "Pública",
      knock: "Solicitação",
      invite: "Convite",
      private: "Privada",
      restricted: "Restrita",
    },
    guest_access: {
      can_join: "Convidados podem entrar",
      forbidden: "Convidados não podem entrar",
    },
    history_visibility: {
      invited: "Desde o convite",
      joined: "Desde a entrada",
      shared: "Desde a partilha",
      world_readable: "Qualquer pessoa",
    },
    unencrypted: "Não encriptado",
  },
  action: {
    erase: {
      title: "Eliminar sala",
      content:
        "Tem a certeza de que pretende eliminar esta sala? Esta ação não pode ser desfeita. Todas as mensagens e multimédia partilhado serão permanentemente eliminados do servidor.",
      fields: {
        block: "Bloquear e impedir utilizadores de entrar na sala",
      },
      in_progress: "Eliminação em curso…",
      background_note: "Pode fechar esta janela com segurança; a eliminação continuará em segundo plano.",
      success: "Sala eliminada com sucesso. |||| Salas eliminadas com sucesso.",
      failure: "Não foi possível eliminar a sala. |||| Não foi possível eliminar as salas.",
    },
    make_admin: {
      assign_admin: "Atribuir administrador",
      title: "Atribuir um administrador à sala %{roomName}",
      confirm: "Tornar administrador",
      content:
        "Introduza o MXID completo do utilizador a definir como administrador da sala.\nNota: a sala já deve ter pelo menos um membro local com permissões de administrador para que isto funcione.",
      success: "O utilizador foi definido como administrador da sala.",
      failure: "Não foi possível definir o utilizador como administrador da sala. %{errMsg}",
    },
    join: {
      label: "Adicionar utilizador",
      title: "Adicionar utilizador a %{roomName}",
      confirm: "Adicionar",
      content:
        "Introduza o MXID completo do utilizador a adicionar a esta sala.\nNota: deve ser membro da sala com permissão para convidar utilizadores.",
      success: "Utilizador adicionado à sala com sucesso.",
      failure: "Falha ao adicionar utilizador à sala. %{errMsg}",
    },
    block: {
      label: "Bloquear",
      title: "Bloquear %{room}",
      title_bulk: "Bloquear %{smart_count} sala |||| Bloquear %{smart_count} salas",
      title_by_id: "Bloquear uma sala",
      content: "Os utilizadores serão impedidos de entrar nesta sala.",
      content_bulk:
        "Os utilizadores serão impedidos de entrar em %{smart_count} sala. |||| Os utilizadores serão impedidos de entrar em %{smart_count} salas.",
      success: "Sala bloqueada com sucesso. |||| Salas bloqueadas com sucesso.",
      failure: "Falha ao bloquear a sala. |||| Falha ao bloquear as salas.",
    },
    unblock: {
      label: "Desbloquear",
      success: "Sala desbloqueada com sucesso. |||| Salas desbloqueadas com sucesso.",
      failure: "Falha ao desbloquear a sala. |||| Falha ao desbloquear as salas.",
    },
    purge_history: {
      label: "Limpar histórico",
      title: "Limpar histórico de %{roomName}",
      content:
        "Todos os eventos anteriores à data selecionada serão eliminados da base de dados. O estado da sala (entradas, saídas, tópico) é sempre preservado. Pelo menos uma mensagem é sempre mantida.\nNota: esta operação pode demorar vários minutos para salas grandes.",
      date_label: "Limpar eventos anteriores a",
      delete_local: "Também eliminar eventos enviados por utilizadores locais",
      in_progress: "Limpeza em curso…",
      background_note: "Pode fechar esta janela com segurança; a limpeza continuará em segundo plano.",
      success: "Histórico da sala limpo com sucesso.",
      failure: "Falha ao limpar o histórico da sala. %{errMsg}",
    },
    quarantine_all: {
      label: "Colocar todo o multimédia em quarentena",
      title: "Colocar todo o multimédia de %{roomName} em quarentena",
      content:
        "Isto colocará em quarentena TODO o multimédia local e remoto nesta sala. O multimédia em quarentena deixará de estar acessível aos utilizadores.",
      success:
        "Item de multimédia colocado em quarentena com sucesso. |||| %{smart_count} itens de multimédia colocados em quarentena com sucesso.",
      failure: "Falha ao colocar multimédia em quarentena. %{errMsg}",
    },
    delete_all_media: {
      label: "Eliminar todos os média",
      title: "Eliminar todos os média em %{roomName}",
      content:
        "Todos os ficheiros de média locais nesta sala serão eliminados permanentemente. Apenas os média locais de salas não cifradas são afetados — os média de servidores externos estão excluídos. Esta ação não pode ser revertida.",
      in_progress_loading: "A obter a lista de média…",
      in_progress: "A eliminar os média… (%{current} / %{total})",
      do_not_close:
        "Não feche esta janela — a eliminação está a decorrer em primeiro plano e será interrompida se fechar.",
      success:
        "Eliminado com sucesso %{smart_count} ficheiro de média. |||| Eliminados com sucesso %{smart_count} ficheiros de média.",
      failure: "Falha ao eliminar os média. %{errMsg}",
    },
    delete_all_media_bulk: {
      title: "Eliminar todos os média de %{smart_count} sala? |||| Eliminar todos os média de %{smart_count} salas?",
      content:
        "Todos os ficheiros de média locais das salas selecionadas serão eliminados permanentemente (apenas salas não cifradas). Os média de servidores externos estão excluídos. Esta ação não pode ser revertida.",
      success: "Média eliminados para %{success} de %{total} salas.",
      partial_failure: "Média eliminados para %{success} de %{total} salas. %{failed} falharam.",
    },
    event_context: {
      lookup_title: "Pesquisar evento por ID",
      jump_to_date: "Saltar para data",
      direction: "Direção",
      forward: "Para a frente",
      backward: "Para trás",
      target_event: "Evento alvo",
      events_before: "Eventos anteriores",
      events_after: "Eventos posteriores",
      not_found: "Nenhum evento encontrado no momento especificado",
      failure: "Falha ao obter o contexto do evento",
    },
    messages: {
      load_older: "Carregar mais antigos",
      load_newer: "Carregar mais recentes",
      no_messages: "Sem mensagens nesta sala",
      failure: "Falha ao carregar mensagens",
      filter: "Filtros",
      filter_type: "Tipos de evento",
      filter_sender: "Remetentes",
      advanced_filters: "Filtros avançados",
      filter_not_type: "Excluir tipos de evento",
      filter_not_sender: "Excluir remetentes",
      contains_url: "Contém URL",
      any: "Qualquer",
      with_url: "Apenas com URL",
      without_url: "Apenas sem URL",
      apply_filter: "Aplicar",
      clear_filters: "Limpar",
    },
    hierarchy: {
      load_more: "Carregar mais",
      max_depth: "Profundidade máxima",
      unlimited: "Ilimitada",
      refresh: "Atualizar",
      members: "%{count} membros",
      space: "Espaço",
      room: "Sala",
      suggested: "Sugerida",
      no_children: "Esta sala não tem salas filhas",
      failure: "Falha ao carregar a hierarquia",
    },
  },
};

export default rooms;
