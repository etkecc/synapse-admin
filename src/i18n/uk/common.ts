import _ukrainianMessages from "ra-language-ukrainian";

const ukrainianMessages = (
  "default" in _ukrainianMessages ? _ukrainianMessages.default : _ukrainianMessages
) as typeof _ukrainianMessages;

const { prev: _ukPrev, ...ukNavigation } = ukrainianMessages.ra.navigation;

const fixedUkrainianMessages = {
  ...ukrainianMessages,
  ra: {
    ...ukrainianMessages.ra,
    navigation: {
      ...ukNavigation,
      clear_filters: "Очистити всі фільтри",
      no_filtered_results: "Немає результатів",
    },
    action: {
      ...ukrainianMessages.ra.action,
      reset: "Скинути",
      search_columns: "Пошук по стовпцях",
      select_all_button: "Вибрати всі",
    },
    auth: {
      ...ukrainianMessages.ra.auth,
      email: "Електронна пошта",
    },
    message: {
      ...ukrainianMessages.ra.message,
      access_denied: "Ви не маєте доступу до цієї сторінки.",
      authentication_error: "Сервер автентифікації повернув помилку, перевірити ваші дані не вдалося.",
      placeholder_data_warning: "Проблема з мережею: оновлення даних не вдалося.",
      select_all_limit_reached: "Занадто багато елементів для вибору. Обрано лише перші %{max}.",
    },
    guesser: {
      empty: {
        title: "Немає даних для відображення",
        message: "Перевірте постачальника даних",
      },
    },
    notification: {
      ...ukrainianMessages.ra.notification,
      offline: "Немає з’єднання. Дані не вдалося отримати.",
    },
    page: {
      ...ukrainianMessages.ra.page,
      access_denied: "Доступ заборонено",
      authentication_error: "Помилка автентифікації",
    },
    validation: {
      ...ukrainianMessages.ra.validation,
      unique: "Має бути унікальним",
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const common: Record<string, any> = {
  ...fixedUkrainianMessages,
  ketesa: {
    auth: {
      base_url: "URL домашнього сервера",
      welcome: "Ласкаво просимо до %{name}",
      description: "Еволюція Synapse Admin. Керуйте, відстежуйте та обслуговуйте свій Matrix-сервер через єдиний зручний інтерфейс. Підходить як для невеликих приватних серверів, так і для великих федеративних спільнот.",
      server_version: "Версія Synapse",
      supports_specs: "підтримує специфікації Matrix",
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
        cancel: "Просто вийти з панелі адміністратора",
      },
    },
    users: {
      invalid_user_id: "Локальна частина ID користувача Matrix без адреси домашнього сервера.",
      tabs: {
        sso: "SSO",
        experimental: "Експериментально",
        limits: "Обмеження",
        account_data: "Дані облікового запису",
        sessions: "Сесії",
      },
      danger_zone: "Небезпечна зона",
    },
    rooms: {
      details: "Деталі кімнати",
      tabs: {
        basic: "Основні",
        members: "Учасники",
        detail: "Детально",
        permission: "Дозволи",
        media: "Медіа",
        messages: "Повідомлення",
        hierarchy: "Ієрархія",
      },
    },
    reports: { tabs: { basic: "Основні", detail: "Детально" } },
    admin_config: {
      soft_failed_events: "Події з м'яким збоєм",
      spam_flagged_events: "Події, позначені як спам",
      success: "Конфігурацію адміністратора оновлено",
      failure: "Не вдалося оновити конфігурацію адміністратора",
    },
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
      send_success:
        "Успішно видалено %{smart_count} медіафайл. |||| Успішно видалено %{smart_count} медіафайли. |||| Успішно видалено %{smart_count} медіафайлів.",
      send_success_none: "Жоден медіафайл не відповідає вказаним критеріям. Нічого не було видалено.",
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
      send_success:
        "Успішно очищено %{smart_count} віддалений медіафайл. |||| Успішно очищено %{smart_count} віддалені медіафайли. |||| Успішно очищено %{smart_count} віддалених медіафайлів.",
      send_success_none: "Жоден віддалений медіафайл не відповідає вказаним критеріям. Нічого не було очищено.",
      send_failure: "Під час запиту на очищення віддалених медіа сталася помилка.",
    },
    helper: {
      send: "Цей API очищає кеш віддалених медіа файлів із вашого сервера. Це включає будь-які локальні мініатюри та копії завантажених медіафайлів. Цей API не впливатиме на медіафайли, які було завантажено у власне сховище медіафайлів сервера.",
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
        invoice_not_available: "В очікуванні",
        loading: "Завантаження інформації про білінг...",
        loading_failed1: "Виникла проблема під час завантаження інформації про білінг.",
        loading_failed2: "Будь ласка, спробуйте пізніше.",
        loading_failed3: "Якщо проблема не зникає, будь ласка, зверніться до підтримки etke.cc за адресою",
        loading_failed4: "із таким повідомленням про помилку:",
      },
    },
    status: {
      name: "Стан сервера",
      badge: {
        default: "Натисніть, щоб переглянути стан сервера",
        running: "Запущено: %{command}. %{text}",
      },
      category: {
        "Host Metrics": "Метрики хоста",
        Network: "Мережа",
        HTTP: "HTTP",
        Matrix: "Matrix",
      },
      status: "Стан",
      error: "Помилка",
      loading: "Отримуємо дані про стан сервера в реальному часі... Зачекайте трохи!",
      intro1: "Це звіт моніторингу вашого сервера в реальному часі. Докладніше — на",
      intro2: "Якщо вас турбує будь-яка з перевірок нижче, перегляньте рекомендовані дії на",
      help: "Довідка",
    },
    maintenance: {
      title: "Наразі система перебуває в режимі обслуговування.",
      try_again: "Будь ласка, спробуйте пізніше.",
      note: "Не потрібно звертатися до підтримки з цього приводу — ми вже працюємо над цим!",
    },
    actions: {
      name: "Команди сервера",
      available_title: "Доступні команди",
      available_description: "Нижче наведені команди, які можна виконати.",
      available_help_intro: "Докладнішу інформацію про кожну з них можна знайти на",
      scheduled_title: "Заплановані команди",
      scheduled_description:
        "Наведені команди заплановані на виконання у визначений час. Ви можете переглянути деталі та змінити їх за потреби.",
      recurring_title: "Повторювані команди",
      recurring_description:
        "Наведені команди налаштовані на щотижневе виконання у визначений день і час. Ви можете переглянути деталі та змінити їх за потреби.",
      scheduled_help_intro: "Докладнішу інформацію про цей режим можна знайти на",
      recurring_help_intro: "Докладнішу інформацію про цей режим можна знайти на",
      maintenance_title: "Наразі система перебуває в режимі обслуговування.",
      maintenance_try_again: "Будь ласка, спробуйте пізніше.",
      maintenance_note: "Не потрібно звертатися до підтримки з цього приводу — ми вже працюємо над цим!",
      maintenance_commands_blocked: "Команди не можна запускати, доки режим обслуговування не буде вимкнено.",
      table: {
        command: "Команда",
        description: "Опис",
        arguments: "Аргументи",
        is_recurring: "Повторювана?",
        run_at: "Запуск (локальний час)",
        next_run_at: "Наступний запуск (локальний час)",
        time_utc: "Час (UTC)",
        time_local: "Час (локальний)",
      },
      buttons: {
        create: "Створити",
        update: "Оновити",
        back: "Назад",
        delete: "Видалити",
        run: "Запустити",
      },
      command_scheduled: "Команду заплановано: %{command}",
      command_scheduled_args: "з додатковими аргументами: %{args}",
      expect_prefix: "Очікуйте результат на сторінці",
      expect_suffix: "найближчим часом.",
      notifications_link: "Сповіщення",
      command_help_title: "Довідка %{command}",
      scheduled_title_create: "Створити заплановану команду",
      scheduled_title_edit: "Редагувати заплановану команду",
      recurring_title_create: "Створити повторювану команду",
      recurring_title_edit: "Редагувати повторювану команду",
      scheduled_details_title: "Деталі запланованої команди",
      recurring_warning:
        "Заплановані команди, створені з повторюваної, не можна редагувати, оскільки вони будуть згенеровані повторно автоматично. Будь ласка, редагуйте повторювану команду.",
      command_details_intro: "Докладнішу інформацію про команду можна знайти на",
      form: {
        id: "ID",
        command: "Команда",
        scheduled_at: "Заплановано на",
        day_of_week: "День тижня",
      },
      delete_scheduled_title: "Видалити заплановану команду",
      delete_recurring_title: "Видалити повторювану команду",
      delete_confirm: "Ви впевнені, що хочете видалити команду: %{command}?",
      errors: {
        unknown: "Сталася невідома помилка",
        delete_failed: "Помилка: %{error}",
      },
      days: {
        monday: "Понеділок",
        tuesday: "Вівторок",
        wednesday: "Середа",
        thursday: "Четвер",
        friday: "Пʼятниця",
        saturday: "Субота",
        sunday: "Неділя",
      },
      scheduled: {
        action: {
          create_success: "Заплановану команду успішно створено",
          update_success: "Заплановану команду успішно оновлено",
          update_failure: "Сталася помилка",
          delete_success: "Заплановану команду успішно видалено",
          delete_failure: "Сталася помилка",
        },
      },
      recurring: {
        action: {
          create_success: "Повторювану команду успішно створено",
          update_success: "Повторювану команду успішно оновлено",
          update_failure: "Сталася помилка",
          delete_success: "Повторювану команду успішно видалено",
          delete_failure: "Сталася помилка",
        },
      },
    },
    notifications: {
      title: "Сповіщення",
      new_notifications:
        "%{smart_count} нове сповіщення |||| %{smart_count} нові сповіщення |||| %{smart_count} нових сповіщень",
      no_notifications: "Поки сповіщень немає",
      see_all: "Переглянути всі сповіщення",
      clear_all: "Очистити все",
      ago: "тому",
    },
    currently_running: {
      command: "Зараз виконується:",
      started_ago: "(запущено %{time} тому)",
    },
    time: {
      less_than_minute: "кілька секунд",
      minutes: "%{smart_count} хвилина |||| %{smart_count} хвилини |||| %{smart_count} хвилин",
      hours: "%{smart_count} година |||| %{smart_count} години |||| %{smart_count} годин",
      days: "%{smart_count} день |||| %{smart_count} дні |||| %{smart_count} днів",
      weeks: "%{smart_count} тиждень |||| %{smart_count} тижні |||| %{smart_count} тижнів",
      months: "%{smart_count} місяць |||| %{smart_count} місяці |||| %{smart_count} місяців",
    },
    support: {
      name: "Підтримка",
      menu_label: "Зв'язатися з підтримкою",
      description: "Відкрийте запит до підтримки або продовжте роботу з існуючим. Наша команда відповість якнайшвидше.",
      create_title: "Новий запит до підтримки",
      no_requests: "Запитів до підтримки ще немає.",
      no_messages: "Повідомлень ще немає.",
      closed_message: "Цей запит закрито. Якщо у вас все ще є проблема, будь ласка, відкрийте новий.",
      fields: {
        subject: "Тема",
        message: "Повідомлення",
        reply: "Відповідь",
        status: "Статус",
        created_at: "Створено",
        updated_at: "Останнє оновлення",
      },
      status: {
        active: "Очікування оператора",
        open: "Відкрито",
        closed: "Закрито",
        pending: "Очікування вашої відповіді",
      },
      buttons: {
        new_request: "Новий запит",
        submit: "Надіслати",
        cancel: "Скасувати",
        send: "Надіслати",
        back: "Повернутися до підтримки",
      },
      helper: {
        loading: "Завантаження запитів до підтримки...",
        reply_hint: "Ctrl+Enter для надсилання",
        reply_placeholder: "Вкажіть якомога більше деталей.",
        before_contact_title: "Перш ніж звернутися до нас",
        help_pages_prompt: "Будь ласка, спочатку перегляньте сторінки довідки:",
        services_prompt: "Ми надаємо лише послуги, перелічені на сторінці послуг:",
        topics_prompt: "Ми можемо допомогти лише з підтримуваними темами:",
        scope_confirm_label:
          "Я переглянув сторінки довідки та підтверджую, що цей запит відповідає підтримуваним темам.",
        english_only_notice: "Підтримка надається лише англійською мовою.",
        response_time_prompt: "Відповідь протягом 48 годин. Потрібна швидша відповідь? Див.:",
      },
      actions: {
        create_success: "Запит до підтримки успішно створено.",
        create_failure: "Не вдалося створити запит до підтримки.",
        send_failure: "Не вдалося надіслати повідомлення.",
      },
    },
  },
};

export default common;
