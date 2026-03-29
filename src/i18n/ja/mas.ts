const mas = {
  mas_users: {
    name: "MASユーザー |||| MASユーザー",
    fields: {
      id: "MAS ID",
      username: "ユーザー名",
      admin: "管理者",
      locked: "ロック済み",
      deactivated: "無効化済み",
      legacy_guest: "レガシーゲスト",
      created_at: "作成日時",
      locked_at: "ロック日時",
      deactivated_at: "無効化日時",
    },
    filter: {
      status: "状態",
      search: "検索",
      status_active: "アクティブ",
      status_locked: "ロック済み",
      status_deactivated: "無効化済み",
    },
    action: {
      lock: { label: "ロック", success: "ユーザーをロックしました" },
      unlock: { label: "ロック解除", success: "ユーザーのロックを解除しました" },
      deactivate: { label: "無効化", success: "ユーザーを無効化しました" },
      reactivate: { label: "再有効化", success: "ユーザーを再有効化しました" },
      set_admin: { label: "管理者権限を付与", success: "管理者ステータスを更新しました" },
      remove_admin: { label: "管理者権限を削除", success: "管理者ステータスを更新しました" },
      set_password: {
        label: "パスワードを設定",
        title: "パスワードを設定",
        success: "パスワードを設定しました",
        failure: "パスワードの設定に失敗しました",
      },
    },
  },
  mas_user_emails: {
    name: "メールアドレス |||| メールアドレス",
    empty: "メールアドレスなし",
    fields: {
      email: "メールアドレス",
      user_id: "ユーザーID",
      created_at: "作成日時",
      actions: "操作",
    },
    action: {
      remove: {
        label: "削除",
        title: "メールアドレスを削除",
        content: "%{email}を削除しますか？",
        success: "メールアドレスを削除しました",
      },
      create: { success: "メールアドレスを追加しました" },
    },
  },
  mas_compat_sessions: {
    name: "互換セッション |||| 互換セッション",
    empty: "互換セッションはありません",
    fields: {
      user_id: "ユーザーID",
      device_id: "デバイスID",
      created_at: "作成日時",
      user_agent: "ユーザーエージェント",
      last_active_at: "最終アクティブ",
      last_active_ip: "最終IP",
      finished_at: "終了日時",
      human_name: "名前",
      active: "アクティブ",
    },
    action: {
      finish: {
        label: "終了",
        title: "このセッションを終了してよろしいですか？",
        content: "このセッションを終了します。",
        success: "セッションを終了しました",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "OAuth2セッション |||| OAuth2セッション",
    empty: "OAuth2セッションはありません",
    fields: {
      user_id: "ユーザーID",
      client_id: "クライアントID",
      scope: "スコープ",
      created_at: "作成日時",
      user_agent: "ユーザーエージェント",
      last_active_at: "最終アクティブ",
      last_active_ip: "最終IP",
      finished_at: "終了日時",
      human_name: "名前",
      active: "アクティブ",
    },
    action: {
      finish: {
        label: "終了",
        title: "このセッションを終了してよろしいですか？",
        content: "このセッションを終了します。",
        success: "セッションを終了しました",
      },
    },
  },
  mas_policy_data: {
    name: "ポリシーデータ",
    current_policy: "現在のポリシー",
    no_policy: "現在ポリシーが設定されていません。",
    set_policy: "新しいポリシーを設定",
    invalid_json: "無効なJSON",
    fields: {
      json_placeholder: "ポリシーデータをJSONで入力…",
      created_at: "作成日時",
    },
    action: {
      save: {
        label: "ポリシーを設定",
        success: "ポリシーを更新しました",
        failure: "ポリシーの更新に失敗しました",
      },
    },
  },
  mas_user_sessions: {
    name: "ブラウザセッション |||| ブラウザセッション",
    fields: {
      user_id: "ユーザーID",
      created_at: "作成日時",
      finished_at: "終了日時",
      user_agent: "ユーザーエージェント",
      last_active_at: "最終アクティブ",
      last_active_ip: "最終IP",
      active: "アクティブ",
    },
    action: {
      finish: {
        label: "終了",
        title: "このセッションを終了してよろしいですか？",
        content: "このブラウザセッションを終了します。",
        success: "セッションを終了しました",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "上流OAuthリンク |||| 上流OAuthリンク",
    fields: {
      user_id: "ユーザーID",
      provider_id: "プロバイダーID",
      subject: "サブジェクト",
      human_account_name: "アカウント名",
      created_at: "作成日時",
    },
    helper: {
      provider_id: "上流OAuthプロバイダーのID。上流OAuthプロバイダーの一覧で確認できます。",
    },
    action: {
      remove: {
        label: "削除",
        title: "OAuthリンクを削除しますか？",
        content: "このユーザーの上流OAuthリンクが削除されます。",
        success: "OAuthリンクを削除しました",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "OAuthプロバイダー |||| OAuthプロバイダー",
    fields: {
      issuer: "発行者",
      human_name: "名前",
      brand_name: "ブランド",
      created_at: "作成日時",
      disabled_at: "無効化日時",
      enabled: "有効",
    },
  },
  mas_personal_sessions: {
    name: "個人セッション |||| 個人セッション",
    empty: "個人セッションはありません",
    fields: {
      owner_user_id: "所有者ID",
      actor_user_id: "ユーザー",
      human_name: "名前",
      scope: "スコープ",
      created_at: "作成日時",
      revoked_at: "失効日時",
      last_active_at: "最終アクティブ",
      last_active_ip: "最終IP",
      expires_at: "有効期限",
      expires_in: "有効期限（秒）",
      active: "アクティブ",
    },
    helper: {
      expires_in: "省略可能。トークンの有効期限（秒）。空欄の場合は無期限。",
    },
    action: {
      revoke: {
        label: "失効",
        title: "セッションを失効させますか？",
        content: "アクセストークンが永久に失効します。",
        success: "セッションを失効させました",
      },
      create: {
        token_title: "アクセストークンが作成されました",
        token_content: "このトークンをコピーしてください。このダイアログを閉じると二度と表示されません。",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "アクティブ",
      finished: "終了",
      revoked: "失効",
    },
  },
};

export default mas;
