const misc_resources = {
  scheduled_tasks: {
    name: "Запланированная задача |||| Запланированные задачи",
    fields: {
      id: "ID",
      action: "Действие",
      status: "Статус",
      timestamp: "Временная метка",
      resource_id: "ID ресурса",
      result: "Результат",
      error: "Ошибка",
      max_timestamp: "До даты",
    },
    status: {
      scheduled: "Запланирована",
      active: "Активна",
      complete: "Завершена",
      cancelled: "Отменена",
      failed: "Не выполнена",
    },
  },
  connections: {
    name: "Подключения",
    fields: {
      last_seen: "Дата",
      ip: "IP адрес",
      user_agent: "Юзер-агент",
    },
  },
  devices: {
    name: "Устройство |||| Устройства",
    fields: {
      device_id: "ID устройства",
      display_name: "Название",
      last_seen_ts: "Дата и время",
      last_seen_ip: "IP адрес",
      last_seen_user_agent: "Юзер-агент",
      dehydrated: "Дегидратировано",
    },
    action: {
      erase: {
        title: "Удаление %{id}",
        title_bulk:
          "Удаление %{smart_count} устройства |||| Удаление %{smart_count} устройств |||| Удаление %{smart_count} устройств",
        content: 'Действительно удалить устройство "%{name}"?',
        content_bulk:
          "Действительно удалить %{smart_count} устройство? |||| Действительно удалить %{smart_count} устройства? |||| Действительно удалить %{smart_count} устройств?",
        success: "Устройство успешно удалено.",
        failure: "Произошла ошибка.",
      },
      display_name: {
        success: "Название устройства обновлено",
        failure: "Не удалось обновить название устройства",
      },
      create: {
        label: "Создать устройство",
        title: "Создание нового устройства",
        success: "Устройство создано",
        failure: "Не удалось создать устройство",
      },
    },
  },
  users_media: {
    name: "Файлы",
    fields: {
      media_id: "ID файла",
      media_length: "Размер файла (в байтах)",
      media_type: "Тип",
      upload_name: "Имя файла",
      quarantined_by: "На карантине",
      safe_from_quarantine: "Защитить от карантина",
      created_ts: "Создано",
      last_access_ts: "Последний доступ",
    },
    action: {
      open: "Открыть файл в новом окне",
    },
  },
  protect_media: {
    action: {
      create: "Защитить",
      delete: "Снять защиту",
      none: "На карантине",
      send_success: "Статус защиты успешно изменён.",
      send_failure: "Произошла ошибка.",
    },
  },
  quarantine_media: {
    action: {
      name: "Карантин",
      create: "Карантин",
      delete: "Снять карантин",
      none: "Защищено",
      send_success: "Статус карантина успешно изменён.",
      send_failure: "Произошла ошибка: %{error}",
    },
  },
  pushers: {
    name: "Пушер |||| Пушеры",
    fields: {
      app: "Приложение",
      app_display_name: "Название приложения",
      app_id: "ID приложения",
      device_display_name: "Название устройства",
      kind: "Вид",
      lang: "Язык",
      profile_tag: "Тег профиля",
      pushkey: "Ключ",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "Серверные уведомления",
    send: "Отправить серверные уведомления",
    fields: {
      body: "Сообщение",
    },
    action: {
      send: "Отправить",
      send_success: "Серверное уведомление успешно отправлено.",
      send_failure: "Произошла ошибка.",
    },
    helper: {
      send: 'Отправить серверное уведомление выбранным пользователям. На сервере должна быть активна функция "Server Notices".',
    },
  },
  database_room_statistics: {
    name: "Статистика БД по комнатам",
    fields: {
      room_id: "ID комнаты",
      estimated_size: "Примерный размер",
    },
    helper: {
      info: "Отображает приблизительный объём дискового пространства, занятого каждой комнатой в базе данных Synapse. Цифры являются приблизительными.",
    },
  },
  user_media_statistics: {
    name: "Файлы пользователей",
    fields: {
      media_count: "Количество файлов",
      media_length: "Размер файлов",
    },
  },
  forward_extremities: {
    name: "Оконечности",
    fields: {
      id: "ID события",
      received_ts: "Дата и время",
      depth: "Глубина",
      state_group: "Группа состояния",
    },
  },
  room_state: {
    name: "События состояния",
    fields: {
      type: "Тип",
      content: "Содержимое",
      origin_server_ts: "Дата отправки",
      sender: "Отправитель",
    },
  },
  room_media: {
    name: "Медиа",
    fields: {
      media_id: "ID медиа",
    },
    helper: {
      info: "Это список медиа, которые были загружены в комнату. Невозможно удалить медиа, которые были загружены во внешние медиа-репозитории.",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "Каталог комнат",
    fields: {
      world_readable: "Гости могут просматривать без входа",
      guest_can_join: "Гости могут войти",
    },
    action: {
      title:
        "Удалить комнату из каталога |||| Удалить %{smart_count} комнаты из каталога |||| Удалить %{smart_count} комнат из каталога",
      content:
        "Действительно удалить комнату из каталога? |||| Действительно удалить %{smart_count} комнаты из каталога? |||| Действительно удалить %{smart_count} комнат из каталога?",
      erase: "Удалить из каталога комнат",
      create: "Опубликовать в каталоге комнат",
      send_success: "Комната успешно опубликована.",
      send_failure: "Произошла ошибка.",
    },
  },
  destinations: {
    name: "Федерация",
    fields: {
      destination: "Назначение",
      failure_ts: "Дата и время ошибки",
      retry_last_ts: "Дата и время последней попытки",
      retry_interval: "Интервал между попытками",
      last_successful_stream_ordering: "Последний успешный поток",
      stream_ordering: "Поток",
    },
    action: { reconnect: "Переподключиться" },
  },
  registration_tokens: {
    name: "Токены регистрации",
    fields: {
      token: "Токен",
      valid: "Рабочий токен",
      uses_allowed: "Количество использований",
      pending: "Ожидает",
      completed: "Завершено",
      expiry_time: "Дата окончания",
      length: "Длина",
      created_at: "Дата создания",
      last_used_at: "Последнее использование",
      revoked_at: "Дата отзыва",
    },
    helper: { length: "Длина токена, если токен не задан." },
    action: {
      revoke: {
        label: "Отозвать",
        success: "Токен отозван",
      },
      unrevoke: {
        label: "Восстановить",
        success: "Токен восстановлен",
      },
    },
  },
};

export default misc_resources;
