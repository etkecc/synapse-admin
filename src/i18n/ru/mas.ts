const mas = {
  mas_users: {
    name: "MAS-пользователь |||| MAS-пользователи",
    fields: {
      id: "MAS-идентификатор",
      username: "Имя пользователя",
      admin: "Администратор",
      locked: "Заблокирован",
      deactivated: "Деактивирован",
      legacy_guest: "Устаревший гость",
      created_at: "Создан",
      locked_at: "Заблокирован",
      deactivated_at: "Деактивирован",
    },
    filter: {
      status: "Статус",
      search: "Поиск",
      status_active: "Активен",
      status_locked: "Заблокирован",
      status_deactivated: "Деактивирован",
    },
    action: {
      lock: { label: "Заблокировать", success: "Пользователь заблокирован" },
      unlock: { label: "Разблокировать", success: "Пользователь разблокирован" },
      deactivate: { label: "Деактивировать", success: "Пользователь деактивирован" },
      reactivate: { label: "Реактивировать", success: "Пользователь реактивирован" },
      set_admin: { label: "Назначить администратором", success: "Статус администратора обновлён" },
      remove_admin: { label: "Снять права администратора", success: "Статус администратора обновлён" },
      set_password: {
        label: "Установить пароль",
        title: "Установить пароль",
        success: "Пароль установлен",
        failure: "Не удалось установить пароль",
      },
    },
  },
  mas_user_emails: {
    name: "Эл. почта |||| Эл. почта",
    empty: "Нет эл. адресов",
    fields: {
      email: "Эл. почта",
      user_id: "ID пользователя",
      created_at: "Создан",
      actions: "Действия",
    },
    action: {
      remove: {
        label: "Удалить",
        title: "Удалить эл. адрес",
        content: "Удалить %{email}?",
        success: "Эл. адрес удалён",
      },
      create: { success: "Эл. адрес добавлен" },
    },
  },
  mas_compat_sessions: {
    name: "Совместимая сессия |||| Совместимые сессии",
    empty: "Нет совместимых сессий",
    fields: {
      user_id: "ID пользователя",
      device_id: "ID устройства",
      created_at: "Создана",
      user_agent: "Юзер-агент",
      last_active_at: "Последняя активность",
      last_active_ip: "Последний IP",
      finished_at: "Завершена",
      human_name: "Название",
      active: "Активна",
    },
    action: {
      finish: {
        label: "Завершить",
        title: "Завершить сессию?",
        content: "Сессия будет завершена.",
        success: "Сессия завершена",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "OAuth2-сессия |||| OAuth2-сессии",
    empty: "Нет OAuth2-сессий",
    fields: {
      user_id: "ID пользователя",
      client_id: "ID клиента",
      scope: "Область доступа",
      created_at: "Создана",
      user_agent: "Юзер-агент",
      last_active_at: "Последняя активность",
      last_active_ip: "Последний IP",
      finished_at: "Завершена",
      human_name: "Название",
      active: "Активна",
    },
    action: {
      finish: {
        label: "Завершить",
        title: "Завершить сессию?",
        content: "Сессия будет завершена.",
        success: "Сессия завершена",
      },
    },
  },
  mas_policy_data: {
    name: "Данные политики",
    current_policy: "Текущая политика",
    no_policy: "Политика в настоящее время не задана.",
    set_policy: "Задать новую политику",
    invalid_json: "Некорректный JSON",
    fields: {
      json_placeholder: "Введите данные политики в формате JSON…",
      created_at: "Создано",
    },
    action: {
      save: {
        label: "Задать политику",
        success: "Политика обновлена",
        failure: "Не удалось обновить политику",
      },
    },
  },
  mas_user_sessions: {
    name: "Сессия браузера |||| Сессии браузера",
    fields: {
      user_id: "ID пользователя",
      created_at: "Создана",
      finished_at: "Завершена",
      user_agent: "Юзер-агент",
      last_active_at: "Последняя активность",
      last_active_ip: "Последний IP",
      active: "Активна",
    },
    action: {
      finish: {
        label: "Завершить",
        title: "Завершить сессию?",
        content: "Браузерная сессия будет завершена.",
        success: "Сессия завершена",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "OAuth-связь |||| OAuth-связи",
    fields: {
      user_id: "ID пользователя",
      provider_id: "ID провайдера",
      subject: "Субъект",
      human_account_name: "Имя аккаунта",
      created_at: "Создана",
    },
    helper: {
      provider_id: "ID стороннего OAuth-провайдера. Найдите его в списке OAuth-провайдеров.",
    },
    action: {
      remove: {
        label: "Удалить",
        title: "Удалить OAuth-связь?",
        content: "OAuth-связь для этого пользователя будет удалена.",
        success: "OAuth-связь удалена",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "OAuth-провайдер |||| OAuth-провайдеры",
    fields: {
      issuer: "Издатель",
      human_name: "Название",
      brand_name: "Бренд",
      created_at: "Создан",
      disabled_at: "Отключён",
      enabled: "Включён",
    },
  },
  mas_personal_sessions: {
    name: "Персональная сессия |||| Персональные сессии",
    empty: "Нет персональных сессий",
    fields: {
      owner_user_id: "ID владельца",
      actor_user_id: "Пользователь",
      human_name: "Название",
      scope: "Область доступа",
      created_at: "Создана",
      revoked_at: "Отозвана",
      last_active_at: "Последняя активность",
      last_active_ip: "Последний IP",
      expires_at: "Истекает",
      expires_in: "Истекает через (секунды)",
      active: "Активна",
    },
    helper: {
      expires_in: "Необязательно. Количество секунд до истечения токена. Оставьте пустым для бессрочного токена.",
    },
    action: {
      revoke: {
        label: "Отозвать",
        title: "Отозвать сессию?",
        content: "Токен доступа будет безвозвратно отозван.",
        success: "Сессия отозвана",
      },
      create: {
        token_title: "Токен доступа создан",
        token_content: "Скопируйте токен. После закрытия этого окна он больше не будет доступен.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "Активна",
      finished: "Завершена",
      revoked: "Отозвана",
    },
  },
};

export default mas;
