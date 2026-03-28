const reports = {
  name: "Жалоба |||| Жалобы",
  fields: {
    id: "ID",
    received_ts: "Время жалобы",
    user_id: "Заявитель",
    name: "Название комнаты",
    score: "Оценка",
    reason: "Причина",
    event_id: "ID события",
    sender: "Отправитель",
  },
  action: {
    erase: {
      title: "Удалить жалобу",
      content: "Действительно удалить жалобу? Это действие будет невозможно отменить.",
    },
    event_lookup: {
      label: "Поиск события",
      title: "Получить событие по ID",
      fetch: "Получить",
    },
    fetch_event_error: "Не удалось получить событие",
  },
};

export default reports;
