import frenchMessages from "ra-language-french";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const common: Record<string, any> = {
  ...frenchMessages,
  ketesa: {
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
        sessions: "Sessions",
      },
      danger_zone: "Zone dangereuse",
    },
    rooms: {
      details: "Détails de la salle",
      tabs: {
        basic: "Informations de base",
        members: "Membres",
        detail: "Détails",
        permission: "Permissions",
        media: "Médias",
        messages: "Messages",
        hierarchy: "Hiérarchie",
      },
    },
    reports: { tabs: { basic: "Informations de base", detail: "Détails" } },
    admin_config: {
      soft_failed_events: "Événements en échec souple",
      spam_flagged_events: "Événements signalés comme spam",
      success: "Configuration administrateur mise à jour",
      failure: "Échec de la mise à jour de la configuration administrateur",
    },
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
      send_success:
        "%{smart_count} fichier média supprimé avec succès. |||| %{smart_count} fichiers média supprimés avec succès.",
      send_success_none: "Aucun fichier média ne correspondait aux critères spécifiés. Rien n'a été supprimé.",
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
      send_success:
        "%{smart_count} fichier média distant purgé avec succès. |||| %{smart_count} fichiers média distants purgés avec succès.",
      send_success_none: "Aucun fichier média distant ne correspondait aux critères spécifiés. Rien n'a été purgé.",
      send_failure: "Une erreur est survenue lors de la demande de purge des médias distants.",
    },
    helper: {
      send: "Cette API purge le cache des médias distants du disque de votre propre serveur. Cela inclut toutes les vignettes locales et les copies des médias téléchargés. Cette API n'affectera pas les médias qui ont été téléchargés dans le dépôt de médias du serveur.",
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
        invoice_not_available: "En attente",
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
        reply_placeholder: "Incluez autant de détails que possible.",
        before_contact_title: "Avant de nous contacter",
        help_pages_prompt: "Veuillez d’abord consulter nos pages d’aide :",
        services_prompt: "Nous ne fournissons que les services listés sur la page Services :",
        topics_prompt: "Nous ne pouvons aider que sur les sujets pris en charge :",
        scope_confirm_label:
          "J’ai consulté les pages d’aide et je confirme que cette demande correspond aux sujets pris en charge.",
        english_only_notice: "Le support est fourni uniquement en anglais.",
        response_time_prompt: "Réponse sous 48 heures. Besoin de délais plus rapides ? Voir :",
      },
      actions: {
        create_success: "Demande de support créée avec succès.",
        create_failure: "Échec de la création de la demande de support.",
        send_failure: "Échec de l'envoi du message.",
      },
    },
  },
};

export default common;
