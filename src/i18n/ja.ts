// SPDX-FileCopyrightText: 2020 Michael Albert
// SPDX-FileCopyrightText: 2020 - 2024 Manuel Stahl
// SPDX-FileCopyrightText: 2021 Dirk Klimpel
// SPDX-FileCopyrightText: 2023 Przemysław Romanik
// SPDX-FileCopyrightText: 2024 Alexander Tumin
// SPDX-FileCopyrightText: 2024 - 2025 Borislav Pantaleev
// SPDX-FileCopyrightText: 2024 - 2025 Nikita Chernyi
// SPDX-FileCopyrightText: 2025 Suguru Hirahara
//
// SPDX-License-Identifier: Apache-2.0

import japaneseMessages from "@bicstone/ra-language-japanese";

import { SynapseTranslationMessages } from ".";

const ja: SynapseTranslationMessages = {
  ...japaneseMessages,
  ra: {
    ...japaneseMessages.ra,
    validation: {
      ...japaneseMessages.ra.validation,
      unique: "一意である必要があります",
    },
  },
  synapseadmin: {
    auth: {
      base_url: "ホームサーバーのURL",
      welcome: "%{name}にようこそ",
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
      },
    },
    rooms: {
      details: "ルームの詳細",
      tabs: {
        basic: "基本情報",
        members: "メンバー",
        detail: "詳細",
        permission: "権限",
        media: "メディア",
      },
    },
    reports: { tabs: { basic: "基本情報", detail: "詳細" } },
  },
  import_users: {
    error: {
      at_entry: "エントリー %{entry}: %{message}",
      error: "エラー",
      required_field: "必須のフィールド「%{field}」がありません",
      invalid_value:
        "%{row}行目に不正な値があります。「%{field}」のフィールドには「true」または「false」を指定してください",
      unreasonably_big: "ファイルは%{size}メガバイトで大きすぎるため、読み込みを行いませんでした",
      already_in_progress: "インポートを実行しています",
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
      send_success: "リクエストを送信しました。",
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
      send_success: "削除のリクエストを送信しました。",
      send_failure: "エラーが発生しました。",
    },
    helper: {
      send: "このAPIを使うとサーバーからリモートメディアファイルのキャッシュを削除できます。削除できるファイルは、ローカルのサムネイルファイルと、ダウンロードしたメディアファイルのコピーも含みます。サーバーのメディアリポジトリーにアップロードされたメディアファイルは削除できません。",
    },
  },
  resources: {
    users: {
      name: "ユーザー",
      email: "メールアドレス",
      msisdn: "電話番号",
      threepid: "メールアドレスまたは電話番号",
      membership: "メンバーシップ |||| メンバーシップ",
      fields: {
        avatar: "アバター",
        id: "ユーザーID",
        name: "名前",
        is_guest: "ゲスト",
        admin: "サーバーの管理者",
        locked: "ロック",
        suspended: "停止",
        deactivated: "無効化",
        erased: "消去",
        show_guests: "ゲストを表示",
        show_deactivated: "無効化されたユーザーを表示",
        show_locked: "ロックされたユーザーを表示",
        show_suspended: "停止されたユーザーを表示",
        user_id: "ユーザーを検索",
        displayname: "表示名",
        password: "パスワード",
        avatar_url: "アバターのURL",
        avatar_src: "アバター",
        medium: "Medium",
        threepids: "サードパーティーのID",
        address: "アドレス",
        creation_ts_ms: "作成日時",
        consent_version: "同意のバージョン",
        auth_provider: "プロバイダー",
        user_type: "ユーザーの種類",
      },
      helper: {
        password: "パスワードを変更すると、全てのセッションからログアウトします。",
        password_required_for_reactivation: "アカウントを再度有効にするにはパスワードを設定する必要があります",
        create_password: "以下のボタンで強力なパスワードを生成できます。",
        lock: "ユーザーにアカウントを使用できないよう設定。これは後から取り消せます。",
        deactivate: "アカウントを再度有効にするにはパスワードを設定する必要があります。",
        suspend: "ユーザーを停止すると、ユーザーは読み込み限定のモードに設定されます。",
        erase: "ユーザーをGDPRに準拠した形で消去",
        admin: "サーバーの管理者には、サーバーとユーザーに対する完全なコントロールの権利が与えられています。",
        erase_text:
          "ユーザーが送信したメッセージは、メッセージが送信された時点にルームに参加していたユーザーは今後もこれを閲覧できますが、その後で参加したユーザーには表示されません。",
        erase_admin_error: "自分自身のユーザーは削除できません。",
        modify_managed_user_error: "システムが管理しているユーザーは変更できません。",
        username_available: "ユーザー名は利用できます",
      },
      action: {
        erase: "ユーザーのデータを消去",
        erase_avatar: "アバターを消去",
        delete_media: "このユーザーがアップロードしたメディアファイルを削除",
        redact_events: "このユーザーが送信したイベントを削除",
        generate_password: "パスワードを生成",
        overwrite_title: "注意！",
        overwrite_content: "このユーザー名はすでに取得されています。既存のユーザーを上書きしてもよろしいですか？",
        overwrite_cancel: "キャンセル",
        overwrite_confirm: "上書きする",
      },
      badge: {
        you: "あなた",
        bot: "ボット",
        admin: "管理者",
        support: "サポート",
        regular: "一般ユーザー",
        federated: "フェデレーションユーザー",
        system_managed: "システム管理",
      },
      limits: {
        messages_per_second: "毎秒のメッセージ数",
        messages_per_second_text: "毎秒ごとに実行できるアクションの数。",
        burst_count: "バースト数",
        burst_count_text: "制限が実行されるまで行えるアクションの数。",
      },
      account_data: {
        title: "アカウントのデータ",
        global: "グローバル",
        rooms: "ルーム",
      },
    },
    rooms: {
      name: "ルーム",
      fields: {
        room_id: "ルームのID",
        name: "名称",
        canonical_alias: "エイリアス",
        joined_members: "メンバー",
        joined_local_members: "ローカルのメンバー",
        joined_local_devices: "ローカルの端末",
        state_events: "ステートイベント / 複雑さ",
        version: "バージョン",
        is_encrypted: "暗号化",
        encryption: "暗号化",
        federatable: "フェデレーションに対応",
        public: "ルームディレクトリーに表示",
        creator: "作成者",
        join_rules: "参加のルール",
        guest_access: "ゲストによるアクセス",
        history_visibility: "履歴の見え方",
        topic: "トピック",
        avatar: "アバター",
        actions: "アクション",
      },
      filter: {
        public_rooms: "公開ルーム",
        empty_rooms: "空のルーム",
      },
      helper: {
        forward_extremities:
          "転送末端（forward extremities）は、ルーム内の有向非巡回グラフ（DAG）の終端にあるイベント、つまり、子をもたないイベントのことをいいます。これが多ければ多いほど、Synapseが実行しなければならないステート解決（これは負荷の大きい作業です）の数も多くなります。Synapseには、ルーム内に存在する末端の数を減らす仕組みが備わっていますが、バグによりそれが機能しない場合があります。もしルームに10個以上の転送末端がある場合は、どのルームがそれを引き起こしているかを確認して #1760 で参照されているSQLクエリーで転送末端を削除することを検討してみてください。",
      },
      enums: {
        join_rules: {
          public: "公開",
          knock: "ノック",
          invite: "招待",
          private: "非公開",
        },
        guest_access: {
          can_join: "ゲスト参加可",
          forbidden: "ゲスト参加不可",
        },
        history_visibility: {
          invited: "招待以後",
          joined: "参加以後",
          shared: "共有以後",
          world_readable: "制限なし",
        },
        unencrypted: "非暗号化",
      },
      action: {
        erase: {
          title: "ルームの削除",
          content:
            "ルームを削除してよろしいですか？　これは取り消せません。ルームのメッセージとメディアファイルはサーバーから削除されます！",
          fields: {
            block: "ユーザーがルームに参加できないように設定",
          },
          success: "ルームを削除しました。",
          failure: "ルームを削除できませんでした。",
        },
        make_admin: {
          assign_admin: "管理者を任命",
          title: "%{roomName}のルームの管理者を任命",
          confirm: "管理者にする",
          content:
            "管理者に任命するユーザーのMXIDを入力してください。\n注意：これが機能するには、ルームには管理者となるローカルメンバーが最低1人以上いる必要があります。",
          success: "ユーザーをルームの管理者に設定しました。",
          failure: "ユーザーをルームの管理者に設定できませんでした。%{errMsg}",
        },
      },
    },
    reports: {
      name: "報告されたイベント",
      fields: {
        id: "ID",
        received_ts: "報告日時",
        user_id: "報告者",
        name: "ルーム名",
        score: "点数",
        reason: "理由",
        event_id: "イベントのID",
        event_json: {
          origin: "送信元のサーバー",
          origin_server_ts: "送信日時",
          type: "イベントの種類",
          content: {
            msgtype: "内容の種類",
            body: "内容",
            format: "形式",
            formatted_body: "フォーマット済の内容",
            algorithm: "アルゴリズム",
            url: "URL",
            info: {
              mimetype: "種類",
            },
          },
        },
      },
      action: {
        erase: {
          title: "報告されたイベントを削除",
          content: "報告されたイベントを削除してよろしいですか？これは取り消せません。",
        },
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
      },
      action: {
        erase: {
          title: "%{id}を削除",
          content: "「%{name}」を削除してよろしいですか？",
          success: "端末を削除しました。",
          failure: "エラーが発生しました。",
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
        create: "未保護。保護を実行",
        delete: "保護済。保護を削除",
        none: "検疫済",
        send_success: "保護に関する状態を変更しました。",
        send_failure: "エラーが発生しました。",
      },
    },
    quarantine_media: {
      action: {
        name: "検疫",
        create: "検疫に追加",
        delete: "検疫に追加されています。検疫から取り出す",
        none: "検疫によって保護されています",
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
        info: "ルームにアップロードされたメディアファイルの一覧です。外部のレポジトリーにアップロードされたメディアファイルは削除できません。",
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
        destination: "目的地",
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
      },
      helper: { length: "トークンが与えられていない場合のトークンの長さ。" },
    },
  },
  etkecc: {
    billing: {
      name: "請求",
      title: "支払い履歴",
      no_payments: "支払いが見つかりませんでした。",
      no_payments_helper: "誤りだと思われる場合は、etke.cc サポート（",
      description1: "ここから支払いの確認や請求書の作成ができます。サブスクリプション管理の詳細は",
      description2: "請求先メールアドレスの変更や会社情報の追加をご希望の場合は、etke.cc サポート（",
      fields: {
        transaction_id: "取引ID",
        email: "メール",
        type: "種別",
        amount: "金額",
        paid_at: "支払日",
        invoice: "請求書",
      },
      enums: {
        type: {
          subscription: "サブスクリプション",
          one_time: "単発",
        },
      },
      helper: {
        download_invoice: "請求書をダウンロード",
        downloading: "ダウンロード中...",
        download_started: "請求書のダウンロードを開始しました。",
        loading: "請求情報を読み込み中...",
        loading_failed1: "請求情報の読み込み中に問題が発生しました。",
        loading_failed2: "しばらくしてからもう一度お試しください。",
        loading_failed3: "問題が解消しない場合は、etke.cc サポート（",
        loading_failed4: "）まで、次のエラーメッセージを添えてご連絡ください:",
      },
    },
    status: {
      name: "サーバーステータス",
      badge: {
        default: "クリックしてサーバーステータスを表示",
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
      loading: "リアルタイムのサーバー健全性を取得しています... 少々お待ちください！",
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
      name: "サーバーコマンド",
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
      command_scheduled: "コマンドをスケジュールしました: %{command}",
      command_scheduled_args: "追加引数: %{args}",
      expect_prefix: "結果はまもなく",
      expect_suffix: "ページに表示されます。",
      notifications_link: "通知",
      command_help_title: "%{command} のヘルプ",
      scheduled_title_create: "スケジュール済みコマンドを作成",
      scheduled_title_edit: "スケジュール済みコマンドを編集",
      recurring_title_create: "繰り返しコマンドを作成",
      recurring_title_edit: "繰り返しコマンドを編集",
      scheduled_details_title: "スケジュール済みコマンドの詳細",
      recurring_warning:
        "繰り返しコマンドから作成されたスケジュール済みコマンドは、自動的に再生成されるため編集できません。代わりに繰り返しコマンドを編集してください。",
      command_details_intro: "コマンドの詳細は",
      form: {
        id: "ID",
        command: "コマンド",
        scheduled_at: "スケジュール時刻",
        day_of_week: "曜日",
      },
      delete_scheduled_title: "スケジュール済みコマンドを削除",
      delete_recurring_title: "繰り返しコマンドを削除",
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
          create_success: "繰り返しコマンドを作成しました",
          update_success: "繰り返しコマンドを更新しました",
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
      description: "サポートリクエストを開くか、既存のリクエストをフォローアップしてください。チームができるだけ早く対応します。",
      create_title: "新しいサポートリクエスト",
      no_requests: "まだサポートリクエストはありません。",
      no_messages: "まだメッセージはありません。",
      fields: {
        subject: "件名",
        message: "メッセージ",
        reply: "返信",
        status: "ステータス",
        created_at: "作成日",
        updated_at: "最終更新",
      },
      status: {
        active: "アクティブ",
        open: "オープン",
        closed: "クローズ",
        pending: "保留中",
      },
      buttons: {
        new_request: "新しいリクエスト",
        submit: "送信",
        cancel: "キャンセル",
        send: "送信",
        back: "サポートに戻る",
      },
      helper: {
        loading: "サポートリクエストを読み込み中...",
        reply_hint: "Ctrl+Enterで送信",
        reply_placeholder: "できる限り詳細な情報をご提供ください。なお、応答時間はサポートプランによって異なります。",
      },
      actions: {
        create_success: "サポートリクエストが正常に作成されました。",
        create_failure: "サポートリクエストの作成に失敗しました。",
        send_failure: "メッセージの送信に失敗しました。",
      },
    },
  },
};
export default ja;
