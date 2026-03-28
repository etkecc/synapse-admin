const reports = {
  name: "Reported event |||| Reported events",
  fields: {
    id: "ID",
    received_ts: "Report Time",
    user_id: "Announcer",
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
      label: "Event Lookup",
      title: "Fetch Event by ID",
      fetch: "Fetch",
    },
    fetch_event_error: "Failed to fetch event",
  },
};

export default reports;
