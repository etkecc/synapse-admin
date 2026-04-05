const rooms = {
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
    history_visibility: "Видимість історії",
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
      restricted: "Обмежений доступ",
    },
    guest_access: {
      can_join: "Гості можуть приєднатися",
      forbidden: "Гості не можуть приєднатися",
    },
    history_visibility: {
      invited: "З моменту запрошення",
      joined: "З моменту приєднання",
      shared: "З моменту надання доступу",
      world_readable: "Будь-хто",
    },
    unencrypted: "Незашифровано",
  },
  action: {
    erase: {
      title: "Видалити кімнату",
      content:
        "Ви впевнені, що хочете видалити кімнату? Цю дію не можна скасувати. Усі повідомлення та медіафайли в кімнаті буде видалено з сервера!",
      fields: {
        block: "Заблокувати та заборонити користувачам приєднуватися до кімнати",
      },
      in_progress: "Видалення виконується…",
      background_note: "Ви можете закрити це вікно, видалення продовжиться у фоновому режимі.",
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
    join: {
      label: "Приєднати",
      title: "Приєднати користувача до %{roomName}",
      confirm: "Приєднати",
      content:
        "Введіть повний MXID користувача, якого потрібно приєднати до цієї кімнати.\nПримітка: ви повинні бути в кімнаті та мати дозвіл запрошувати користувачів.",
      success: "Користувача успішно додано до кімнати.",
      failure: "Не вдалося додати користувача до кімнати. %{errMsg}",
    },
    block: {
      label: "Заблокувати",
      title: "Заблокувати %{room}",
      title_bulk:
        "Заблокувати %{smart_count} кімнату |||| Заблокувати %{smart_count} кімнати |||| Заблокувати %{smart_count} кімнат",
      title_by_id: "Заблокувати кімнату",
      content: "Користувачі не зможуть приєднатися до цієї кімнати.",
      content_bulk:
        "Користувачі не зможуть приєднатися до %{smart_count} кімнати. |||| Користувачі не зможуть приєднатися до %{smart_count} кімнат. |||| Користувачі не зможуть приєднатися до %{smart_count} кімнат.",
      success: "Кімнату успішно заблоковано. |||| Кімнати успішно заблоковано. |||| Кімнат успішно заблоковано.",
      failure:
        "Не вдалося заблокувати кімнату. |||| Не вдалося заблокувати кімнати. |||| Не вдалося заблокувати кімнат.",
    },
    unblock: {
      label: "Розблокувати",
      success: "Кімнату успішно розблоковано. |||| Кімнати успішно розблоковано. |||| Кімнат успішно розблоковано.",
      failure:
        "Не вдалося розблокувати кімнату. |||| Не вдалося розблокувати кімнати. |||| Не вдалося розблокувати кімнат.",
    },
    purge_history: {
      label: "Очистити історію",
      title: "Очистити історію %{roomName}",
      content:
        "Усі події до обраної дати будуть видалені з бази даних. Стан кімнати (входи, виходи, тема) завжди зберігається. Принаймні одне повідомлення завжди залишається.\nПримітка: ця операція може зайняти кілька хвилин для великих кімнат.",
      date_label: "Очистити події до",
      delete_local: "Також видалити події локальних користувачів",
      in_progress: "Очищення виконується…",
      background_note: "Ви можете закрити це вікно, очищення продовжиться у фоновому режимі.",
      success: "Історію кімнати успішно очищено.",
      failure: "Не вдалося очистити історію кімнати. %{errMsg}",
    },
    quarantine_all: {
      label: "Помістити всі медіа на карантин",
      title: "Помістити на карантин усі медіа в %{roomName}",
      content:
        "Усі локальні та віддалені медіа в цій кімнаті будуть поміщені на карантин. Медіа на карантині стануть недоступними для користувачів.",
      success:
        "Успішно поміщено на карантин %{smart_count} медіа-елемент. |||| Успішно поміщено на карантин %{smart_count} медіа-елементів.",
      failure: "Не вдалося помістити медіа на карантин. %{errMsg}",
    },
    event_context: {
      lookup_title: "Пошук події за ID",
      jump_to_date: "Перейти до дати",
      direction: "Напрямок",
      forward: "Вперед",
      backward: "Назад",
      target_event: "Цільова подія",
      events_before: "Подій до",
      events_after: "Подій після",
      not_found: "Подію на вказаний час не знайдено",
      failure: "Не вдалося отримати контекст події",
    },
    messages: {
      load_older: "Завантажити старіші",
      load_newer: "Завантажити новіші",
      no_messages: "У цій кімнаті немає повідомлень",
      failure: "Не вдалося завантажити повідомлення",
      filter: "Фільтри",
      filter_type: "Типи подій",
      filter_sender: "Відправники",
      advanced_filters: "Розширені фільтри",
      filter_not_type: "Виключити типи подій",
      filter_not_sender: "Виключити відправників",
      contains_url: "Містить URL",
      any: "Будь-який",
      with_url: "Тільки з URL",
      without_url: "Тільки без URL",
      apply_filter: "Застосувати",
      clear_filters: "Скинути",
    },
    hierarchy: {
      load_more: "Завантажити ще",
      max_depth: "Максимальна глибина",
      unlimited: "Без обмежень",
      refresh: "Оновити",
      members: "%{count} учасників",
      space: "Простір",
      room: "Кімната",
      suggested: "Рекомендована",
      no_children: "У цій кімнаті немає дочірніх кімнат",
      failure: "Не вдалося завантажити ієрархію",
    },
  },
};

export default rooms;
