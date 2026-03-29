const reports = {
  name: "Скарга на подію |||| Скарги на події |||| Скарг на події",
  fields: {
    id: "ID",
    received_ts: "Час скарги",
    user_id: "Заявник",
    name: "Назва кімнати",
    score: "Оцінка",
    reason: "Причина",
    event_id: "ID події",
    sender: "Відправник",
  },
  action: {
    erase: {
      title: "Видалити повідомлення про подію",
      content: "Ви впевнені, що хочете видалити повідомлення про подію? Цю дію не можна скасувати.",
    },
    event_lookup: {
      label: "Пошук події",
      title: "Отримати подію за ID",
      fetch: "Отримати",
    },
    fetch_event_error: "Не вдалося отримати подію",
  },
};

export default reports;
