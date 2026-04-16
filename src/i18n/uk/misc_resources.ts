const misc_resources = {
  scheduled_tasks: {
    name: "Запланована задача |||| Заплановані задачі",
    fields: {
      id: "ID",
      action: "Дія",
      status: "Статус",
      timestamp: "Часова мітка",
      resource_id: "ID ресурсу",
      result: "Результат",
      error: "Помилка",
      max_timestamp: "До дати",
    },
    status: {
      scheduled: "Заплановано",
      active: "Активна",
      complete: "Завершена",
      cancelled: "Скасована",
      failed: "Невдала",
    },
  },
  connections: {
    name: "Підключення",
    fields: {
      last_seen: "Дата",
      ip: "IP-адреса",
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
      last_seen_user_agent: "User agent",
      dehydrated: "Дегідратовано",
    },
    action: {
      erase: {
        title: "Видалення %{id}",
        title_bulk:
          "Видалення %{smart_count} пристрою |||| Видалення %{smart_count} пристроїв |||| Видалення %{smart_count} пристроїв",
        content: 'Ви впевнені, що хочете видалити пристрій "%{name}"?',
        content_bulk:
          "Ви впевнені, що хочете видалити %{smart_count} пристрій? |||| Ви впевнені, що хочете видалити %{smart_count} пристрої? |||| Ви впевнені, що хочете видалити %{smart_count} пристроїв?",
        success: "Пристрій успішно видалено.",
        failure: "Сталася помилка.",
      },
      display_name: {
        success: "Назву пристрою оновлено",
        failure: "Не вдалося оновити назву пристрою",
      },
      create: {
        label: "Створити пристрій",
        title: "Створення нового пристрою",
        success: "Пристрій створено",
        failure: "Не вдалося створити пристрій",
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
      create: "Захистити",
      delete: "Зняти захист",
      none: "На карантині",
      send_success: "Статус захисту успішно змінено.",
      send_failure: "Сталася помилка.",
    },
  },
  quarantine_media: {
    action: {
      name: "Карантин",
      create: "Карантин",
      delete: "Зняти карантин",
      none: "Захищено",
      send_success: "Успішно змінено статус карантину.",
      send_failure: "Сталася помилка: %{error}",
    },
  },
  pushers: {
    name: "Pusher |||| Pushers",
    fields: {
      app: "Застосунок",
      app_display_name: "Назва застосунку",
      app_id: "ID застосунку",
      device_display_name: "Назва пристрою",
      kind: "Тип",
      lang: "Мова",
      profile_tag: "Тег профілю",
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
  database_room_statistics: {
    name: "Статистика БД по кімнатах",
    fields: {
      room_id: "ID кімнати",
      estimated_size: "Приблизний розмір",
    },
    helper: {
      info: "Відображає приблизний обсяг дискового простору, який використовує кожна кімната в базі даних Synapse. Числа є наближеними.",
    },
  },
  user_media_statistics: {
    name: "Медіа",
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
      state_group: "Група стану",
    },
  },
  room_state: {
    name: "Події",
    fields: {
      type: "Тип",
      content: "Зміст",
      origin_server_ts: "Час відправки",
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
      world_readable: "Гість може переглядати без приєднання",
      guest_can_join: "Гості можуть приєднатися",
    },
    action: {
      title:
        "Видалити кімнату з каталогу кімнат |||| Видалити %{smart_count} кімнати із каталогу кімнат |||| Видалити %{smart_count} кімнат із каталогу кімнат",
      content:
        "Ви впевнені, що хочете видалити цю кімнату з каталогу? |||| Ви впевнені, що хочете видалити ці %{smart_count} кімнати із каталогу? |||| Ви впевнені, що хочете видалити ці %{smart_count} кімнат із каталогу?",
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
      created_at: "Дата створення",
      last_used_at: "Останнє використання",
      revoked_at: "Дата відкликання",
    },
    helper: { length: "Довжина токена, якщо токен не вказано." },
    action: {
      revoke: {
        label: "Відкликати",
        success: "Токен відкликано",
      },
      unrevoke: {
        label: "Відновити",
        success: "Токен відновлено",
      },
    },
  },
  account_data: {
    name: "Дані облікового запису",
  },
  joined_rooms: {
    name: "Кімнати",
  },
  memberships: {
    name: "Членства",
  },
  room_members: {
    name: "Учасники",
  },
  destination_rooms: {
    name: "Кімнати",
  },
};

export default misc_resources;
