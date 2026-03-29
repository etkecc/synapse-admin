import _japaneseMessages from "@bicstone/ra-language-japanese";

const japaneseMessages = (
  "default" in _japaneseMessages ? _japaneseMessages.default : _japaneseMessages
) as typeof _japaneseMessages;

const fixedJapaneseMessages = {
  ...japaneseMessages,
  ra: {
    ...japaneseMessages.ra,
    guesser: {
      empty: {
        title: "表示するデータがありません",
        message: "データプロバイダーを確認してください",
      },
    },
    validation: {
      ...japaneseMessages.ra.validation,
      unique: "一意である必要があります",
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const common: Record<string, any> = {
  ...fixedJapaneseMessages,
  ketesa: {
    auth: {
      base_url: "ホームサーバーのURL",
      welcome: "%{name}にようこそ",
      description:
        "Synapse Adminの進化形。シンプルなひとつのインターフェースで、Matrixサーバーの管理・監視・運用を完結。小規模なプライベートサーバーから大規模なフェデレーションコミュニティまで、幅広く対応します。",
      server_version: "Synapseのバージョン",
      supports_specs: "次のMatrixのスペックをサポートしています",
      username_error: "有効なユーザーIDを入力してください。形式は「@user:domain」です。",
      protocol_error: "URLの先頭には「http://」または「https://」を置いてください",
      url_error: "正しいMatrixのサーバーのURLではありません",
      sso_sign_in: "シングルサインオン",
      credentials: "認証情報",
      access_token: "アクセストークン",
      logout_acces_token_dialog: {
        title: "既存のMatrixアクセストークンが使われています。",
        content:
          "このセッションを破棄しますか？　このセッションは、Matrixのクライアントなどで使われている可能性があります。または、管理パネルからログアウトしますか？",
        confirm: "破棄する",
        cancel: "管理パネルからログアウト",
      },
    },
    users: {
      invalid_user_id: "ホームサーバーが指定されていないMatrixのユーザーIDです。",
      tabs: {
        sso: "シングルサインオン",
        experimental: "実験的",
        limits: "レート制限",
        account_data: "アカウントのデータ",
        sessions: "セッション",
      },
      danger_zone: "要注意",
    },
    rooms: {
      details: "ルームの詳細",
      tabs: {
        basic: "基本情報",
        members: "メンバー",
        detail: "詳細",
        permission: "権限",
        media: "メディア",
        messages: "メッセージ",
        hierarchy: "階層",
      },
    },
    reports: { tabs: { basic: "基本情報", detail: "詳細" } },
    admin_config: {
      soft_failed_events: "ソフト失敗イベント",
      spam_flagged_events: "スパムとしてフラグされたイベント",
      success: "管理者設定を更新しました",
      failure: "管理者設定の更新に失敗しました",
    },
  },
  import_users: {
    error: {
      at_entry: "エントリー %{entry}: %{message}",
      error: "エラー",
      required_field: "必須のフィールド「%{field}」がありません",
      invalid_value:
        "%{row}行目に不正な値があります。「%{field}」のフィールドには「true」または「false」を指定してください",
      unreasonably_big: "ファイルは%{size}メガバイトで大きすぎるため、読み込めませんでした",
      already_in_progress: "インポートしています",
      id_exits: "ID %{id} は既に存在しています",
    },
    title: "CSVでユーザーをインポート",
    goToPdf: "Go to PDF",
    cards: {
      importstats: {
        header: "インポートするユーザー",
        users_total: "CSVファイルの%{smart_count}人のユーザー",
        guest_count: "%{smart_count}人のゲスト",
        admin_count: "%{smart_count}人の管理者",
      },
      conflicts: {
        header: "競合を処理する方針",
        mode: {
          stop: "競合の発生時に停止",
          skip: "エラーを表示して競合をスキップ",
        },
      },
      ids: {
        header: "ID",
        all_ids_present: "全てのエントリーにIDsがあります",
        count_ids_present: "%{smart_count}個のエントリーにIDがあります",
        mode: {
          ignore: "CSVファイルのIDを無視し、新しいIDを作成",
          update: "既存のレコードを更新",
        },
      },
      passwords: {
        header: "パスワード",
        all_passwords_present: "全てのエントリーにパスワードがあります",
        count_passwords_present: "%{smart_count}個のエントリーにパスワードがあります",
        use_passwords: "CSVファイルのパスワードを使用",
      },
      upload: {
        header: "CSVファイルを送信",
        explanation:
          "作成またはアップデートするユーザーをコンマで区切って入力したファイルをアップロードできます。ファイルには「id」と「displayname」のフィールドを含めてください。参照用のファイルは以下からダウンロードできます。",
      },
      startImport: {
        simulate_only: "シミュレーション",
        run_import: "インポート",
      },
      results: {
        header: "インポートの結果",
        total: "合計%{smart_count}個のエントリー",
        successful: "%{smart_count}個のエントリーをインポートしました",
        skipped: "%{smart_count}個のエントリーをスキップしました",
        download_skipped: "スキップしたエントリーをダウンロード",
        with_error: "%{smart_count}個のエントリーでエラーが発生しました",
        simulated_only: "シミュレーションのみ実行",
      },
    },
  },
  delete_media: {
    name: "メディアファイル",
    fields: {
      before_ts: "最終アクセス日時がこれより以前のもの",
      size_gt: "サイズがこれより大きいもの（バイト）",
      keep_profiles: "プロフィールの画像は削除しない",
    },
    action: {
      send: "メディアファイルを削除",
      send_success: "%{smart_count}件のメディアファイルを削除しました。",
      send_success_none: "指定された条件に一致するメディアファイルはありませんでした。何も削除されていません。",
      send_failure: "エラーが発生しました。",
    },
    helper: {
      send: "このAPIを使うとサーバーからローカルメディアファイルを削除できます。削除できるファイルは、ローカルのサムネイルファイルと、ダウンロードしたメディアファイルのコピーも含みます。外部のメディアリポジトリーにアップロードされたメディアファイルは削除できません。",
    },
  },
  purge_remote_media: {
    name: "リモートのメディアファイル",
    fields: {
      before_ts: "最終アクセス日時がこれより以前のもの",
    },
    action: {
      send: "リモートのメディアファイルを削除",
      send_success: "%{smart_count}件のリモートメディアファイルを削除しました。",
      send_success_none: "指定された条件に一致するリモートメディアファイルはありませんでした。何も削除されていません。",
      send_failure: "エラーが発生しました。",
    },
    helper: {
      send: "このAPIを使うとサーバーからリモートメディアファイルのキャッシュを削除できます。削除できるファイルは、ローカルのサムネイルファイルと、ダウンロードしたメディアファイルのコピーも含みます。サーバーのメディアリポジトリーにアップロードされたメディアファイルは削除できません。",
    },
  },
  etkecc: {
    billing: {
      name: "請求",
      title: "支払履歴",
      no_payments: "支払が見つかりませんでした。",
      no_payments_helper: "誤りだと思われる場合は、etke.cc サポート（",
      description1: "ここから支払の確認や請求書の作成ができます。サブスクリプション管理の詳細は",
      description2: "請求先メールアドレスの変更や会社情報の追加をご希望の場合は、etke.cc サポート（",
      fields: {
        transaction_id: "取引ID",
        email: "メール",
        type: "種類",
        amount: "金額",
        paid_at: "支払日",
        invoice: "請求書",
      },
      enums: {
        type: {
          subscription: "サブスクリプション",
          one_time: "一度のみ",
        },
      },
      helper: {
        download_invoice: "請求書をダウンロード",
        downloading: "ダウンロードしています…",
        download_started: "請求書のダウンロードを開始しました。",
        invoice_not_available: "保留中",
        loading: "請求情報を読み込んでいます…",
        loading_failed1: "請求情報を読み込めませんでした。",
        loading_failed2: "しばらくしてからもう一度お試しください。",
        loading_failed3: "問題が解消しない場合は、etke.cc サポート（",
        loading_failed4: "）まで、次のエラーメッセージを添付してご連絡ください:",
      },
    },
    status: {
      name: "サーバーの状態",
      badge: {
        default: "クリックしてサーバーの状態を表示",
        running: "実行中: %{command}。%{text}",
      },
      category: {
        "Host Metrics": "ホストメトリクス",
        Network: "ネットワーク",
        HTTP: "HTTP",
        Matrix: "Matrix",
      },
      status: "ステータス",
      error: "エラー",
      loading: "現在のサーバーの状態を確認しています... 少々お待ちください！",
      intro1: "これはサーバーのリアルタイム監視レポートです。詳しくは",
      intro2: "以下のチェック内容が気になる場合は、推奨される対処方法を",
      help: "ヘルプ",
    },
    maintenance: {
      title: "現在、システムはメンテナンスモードです。",
      try_again: "しばらくしてからもう一度お試しください。",
      note: "この件についてサポートに連絡する必要はありません。すでに対応中です！",
    },
    actions: {
      name: "サーバーのコマンド",
      available_title: "利用可能なコマンド",
      available_description: "以下のコマンドを実行できます。",
      available_help_intro: "各コマンドの詳細は",
      scheduled_title: "スケジュール済みコマンド",
      scheduled_description:
        "以下のコマンドは指定した時刻に実行されるようスケジュールされています。詳細を確認し、必要に応じて変更できます。",
      recurring_title: "繰り返しコマンド",
      recurring_description:
        "以下のコマンドは毎週、指定した曜日と時刻に実行されるよう設定されています。詳細を確認し、必要に応じて変更できます。",
      scheduled_help_intro: "このモードの詳細は",
      recurring_help_intro: "このモードの詳細は",
      maintenance_title: "現在、システムはメンテナンスモードです。",
      maintenance_try_again: "しばらくしてからもう一度お試しください。",
      maintenance_note: "この件についてサポートに連絡する必要はありません。すでに対応中です！",
      maintenance_commands_blocked: "メンテナンスモードが解除されるまでコマンドは実行できません。",
      table: {
        command: "コマンド",
        description: "説明",
        arguments: "引数",
        is_recurring: "繰り返し？",
        run_at: "実行（ローカル時間）",
        next_run_at: "次回実行（ローカル時間）",
        time_utc: "時刻（UTC）",
        time_local: "時刻（ローカル）",
      },
      buttons: {
        create: "作成",
        update: "更新",
        back: "戻る",
        delete: "削除",
        run: "実行",
      },
      command_scheduled: "コマンドを予約しました: %{command}",
      command_scheduled_args: "追加引数: %{args}",
      expect_prefix: "結果はまもなく",
      expect_suffix: "ページに表示されます。",
      notifications_link: "通知",
      command_help_title: "%{command} のヘルプ",
      scheduled_title_create: "スケジュール済みのコマンドを作成",
      scheduled_title_edit: "スケジュール済みのコマンドを編集",
      recurring_title_create: "繰り返し用のコマンドを作成",
      recurring_title_edit: "繰り返し用のコマンドを編集",
      scheduled_details_title: "スケジュール済みのコマンドの詳細",
      recurring_warning:
        "繰り返し用のコマンドから作成したスケジュール用のコマンドは、自動的に再生成されるため編集できません。代わりに繰り返し用のコマンドを編集してください。",
      command_details_intro: "コマンドの詳細",
      form: {
        id: "ID",
        command: "コマンド",
        scheduled_at: "予定時刻",
        day_of_week: "曜日",
      },
      delete_scheduled_title: "スケジュール済みコマンドを削除",
      delete_recurring_title: "繰り返し用のコマンドを削除",
      delete_confirm: "コマンド %{command} を削除してもよろしいですか？",
      errors: {
        unknown: "不明なエラーが発生しました",
        delete_failed: "エラー: %{error}",
      },
      days: {
        monday: "月曜日",
        tuesday: "火曜日",
        wednesday: "水曜日",
        thursday: "木曜日",
        friday: "金曜日",
        saturday: "土曜日",
        sunday: "日曜日",
      },
      scheduled: {
        action: {
          create_success: "スケジュール済みコマンドを作成しました",
          update_success: "スケジュール済みコマンドを更新しました",
          update_failure: "エラーが発生しました",
          delete_success: "スケジュール済みコマンドを削除しました",
          delete_failure: "エラーが発生しました",
        },
      },
      recurring: {
        action: {
          create_success: "繰り返し用のコマンドを作成しました",
          update_success: "繰り返し用のコマンドを更新しました",
          update_failure: "エラーが発生しました",
          delete_success: "繰り返しコマンドを削除しました",
          delete_failure: "エラーが発生しました",
        },
      },
    },
    notifications: {
      title: "通知",
      new_notifications: "新しい通知 %{smart_count} 件",
      no_notifications: "通知はまだありません",
      see_all: "すべての通知を見る",
      clear_all: "すべてクリア",
      ago: "前",
    },
    currently_running: {
      command: "現在実行中:",
      started_ago: "（%{time} 前に開始）",
    },
    time: {
      less_than_minute: "数秒",
      minutes: "%{smart_count} 分",
      hours: "%{smart_count} 時間",
      days: "%{smart_count} 日",
      weeks: "%{smart_count} 週間",
      months: "%{smart_count} か月",
    },
    support: {
      name: "サポート",
      menu_label: "サポートに連絡",
      description: "サポートリクエストを開くか、既存のリクエストに情報を追加してください。チームが早急に対応します。",
      create_title: "新しいサポートリクエスト",
      no_requests: "サポートリクエストはありません。",
      no_messages: "メッセージはありません。",
      closed_message: "このリクエストは終了しました。まだ問題がある場合は、新しいリクエストを送信してください。",
      fields: {
        subject: "件名",
        message: "メッセージ",
        reply: "返信",
        status: "ステータス",
        created_at: "作成日",
        updated_at: "最終更新",
      },
      status: {
        active: "オペレーターの対応待ち",
        open: "オープン",
        closed: "終了",
        pending: "あなたの返答待ち",
      },
      buttons: {
        new_request: "新しいリクエスト",
        submit: "送信",
        cancel: "キャンセル",
        send: "送信",
        back: "サポートに戻る",
      },
      helper: {
        loading: "サポートリクエストを読み込んでいます...",
        reply_hint: "Ctrl+Enterで送信",
        reply_placeholder: "できる限り詳細な情報を記入してください。",
        before_contact_title: "お問い合わせの前に",
        help_pages_prompt: "まずヘルプページをご確認ください：",
        services_prompt: "提供するサービスはサービスページに記載されたもののみです：",
        topics_prompt: "対応できるのは対応トピックのみです：",
        scope_confirm_label: "ヘルプページを確認し、この依頼が対応トピックに該当することを確認しました。",
        english_only_notice: "サポートは英語のみで提供されます。",
        response_time_prompt: "48時間以内に回答します。より早い対応が必要な場合は、こちらをご覧ください：",
      },
      actions: {
        create_success: "サポートリクエストを作成しました。",
        create_failure: "サポートリクエストを作成できませんでした。",
        send_failure: "メッセージを送信できませんでした。",
      },
    },
  },
};

export default common;
