const mas = {
  mas_users: {
    name: "Utilisateur MAS |||| Utilisateurs MAS",
    fields: {
      id: "ID MAS",
      username: "Nom d'utilisateur",
      admin: "Administrateur",
      locked: "Verrouillé",
      deactivated: "Désactivé",
      legacy_guest: "Invité hérité",
      created_at: "Créé le",
      locked_at: "Verrouillé le",
      deactivated_at: "Désactivé le",
    },
    filter: {
      status: "Statut",
      search: "Rechercher",
      status_active: "Actif",
      status_locked: "Verrouillé",
      status_deactivated: "Désactivé",
    },
    action: {
      lock: { label: "Verrouiller", success: "Utilisateur verrouillé" },
      unlock: { label: "Déverrouiller", success: "Utilisateur déverrouillé" },
      deactivate: { label: "Désactiver", success: "Utilisateur désactivé" },
      reactivate: { label: "Réactiver", success: "Utilisateur réactivé" },
      set_admin: { label: "Accorder l'admin", success: "Statut admin mis à jour" },
      remove_admin: { label: "Révoquer l'admin", success: "Statut admin mis à jour" },
      set_password: {
        label: "Définir le mot de passe",
        title: "Définir le mot de passe",
        success: "Mot de passe défini",
        failure: "Échec de la définition du mot de passe",
      },
    },
  },
  mas_user_emails: {
    name: "E-mail |||| E-mails",
    empty: "Aucun e-mail",
    fields: {
      email: "E-mail",
      user_id: "ID utilisateur",
      created_at: "Créé le",
      actions: "Actions",
    },
    action: {
      remove: {
        label: "Supprimer",
        title: "Supprimer l'e-mail",
        content: "Supprimer %{email} ?",
        success: "E-mail supprimé",
      },
      create: { success: "E-mail ajouté" },
    },
  },
  mas_compat_sessions: {
    name: "Session compat |||| Sessions compat",
    empty: "Aucune session compat",
    fields: {
      user_id: "ID utilisateur",
      device_id: "ID appareil",
      created_at: "Créé le",
      user_agent: "Agent utilisateur",
      last_active_at: "Dernière activité",
      last_active_ip: "Dernière IP",
      finished_at: "Terminé le",
      human_name: "Nom",
      active: "Active",
    },
    action: {
      finish: {
        label: "Terminer",
        title: "Terminer la session ?",
        content: "Cette session sera terminée.",
        success: "Session terminée",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "Session OAuth2 |||| Sessions OAuth2",
    empty: "Aucune session OAuth2",
    fields: {
      user_id: "ID utilisateur",
      client_id: "ID client",
      scope: "Portée",
      created_at: "Créé le",
      user_agent: "Agent utilisateur",
      last_active_at: "Dernière activité",
      last_active_ip: "Dernière IP",
      finished_at: "Terminé le",
      human_name: "Nom",
      active: "Active",
    },
    action: {
      finish: {
        label: "Terminer",
        title: "Terminer la session ?",
        content: "Cette session sera terminée.",
        success: "Session terminée",
      },
    },
  },
  mas_policy_data: {
    name: "Données de politique",
    current_policy: "Politique actuelle",
    no_policy: "Aucune politique n'est actuellement définie.",
    set_policy: "Définir une nouvelle politique",
    invalid_json: "JSON invalide",
    fields: {
      json_placeholder: "Saisir les données de politique en JSON…",
      created_at: "Créé le",
    },
    action: {
      save: {
        label: "Définir la politique",
        success: "Politique mise à jour",
        failure: "Échec de la mise à jour de la politique",
      },
    },
  },
  mas_user_sessions: {
    name: "Session navigateur |||| Sessions navigateur",
    fields: {
      user_id: "ID utilisateur",
      created_at: "Créé le",
      finished_at: "Terminé le",
      user_agent: "Agent utilisateur",
      last_active_at: "Dernière activité",
      last_active_ip: "Dernière IP",
      active: "Active",
    },
    action: {
      finish: {
        label: "Terminer",
        title: "Terminer la session ?",
        content: "Cette session navigateur sera terminée.",
        success: "Session terminée",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "Lien OAuth amont |||| Liens OAuth amont",
    fields: {
      user_id: "ID utilisateur",
      provider_id: "ID fournisseur",
      subject: "Sujet",
      human_account_name: "Nom du compte",
      created_at: "Créé le",
    },
    helper: {
      provider_id: "L'ID du fournisseur OAuth amont. Trouvez-le dans la liste des fournisseurs OAuth amont.",
    },
    action: {
      remove: {
        label: "Supprimer",
        title: "Supprimer le lien OAuth ?",
        content: "Le lien OAuth amont de cet utilisateur sera supprimé.",
        success: "Lien OAuth supprimé",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "Fournisseur OAuth |||| Fournisseurs OAuth",
    fields: {
      issuer: "Émetteur",
      human_name: "Nom",
      brand_name: "Marque",
      created_at: "Créé le",
      disabled_at: "Désactivé le",
      enabled: "Actif",
    },
  },
  mas_personal_sessions: {
    name: "Session personnelle |||| Sessions personnelles",
    empty: "Aucune session personnelle",
    fields: {
      owner_user_id: "ID propriétaire",
      actor_user_id: "Utilisateur",
      human_name: "Nom",
      scope: "Portée",
      created_at: "Créé le",
      revoked_at: "Révoqué le",
      last_active_at: "Dernière activité",
      last_active_ip: "Dernière IP",
      expires_at: "Expire le",
      expires_in: "Expire dans (secondes)",
      active: "Active",
    },
    helper: {
      expires_in: "Optionnel. Nombre de secondes avant expiration. Laisser vide pour ne pas expirer.",
    },
    action: {
      revoke: {
        label: "Révoquer",
        title: "Révoquer la session ?",
        content: "Le jeton d'accès sera révoqué définitivement.",
        success: "Session révoquée",
      },
      create: {
        token_title: "Jeton d'accès créé",
        token_content: "Copiez ce jeton. Il ne sera plus affiché après la fermeture de cette fenêtre.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "Active",
      finished: "Terminée",
      revoked: "Révoquée",
    },
  },
};

export default mas;
