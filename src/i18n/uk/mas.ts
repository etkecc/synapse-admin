const mas = {
  mas_users: {
    name: "MAS-користувач |||| MAS-користувачі",
    fields: {
      id: "MAS-ідентифікатор",
      username: "Ім'я користувача",
      admin: "Адміністратор",
      locked: "Заблокований",
      deactivated: "Деактивований",
      legacy_guest: "Застарілий гість",
      created_at: "Створений",
      locked_at: "Заблокований",
      deactivated_at: "Деактивований",
    },
    filter: {
      status: "Статус",
      search: "Пошук",
      status_active: "Активний",
      status_locked: "Заблокований",
      status_deactivated: "Деактивований",
    },
    action: {
      lock: { label: "Заблокувати", success: "Користувача заблоковано" },
      unlock: { label: "Розблокувати", success: "Користувача розблоковано" },
      deactivate: { label: "Деактивувати", success: "Користувача деактивовано" },
      reactivate: { label: "Реактивувати", success: "Користувача реактивовано" },
      set_admin: { label: "Призначити адміністратором", success: "Статус адміністратора оновлено" },
      remove_admin: { label: "Зняти права адміністратора", success: "Статус адміністратора оновлено" },
      set_password: {
        label: "Встановити пароль",
        title: "Встановити пароль",
        success: "Пароль встановлено",
        failure: "Не вдалося встановити пароль",
      },
    },
  },
  mas_user_emails: {
    name: "Ел. пошта |||| Ел. пошта",
    empty: "Немає ел. адрес",
    fields: {
      email: "Ел. пошта",
      user_id: "ID користувача",
      created_at: "Створена",
      actions: "Дії",
    },
    action: {
      remove: {
        label: "Видалити",
        title: "Видалити ел. адресу",
        content: "Видалити %{email}?",
        success: "Ел. адресу видалено",
      },
      create: { success: "Ел. адресу додано" },
    },
  },
  mas_compat_sessions: {
    name: "Сумісна сесія |||| Сумісні сесії",
    empty: "Немає сумісних сесій",
    fields: {
      user_id: "ID користувача",
      device_id: "ID пристрою",
      created_at: "Створена",
      user_agent: "User Agent",
      last_active_at: "Остання активність",
      last_active_ip: "Остання IP",
      finished_at: "Завершена",
      human_name: "Назва",
      active: "Активна",
    },
    action: {
      finish: {
        label: "Завершити",
        title: "Завершити сесію?",
        content: "Сесію буде завершено.",
        success: "Сесію завершено",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "OAuth2-сесія |||| OAuth2-сесії",
    empty: "Немає OAuth2-сесій",
    fields: {
      user_id: "ID користувача",
      client_id: "ID клієнта",
      scope: "Область доступу",
      created_at: "Створена",
      user_agent: "User Agent",
      last_active_at: "Остання активність",
      last_active_ip: "Остання IP",
      finished_at: "Завершена",
      human_name: "Назва",
      active: "Активна",
    },
    action: {
      finish: {
        label: "Завершити",
        title: "Завершити сесію?",
        content: "Сесію буде завершено.",
        success: "Сесію завершено",
      },
    },
  },
  mas_policy_data: {
    name: "Дані політики",
    current_policy: "Поточна політика",
    no_policy: "Наразі жодної політики не встановлено.",
    set_policy: "Задати нову політику",
    invalid_json: "Некоректний JSON",
    fields: {
      json_placeholder: "Введіть дані політики у форматі JSON…",
      created_at: "Створено",
    },
    action: {
      save: {
        label: "Задати політику",
        success: "Політику оновлено",
        failure: "Не вдалося оновити політику",
      },
    },
  },
  mas_user_sessions: {
    name: "Сесія браузера |||| Сесії браузера",
    fields: {
      user_id: "ID користувача",
      created_at: "Створена",
      finished_at: "Завершена",
      user_agent: "User Agent",
      last_active_at: "Остання активність",
      last_active_ip: "Остання IP",
      active: "Активна",
    },
    action: {
      finish: {
        label: "Завершити",
        title: "Завершити сесію?",
        content: "Браузерну сесію буде завершено.",
        success: "Сесію завершено",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "OAuth-зв'язок |||| OAuth-зв'язки",
    fields: {
      user_id: "ID користувача",
      provider_id: "ID провайдера",
      subject: "Суб'єкт",
      human_account_name: "Назва акаунту",
      created_at: "Створена",
    },
    helper: {
      provider_id: "ID стороннього OAuth-провайдера. Знайдіть його у списку OAuth-провайдерів.",
    },
    action: {
      remove: {
        label: "Видалити",
        title: "Видалити OAuth-зв'язок?",
        content: "OAuth-зв'язок для цього користувача буде видалено.",
        success: "OAuth-зв'язок видалено",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "OAuth-провайдер |||| OAuth-провайдери",
    fields: {
      issuer: "Видавець",
      human_name: "Назва",
      brand_name: "Бренд",
      created_at: "Створено",
      disabled_at: "Вимкнено",
      enabled: "Увімкнено",
    },
  },
  mas_personal_sessions: {
    name: "Персональна сесія |||| Персональні сесії",
    empty: "Немає персональних сесій",
    fields: {
      owner_user_id: "ID власника",
      actor_user_id: "Користувач",
      human_name: "Назва",
      scope: "Область доступу",
      created_at: "Створена",
      revoked_at: "Скасована",
      last_active_at: "Остання активність",
      last_active_ip: "Остання IP",
      expires_at: "Спливає",
      expires_in: "Спливає через (секунди)",
      active: "Активна",
    },
    helper: {
      expires_in:
        "Необов'язково. Кількість секунд до закінчення дії токена. Залиште порожнім для безстрокового токена.",
    },
    action: {
      revoke: {
        label: "Скасувати",
        title: "Скасувати сесію?",
        content: "Токен доступу буде безповоротно скасовано.",
        success: "Сесію скасовано",
      },
      create: {
        token_title: "Токен доступу створено",
        token_content: "Скопіюйте токен. Після закриття цього вікна він більше не буде доступний.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "Активна",
      finished: "Завершена",
      revoked: "Відкликана",
    },
  },
};

export default mas;
