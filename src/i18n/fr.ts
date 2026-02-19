import frenchMessages from "ra-language-french";

import { SynapseTranslationMessages } from ".";

const fr: SynapseTranslationMessages = {
  ...frenchMessages,
  synapseadmin: {
    auth: {
      base_url: "URL du serveur d’accueil",
      welcome: "Bienvenue sur %{name}",
      server_version: "Version du serveur Synapse",
      username_error: "Veuillez entrer un nom d'utilisateur complet : « @utilisateur:domaine »",
      protocol_error: "L'URL doit commencer par « http:// » ou « https:// »",
      url_error: "L'URL du serveur Matrix n'est pas valide",
      sso_sign_in: "Se connecter avec l'authentification unique",
      credentials: "Identifiants",
      access_token: "Jeton d'accès",
      supports_specs: "prend en charge les spécifications Matrix",
      logout_acces_token_dialog: {
        title: "Vous utilisez un jeton d'accès Matrix existant.",
        content:
          "Voulez-vous détruire cette session (qui pourrait être utilisée ailleurs, par exemple dans un client Matrix) ou simplement vous déconnecter du panneau d'administration?",
        confirm: "Détruire la session",
        cancel: "Se déconnecter simplement du panneau d'administration",
      },
    },
    users: {
      invalid_user_id: "Partie locale d'un identifiant utilisateur Matrix sans le nom du serveur d’accueil.",
      tabs: {
        sso: "Authentification unique",
        experimental: "Expérimental",
        limits: "Limites",
        account_data: "Données du compte",
      },
    },
    rooms: {
      details: "Détails de la salle",
      tabs: {
        basic: "Informations de base",
        members: "Membres",
        detail: "Détails",
        permission: "Permissions",
        media: "Médias",
      },
    },
    reports: { tabs: { basic: "Informations de base", detail: "Détails" } },
  },
  import_users: {
    error: {
      at_entry: "Pour l'entrée %{entry} : %{message}",
      error: "Erreur",
      required_field: "Le champ requis « %{field} » est manquant",
      invalid_value:
        "Valeur non valide à la ligne %{row}. Le champ « %{field} » ne peut être que « true » ou « false »",
      unreasonably_big: "Refus de charger un fichier trop volumineux de %{size} mégaoctets",
      already_in_progress: "Un import est déjà en cours",
      id_exits: "L'identifiant %{id} déjà présent",
    },
    title: "Importer des utilisateurs à partir d'un fichier CSV",
    goToPdf: "Voir le PDF",
    cards: {
      importstats: {
        header: "Utilisateurs analysés pour l'import",
        users_total:
          "%{smart_count} utilisateur dans le fichier CSV |||| %{smart_count} utilisateurs dans le fichier CSV",
        guest_count: "%{smart_count} visiteur |||| %{smart_count} visiteurs",
        admin_count: "%{smart_count} administrateur |||| %{smart_count} administrateurs",
      },
      conflicts: {
        header: "Stratégie de résolution des conflits",
        mode: {
          stop: "S'arrêter en cas de conflit",
          skip: "Afficher l'erreur et ignorer le conflit",
        },
      },
      ids: {
        header: "Identifiants",
        all_ids_present: "Identifiants présents pour chaque entrée",
        count_ids_present: "%{smart_count} entrée avec identifiant |||| %{smart_count} entrées avec identifiant",
        mode: {
          ignore: "Ignorer les identifiants dans le ficher CSV et en créer de nouveaux",
          update: "Mettre à jour les enregistrements existants",
        },
      },
      passwords: {
        header: "Mots de passe",
        all_passwords_present: "Mots de passe présents pour chaque entrée",
        count_passwords_present:
          "%{smart_count} entrée avec mot de passe |||| %{smart_count} entrées avec mot de passe",
        use_passwords: "Utiliser les mots de passe provenant du fichier CSV",
      },
      upload: {
        header: "Fichier CSV en entrée",
        explanation:
          "Vous pouvez télécharger ici un fichier contenant des valeurs séparées par des virgules qui sera traité pour créer ou mettre à jour des utilisateurs. Le fichier doit inclure les champs « id » et « displayname ». Vous pouvez télécharger et adapter un fichier d'exemple ici : ",
      },
      startImport: {
        simulate_only: "Simuler",
        run_import: "Importer",
      },
      results: {
        header: "Résultats de l'import",
        total: "%{smart_count} entrée au total |||| %{smart_count} entrées au total",
        successful: "%{smart_count} entrées importées avec succès",
        skipped: "%{smart_count} entrées ignorées",
        download_skipped: "Télécharger les entrées ignorées",
        with_error: "%{smart_count} entrée avec des erreurs ||| %{smart_count} entrées avec des erreurs",
        simulated_only: "L'import était simulé",
      },
    },
  },
  delete_media: {
    name: "Media",
    fields: {
      before_ts: "Dernier accès avant",
      size_gt: "Plus grand que (en octets)",
      keep_profiles: "Conserver les images de profil",
    },
    action: {
      send: "Supprimer le média",
      send_success: "Requête envoyée avec succès",
      send_failure: "Une erreur s'est produite",
    },
    helper: {
      send: "Cette API supprime les médias locaux du disque de votre propre serveur. Cela inclut toutes les vignettes locales et les copies des médias téléchargés. Cette API n'affectera pas les médias qui ont été téléversés dans des dépôts de médias externes.",
    },
  },
  purge_remote_media: {
    name: "Médias distants",
    fields: {
      before_ts: "dernier accès avant",
    },
    action: {
      send: "Purger les médias distants",
      send_success: "La demande de purge des médias distants a été envoyée.",
      send_failure: "Une erreur est survenue lors de la demande de purge des médias distants.",
    },
    helper: {
      send: "Cette API purge le cache des médias distants du disque de votre propre serveur. Cela inclut toutes les vignettes locales et les copies des médias téléchargés. Cette API n'affectera pas les médias qui ont été téléchargés dans le dépôt de médias du serveur.",
    },
  },
  resources: {
    users: {
      name: "Utilisateur |||| Utilisateurs",
      email: "Adresse électronique",
      msisdn: "Numéro de téléphone",
      threepid: "Adresse électronique / Numéro de téléphone",
      membership: "Adhésion |||| Adhésions",
      fields: {
        avatar: "Avatar",
        id: "Identifiant",
        name: "Nom",
        is_guest: "Visiteur",
        admin: "Administrateur du serveur",
        locked: "Verrouillé",
        suspended: "Suspendu",
        deactivated: "Désactivé",
        show_guests: "Afficher les visiteurs",
        show_deactivated: "Afficher les utilisateurs désactivés",
        show_locked: "Afficher les utilisateurs verrouillés",
        show_suspended: "Afficher les utilisateurs suspendus",
        user_id: "Rechercher un utilisateur",
        displayname: "Nom d'affichage",
        password: "Mot de passe",
        avatar_url: "URL de l'avatar",
        avatar_src: "Avatar",
        medium: "Type",
        threepids: "Identifiants tiers",
        address: "Adresse",
        creation_ts_ms: "Date de création",
        consent_version: "Version du consentement",
        auth_provider: "Fournisseur d'identité",
        user_type: "Type d'utilisateur",
        erased: "Effacé (RGPD)",
      },
      helper: {
        password: "Changer le mot de passe déconnectera l'utilisateur de toutes les sessions.",
        password_required_for_reactivation: "Vous devez fournir un mot de passe pour réactiver le compte.",
        create_password: "Générer un mot de passe fort et sécurisé en utilisant le bouton ci-dessous.",
        deactivate: "Vous devrez fournir un mot de passe pour réactiver le compte.",
        suspend: "L'utilisateur sera suspendu jusqu'à ce que vous le réactiviez.",
        erase: "Marquer l'utilisateur comme effacé conformément au RGPD",
        admin: "Un administrateur de serveur a un contrôle total sur le serveur et ses utilisateurs.",
        lock: "Empêche l'utilisateur d'utiliser le serveur. C'est une action non destructive qui peut être annulée.",
        erase_text:
          "Cela signifie que les messages envoyés par le(s) utilisateur(s) seront toujours visibles par toute personne qui se trouvait dans la salle au moment où ces messages ont été envoyés, mais qu'ils seront cachés aux utilisateurs qui rejoindront la salle par la suite.",
        erase_admin_error: "La suppression de son propre utilisateur n'est pas autorisée.",
        modify_managed_user_error: "La modification d'un utilisateur géré par le système n'est pas autorisée.",
        username_available: "Nom d'utilisateur disponible",
      },
      badge: {
        you: "Vous",
        bot: "Bot",
        admin: "Admin",
        support: "Support",
        regular: "Utilisateur régulier",
        federated: "Fédéré",
        system_managed: "Géré par le système",
      },
      action: {
        erase: "Effacer les données de l'utilisateur",
        erase_avatar: "Effacer l'avatar",
        delete_media: "Supprimer tous les médias téléchargés par le(s) utilisateur(s)",
        redact_events: "Expurger tous les événements envoyés par l'utilisateur(-s)",
        generate_password: "Générer un mot de passe",
        overwrite_title: "Attention !",
        overwrite_content:
          "Ce nom d'utilisateur est déjà pris. Êtes-vous sûr de vouloir écraser l'utilisateur existant ?",
        overwrite_cancel: "Annuler",
        overwrite_confirm: "Écraser",
      },
      limits: {
        messages_per_second: "Messages par seconde",
        messages_per_second_text: "Le nombre d'actions que l'utilisateur peut effectuer par seconde.",
        burst_count: "Compteur de pics",
        burst_count_text: "Le nombre d'actions que l'utilisateur peut effectuer avant d'être limité.",
      },
      account_data: {
        title: "Données du compte",
        global: "Globales",
        rooms: "Salons",
      },
    },
    rooms: {
      name: "Salon |||| Salons",
      fields: {
        room_id: "Identifiant du salon",
        name: "Nom",
        canonical_alias: "Alias",
        joined_members: "Membres",
        joined_local_members: "Membres locaux",
        joined_local_devices: "Appareils locaux",
        state_events: "Événements d'État / Complexité",
        version: "Version",
        is_encrypted: "Chiffré",
        encryption: "Chiffrement",
        federatable: "Fédérable",
        public: "Visible dans le répertoire des salons",
        creator: "Créateur",
        join_rules: "Règles d'adhésion",
        guest_access: "Accès des visiteurs",
        history_visibility: "Visibilité de l'historique",
        topic: "Sujet",
        avatar: "Avatar",
        actions: "Actions",
      },
      filter: {
        public_rooms: "Salons publics",
        empty_rooms: "Salons vides",
      },
      helper: {
        forward_extremities:
          "Les extrémités avant sont les événements feuilles à la fin d'un graphe orienté acyclique (DAG) dans un salon, c'est-à-dire les événements qui n'ont pas de descendants. Plus il y en a dans un salon, plus la résolution d'état que Synapse doit effectuer est importante (indice : c'est une opération coûteuse). Bien que Synapse dispose d'un algorithme pour éviter qu'un trop grand nombre de ces événements n'existent en même temps dans un salon, des bogues peuvent parfois les faire réapparaître. Si un salon présente plus de 10 extrémités avant, cela vaut la peine d'y prêter attention et éventuellement de les supprimer en utilisant les requêtes SQL mentionnées dans la discussion traitant du problème https://github.com/matrix-org/synapse/issues/1760.",
      },
      enums: {
        join_rules: {
          public: "Public",
          knock: "Sur demande",
          invite: "Sur invitation",
          private: "Privé",
        },
        guest_access: {
          can_join: "Les visiteurs peuvent rejoindre le salon",
          forbidden: "Les visiteurs ne peuvent pas rejoindre le salon",
        },
        history_visibility: {
          invited: "Depuis l'invitation",
          joined: "Depuis l'adhésion",
          shared: "Depuis le partage",
          world_readable: "Tout le monde",
        },
        unencrypted: "Non chiffré",
      },
      action: {
        erase: {
          title: "Supprimer le salon",
          content:
            "Voulez-vous vraiment supprimer le salon ? Cette opération ne peut être annulée. Tous les messages et médias partagés du salon seront supprimés du serveur !",
          fields: {
            block: "Bloquer et empêcher les utilisateurs de rejoindre la salle",
          },
          success: "Salle/s supprimées avec succès.",
          failure: "La/les salle/s n'ont pas pu être supprimées.",
        },
        make_admin: {
          assign_admin: "Assigner un administrateur",
          title: "Assigner un administrateur au salon %{roomName}",
          confirm: "Assigner un administrateur",
          content:
            "Entrez la MXID complète de l'utilisateur qui sera désigné comme administrateur.\nAttention : pour que cela fonctionne, la salle doit avoir au moins un membre local en tant qu'administrateur.",
          success: "L'utilisateur a été désigné comme administrateur de la salle.",
          failure: "L'utilisateur n'a pas pu être désigné comme administrateur de la salle. %{errMsg}",
        },
      },
    },
    reports: {
      name: "Événement signalé |||| Événements signalés",
      fields: {
        id: "Identifiant",
        received_ts: "Date du rapport",
        user_id: "Rapporteur",
        name: "Nom du salon",
        score: "Score",
        reason: "Motif",
        event_id: "Identifiant de l'événement",
        event_json: {
          origin: "Serveur d'origine",
          origin_server_ts: "Date d'envoi",
          type: "Type d'événement",
          content: {
            msgtype: "Type de contenu",
            body: "Contenu",
            format: "Format",
            formatted_body: "Contenu mis en forme",
            algorithm: "Algorithme",
            url: "URL",
            info: {
              mimetype: "Type",
            },
          },
        },
      },
      action: {
        erase: {
          title: "Supprimer l’événement signalé",
          content: "Voulez-vous vraiment supprimer l’événement signalé ? Cette action est irréversible.",
        },
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
      },
      action: {
        erase: {
          title: "Suppression de %{id}",
          content: "Voulez-vous vraiment supprimer l'appareil « %{name} » ?",
          success: "Appareil supprimé avec succès",
          failure: "Une erreur s'est produite",
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
        delete: "Révoquer la protection",
        none: "En quarantaine",
        send_success: "Le statut de protection a été modifié avec succès",
        send_failure: "Une erreur s'est produite",
      },
    },
    quarantine_media: {
      action: {
        name: "Quarantaine",
        create: "Mettre en quarantaine",
        delete: "Révoquer la mise en quarantaine",
        none: "Protégé contre la mise en quarantaine",
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
      name: "Jetons d'inscription",
      fields: {
        token: "Jeton",
        valid: "Jeton valide",
        uses_allowed: "Nombre d'inscription autorisées",
        pending: "Nombre d'inscription en cours",
        completed: "Nombre d'inscription accomplie",
        expiry_time: "Date d'expiration",
        length: "Longueur",
      },
      helper: {
        length: "Longueur du jeton généré aléatoirement si aucun jeton n'est pas spécifié",
      },
    },
  },
  etkecc: {
    billing: {
      name: "Facturation",
      title: "Historique des paiements",
      no_payments: "Aucun paiement trouvé.",
      no_payments_helper: "Si vous pensez qu’il s’agit d’une erreur, veuillez contacter le support etke.cc à l’adresse",
      description1:
        "Vous pouvez consulter les paiements et générer des factures ici. Pour en savoir plus sur la gestion des abonnements, rendez-vous sur",
      description2:
        "Si vous souhaitez modifier votre e-mail de facturation ou ajouter des informations d’entreprise, veuillez contacter le support etke.cc à l’adresse",
      fields: {
        transaction_id: "ID de transaction",
        email: "E-mail",
        type: "Type",
        amount: "Montant",
        paid_at: "Payé le",
        invoice: "Facture",
      },
      enums: {
        type: {
          subscription: "Abonnement",
          one_time: "Paiement unique",
        },
      },
      helper: {
        download_invoice: "Télécharger la facture",
        downloading: "Téléchargement...",
        download_started: "Le téléchargement de la facture a commencé.",
        loading: "Chargement des informations de facturation...",
        loading_failed1: "Un problème est survenu lors du chargement des informations de facturation.",
        loading_failed2: "Veuillez réessayer plus tard.",
        loading_failed3: "Si le problème persiste, veuillez contacter le support etke.cc à l’adresse",
        loading_failed4: "avec le message d’erreur suivant :",
      },
    },
    status: {
      name: "État du serveur",
      badge: {
        default: "Cliquer pour voir l’état du serveur",
        running: "En cours d’exécution : %{command}. %{text}",
      },
      category: {
        "Host Metrics": "Métriques de l’hôte",
        Network: "Réseau",
        HTTP: "HTTP",
        Matrix: "Matrix",
      },
      status: "État",
      error: "Erreur",
      loading: "Récupération de l’état de santé du serveur en temps réel... Un instant !",
      intro1: "Ceci est un rapport de surveillance en temps réel de votre serveur. Vous pouvez en savoir plus sur",
      intro2: "Si l’une des vérifications ci-dessous vous inquiète, consultez les actions recommandées sur",
      help: "Aide",
    },
    maintenance: {
      title: "Le système est actuellement en mode maintenance.",
      try_again: "Veuillez réessayer plus tard.",
      note: "Vous n’avez pas besoin de contacter le support à ce sujet : nous nous en occupons déjà !",
    },
    actions: {
      name: "Commandes serveur",
      available_title: "Commandes disponibles",
      available_description: "Les commandes suivantes peuvent être exécutées.",
      available_help_intro: "Vous trouverez plus de détails sur chacune d’elles sur",
      scheduled_title: "Commandes planifiées",
      scheduled_description:
        "Les commandes suivantes sont planifiées pour s’exécuter à des moments précis. Vous pouvez voir les détails et les modifier si nécessaire.",
      recurring_title: "Commandes récurrentes",
      recurring_description:
        "Les commandes suivantes sont configurées pour s’exécuter chaque semaine à un jour et une heure précis. Vous pouvez voir les détails et les modifier si nécessaire.",
      scheduled_help_intro: "Vous trouverez plus de détails sur ce mode sur",
      recurring_help_intro: "Vous trouverez plus de détails sur ce mode sur",
      maintenance_title: "Le système est actuellement en mode maintenance.",
      maintenance_try_again: "Veuillez réessayer plus tard.",
      maintenance_note: "Vous n’avez pas besoin de contacter le support à ce sujet : nous nous en occupons déjà !",
      maintenance_commands_blocked:
        "Les commandes ne peuvent pas être exécutées tant que le mode maintenance n’est pas désactivé.",
      table: {
        command: "Commande",
        description: "Description",
        arguments: "Arguments",
        is_recurring: "Récurrente ?",
        run_at: "Exécuter (heure locale)",
        next_run_at: "Prochaine exécution (heure locale)",
        time_utc: "Heure (UTC)",
        time_local: "Heure (locale)",
      },
      buttons: {
        create: "Créer",
        update: "Mettre à jour",
        back: "Retour",
        delete: "Supprimer",
        run: "Exécuter",
      },
      command_scheduled: "Commande planifiée : %{command}",
      command_scheduled_args: "avec des arguments supplémentaires : %{args}",
      expect_prefix: "Attendez le résultat dans la page",
      expect_suffix: "bientôt.",
      notifications_link: "Notifications",
      command_help_title: "Aide %{command}",
      scheduled_title_create: "Créer une commande planifiée",
      scheduled_title_edit: "Modifier la commande planifiée",
      recurring_title_create: "Créer une commande récurrente",
      recurring_title_edit: "Modifier la commande récurrente",
      scheduled_details_title: "Détails de la commande planifiée",
      recurring_warning:
        "Les commandes planifiées créées à partir d’une commande récurrente ne sont pas modifiables, car elles seront régénérées automatiquement. Veuillez modifier la commande récurrente à la place.",
      command_details_intro: "Vous trouverez plus de détails sur la commande sur",
      form: {
        id: "ID",
        command: "Commande",
        scheduled_at: "Planifiée pour",
        day_of_week: "Jour de la semaine",
      },
      delete_scheduled_title: "Supprimer la commande planifiée",
      delete_recurring_title: "Supprimer la commande récurrente",
      delete_confirm: "Êtes-vous sûr de vouloir supprimer la commande : %{command} ?",
      errors: {
        unknown: "Une erreur inconnue s’est produite",
        delete_failed: "Erreur : %{error}",
      },
      days: {
        monday: "Lundi",
        tuesday: "Mardi",
        wednesday: "Mercredi",
        thursday: "Jeudi",
        friday: "Vendredi",
        saturday: "Samedi",
        sunday: "Dimanche",
      },
      scheduled: {
        action: {
          create_success: "Commande planifiée créée avec succès",
          update_success: "Commande planifiée mise à jour avec succès",
          update_failure: "Une erreur est survenue",
          delete_success: "Commande planifiée supprimée avec succès",
          delete_failure: "Une erreur est survenue",
        },
      },
      recurring: {
        action: {
          create_success: "Commande récurrente créée avec succès",
          update_success: "Commande récurrente mise à jour avec succès",
          update_failure: "Une erreur est survenue",
          delete_success: "Commande récurrente supprimée avec succès",
          delete_failure: "Une erreur est survenue",
        },
      },
    },
    notifications: {
      title: "Notifications",
      new_notifications: "%{smart_count} nouvelle notification |||| %{smart_count} nouvelles notifications",
      no_notifications: "Aucune notification pour le moment",
      see_all: "Voir toutes les notifications",
      clear_all: "Tout effacer",
      ago: "il y a",
    },
    currently_running: {
      command: "En cours d’exécution :",
      started_ago: "(démarré il y a %{time})",
    },
    time: {
      less_than_minute: "quelques secondes",
      minutes: "%{smart_count} minute |||| %{smart_count} minutes",
      hours: "%{smart_count} heure |||| %{smart_count} heures",
      days: "%{smart_count} jour |||| %{smart_count} jours",
      weeks: "%{smart_count} semaine |||| %{smart_count} semaines",
      months: "%{smart_count} mois |||| %{smart_count} mois",
    },
    support: {
      name: "Support",
      menu_label: "Contacter le support",
      description:
        "Ouvrez une demande de support ou faites un suivi d'une demande existante. Notre équipe répondra dans les plus brefs délais.",
      create_title: "Nouvelle demande de support",
      no_requests: "Aucune demande de support pour l'instant.",
      no_messages: "Aucun message pour l'instant.",
      closed_message: "Cette demande est clôturée. Si vous avez toujours un problème, veuillez en ouvrir une nouvelle.",
      fields: {
        subject: "Sujet",
        message: "Message",
        reply: "Réponse",
        status: "Statut",
        created_at: "Créé",
        updated_at: "Dernière mise à jour",
      },
      status: {
        active: "En attente de l'opérateur",
        open: "Ouvert",
        closed: "Fermé",
        pending: "En attente de votre réponse",
      },
      buttons: {
        new_request: "Nouvelle demande",
        submit: "Soumettre",
        cancel: "Annuler",
        send: "Envoyer",
        back: "Retour au support",
      },
      helper: {
        loading: "Chargement des demandes de support...",
        reply_hint: "Ctrl+Entrée pour envoyer",
        reply_placeholder:
          "Incluez autant de détails que possible. Les délais de réponse dépendent de votre plan de support.",
      },
      actions: {
        create_success: "Demande de support créée avec succès.",
        create_failure: "Échec de la création de la demande de support.",
        send_failure: "Échec de l'envoi du message.",
      },
    },
  },
};
export default fr;
