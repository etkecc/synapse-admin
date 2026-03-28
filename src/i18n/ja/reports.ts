const reports = {
  name: "報告されたイベント",
  fields: {
    id: "ID",
    received_ts: "報告日時",
    user_id: "報告者",
    name: "ルーム名",
    score: "点数",
    reason: "理由",
    event_id: "イベントのID",
    sender: "送信者",
  },
  action: {
    erase: {
      title: "報告されたイベントを削除",
      content: "報告されたイベントを削除してよろしいですか？これは取り消せません。",
    },
    event_lookup: {
      label: "イベント検索",
      title: "IDでイベントを取得",
      fetch: "取得",
    },
    fetch_event_error: "イベントの取得に失敗しました",
  },
};

export default reports;
