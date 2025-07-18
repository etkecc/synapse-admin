import chineseMessages from "@haxqer/ra-language-chinese";

import { SynapseTranslationMessages } from ".";

const fixedChineseMessages = {
  ...chineseMessages,
  ra: {
    ...chineseMessages.ra,
    navigation: {
      ...chineseMessages.ra.navigation,
      no_filtered_results: "没有结果",
      clear_filters: "清除所有过滤器",
    },
    auth: {
      ...chineseMessages.ra.auth,
      email: "邮箱",
    },
    action: {
      ...chineseMessages.ra.action,
      update_application: "更新应用",
      select_all_button: "全部选择",
    },
    page: {
      ...chineseMessages.ra.page,
      access_denied: "拒绝访问",
      authentication_error: "认证错误",
    },
    message: {
      ...chineseMessages.ra.message,
      access_denied: "您没有访问此页面的权限。",
      authentication_error: "身份验证服务器返回错误，无法验证您的凭据。",
      select_all_limit_reached: "选择的元素太多。只选择了前 %{max} 个元素。",
      placeholder_data_warning: "网络问题：数据刷新失败。",
    },
  },
};

const zh: SynapseTranslationMessages = {
  ...fixedChineseMessages,
  synapseadmin: {
    auth: {
      base_url: "服务器 URL",
      welcome: "欢迎来到 Synapse Admin",
      server_version: "Synapse 版本",
      username_error: "请输入完整有效的用户 ID: '@user:domain'",
      protocol_error: "URL 需要以'http://'或'https://'作为起始",
      url_error: "不是一个有效的 Matrix 服务器地址",
      sso_sign_in: "使用 SSO 登录",
      credentials: "凭证",
      access_token: "访问令牌",
      logout_acces_token_dialog: {
        title: "您正在使用现有的 Matrix 访问令牌。",
        content: "您想销毁此会话（可能在其他地方使用，例如在 Matrix 客户端中）还是仅从管理面板退出？",
        confirm: "销毁会话",
        cancel: "仅从管理面板退出",
      },
    },
    users: {
      invalid_user_id: "必须要是一个有效的 Matrix 用户 ID ，例如 @user_id:homeserver",
      tabs: { sso: "SSO", experimental: "实验性", limits: "限制", account_data: "账户数据" },
    },
    rooms: {
      tabs: {
        basic: "基本",
        members: "成员",
        detail: "细节",
        permission: "权限",
        media: "媒体",
      },
    },
    reports: { tabs: { basic: "基本", detail: "细节" } },
  },
  import_users: {
    error: {
      at_entry: "在条目 %{entry}: %{message}",
      error: "错误",
      required_field: "需要的值 '%{field}' 未被设置。",
      invalid_value: "第 %{row} 行出现无效值。 '%{field}' 只可以是 'true' 或 'false'。",
      unreasonably_big: "拒绝加载过大的文件： %{size} MB",
      already_in_progress: "一个导入进程已经在运行中",
      id_exits: "ID %{id} 已经存在",
    },
    title: "通过 CSV 导入用户",
    goToPdf: "转到 PDF",
    cards: {
      importstats: {
        header: "分析用于导入的用户",
        users_total: "%{smart_count} 用户在 CSV 文件中 |||| %{smart_count} 用户在 CSV 文件中",
        guest_count: "%{smart_count} 访客 |||| %{smart_count} 访客",
        admin_count: "%{smart_count} 管理员 |||| %{smart_count} 管理员",
      },
      conflicts: {
        header: "冲突处理策略",
        mode: {
          stop: "在冲突处停止",
          skip: "显示错误并跳过冲突",
        },
      },
      ids: {
        header: "IDs",
        all_ids_present: "每条记录的 ID",
        count_ids_present: "%{smart_count} 个含 ID 的记录 |||| %{smart_count} 个含 ID 的记录",
        mode: {
          ignore: "忽略 CSV 中的 ID 并创建新的",
          update: "更新已经存在的记录",
        },
      },
      passwords: {
        header: "密码",
        all_passwords_present: "每条记录的密码",
        count_passwords_present: "%{smart_count} 个含密码的记录 |||| %{smart_count} 个含密码的记录",
        use_passwords: "使用 CSV 中标记的密码",
      },
      upload: {
        header: "导入 CSV 文件",
        explanation:
          "在这里，你可以上传一个用逗号分隔的文件，用于创建或更新用户。该文件必须包括 'id' 和 'displayname' 字段。你可以在这里下载并修改一个示例文件：",
      },
      startImport: {
        simulate_only: "模拟模式",
        run_import: "导入",
      },
      results: {
        header: "导入结果",
        total: "共计 %{smart_count} 条记录 |||| 共计 %{smart_count} 条记录",
        successful: "%{smart_count} 条记录导入成功",
        skipped: "跳过 %{smart_count} 条记录",
        download_skipped: "下载跳过的记录",
        with_error: "%{smart_count} 条记录出现错误 ||| %{smart_count} 条记录出现错误",
        simulated_only: "只是一次模拟运行",
      },
    },
  },
  delete_media: {
    name: "媒体文件",
    fields: {
      before_ts: "最后访问时间",
      size_gt: "大于 (字节)",
      keep_profiles: "保留头像",
    },
    action: {
      send: "删除媒体",
      send_success: "请求发送成功。",
      send_failure: "出现了一个错误。",
    },
    helper: {
      send: "这个API会删除您硬盘上的本地媒体。包含了任何的本地缓存和下载的媒体备份。这个API不会影响上传到外部媒体存储库上的媒体文件。",
    },
  },
  purge_remote_media: {
    name: "远程媒体",
    fields: {
      before_ts: "最后访问于之前",
    },
    action: {
      send: "清除远程媒体",
      send_success: "远程媒体清除请求已发送。",
      send_failure: "发生错误，远程媒体清除请求未成功。",
    },
    helper: {
      send: "此API清除您服务器磁盘上的远程媒体缓存。这包括任何本地缩略图和下载的媒体副本。此API不会影响已经上传到服务器媒体存储库的媒体。",
    },
  },
  resources: {
    users: {
      name: "用户",
      email: "邮箱",
      msisdn: "电话",
      threepid: "邮箱 / 电话",
      fields: {
        avatar: "邮箱",
        id: "用户 ID",
        name: "用户名",
        is_guest: "访客",
        admin: "服务器管理员",
        locked: "锁定",
        deactivated: "被禁用",
        suspended: "被锁定",
        guests: "显示访客",
        show_deactivated: "显示被禁用的账户",
        show_locked: "显示被锁定的账户",
        show_suspended: "显示被锁定的账户",
        user_id: "搜索用户",
        displayname: "显示名字",
        password: "密码",
        avatar_url: "头像 URL",
        avatar_src: "头像",
        medium: "Medium",
        threepids: "3PIDs",
        address: "地址",
        creation_ts_ms: "创建时间戳",
        consent_version: "协议版本",
      },
      helper: {
        password: "更改密码会使用户注销所有会话。",
        password_required_for_reactivation: "您必须提供一串密码来激活账户。",
        create_password: "使用下面的按钮生成一个强大和安全的密码。",
        deactivate: "您必须提供一串密码来激活账户。",
        suspend: "您必须提供一串密码来暂停账户。",
        erase: "将用户标记为根据 GDPR 的要求抹除了",
        admin: "服务器管理员对服务器和其用户有完全的控制权。",
        lock: "阻止用户使用服务器。这是一个非破坏性的操作，可以被撤销。",
        erase_text:
          "这意味着用户发送的信息对于发送信息时在房间内的任何人来说都是可见的，但对于之后加入房间的用户来说则是隐藏的。",
        erase_admin_error: "不允许删除自己的用户",
        modify_managed_user_error: "不允许修改系统管理的用户。",
        username_available: "用户名可用",
      },
      badge: {
        you: "您",
        bot: "机器人",
        admin: "管理员",
        support: "支持",
        regular: "普通用户",
        system_managed: "系统管理",
      },
      action: {
        erase: "抹除用户信息",
        erase_avatar: "抹掉头像",
        delete_media: "删除用户上传的所有媒体",
        redact_events: "重新编辑用户（-s）发送的所有事件",
        generate_password: "生成密码",
        overwrite_title: "警告！",
        overwrite_content: "这个用户名已经被占用。您确定要覆盖现有的用户吗？",
        overwrite_cancel: "取消",
        overwrite_confirm: "覆盖",
      },
      limits: {
        messages_per_second: "每秒消息数",
        messages_per_second_text: "每秒可以执行的操作数。",
        burst_count: "Burst-计数",
        burst_count_text: "在限制之前可以执行的操作数。",
      },
      account_data: {
        title: "账户数据",
        global: "全局",
        rooms: "房间",
      },
    },
    rooms: {
      name: "房间",
      fields: {
        room_id: "房间 ID",
        name: "房间名",
        canonical_alias: "别名",
        joined_members: "成员",
        joined_local_members: "本地成员",
        state_events: "状态事件",
        version: "版本",
        is_encrypted: "已经加密",
        encryption: "加密",
        federatable: "可联合的",
        public: "公开",
        creator: "创建者",
        join_rules: "加入规则",
        guest_access: "访客访问",
        history_visibility: "历史可见性",
        topic: "主题",
        avatar: "头像",
        actions: "操作",
      },
      enums: {
        join_rules: {
          public: "公开",
          knock: "申请",
          invite: "邀请",
          private: "私有",
        },
        guest_access: {
          can_join: "访客可以加入",
          forbidden: "访客不可加入",
        },
        history_visibility: {
          invited: "自从被邀请",
          joined: "自从加入",
          shared: "自从分享",
          world_readable: "任何人",
        },
        unencrypted: "未加密",
      },
    },
    reports: {
      name: "报告事件",
      fields: {
        id: "ID",
        received_ts: "报告时间",
        user_id: "报告者",
        name: "房间名",
        score: "分数",
        reason: "原因",
        event_id: "事件 ID",
        event_json: {
          origin: "原始服务器",
          origin_server_ts: "发送时间",
          type: "事件类型",
          content: {
            msgtype: "内容类型",
            body: "内容",
            format: "格式",
            formatted_body: "格式化的数据",
            algorithm: "算法",
          },
        },
      },
    },
    connections: {
      name: "连接",
      fields: {
        last_seen: "日期",
        ip: "IP 地址",
        user_agent: "用户代理 (UA)",
      },
    },
    devices: {
      name: "设备",
      fields: {
        device_id: "设备 ID",
        display_name: "设备名",
        last_seen_ts: "时间戳",
        last_seen_ip: "IP 地址",
      },
      action: {
        erase: {
          title: "移除 %{id}",
          content: '您确定要移除设备 "%{name}"?',
          success: "设备移除成功。",
          failure: "出现了一个错误。",
        },
      },
    },
    users_media: {
      name: "媒体文件",
      fields: {
        media_id: "媒体文件 ID",
        media_length: "长度",
        media_type: "类型",
        upload_name: "文件名",
        quarantined_by: "被隔离",
        safe_from_quarantine: "取消隔离",
        created_ts: "创建",
        last_access_ts: "上一次访问",
      },
    },
    pushers: {
      name: "发布者",
      fields: {
        app: "App",
        app_display_name: "App 名称",
        app_id: "App ID",
        device_display_name: "设备显示名",
        kind: "类型",
        lang: "语言",
        profile_tag: "数据标签",
        pushkey: "Pushkey",
        data: { url: "URL" },
      },
    },
    servernotices: {
      name: "服务器提示",
      send: "发送服务器提示",
      fields: {
        body: "信息",
      },
      action: {
        send: "发送提示",
        send_success: "服务器提示发送成功。",
        send_failure: "出现了一个错误。",
      },
      helper: {
        send: '向选中的用户发送服务器提示。服务器配置中的 "服务器提示(Server Notices)" 选项需要被设置为启用。',
      },
    },
    user_media_statistics: {
      name: "用户的媒体文件",
      fields: {
        media_count: "媒体文件统计",
        media_length: "媒体文件长度",
      },
    },
    room_media: {
      name: "媒体",
      fields: {
        media_id: "媒体ID",
      },
      helper: {
        info: "这是上传到房间的媒体列表。无法删除上传到外部媒体存储库的媒体。",
      },
      action: {
        error: "%{errcode} (%{errstatus}) %{error}",
      },
    },
  },
};
export default zh;
