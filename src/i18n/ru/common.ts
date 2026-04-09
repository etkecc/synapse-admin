import russianMessages from "./base";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const common: Record<string, any> = {
  ...russianMessages,
  ketesa: {
    auth: {
      base_url: "Адрес домашнего сервера",
      welcome: "Добро пожаловать в %{name}",
      description:
        "Эволюция Synapse Admin. Управляйте, отслеживайте и обслуживайте свой Matrix-сервер через единый удобный интерфейс. Подходит как для небольших приватных серверов, так и для крупных федеративных сообществ.",
      server_version: "Версия Synapse",
      supports_specs: "поддерживает спецификации Matrix",
      username_error: "Пожалуйста, укажите полный ID пользователя: '@user:domain'",
      protocol_error: "Адрес должен начинаться с 'http://' или 'https://'",
      url_error: "Неверный адрес сервера Matrix",
      sso_sign_in: "Вход через SSO",
      credentials: "Учетные данные",
      access_token: "Токен доступа",
      logout_acces_token_dialog: {
        title: "Вы используете существующий токен доступа Matrix.",
        content:
          "Вы хотите завершить эту сессию (которая может быть использована в другом месте, например, в клиенте Matrix) или просто выйти из панели администрирования?",
        confirm: "Завершить сессию",
        cancel: "Просто выйти из панели администрирования",
      },
    },
    users: {
      invalid_user_id: "Локальная часть ID пользователя Matrix без адреса домашнего сервера.",
      tabs: {
        sso: "SSO",
        experimental: "Экспериментальные",
        limits: "Ограничения",
        account_data: "Данные пользователя",
        sessions: "Сессии",
      },
      danger_zone: "Опасная зона",
    },
    rooms: {
      details: "Данные комнаты",
      tabs: {
        basic: "Основные",
        members: "Участники",
        detail: "Подробности",
        permission: "Права доступа",
        media: "Медиа",
        messages: "Сообщения",
        hierarchy: "Иерархия",
      },
    },
    reports: { tabs: { basic: "Основные", detail: "Подробности" } },
    admin_config: {
      soft_failed_events: "События с мягким сбоем",
      spam_flagged_events: "События, помеченные как спам",
      success: "Конфигурация администратора обновлена",
      failure: "Не удалось обновить конфигурацию администратора",
    },
  },
  import_users: {
    error: {
      at_entry: "В записи %{entry}: %{message}",
      error: "Ошибка",
      required_field: "Отсутствует обязательное поле '%{field}'",
      invalid_value: "Неверное значение в строке %{row}. Поле '%{field}' может быть либо 'true', либо 'false'",
      unreasonably_big: "Отказано в загрузке слишком большого файла размером %{size} мегабайт",
      already_in_progress: "Импорт уже в процессе",
      id_exits: "ID %{id} уже существует",
    },
    title: "Импорт пользователей из CSV",
    goToPdf: "Перейти к PDF",
    cards: {
      importstats: {
        header: "Сводка по импорту пользователей",
        users_total:
          "%{smart_count} пользователь в CSV файле |||| %{smart_count} пользователя в CSV файле |||| %{smart_count} пользователей в CSV файле",
        guest_count: "%{smart_count} гость |||| %{smart_count} гостя |||| %{smart_count} гостей",
        admin_count:
          "%{smart_count} администратор |||| %{smart_count} администратора |||| %{smart_count} администраторов",
      },
      conflicts: {
        header: "Стратегия разрешения конфликтов",
        mode: {
          stop: "Остановка при конфликте",
          skip: "Показать ошибку и пропустить при конфликте",
        },
      },
      ids: {
        header: "Идентификаторы",
        all_ids_present: "Идентификаторы присутствуют в каждой записи",
        count_ids_present:
          "%{smart_count} запись с ID |||| %{smart_count} записи с ID |||| %{smart_count} записей с ID",
        mode: {
          ignore: "Игнорировать идентификаторы в CSV и создать новые",
          update: "Обновить существующие записи",
        },
      },
      passwords: {
        header: "Пароли",
        all_passwords_present: "Пароли присутствуют в каждой записи",
        count_passwords_present:
          "%{smart_count} запись с паролем |||| %{smart_count} записи с паролями |||| %{smart_count} записей с паролями",
        use_passwords: "Использовать пароли из CSV",
      },
      upload: {
        header: "Загрузить CSV файл",
        explanation:
          "Здесь вы можете загрузить файл со значениями, разделёнными запятыми, которые будут использованы для создания или обновления данных пользователей. \
        В файле должны быть поля 'id' и 'displayname'. Вы можете скачать и изменить файл-образец отсюда: ",
      },
      startImport: {
        simulate_only: "Только симулировать",
        run_import: "Импорт",
      },
      results: {
        header: "Результаты импорта",
        total: "%{smart_count} запись всего |||| %{smart_count} записи всего |||| %{smart_count} записей всего",
        successful:
          "%{smart_count} запись успешно импортирована |||| %{smart_count} записи успешно импортированы |||| %{smart_count} записей успешно импортированы",
        skipped:
          "%{smart_count} запись пропущена |||| %{smart_count} записи пропущены |||| %{smart_count} записей пропущено",
        download_skipped: "Скачать пропущенные записи",
        with_error:
          "%{smart_count} запись с ошибкой |||| %{smart_count} записи с ошибками |||| %{smart_count} записей с ошибками",
        simulated_only: "Импорт был симулирован",
      },
    },
  },
  delete_media: {
    name: "Файлы",
    fields: {
      before_ts: "Последнее обращение до",
      size_gt: "Более чем (в байтах)",
      keep_profiles: "Сохранить аватары",
    },
    action: {
      send: "Удалить файлы",
      send_success:
        "Успешно удалён %{smart_count} медиафайл. |||| Успешно удалено %{smart_count} медиафайла. |||| Успешно удалено %{smart_count} медиафайлов.",
      send_success_none: "Нет медиафайлов, соответствующих указанным критериям. Ничего не было удалено.",
      send_failure: "Произошла ошибка.",
    },
    helper: {
      send: "Это API удаляет локальные файлы с вашего собственного сервера, включая локальные миниатюры и копии скачанных файлов. \
      Данный API не затрагивает файлы, загруженные во внешние хранилища.",
    },
  },
  purge_remote_media: {
    name: "Внешние медиа",
    fields: {
      before_ts: "Последний доступ до",
    },
    action: {
      send: "Очистить внешние медиа",
      send_success:
        "Успешно очищен %{smart_count} внешний медиафайл. |||| Успешно очищено %{smart_count} внешних медиафайла. |||| Успешно очищено %{smart_count} внешних медиафайлов.",
      send_success_none: "Нет внешних медиафайлов, соответствующих указанным критериям. Ничего не было очищено.",
      send_failure: "Произошла ошибка при запросе очистки внешних медиа.",
    },
    helper: {
      send: "Этот API очищает кэш внешних медиа с диска вашего сервера. Это включает любые локальные миниатюры и копии загруженных медиа. Этот API не повлияет на медиа, которые были загружены в собственное медиа-хранилище сервера.",
    },
  },
  etkecc: {
    donate: {
      menu_label: "Пожертвовать",
      name: "Поддержать развитие Ketesa",
      title: "Поддержать развитие Ketesa",
      description_1:
        "Проект Ketesa распространяется свободно и с открытым исходным кодом, и мы открыто развиваем и поддерживаем его для сообщества Matrix.",
      description_2:
        "Если проект Ketesa оказался вам полезен, пожертвование помогает нам продолжать работу над ним: разработку, сопровождение, исправления и постоянные улучшения.",
      description_3:
        "Это помогает нам уделять больше времени тому, чтобы развивать проект для всех, кто на него полагается.",
      description_4: "Важен каждый вклад, и мы искренне благодарны вам за поддержку! ❤️",
      button: "Пожертвовать",
      signature_team: "команда etke.cc",
    },
    billing: {
      name: "Биллинг",
      title: "История платежей",
      no_payments: "Платежи не найдены.",
      no_payments_helper:
        "Если вы считаете, что это ошибка, пожалуйста, свяжитесь со службой поддержки etke.cc по адресу",
      description1: "Здесь вы можете просматривать платежи и формировать счета. Подробнее об управлении подпиской — на",
      description2: "Чтобы изменить email для выставления счетов или добавить реквизиты компании в счета, см.",
      fields: {
        transaction_id: "ID транзакции",
        email: "Эл. почта",
        type: "Тип",
        amount: "Сумма",
        paid_at: "Дата оплаты",
        invoice: "Счёт",
      },
      enums: {
        type: {
          subscription: "Подписка",
          one_time: "Разовый",
        },
      },
      helper: {
        download_invoice: "Скачать счёт",
        downloading: "Скачивание...",
        download_started: "Скачивание счёта началось.",
        invoice_not_available: "В ожидании",
        loading: "Загрузка биллинговой информации...",
        loading_failed1: "Возникла проблема при загрузке биллинговой информации.",
        loading_failed2: "Пожалуйста, попробуйте позже.",
        loading_failed3: "Если проблема сохраняется, пожалуйста, свяжитесь со службой поддержки etke.cc по адресу",
        loading_failed4: "и сообщите следующее сообщение об ошибке:",
      },
    },
    status: {
      name: "Статус сервера",
      badge: {
        default: "Нажмите, чтобы посмотреть статус сервера",
        running: "Запущено: %{command}. %{text}",
      },
      category: {
        "Host Metrics": "Метрики хоста",
        Network: "Сеть",
        HTTP: "HTTP",
        Matrix: "Matrix",
      },
      status: "Статус",
      error: "Ошибка",
      loading: "Получаем данные о состоянии сервера в реальном времени… Подождите немного!",
      intro1: "Это отчёт мониторинга вашего сервера в реальном времени. Подробнее — на",
      intro2: "Если какая-либо из проверок ниже вас беспокоит, ознакомьтесь с рекомендуемыми действиями на",
      help: "Справка",
    },
    maintenance: {
      title: "Система сейчас находится в режиме обслуживания.",
      try_again: "Пожалуйста, попробуйте позже.",
      note: "Не нужно обращаться в поддержку по этому поводу — мы уже работаем над этим!",
    },
    actions: {
      name: "Серверные команды",
      available_title: "Доступные команды",
      available_description: "Ниже доступны команды для запуска.",
      available_help_intro: "Подробнее о каждой из них можно узнать на",
      scheduled_title: "Запланированные команды",
      scheduled_description:
        "Следующие команды запланированы на запуск в определённое время. Вы можете просмотреть их детали и изменить при необходимости.",
      recurring_title: "Повторяющиеся команды",
      recurring_description:
        "Следующие команды настроены на запуск в определённый день недели и время (еженедельно). Вы можете просмотреть их детали и изменить при необходимости.",
      scheduled_help_intro: "Подробнее о режиме можно узнать на",
      recurring_help_intro: "Подробнее о режиме можно узнать на",
      maintenance_title: "Система сейчас находится в режиме обслуживания.",
      maintenance_try_again: "Пожалуйста, попробуйте позже.",
      maintenance_note: "Не нужно обращаться в поддержку по этому поводу — мы уже работаем над этим!",
      maintenance_commands_blocked: "Команды нельзя запускать, пока режим обслуживания не будет отключён.",
      table: {
        command: "Команда",
        description: "Описание",
        arguments: "Аргументы",
        is_recurring: "Повторяющаяся?",
        run_at: "Запуск (локальное время)",
        next_run_at: "Следующий запуск (локальное время)",
        time_utc: "Время (UTC)",
        time_local: "Время (локальное время)",
      },
      buttons: {
        create: "Создать",
        update: "Обновить",
        back: "Назад",
        delete: "Удалить",
        run: "Запустить",
      },
      command_scheduled: "Команда запланирована: %{command}",
      command_scheduled_args: "с дополнительными аргументами: %{args}",
      expect_prefix: "Результат появится на странице",
      expect_suffix: "в ближайшее время.",
      notifications_link: "Уведомления",
      command_help_title: "Справка по %{command}",
      scheduled_title_create: "Создать запланированную команду",
      scheduled_title_edit: "Редактировать запланированную команду",
      recurring_title_create: "Создать повторяющуюся команду",
      recurring_title_edit: "Редактировать повторяющуюся команду",
      scheduled_details_title: "Детали запланированной команды",
      recurring_warning:
        "Запланированные команды, созданные из повторяющейся, нельзя редактировать: они будут создаваться заново автоматически. Пожалуйста, измените повторяющуюся команду.",
      command_details_intro: "Подробнее о команде можно узнать на",
      form: {
        id: "ID",
        command: "Команда",
        scheduled_at: "Запланировано на",
        day_of_week: "День недели",
      },
      delete_scheduled_title: "Удалить запланированную команду",
      delete_recurring_title: "Удалить повторяющуюся команду",
      delete_confirm: "Вы уверены, что хотите удалить команду: %{command}?",
      errors: {
        unknown: "Произошла неизвестная ошибка",
        delete_failed: "Ошибка: %{error}",
      },
      days: {
        monday: "Понедельник",
        tuesday: "Вторник",
        wednesday: "Среда",
        thursday: "Четверг",
        friday: "Пятница",
        saturday: "Суббота",
        sunday: "Воскресенье",
      },
      scheduled: {
        action: {
          create_success: "Запланированная команда создана успешно",
          update_success: "Запланированная команда обновлена успешно",
          update_failure: "Произошла ошибка",
          delete_success: "Запланированная команда удалена успешно",
          delete_failure: "Произошла ошибка",
        },
      },
      recurring: {
        action: {
          create_success: "Повторяющаяся команда создана успешно",
          update_success: "Повторяющаяся команда обновлена успешно",
          update_failure: "Произошла ошибка",
          delete_success: "Повторяющаяся команда удалена успешно",
          delete_failure: "Произошла ошибка",
        },
      },
    },
    notifications: {
      title: "Уведомления",
      new_notifications:
        "%{smart_count} новое уведомление |||| %{smart_count} новых уведомления |||| %{smart_count} новых уведомлений",
      no_notifications: "Пока уведомлений нет",
      see_all: "Посмотреть все уведомления",
      clear_all: "Очистить все",
      ago: "назад",
    },
    currently_running: {
      command: "Сейчас запущено:",
      started_ago: "(начато %{time} назад)",
    },
    time: {
      less_than_minute: "несколько секунд",
      minutes: "%{smart_count} минуту |||| %{smart_count} минуты |||| %{smart_count} минут",
      hours: "%{smart_count} час |||| %{smart_count} часа |||| %{smart_count} часов",
      days: "%{smart_count} день |||| %{smart_count} дня |||| %{smart_count} дней",
      weeks: "%{smart_count} неделю |||| %{smart_count} недели |||| %{smart_count} недель",
      months: "%{smart_count} месяц |||| %{smart_count} месяца |||| %{smart_count} месяцев",
    },
    support: {
      name: "Поддержка",
      menu_label: "Связаться с поддержкой",
      description:
        "Откройте запрос в поддержку или продолжите работу с существующим. Наша команда ответит как можно скорее.",
      create_title: "Новый запрос в поддержку",
      no_requests: "Запросов в поддержку пока нет.",
      no_messages: "Сообщений пока нет.",
      closed_message: "Этот запрос закрыт. Если у вас всё ещё есть проблема, пожалуйста, создайте новый.",
      fields: {
        subject: "Тема",
        message: "Сообщение",
        reply: "Ответ",
        status: "Статус",
        created_at: "Создан",
        updated_at: "Последнее обновление",
      },
      status: {
        active: "Ожидание оператора",
        open: "Открыт",
        closed: "Закрыт",
        pending: "Ожидание вашего ответа",
      },
      buttons: {
        new_request: "Новый запрос",
        submit: "Отправить",
        cancel: "Отмена",
        send: "Отправить",
        back: "Вернуться в поддержку",
        attach_files: "Прикрепить файлы",
      },
      helper: {
        loading: "Загрузка запросов в поддержку...",
        reply_hint: "Ctrl+Enter для отправки",
        reply_placeholder: "Укажите как можно больше деталей.",
        before_contact_title: "Прежде чем связаться с нами",
        help_pages_prompt: "Пожалуйста, сначала ознакомьтесь с разделом помощи:",
        services_prompt: "Мы предоставляем только услуги, перечисленные на странице услуг:",
        topics_prompt: "Мы можем помочь только по поддерживаемым темам:",
        scope_confirm_label:
          "Я ознакомился с разделом помощи и подтверждаю, что запрос соответствует поддерживаемым темам.",
        english_only_notice: "Поддержка предоставляется только на английском языке.",
        response_time_prompt: "Ответ в течение 48 часов. Нужен более быстрый ответ? См.:",
        attachments_limit: "До 5 файлов, 5 МБ каждый, 10 МБ всего.",
        close_request_label: "Закрыть запрос после отправки",
      },
      actions: {
        create_success: "Запрос в поддержку успешно создан.",
        create_failure: "Не удалось создать запрос в поддержку.",
        send_failure: "Не удалось отправить сообщение.",
        attachment_too_large: "Файл «%{name}» превышает ограничение в 5 МБ.",
        too_many_attachments: "Максимум 5 файлов.",
        total_size_exceeded: "Общий размер вложений превышает 10 МБ.",
      },
    },
  },
};

export default common;
