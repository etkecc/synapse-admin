import _chineseMessages from "@haxqer/ra-language-chinese";

const chineseMessages = (
  "default" in _chineseMessages ? _chineseMessages.default : _chineseMessages
) as typeof _chineseMessages;

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
    guesser: {
      empty: {
        title: "没有可显示的数据",
        message: "请检查数据提供程序",
      },
    },
  },
};

const { prev: _zhPrev, ...zhNavigation } = fixedChineseMessages.ra
  .navigation as typeof fixedChineseMessages.ra.navigation & { prev?: unknown };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const common: Record<string, any> = {
  ...fixedChineseMessages,
  ra: {
    ...fixedChineseMessages.ra,
    navigation: zhNavigation,
    action: {
      ...fixedChineseMessages.ra.action,
      reset: "重置",
      search_columns: "搜索列",
    },
    notification: {
      ...fixedChineseMessages.ra.notification,
      offline: "离线。无法获取数据。",
    },
    validation: {
      ...fixedChineseMessages.ra.validation,
      unique: "必须唯一",
    },
  },
  ketesa: {
    auth: {
      base_url: "服务器 URL",
      welcome: "欢迎来到 %{name}",
      description: "Synapse Admin 的进化之作。通过一个简洁的界面，完成对 Matrix 服务器的管理、监控与维护。无论是小型私人服务器还是大型联邦社区，都能轻松应对。",
      server_version: "Synapse 版本",
      username_error: "请输入完整有效的用户 ID: '@user:domain'",
      protocol_error: "URL 需要以'http://'或'https://'作为起始",
      url_error: "不是一个有效的 Matrix 服务器地址",
      sso_sign_in: "使用 SSO 登录",
      credentials: "凭证",
      access_token: "访问令牌",
      supports_specs: "支持 Matrix 规范",
      logout_acces_token_dialog: {
        title: "您正在使用现有的 Matrix 访问令牌。",
        content: "您想销毁此会话（可能在其他地方使用，例如在 Matrix 客户端中）还是仅从管理面板退出？",
        confirm: "销毁会话",
        cancel: "仅从管理面板退出",
      },
    },
    users: {
      invalid_user_id: "必须要是一个有效的 Matrix 用户 ID ，例如 @user_id:homeserver",
      tabs: { sso: "SSO", experimental: "实验性", limits: "限制", account_data: "账户数据", sessions: "会话" },
      danger_zone: "危险区域",
    },
    rooms: {
      details: "房间详情",
      tabs: {
        basic: "基本",
        members: "成员",
        detail: "细节",
        permission: "权限",
        media: "媒体",
        messages: "消息",
        hierarchy: "层级结构",
      },
    },
    reports: { tabs: { basic: "基本", detail: "细节" } },
    admin_config: {
      soft_failed_events: "软失败事件",
      spam_flagged_events: "被标记为垃圾邮件的事件",
      success: "管理员配置已更新",
      failure: "更新管理员配置失败",
    },
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
      send_success: "成功删除了 %{smart_count} 个媒体文件。",
      send_success_none: "没有符合指定条件的媒体文件。未删除任何内容。",
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
      send_success: "成功清除了 %{smart_count} 个远程媒体文件。",
      send_success_none: "没有符合指定条件的远程媒体文件。未清除任何内容。",
      send_failure: "发生错误，远程媒体清除请求未成功。",
    },
    helper: {
      send: "此API清除您服务器磁盘上的远程媒体缓存。这包括任何本地缩略图和下载的媒体副本。此API不会影响已经上传到服务器媒体存储库的媒体。",
    },
  },
  etkecc: {
    billing: {
      name: "账单",
      title: "付款记录",
      no_payments: "未找到付款记录。",
      no_payments_helper: "如果您认为这是错误，请通过以下方式联系 etke.cc 支持：",
      description1: "您可以在此查看付款并生成发票。有关订阅管理的更多信息，请访问",
      description2: "如果您想更改账单邮箱或添加公司信息，请通过以下方式联系 etke.cc 支持：",
      fields: {
        transaction_id: "交易ID",
        email: "邮箱",
        type: "类型",
        amount: "金额",
        paid_at: "付款时间",
        invoice: "发票",
      },
      enums: {
        type: {
          subscription: "订阅",
          one_time: "一次性",
        },
      },
      helper: {
        download_invoice: "下载发票",
        downloading: "正在下载...",
        download_started: "发票下载已开始。",
        invoice_not_available: "待处理",
        loading: "正在加载账单信息...",
        loading_failed1: "加载账单信息时出现问题。",
        loading_failed2: "请稍后再试。",
        loading_failed3: "如果问题仍然存在，请通过以下方式联系 etke.cc 支持：",
        loading_failed4: "并提供以下错误信息：",
      },
    },
    status: {
      name: "服务器状态",
      badge: {
        default: "点击查看服务器状态",
        running: "正在运行：%{command}。%{text}",
      },
      category: {
        "Host Metrics": "主机指标",
        Network: "网络",
        HTTP: "HTTP",
        Matrix: "Matrix",
      },
      status: "状态",
      error: "错误",
      loading: "正在获取实时服务器健康状况... 请稍候！",
      intro1: "这是您的服务器实时监控报告。您可以在以下页面了解更多：",
      intro2: "如果您对下方任意检查项有疑问，请在以下页面查看建议操作：",
      help: "帮助",
    },
    maintenance: {
      title: "系统当前处于维护模式。",
      try_again: "请稍后再试。",
      note: "无需就此联系支持团队——我们已在处理！",
    },
    actions: {
      name: "服务器命令",
      available_title: "可用命令",
      available_description: "以下命令可执行。",
      available_help_intro: "每个命令的更多详情请访问",
      scheduled_title: "计划命令",
      scheduled_description: "以下命令已计划在指定时间运行。您可以查看详情并按需修改。",
      recurring_title: "周期命令",
      recurring_description: "以下命令设置为每周在指定的星期和时间运行。您可以查看详情并按需修改。",
      scheduled_help_intro: "关于此模式的更多详情请访问",
      recurring_help_intro: "关于此模式的更多详情请访问",
      maintenance_title: "系统当前处于维护模式。",
      maintenance_try_again: "请稍后再试。",
      maintenance_note: "无需就此联系支持团队——我们已在处理！",
      maintenance_commands_blocked: "在维护模式解除之前无法运行命令。",
      table: {
        command: "命令",
        description: "描述",
        arguments: "参数",
        is_recurring: "是否周期？",
        run_at: "运行时间（本地）",
        next_run_at: "下次运行（本地）",
        time_utc: "时间（UTC）",
        time_local: "时间（本地）",
      },
      buttons: {
        create: "创建",
        update: "更新",
        back: "返回",
        delete: "删除",
        run: "运行",
      },
      command_scheduled: "命令已计划：%{command}",
      command_scheduled_args: "附加参数：%{args}",
      expect_prefix: "请在",
      expect_suffix: "页面查看结果。",
      notifications_link: "通知",
      command_help_title: "%{command} 帮助",
      scheduled_title_create: "创建计划命令",
      scheduled_title_edit: "编辑计划命令",
      recurring_title_create: "创建周期命令",
      recurring_title_edit: "编辑周期命令",
      scheduled_details_title: "计划命令详情",
      recurring_warning: "由周期命令生成的计划命令不可编辑，因为它们会被自动重新生成。请改为编辑周期命令。",
      command_details_intro: "该命令的更多详情请访问",
      form: {
        id: "ID",
        command: "命令",
        scheduled_at: "计划时间",
        day_of_week: "星期",
      },
      delete_scheduled_title: "删除计划命令",
      delete_recurring_title: "删除周期命令",
      delete_confirm: "确定要删除命令：%{command}？",
      errors: {
        unknown: "发生未知错误",
        delete_failed: "错误：%{error}",
      },
      days: {
        monday: "周一",
        tuesday: "周二",
        wednesday: "周三",
        thursday: "周四",
        friday: "周五",
        saturday: "周六",
        sunday: "周日",
      },
      scheduled: {
        action: {
          create_success: "计划命令创建成功",
          update_success: "计划命令更新成功",
          update_failure: "发生错误",
          delete_success: "计划命令删除成功",
          delete_failure: "发生错误",
        },
      },
      recurring: {
        action: {
          create_success: "周期命令创建成功",
          update_success: "周期命令更新成功",
          update_failure: "发生错误",
          delete_success: "周期命令删除成功",
          delete_failure: "发生错误",
        },
      },
    },
    notifications: {
      title: "通知",
      new_notifications: "%{smart_count} 条新通知",
      no_notifications: "暂无通知",
      see_all: "查看所有通知",
      clear_all: "全部清除",
      ago: "前",
    },
    currently_running: {
      command: "当前正在运行：",
      started_ago: "（%{time} 前开始）",
    },
    time: {
      less_than_minute: "几秒钟",
      minutes: "%{smart_count} 分钟",
      hours: "%{smart_count} 小时",
      days: "%{smart_count} 天",
      weeks: "%{smart_count} 周",
      months: "%{smart_count} 个月",
    },
    support: {
      name: "支持",
      menu_label: "联系支持",
      description: "提交支持请求或跟进现有请求。我们的团队将尽快回复。",
      create_title: "新建支持请求",
      no_requests: "暂无支持请求。",
      no_messages: "暂无消息。",
      closed_message: "此请求已关闭。如果您仍有问题，请提交新的请求。",
      fields: {
        subject: "主题",
        message: "消息",
        reply: "回复",
        status: "状态",
        created_at: "创建时间",
        updated_at: "最后更新",
      },
      status: {
        active: "等待运营商",
        open: "开放",
        closed: "已关闭",
        pending: "等待您的回复",
      },
      buttons: {
        new_request: "新建请求",
        submit: "提交",
        cancel: "取消",
        send: "发送",
        back: "返回支持",
      },
      helper: {
        loading: "正在加载支持请求...",
        reply_hint: "Ctrl+Enter 发送",
        reply_placeholder: "请提供尽可能多的详细信息。",
        before_contact_title: "在联系之前",
        help_pages_prompt: "请先查看帮助页面：",
        services_prompt: "我们只提供服务页面中列出的服务：",
        topics_prompt: "我们仅能协助支持的主题：",
        scope_confirm_label: "我已查看帮助页面，并确认此请求符合支持的主题。",
        english_only_notice: "仅提供英文支持。",
        response_time_prompt: "48 小时内回复。需要更快的响应？请查看：",
      },
      actions: {
        create_success: "支持请求创建成功。",
        create_failure: "支持请求创建失败。",
        send_failure: "消息发送失败。",
      },
    },
  },
};

export default common;
