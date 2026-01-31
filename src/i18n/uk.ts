import ukrainianMessages from "ra-language-ukrainian";

import { SynapseTranslationMessages } from ".";

const uk: SynapseTranslationMessages = {
  ...ukrainianMessages,
  synapseadmin: {
    auth: {
      base_url: "URL домашнього сервера",
      welcome: "Ласкаво просимо до %{name}",
      server_version: "Версія Synapse",
      supports_specs: "supports Matrix specs",
      username_error: "Будь ласка, введіть повний ідентифікатор користувача: '@user:domain'",
      protocol_error: "URL повинен починатися з 'http://' або 'https://'",
      url_error: "Недійсна URL-адреса сервера Matrix",
      sso_sign_in: "Вхід через SSO",
      credentials: "Облікові дані",
      access_token: "Токен доступу",
      logout_acces_token_dialog: {
        title: "Ви використовуєте існуючий токен доступу Matrix.",
        content:
          "Ви бажаєте знищити цю сесію (яка може використовуватися деінде, наприклад, у клієнті Matrix) чи просто вийти з панелі адміністратора?",
        confirm: "Знищити сесію",
        cancel: "Просто выйти из панели администрирования",
      },
    },
    users: {
      invalid_user_id: "Локальна частина ID користувача Matrix без адреси домашнього сервера.",
      tabs: {
        sso: "SSO",
        experimental: "Експериментально",
        limits: "Обмеження",
        account_data: "Дані облікового запису",
      },
    },
    rooms: {
      details: "Деталі кімнати",
      tabs: {
        basic: "Основні",
        members: "Учасники",
        detail: "Детально",
        permission: "Дозволи",
        media: "Медіа",
      },
    },
    reports: { tabs: { basic: "Основні", detail: "Детально" } },
  },
  import_users: {
    error: {
      at_entry: "At entry %{entry}: %{message}",
      error: "Помилка",
      required_field: "Required field '%{field}' is not present",
      invalid_value: "Invalid value on line %{row}. '%{field}' field may only be 'true' or 'false'",
      unreasonably_big: "Refused to load unreasonably big file of %{size} megabytes",
      already_in_progress: "An import run is already in progress",
      id_exits: "ID %{id} already present",
    },
    title: "Імпорт користувачів через CSV",
    goToPdf: "Go to PDF",
    cards: {
      importstats: {
        header: "Імпорт користувачів",
        users_total: "%{smart_count} user in CSV file |||| %{smart_count} users in CSV file",
        guest_count: "%{smart_count} guest |||| %{smart_count} guests",
        admin_count: "%{smart_count} admin |||| %{smart_count} admins",
      },
      conflicts: {
        header: "Conflict strategy",
        mode: {
          stop: "Stop on conflict",
          skip: "Show error and skip on conflict",
        },
      },
      ids: {
        header: "IDs",
        all_ids_present: "IDs present on every entry",
        count_ids_present: "%{smart_count} entry with ID |||| %{smart_count} entries with IDs",
        mode: {
          ignore: "Ignore IDs in CSV and create new ones",
          update: "Update existing records",
        },
      },
      passwords: {
        header: "Паролі",
        all_passwords_present: "Passwords present on every entry",
        count_passwords_present: "%{smart_count} entry with password |||| %{smart_count} entries with passwords",
        use_passwords: "Use passwords from CSV",
      },
      upload: {
        header: "Input CSV file",
        explanation:
          "Here you can upload a file with comma separated values that is processed to create or update users. The file must include the fields 'id' and 'displayname'. You can download and adapt an example file here: ",
      },
      startImport: {
        simulate_only: "Simulate only",
        run_import: "Import",
      },
      results: {
        header: "Import results",
        total: "%{smart_count} entry in total |||| %{smart_count} entries in total",
        successful: "%{smart_count} entries successfully imported",
        skipped: "%{smart_count} entries skipped",
        download_skipped: "Download skipped records",
        with_error: "%{smart_count} entry with errors |||| %{smart_count} entries with errors",
        simulated_only: "Run was only simulated",
      },
    },
  },
  delete_media: {
    name: "Media",
    fields: {
      before_ts: "останній доступ раніше ніж:",
      size_gt: "розмір більше ніж (у байтах):",
      keep_profiles: "Залишити зображення профілів користувачів",
    },
    action: {
      send: "Видалити медіафайли",
      send_success: "Запит успішно відправлено.",
      send_failure: "Сталася помилка.",
    },
    helper: {
      send: "Цей API видаляє локальні медіа з диска вашого власного сервера. Це включає будь-які локальні мініатюри та копії завантажених медіафайлів. Цей API не впливатиме на медіафайли, які було завантажено до зовнішніх сховищ медіафайлів.",
    },
  },
  purge_remote_media: {
    name: "Remote Media",
    fields: {
      before_ts: "останній доступ раніше ніж:",
    },
    action: {
      send: "Очистити віддалені медіа",
      send_success: "Запит на видалення віддалених медіа надіслано.",
      send_failure: "Під час запиту на очищення віддалених медіа сталася помилка.",
    },
    helper: {
      send: "Цей API очищає кеш віддалених медіа файлів із вашого сервера. Це включає будь-які локальні мініатюри та копії завантажених медіафайлів. Цей API не впливатиме на медіафайли, які було завантажено у власне сховище медіафайлів сервера.",
    },
  },
  resources: {
    users: {
      name: "Користувач |||| Користувачі",
      email: "Електронна пошта",
      msisdn: "Телефон",
      threepid: "Ел. пошта / телефон",
      membership: "Учасник |||| Учасники",
      fields: {
        avatar: "Аватар",
        id: "ID користувача",
        name: "Ім'я",
        is_guest: "Гість",
        admin: "Адміністратор сервера",
        locked: "Заблокований",
        suspended: "Припинений",
        deactivated: "Деактивований",
        erased: "Вилучений",
        show_guests: "Показати гостей",
        show_deactivated: "Показати дезактивованих",
        show_locked: "Показати заблокованих",
        show_suspended: "Показати призупинених",
        user_id: "Пошук користувача",
        displayname: "Ім'я, що відображається",
        password: "Пароль",
        avatar_url: "Avatar URL",
        avatar_src: "Аватар",
        medium: "Тип",
        threepids: "3PIDs",
        address: "Адреса",
        creation_ts_ms: "Мітка часу створення",
        consent_version: "Consent version",
        auth_provider: "Провайдер",
        user_type: "Тип користувача",
      },
      helper: {
        password: "Зміна пароля призведе до виходу користувача з усіх сеансів.",
        create_password: "Створіть надійний і надійний пароль за допомогою кнопки нижче.",
        deactivate: "Ви повинні ввести пароль, щоб повторно активувати обліковий запис.",
        suspend: "Призупинення користувача означає, що він переходить у режим лише читання.",
        erase: "Позначити користувача як вилученого GDPR",
        erase_text:
          "This means messages sent by the user(-s) will still be visible by anyone who was in the room when these messages were sent, but hidden from users joining the room afterward.",
        erase_admin_error: "Видалення власного користувача заборонено.",
        modify_managed_user_error: "Modifying a system-managed user is not allowed.",
        username_available: "Ім'я користувача доступне",
      },
      action: {
        erase: "Видалити дані користувача",
        erase_avatar: "Видалити аватар",
        delete_media: "Видалити всі медіафайли, завантажені користувачем(ами)",
        redact_events: "Redact all events sent by the user(-s)",
        generate_password: "Згенерувати пароль",
        overwrite_title: "УВАГА!",
        overwrite_content:
          "Це ім'я користувача вже зайняте. Ви впевнені, що хочете перезаписати існуючого користувача?",
        overwrite_cancel: "Скасувати",
        overwrite_confirm: "Перезаписати",
      },
      badge: {
        you: "Ти",
        bot: "Бот",
        admin: "Адмін",
        support: "Підтримка",
        regular: "Звичайний користувач",
        federated: "Федеративний",
        system_managed: "Системне керування",
      },
      limits: {
        messages_per_second: "Повідомлень за секунду",
        messages_per_second_text: "Кількість дій, які можна виконати за секунду.",
        burst_count: "Кількість пакетів",
        burst_count_text: "Скільки дій можна виконати до обмеження.",
      },
      account_data: {
        title: "Дані облікового запису",
        global: "Глобальні",
        rooms: "Кімнати",
      },
    },
    rooms: {
      name: "Кімната |||| Кімнати",
      fields: {
        room_id: "ID кімнати",
        name: "Ім'я",
        canonical_alias: "Псевдонім",
        joined_members: "Учасники",
        joined_local_members: "Локальні учасники",
        joined_local_devices: "Локальні пристрої",
        state_events: "Події стану / Складність",
        version: "Версія",
        is_encrypted: "Зашифровано",
        encryption: "Шифрування",
        federatable: "Федеративний",
        public: "Відображається у каталозі кімнат",
        creator: "Творець",
        join_rules: "Правила приєднання",
        guest_access: "Гостьовий доступ",
        history_visibility: "History visibility",
        topic: "Тема",
        avatar: "Аватар",
        actions: "Дії",
      },
      filter: {
        public_rooms: "Публічні кімнати",
        empty_rooms: "Порожні кімнати",
      },
      helper: {
        forward_extremities:
          "Forward extremities are the leaf events at the end of a Directed acyclic graph (DAG) in a room, aka events that have no children. The more exist in a room, the more state resolution that Synapse needs to perform (hint: it's an expensive operation). While Synapse has code to prevent too many of these existing at one time in a room, bugs can sometimes make them crop up again. If a room has >10 forward extremities, it's worth checking which room is the culprit and potentially removing them using the SQL queries mentioned in #1760.",
      },
      enums: {
        join_rules: {
          public: "Публічна",
          knock: "Треба постукати",
          invite: "Запросити",
          private: "Приватна",
        },
        guest_access: {
          can_join: "Гості можуть приєднатися",
          forbidden: "Гості не можуть приєднатися",
        },
        history_visibility: {
          invited: "Since invited",
          joined: "Since joined",
          shared: "Since shared",
          world_readable: "Anyone",
        },
        unencrypted: "Unencrypted",
      },
      action: {
        erase: {
          title: "Видалити кімнату",
          content:
            "Are you sure you want to delete the room? This cannot be undone. All messages and shared media in the room will be deleted from the server!",
          fields: {
            block: "Block and prevent users from joining the room",
          },
          success: "Кімнату(и) успішно видалено.",
          failure: "Не вдалося видалити кімнату(и).",
        },
        make_admin: {
          assign_admin: "Призначити адміністратора",
          title: "Призначити адміністратора кімнати %{roomName}",
          confirm: "Зробити адміном",
          content:
            "Введіть повний MXID користувача, якого буде встановлено як адміністратора.\nПопередження: щоб це працювало, кімната повинна мати принаймні одного локального учасника як адміністратора.",
          success: "Користувача призначено адміністратором кімнати.",
          failure: "Користувача не можна призначити адміністратором кімнати. %{errMsg}",
        },
      },
    },
    reports: {
      name: "Reported event |||| Reported events",
      fields: {
        id: "ID",
        received_ts: "Час події",
        user_id: "Автор",
        name: "name of the room",
        score: "score",
        reason: "reason",
        event_id: "event ID",
        event_json: {
          origin: "origin server",
          origin_server_ts: "Час відправки:",
          type: "event type",
          content: {
            msgtype: "content type",
            body: "content",
            format: "format",
            formatted_body: "formatted content",
            algorithm: "algorithm",
            url: "URL",
            info: {
              mimetype: "Type",
            },
          },
        },
      },
      action: {
        erase: {
          title: "Delete reported event",
          content: "Are you sure you want to delete the reported event? This cannot be undone.",
        },
      },
    },
    connections: {
      name: "Підключення",
      fields: {
        last_seen: "Дата",
        ip: "IP address",
        user_agent: "Агент користувача",
      },
    },
    devices: {
      name: "Пристрій |||| Пристрої",
      fields: {
        device_id: "ID пристрою",
        display_name: "Назва пристрою",
        last_seen_ts: "Мітка часу",
        last_seen_ip: "IP адреса",
      },
      action: {
        erase: {
          title: "Removing %{id}",
          content: 'Are you sure you want to remove the device "%{name}"?',
          success: "Device successfully removed.",
          failure: "An error has occurred.",
        },
      },
    },
    users_media: {
      name: "Медіа",
      fields: {
        media_id: "ID медіа",
        media_length: "Розмір файлу (у байтах)",
        media_type: "Тип",
        upload_name: "Ім'я файлу",
        quarantined_by: "У карантині",
        safe_from_quarantine: "Захистити від карантину",
        created_ts: "Створено",
        last_access_ts: "Останній доступ",
      },
      action: {
        open: "Відкрити мультимедійний файл у новому вікні",
      },
    },
    protect_media: {
      action: {
        create: "Unprotected, create protection",
        delete: "Protected, remove protection",
        none: "In quarantine",
        send_success: "Successfully changed the protection status.",
        send_failure: "An error has occurred.",
      },
    },
    quarantine_media: {
      action: {
        name: "Карантин",
        create: "Додати на карантин",
        delete: "In quarantine, unquarantine",
        none: "Protected from quarantine",
        send_success: "Успішно змінено статус карантину.",
        send_failure: "Сталася помилка: %{error}",
      },
    },
    pushers: {
      name: "Pusher |||| Pushers",
      fields: {
        app: "App",
        app_display_name: "App display name",
        app_id: "App ID",
        device_display_name: "Device display name",
        kind: "Kind",
        lang: "Language",
        profile_tag: "Profile tag",
        pushkey: "Pushkey",
        data: { url: "URL" },
      },
    },
    servernotices: {
      name: "Повідомлення сервера",
      send: "Надіслати сповіщення сервера",
      fields: {
        body: "Повідомлення",
      },
      action: {
        send: "Надіслати повідомлення",
        send_success: "Повідомлення на сервер успішно надіслано.",
        send_failure: "Сталася помилка.",
      },
      helper: {
        send: 'Надсилає повідомлення сервера вибраним користувачам. На сервері має бути активовано функцію "Повідомлення сервера".',
      },
    },
    user_media_statistics: {
      name: "Медіа користувачів",
      fields: {
        media_count: "Кількість медіафайлів",
        media_length: "Розмір медіафайлів",
      },
    },
    forward_extremities: {
      name: "Forward Extremities",
      fields: {
        id: "ID події",
        received_ts: "Мітка часу",
        depth: "Глибина",
        state_group: "State group",
      },
    },
    room_state: {
      name: "Події",
      fields: {
        type: "Тип",
        content: "Зміст",
        origin_server_ts: "час відправки",
        sender: "Відправник",
      },
    },
    room_media: {
      name: "Медіа",
      fields: {
        media_id: "ID медіа",
      },
      helper: {
        info: "Це список медіафайлів, які було завантажено в кімнату. Неможливо видалити медіафайли, завантажені до зовнішніх сховищ медіафайлів.",
      },
      action: {
        error: "%{errcode} (%{errstatus}) %{error}",
      },
    },
    room_directory: {
      name: "Каталог кімнат",
      fields: {
        world_readable: "гість може переглядати без приєднання",
        guest_can_join: "гості можуть приєднатися",
      },
      action: {
        title: "Видалити кімнату з каталогу кімнат |||| Видалити %{smart_count} кімнати із каталогу кімнат",
        content:
          "Ви впевнені, що хочете видалити цю кімнату з каталогу? |||| Ви впевнені, що хочете видалити ці %{smart_count} кімнат із каталогу?",
        erase: "Видалити з каталогу кімнат",
        create: "Опублікувати в каталозі кімнат",
        send_success: "Кімнату успішно опубліковано.",
        send_failure: "Сталася помилка.",
      },
    },
    destinations: {
      name: "Федерація",
      fields: {
        destination: "Пункт призначення",
        failure_ts: "Мітка часу помилки",
        retry_last_ts: "Мітка часу останньої повторної спроби",
        retry_interval: "Інтервал повторення",
        last_successful_stream_ordering: "Остання успішна трансляція",
        stream_ordering: "Трансляція",
      },
      action: { reconnect: "Повторне підключення" },
    },
    registration_tokens: {
      name: "Реєстраційні токени",
      fields: {
        token: "Токен",
        valid: "Дійсний токен",
        uses_allowed: "Використання дозволено",
        pending: "В очікуванні",
        completed: "Завершений",
        expiry_time: "Термін придатності",
        length: "Довжина",
      },
      helper: { length: "Довжина токена, якщо токен не вказано." },
    },
  },
  etkecc: {
    billing: {
      name: "Білінг",
      title: "Історія платежів",
      no_payments: "Платежів не знайдено.",
      no_payments_helper: "Якщо ви вважаєте, що це помилка, будь ласка, зверніться до підтримки etke.cc за адресою",
      description1: "Тут ви можете переглядати платежі та формувати рахунки. Докладніше про керування підпискою — на",
      description2:
        "Якщо ви хочете змінити email для білінгу або додати дані компанії, будь ласка, зверніться до підтримки etke.cc за адресою",
      fields: {
        transaction_id: "ID транзакції",
        email: "Ел. пошта",
        type: "Тип",
        amount: "Сума",
        paid_at: "Дата оплати",
        invoice: "Рахунок",
      },
      enums: {
        type: {
          subscription: "Підписка",
          one_time: "Разовий",
        },
      },
      helper: {
        download_invoice: "Завантажити рахунок",
        downloading: "Завантаження...",
        download_started: "Завантаження рахунку розпочато.",
        loading: "Завантаження інформації про білінг...",
        loading_failed1: "Виникла проблема під час завантаження інформації про білінг.",
        loading_failed2: "Будь ласка, спробуйте пізніше.",
        loading_failed3: "Якщо проблема не зникає, будь ласка, зверніться до підтримки etke.cc за адресою",
        loading_failed4: "із таким повідомленням про помилку:",
      },
    },
    maintenance: {
      title: "Наразі система перебуває в режимі обслуговування.",
      try_again: "Будь ласка, спробуйте пізніше.",
      note: "Не потрібно звертатися до підтримки з цього приводу — ми вже працюємо над цим!",
    },
  },
};
export default uk;
