const mas = {
  mas_users: {
    name: "Utilizador MAS |||| Utilizadores MAS",
    fields: {
      id: "ID MAS",
      username: "Nome de utilizador",
      admin: "Administrador",
      locked: "Bloqueado",
      deactivated: "Desativado",
      legacy_guest: "Convidado legado",
      created_at: "Criado em",
      locked_at: "Bloqueado em",
      deactivated_at: "Desativado em",
    },
    filter: {
      status: "Estado",
      search: "Pesquisar",
      status_active: "Ativo",
      status_locked: "Bloqueado",
      status_deactivated: "Desativado",
    },
    action: {
      lock: { label: "Bloquear", success: "Utilizador bloqueado" },
      unlock: { label: "Desbloquear", success: "Utilizador desbloqueado" },
      deactivate: { label: "Desativar", success: "Utilizador desativado" },
      reactivate: { label: "Reativar", success: "Utilizador reativado" },
      set_admin: { label: "Conceder administração", success: "Estado de administrador atualizado" },
      remove_admin: { label: "Remover administração", success: "Estado de administrador atualizado" },
      set_password: {
        label: "Definir palavra-passe",
        title: "Definir palavra-passe",
        success: "Palavra-passe definida",
        failure: "Falha ao definir a palavra-passe",
      },
    },
  },
  mas_user_emails: {
    name: "E-mail |||| E-mails",
    empty: "Sem e-mails",
    fields: {
      email: "E-mail",
      user_id: "ID de utilizador",
      created_at: "Criado em",
      actions: "Ações",
    },
    action: {
      remove: {
        label: "Remover",
        title: "Remover e-mail",
        content: "Remover %{email}?",
        success: "E-mail removido",
      },
      create: { success: "E-mail adicionado" },
    },
  },
  mas_compat_sessions: {
    name: "Sessão de compatibilidade |||| Sessões de compatibilidade",
    empty: "Sem sessões de compatibilidade",
    fields: {
      user_id: "ID de utilizador",
      device_id: "ID do dispositivo",
      created_at: "Criado em",
      user_agent: "Agente de utilizador",
      last_active_at: "Última atividade",
      last_active_ip: "Último IP",
      finished_at: "Terminado em",
      human_name: "Nome",
      active: "Ativo",
    },
    action: {
      finish: {
        label: "Terminar",
        title: "Terminar esta sessão?",
        content: "Isto irá terminar a sessão.",
        success: "Sessão terminada",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "Sessão OAuth2 |||| Sessões OAuth2",
    empty: "Sem sessões OAuth2",
    fields: {
      user_id: "ID de utilizador",
      client_id: "ID do cliente",
      scope: "Âmbito",
      created_at: "Criado em",
      user_agent: "Agente de utilizador",
      last_active_at: "Última atividade",
      last_active_ip: "Último IP",
      finished_at: "Terminado em",
      human_name: "Nome",
      active: "Ativo",
    },
    action: {
      finish: {
        label: "Terminar",
        title: "Terminar esta sessão?",
        content: "Isto irá terminar a sessão.",
        success: "Sessão terminada",
      },
    },
  },
  mas_policy_data: {
    name: "Dados de política",
    current_policy: "Política atual",
    no_policy: "Nenhuma política está atualmente definida.",
    set_policy: "Definir nova política",
    invalid_json: "JSON inválido",
    fields: {
      json_placeholder: "Introduza os dados da política em JSON…",
      created_at: "Criado em",
    },
    action: {
      save: {
        label: "Definir política",
        success: "Política atualizada",
        failure: "Falha ao atualizar a política",
      },
    },
  },
  mas_user_sessions: {
    name: "Sessão de navegador |||| Sessões de navegador",
    fields: {
      user_id: "ID de utilizador",
      created_at: "Criado em",
      finished_at: "Terminado em",
      user_agent: "Agente de utilizador",
      last_active_at: "Última atividade",
      last_active_ip: "Último IP",
      active: "Ativo",
    },
    action: {
      finish: {
        label: "Terminar",
        title: "Terminar esta sessão?",
        content: "Isto irá terminar a sessão de navegador.",
        success: "Sessão terminada",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "Ligação OAuth upstream |||| Ligações OAuth upstream",
    fields: {
      user_id: "ID de utilizador",
      provider_id: "ID do fornecedor",
      subject: "Assunto",
      human_account_name: "Nome da conta",
      created_at: "Criado em",
    },
    helper: {
      provider_id: "O ID do fornecedor OAuth upstream. Pode encontrá-lo na lista de Fornecedores OAuth upstream.",
    },
    action: {
      remove: {
        label: "Remover",
        title: "Remover ligação OAuth?",
        content: "Isto irá remover a ligação OAuth upstream deste utilizador.",
        success: "Ligação OAuth removida",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "Fornecedor OAuth |||| Fornecedores OAuth",
    fields: {
      issuer: "Emissor",
      human_name: "Nome",
      brand_name: "Marca",
      created_at: "Criado em",
      disabled_at: "Desativado em",
      enabled: "Ativado",
    },
  },
  mas_personal_sessions: {
    name: "Sessão pessoal |||| Sessões pessoais",
    empty: "Sem sessões pessoais",
    fields: {
      owner_user_id: "ID do utilizador proprietário",
      actor_user_id: "Utilizador",
      human_name: "Nome",
      scope: "Âmbito",
      created_at: "Criado em",
      revoked_at: "Revogado em",
      last_active_at: "Última atividade",
      last_active_ip: "Último IP",
      expires_at: "Expira em",
      expires_in: "Expira em (segundos)",
      active: "Ativo",
    },
    helper: {
      expires_in: "Opcional. Número de segundos até o token expirar. Deixe em branco para sem expiração.",
    },
    action: {
      revoke: {
        label: "Revogar",
        title: "Revogar sessão?",
        content: "Isto irá revogar o token de acesso pessoal.",
        success: "Sessão revogada",
      },
      create: {
        token_title: "Token de acesso pessoal",
        token_content: "Copie este token agora — não será mostrado novamente.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "Ativo",
      finished: "Terminado",
      revoked: "Revogado",
    },
  },
};

export default mas;
