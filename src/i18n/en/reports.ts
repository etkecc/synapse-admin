const reports = {
  name: "Reported event |||| Reported events",
  fields: {
    id: "ID",
    received_ts: "Reported at",
    user_id: "Reporter",
    name: "Room Name",
    score: "Score",
    reason: "Reason",
    event_id: "Event ID",
    sender: "Sender",
  },
  action: {
    erase: {
      title: "Delete reported event",
      content: "Are you sure you want to delete the reported event? This cannot be undone.",
    },
    event_lookup: {
      label: "Look Up Event",
      title: "Look Up Event by ID",
      fetch: "Look Up",
    },
    fetch_event_error: "Failed to fetch event",
  },
};

export default reports;
