const mas = {
  mas_users: {
    name: "MAS用户 |||| MAS用户",
    fields: {
      id: "MAS ID",
      username: "用户名",
      admin: "管理员",
      locked: "已锁定",
      deactivated: "已停用",
      legacy_guest: "旧版访客",
      created_at: "创建于",
      locked_at: "锁定于",
      deactivated_at: "停用于",
    },
    filter: {
      status: "状态",
      search: "搜索",
      status_active: "活跃",
      status_locked: "已锁定",
      status_deactivated: "已停用",
    },
    action: {
      lock: { label: "锁定", success: "用户已锁定" },
      unlock: { label: "解锁", success: "用户已解锁" },
      deactivate: { label: "停用", success: "用户已停用" },
      reactivate: { label: "重新激活", success: "用户已重新激活" },
      set_admin: { label: "授予管理员权限", success: "管理员状态已更新" },
      remove_admin: { label: "移除管理员权限", success: "管理员状态已更新" },
      set_password: {
        label: "设置密码",
        title: "设置密码",
        success: "密码已设置",
        failure: "密码设置失败",
      },
    },
  },
  mas_user_emails: {
    name: "邮箱 |||| 邮箱",
    empty: "无邮箱",
    fields: {
      email: "邮箱",
      user_id: "用户ID",
      created_at: "创建于",
      actions: "操作",
    },
    action: {
      remove: {
        label: "删除",
        title: "删除邮箱",
        content: "删除 %{email}？",
        success: "邮箱已删除",
      },
      create: { success: "邮箱已添加" },
    },
  },
  mas_compat_sessions: {
    name: "兼容会话 |||| 兼容会话",
    empty: "没有兼容会话",
    fields: {
      user_id: "用户ID",
      device_id: "设备ID",
      created_at: "创建时间",
      user_agent: "用户代理",
      last_active_at: "最后活跃",
      last_active_ip: "最后IP",
      finished_at: "结束时间",
      human_name: "名称",
      active: "活跃",
    },
    action: {
      finish: {
        label: "终止",
        title: "终止会话？",
        content: "此会话将被终止。",
        success: "会话已终止",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "OAuth2会话 |||| OAuth2会话",
    empty: "没有OAuth2会话",
    fields: {
      user_id: "用户ID",
      client_id: "客户端ID",
      scope: "权限范围",
      created_at: "创建时间",
      user_agent: "用户代理",
      last_active_at: "最后活跃",
      last_active_ip: "最后IP",
      finished_at: "结束时间",
      human_name: "名称",
      active: "活跃",
    },
    action: {
      finish: {
        label: "终止",
        title: "终止会话？",
        content: "此会话将被终止。",
        success: "会话已终止",
      },
    },
  },
  mas_policy_data: {
    name: "策略数据",
    current_policy: "当前策略",
    no_policy: "当前未设置任何策略。",
    set_policy: "设置新策略",
    invalid_json: "无效的JSON",
    fields: {
      json_placeholder: "输入JSON格式的策略数据…",
      created_at: "创建于",
    },
    action: {
      save: {
        label: "设置策略",
        success: "策略已更新",
        failure: "策略更新失败",
      },
    },
  },
  mas_user_sessions: {
    name: "浏览器会话 |||| 浏览器会话",
    fields: {
      user_id: "用户ID",
      created_at: "创建时间",
      finished_at: "结束时间",
      user_agent: "用户代理",
      last_active_at: "最后活跃",
      last_active_ip: "最后IP",
      active: "活跃",
    },
    action: {
      finish: {
        label: "终止",
        title: "终止会话？",
        content: "此浏览器会话将被终止。",
        success: "会话已终止",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "上游OAuth链接 |||| 上游OAuth链接",
    fields: {
      user_id: "用户ID",
      provider_id: "提供商ID",
      subject: "主体",
      human_account_name: "账户名称",
      created_at: "创建时间",
    },
    helper: {
      provider_id: "上游OAuth提供商的ID，可在上游OAuth提供商列表中找到。",
    },
    action: {
      remove: {
        label: "删除",
        title: "删除OAuth链接？",
        content: "此用户的上游OAuth链接将被删除。",
        success: "OAuth链接已删除",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "OAuth提供商 |||| OAuth提供商",
    fields: {
      issuer: "颁发者",
      human_name: "名称",
      brand_name: "品牌",
      created_at: "创建时间",
      disabled_at: "禁用时间",
      enabled: "已启用",
    },
  },
  mas_personal_sessions: {
    name: "个人会话 |||| 个人会话",
    empty: "没有个人会话",
    fields: {
      owner_user_id: "所有者ID",
      actor_user_id: "用户",
      human_name: "名称",
      scope: "权限范围",
      created_at: "创建时间",
      revoked_at: "撤销时间",
      last_active_at: "最后活跃",
      last_active_ip: "最后IP",
      expires_at: "过期时间",
      expires_in: "过期时间（秒）",
      active: "活跃",
    },
    helper: {
      expires_in: "可选。令牌过期的秒数。留空表示永不过期。",
    },
    action: {
      revoke: {
        label: "撤销",
        title: "撤销会话？",
        content: "访问令牌将被永久撤销。",
        success: "会话已撤销",
      },
      create: {
        token_title: "访问令牌已创建",
        token_content: "请复制此令牌。关闭此对话框后将无法再次查看。",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "活跃",
      finished: "已结束",
      revoked: "已撤销",
    },
  },
};

export default mas;
