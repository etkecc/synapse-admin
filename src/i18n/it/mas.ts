const mas = {
  mas_users: {
    name: "Utente MAS |||| Utenti MAS",
    fields: {
      id: "ID MAS",
      username: "Nome utente",
      admin: "Admin",
      locked: "Bloccato",
      deactivated: "Disattivato",
      legacy_guest: "Ospite legacy",
      created_at: "Creato il",
      locked_at: "Bloccato il",
      deactivated_at: "Disattivato il",
    },
    filter: {
      status: "Stato",
      search: "Cerca",
      status_active: "Attivo",
      status_locked: "Bloccato",
      status_deactivated: "Disattivato",
    },
    action: {
      lock: { label: "Blocca", success: "Utente bloccato" },
      unlock: { label: "Sblocca", success: "Utente sbloccato" },
      deactivate: { label: "Disattiva", success: "Utente disattivato" },
      reactivate: { label: "Riattiva", success: "Utente riattivato" },
      set_admin: { label: "Concedi Admin", success: "Stato admin aggiornato" },
      remove_admin: { label: "Rimuovi Admin", success: "Stato admin aggiornato" },
      set_password: {
        label: "Imposta password",
        title: "Imposta password",
        success: "Password impostata",
        failure: "Impossibile impostare la password",
      },
    },
  },
  mas_user_emails: {
    name: "Email |||| Email",
    empty: "Nessuna email",
    fields: {
      email: "Email",
      user_id: "ID utente",
      created_at: "Creato il",
      actions: "Azioni",
    },
    action: {
      remove: {
        label: "Rimuovi",
        title: "Rimuovi email",
        content: "Rimuovere %{email}?",
        success: "Email rimossa",
      },
      create: { success: "Email aggiunta" },
    },
  },
  mas_compat_sessions: {
    name: "Sessione compat |||| Sessioni compat",
    empty: "Nessuna sessione compat",
    fields: {
      user_id: "ID utente",
      device_id: "ID dispositivo",
      created_at: "Creato il",
      user_agent: "User Agent",
      last_active_at: "Ultima attività",
      last_active_ip: "Ultimo IP",
      finished_at: "Terminato il",
      human_name: "Nome",
      active: "Attivo",
    },
    action: {
      finish: {
        label: "Termina",
        title: "Terminare la sessione?",
        content: "Questa azione terminerà la sessione.",
        success: "Sessione terminata",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "Sessione OAuth2 |||| Sessioni OAuth2",
    empty: "Nessuna sessione OAuth2",
    fields: {
      user_id: "ID utente",
      client_id: "ID client",
      scope: "Ambito",
      created_at: "Creato il",
      user_agent: "User Agent",
      last_active_at: "Ultima attività",
      last_active_ip: "Ultimo IP",
      finished_at: "Terminato il",
      human_name: "Nome",
      active: "Attivo",
    },
    action: {
      finish: {
        label: "Termina",
        title: "Terminare la sessione?",
        content: "Questa azione terminerà la sessione.",
        success: "Sessione terminata",
      },
    },
  },
  mas_policy_data: {
    name: "Dati policy",
    current_policy: "Policy attuale",
    no_policy: "Nessuna policy attualmente impostata.",
    set_policy: "Imposta nuova policy",
    invalid_json: "JSON non valido",
    fields: {
      json_placeholder: "Inserisci i dati della policy come JSON…",
      created_at: "Creato il",
    },
    action: {
      save: {
        label: "Imposta policy",
        success: "Policy aggiornata",
        failure: "Impossibile aggiornare la policy",
      },
    },
  },
  mas_user_sessions: {
    name: "Sessione browser |||| Sessioni browser",
    fields: {
      user_id: "ID utente",
      created_at: "Creato il",
      finished_at: "Terminato il",
      user_agent: "User Agent",
      last_active_at: "Ultima attività",
      last_active_ip: "Ultimo IP",
      active: "Attivo",
    },
    action: {
      finish: {
        label: "Termina",
        title: "Terminare la sessione?",
        content: "Questa azione terminerà la sessione del browser.",
        success: "Sessione terminata",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "Collegamento OAuth upstream |||| Collegamenti OAuth upstream",
    fields: {
      user_id: "ID utente",
      provider_id: "ID provider",
      subject: "Soggetto",
      human_account_name: "Nome account",
      created_at: "Creato il",
    },
    helper: {
      provider_id: "L'ID del provider OAuth upstream. Può trovarlo nell'elenco dei provider OAuth upstream.",
    },
    action: {
      remove: {
        label: "Rimuovi",
        title: "Rimuovere il collegamento OAuth?",
        content: "Questa azione rimuoverà il collegamento OAuth upstream per questo utente.",
        success: "Collegamento OAuth rimosso",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "Provider OAuth |||| Provider OAuth",
    fields: {
      issuer: "Emittente",
      human_name: "Nome",
      brand_name: "Marchio",
      created_at: "Creato il",
      disabled_at: "Disabilitato il",
      enabled: "Abilitato",
    },
  },
  mas_personal_sessions: {
    name: "Sessione personale |||| Sessioni personali",
    empty: "Nessuna sessione personale",
    fields: {
      owner_user_id: "ID utente proprietario",
      actor_user_id: "Utente",
      human_name: "Nome",
      scope: "Ambito",
      created_at: "Creato il",
      revoked_at: "Revocato il",
      last_active_at: "Ultima attività",
      last_active_ip: "Ultimo IP",
      expires_at: "Scade il",
      expires_in: "Scade tra (secondi)",
      active: "Attivo",
    },
    helper: {
      expires_in: "Facoltativo. Numero di secondi prima della scadenza del token. Lasci vuoto per nessuna scadenza.",
    },
    action: {
      revoke: {
        label: "Revoca",
        title: "Revocare la sessione?",
        content: "Questa azione revocherà il token di accesso personale.",
        success: "Sessione revocata",
      },
      create: {
        token_title: "Token di accesso personale",
        token_content: "Copia questo token adesso — non verrà mostrato di nuovo.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "Attiva",
      finished: "Terminata",
      revoked: "Revocata",
    },
  },
};

export default mas;
