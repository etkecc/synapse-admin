const misc_resources = {
  scheduled_tasks: {
    name: "スケジュールされたタスク |||| スケジュールされたタスク",
    fields: {
      id: "ID",
      action: "アクション",
      status: "ステータス",
      timestamp: "タイムスタンプ",
      resource_id: "リソースID",
      result: "結果",
      error: "エラー",
      max_timestamp: "この日付より前",
    },
    status: {
      scheduled: "スケジュール済み",
      active: "実行中",
      complete: "完了",
      cancelled: "キャンセル済み",
      failed: "失敗",
    },
  },
  connections: {
    name: "接続",
    fields: {
      last_seen: "日時",
      ip: "IPアドレス",
      user_agent: "ユーザーエージェント",
    },
  },
  devices: {
    name: "端末",
    fields: {
      device_id: "端末のID",
      display_name: "端末の名称",
      last_seen_ts: "タイムスタンプ",
      last_seen_ip: "IPアドレス",
      last_seen_user_agent: "ユーザーエージェント",
      dehydrated: "デハイドレート",
    },
    action: {
      erase: {
        title: "%{id}を削除",
        title_bulk: "%{smart_count} 件のデバイスを削除",
        content: "「%{name}」を削除してよろしいですか？",
        content_bulk: "%{smart_count} 件のデバイスを削除しますか？",
        success: "端末を削除しました。",
        failure: "エラーが発生しました。",
      },
      display_name: {
        success: "端末の名称を更新しました",
        failure: "端末の名称の更新に失敗しました",
      },
      create: {
        label: "端末を作成",
        title: "新しい端末を作成",
        success: "端末を作成しました",
        failure: "端末の作成に失敗しました",
      },
    },
  },
  users_media: {
    name: "メディアファイル",
    fields: {
      media_id: "メディアのID",
      media_length: "ファイルの大きさ（バイト数）",
      media_type: "種類",
      upload_name: "ファイル名",
      quarantined_by: "検疫の実行者",
      safe_from_quarantine: "検疫で保護",
      created_ts: "作成日時",
      last_access_ts: "最終アクセス",
    },
    action: {
      open: "メディアファイルを新しいウィンドウで開く",
    },
  },
  protect_media: {
    action: {
      create: "保護する",
      delete: "保護解除",
      none: "未保護",
      send_success: "保護に関する状態を変更しました。",
      send_failure: "エラーが発生しました。",
    },
  },
  quarantine_media: {
    action: {
      name: "検疫",
      create: "検疫",
      delete: "検疫解除",
      none: "検疫済",
      send_success: "検疫に関する状態を変更しました。",
      send_failure: "エラーが発生しました: %{error}",
    },
  },
  pushers: {
    name: "プッシュ",
    fields: {
      app: "アプリケーション",
      app_display_name: "アプリケーションの名称",
      app_id: "アプリケーションのID",
      device_display_name: "端末の名称",
      kind: "種類",
      lang: "言語",
      profile_tag: "プロフィールのタグ",
      pushkey: "プッシュ鍵",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "サーバーの告知",
    send: "サーバーの告知を送信",
    fields: {
      body: "メッセージ",
    },
    action: {
      send: "告知を送信",
      send_success: "サーバーの告知を送信しました。",
      send_failure: "エラーが発生しました。",
    },
    helper: {
      send: "サーバーの告知を指定したユーザーに送信。「サーバーの告知」機能がサーバーで有効になっている必要があります。",
    },
  },
  database_room_statistics: {
    name: "データベースルーム統計",
    fields: {
      room_id: "ルームID",
      estimated_size: "推定サイズ",
    },
    helper: {
      info: "Synapse データベース内の各ルームが使用する推定ディスク容量を表示します。数値は概算です。",
    },
  },
  user_media_statistics: {
    name: "ユーザーのメディア",
    fields: {
      media_count: "メディア数",
      media_length: "メディアの大きさ",
    },
  },
  forward_extremities: {
    name: "転送末端",
    fields: {
      id: "イベントのID",
      received_ts: "タイムスタンプ",
      depth: "深さ",
      state_group: "ステートのグループ",
    },
  },
  room_state: {
    name: "ステートイベント",
    fields: {
      type: "種類",
      content: "内容",
      origin_server_ts: "送信日時",
      sender: "送信元",
    },
  },
  room_media: {
    name: "メディア",
    fields: {
      media_id: "メディアのID",
    },
    helper: {
      info: "ルームにアップロードされたメディアファイルの一覧です。外部のリポジトリにアップロードされたメディアファイルは削除できません。",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "ルームのディレクトリー",
    fields: {
      world_readable: "ゲストユーザーは参加せず閲覧可",
      guest_can_join: "ゲストユーザーが参加可能",
    },
    action: {
      title: "ルームをディレクトリーから削除 |||| %{smart_count}個のルームをディレクトリーから削除",
      content:
        "このルームをディレクトリーから削除してよろしいですか？ |||| %{smart_count}個のルームをディレクトリーから削除してよろしいですか？",
      erase: "ルームをディレクトリーから削除",
      create: "ルームをディレクトリーで公開",
      send_success: "ルームを公開しました。",
      send_failure: "エラーが発生しました。",
    },
  },
  destinations: {
    name: "フェデレーション",
    fields: {
      destination: "接続先",
      failure_ts: "失敗した時点のタイムスタンプ",
      retry_last_ts: "最後に試行した時点のタイムスタンプ",
      retry_interval: "再試行までの間隔",
      last_successful_stream_ordering: "最後に成功したストリーム",
      stream_ordering: "ストリーム",
    },
    action: { reconnect: "再接続" },
  },
  registration_tokens: {
    name: "登録トークン",
    fields: {
      token: "トークン",
      valid: "有効なトークン",
      uses_allowed: "使用が許可",
      pending: "保留中",
      completed: "完了",
      expiry_time: "期限切れとなる日時",
      length: "長さ",
      created_at: "作成日時",
      last_used_at: "最終使用日時",
      revoked_at: "失効日時",
    },
    helper: { length: "トークンが与えられていない場合のトークンの長さ。" },
    action: {
      revoke: {
        label: "失効",
        success: "トークンを失効しました",
      },
      unrevoke: {
        label: "復元",
        success: "トークンが復元されました",
      },
    },
  },
};

export default misc_resources;
