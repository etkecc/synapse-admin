const misc_resources = {
  scheduled_tasks: {
    name: "Tâche planifiée |||| Tâches planifiées",
    fields: {
      id: "ID",
      action: "Action",
      status: "Statut",
      timestamp: "Horodatage",
      resource_id: "ID de ressource",
      result: "Résultat",
      error: "Erreur",
      max_timestamp: "Avant la date",
    },
    status: {
      scheduled: "Planifiée",
      active: "Active",
      complete: "Terminée",
      cancelled: "Annulée",
      failed: "Échouée",
    },
  },
  connections: {
    name: "Connexions",
    fields: {
      last_seen: "Date",
      ip: "Adresse IP",
      user_agent: "Agent utilisateur",
    },
  },
  devices: {
    name: "Appareil |||| Appareils",
    fields: {
      device_id: "Identifiant de l'appareil",
      display_name: "Nom de l'appareil",
      last_seen_ts: "Date",
      last_seen_ip: "Adresse IP",
      last_seen_user_agent: "Agent utilisateur",
      dehydrated: "Déshydraté",
    },
    action: {
      erase: {
        title: "Suppression de %{id}",
        title_bulk: "Suppression de %{smart_count} appareil |||| Suppression de %{smart_count} appareils",
        content: "Voulez-vous vraiment supprimer l'appareil « %{name} » ?",
        content_bulk:
          "Voulez-vous vraiment supprimer %{smart_count} appareil ? |||| Voulez-vous vraiment supprimer %{smart_count} appareils ?",
        success: "Appareil supprimé avec succès",
        failure: "Une erreur s'est produite",
      },
      display_name: {
        success: "Nom de l'appareil mis à jour",
        failure: "Échec de la mise à jour du nom de l'appareil",
      },
      create: {
        label: "Créer un appareil",
        title: "Créer un nouvel appareil",
        success: "Appareil créé",
        failure: "Échec de la création de l'appareil",
      },
    },
  },
  users_media: {
    name: "Media",
    fields: {
      media_id: "Identifiant du média",
      media_length: "Taille du fichier (en octets)",
      media_type: "Type",
      upload_name: "Nom du fichier",
      quarantined_by: "Mis en quarantaine par",
      safe_from_quarantine: "Protection contre la mise en quarantaine",
      created_ts: "Date de création",
      last_access_ts: "Dernier accès",
    },
    action: {
      open: "Ouvrir le fichier média dans une nouvelle fenêtre",
    },
  },
  protect_media: {
    action: {
      create: "Protéger",
      delete: "Déprotéger",
      none: "En quarantaine",
      send_success: "Le statut de protection a été modifié avec succès",
      send_failure: "Une erreur s'est produite",
    },
  },
  quarantine_media: {
    action: {
      name: "Quarantaine",
      create: "Quarantaine",
      delete: "Lever la quarantaine",
      none: "Protégé(e)",
      send_success: "Le statut de la quarantaine a été modifié avec succès",
      send_failure: "Une erreur s'est produite: %{error}",
    },
  },
  pushers: {
    name: "Émetteur de notifications |||| Émetteurs de notifications",
    fields: {
      app: "Application",
      app_display_name: "Nom d'affichage de l'application",
      app_id: "Identifiant de l'application",
      device_display_name: "Nom d'affichage de l'appareil",
      kind: "Type",
      lang: "Langue",
      profile_tag: "Profil",
      pushkey: "Identifiant de l'émetteur",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "Annonces du serveur",
    send: "Envoyer des « Annonces du serveur »",
    fields: {
      body: "Message",
    },
    action: {
      send: "Envoyer une annonce",
      send_success: "Annonce envoyée avec succès",
      send_failure: "Une erreur s'est produite",
    },
    helper: {
      send: "Envoie une annonce au nom du serveur aux utilisateurs sélectionnés. La fonction « Annonces du serveur » doit être activée sur le serveur.",
    },
  },
  database_room_statistics: {
    name: "Statistiques de la base de données des salons",
    fields: {
      room_id: "ID du salon",
      estimated_size: "Taille estimée",
    },
    helper: {
      info: "Affiche l'espace disque estimé utilisé par chaque salon dans la base de données Synapse. Les chiffres sont approximatifs.",
    },
  },
  user_media_statistics: {
    name: "Médias des utilisateurs",
    fields: {
      media_count: "Nombre de médias",
      media_length: "Taille des médias",
    },
  },
  forward_extremities: {
    name: "Extrémités avant",
    fields: {
      id: "Identifiant de l'événement",
      received_ts: "Date de réception",
      depth: "Profondeur",
      state_group: "Groupe d'état",
    },
  },
  room_state: {
    name: "Événements d'état",
    fields: {
      type: "Type",
      content: "Contenu",
      origin_server_ts: "Date d'envoi",
      sender: "Expéditeur",
    },
  },
  room_media: {
    name: "Médias",
    fields: {
      media_id: "Identifiant du média",
    },
    helper: {
      info: "Cette liste contient les médias qui ont été téléchargés dans le salon. Il n'est pas possible de supprimer les médias qui ont été téléversés dans des dépôts de médias externes.",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "Répertoire des salons",
    fields: {
      world_readable: "Tout utilisateur peut avoir un aperçu du salon, sans en devenir membre",
      guest_can_join: "Les visiteurs peuvent rejoindre le salon",
    },
    action: {
      title: "Supprimer un salon du répertoire |||| Supprimer %{smart_count} salons du répertoire",
      content:
        "Voulez-vous vraiment supprimer ce salon du répertoire ? |||| Voulez-vous vraiment supprimer ces %{smart_count} salons du répertoire ?",
      erase: "Supprimer du répertoire des salons",
      create: "Publier dans le répertoire des salons",
      send_success: "Salon publié avec succès",
      send_failure: "Une erreur s'est produite",
    },
  },
  destinations: {
    name: "Fédération",
    fields: {
      destination: "Destination",
      failure_ts: "Horodatage d’échec",
      retry_last_ts: "Horodatage de la dernière tentative",
      retry_interval: "Intervalle de nouvelle tentative",
      last_successful_stream_ordering: "Dernier flux réussi",
      stream_ordering: "Flux",
    },
    action: { reconnect: "Reconnecter" },
  },
  registration_tokens: {
    name: "Tokens d'inscription",
    fields: {
      token: "Token",
      valid: "Token valide",
      uses_allowed: "Nombre d'inscription autorisées",
      pending: "Nombre d'inscription en cours",
      completed: "Nombre d'inscription accomplie",
      expiry_time: "Date d'expiration",
      length: "Longueur",
      created_at: "Date de création",
      last_used_at: "Dernière utilisation",
      revoked_at: "Date de révocation",
    },
    helper: {
      length: "Longueur du token généré aléatoirement si aucun token n'est spécifié",
    },
    action: {
      revoke: {
        label: "Révoquer",
        success: "Token révoqué",
      },
      unrevoke: {
        label: "Restaurer",
        success: "Token restauré",
      },
    },
  },
};

export default misc_resources;
