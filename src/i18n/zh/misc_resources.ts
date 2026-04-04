const misc_resources = {
  scheduled_tasks: {
    name: "计划任务 |||| 计划任务",
    fields: {
      id: "ID",
      action: "操作",
      status: "状态",
      timestamp: "时间戳",
      resource_id: "资源 ID",
      result: "结果",
      error: "错误",
      max_timestamp: "截止日期",
    },
    status: {
      scheduled: "已计划",
      active: "进行中",
      complete: "已完成",
      cancelled: "已取消",
      failed: "已失败",
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
      last_seen_user_agent: "用户代理",
      dehydrated: "脱水设备",
    },
    action: {
      erase: {
        title: "移除 %{id}",
        title_bulk: "移除 %{smart_count} 个设备",
        content: '您确定要移除设备 "%{name}"?',
        content_bulk: "您确定要移除 %{smart_count} 个设备？",
        success: "设备移除成功。",
        failure: "出现了一个错误。",
      },
      display_name: {
        success: "设备名称已更新",
        failure: "更新设备名称失败",
      },
      create: {
        label: "创建设备",
        title: "创建新设备",
        success: "设备已创建",
        failure: "创建设备失败",
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
    action: {
      open: "在新窗口打开媒体文件",
    },
  },
  protect_media: {
    action: {
      create: "保护",
      delete: "取消保护",
      none: "处于隔离中",
      send_success: "保护状态修改成功。",
      send_failure: "发生错误。",
    },
  },
  quarantine_media: {
    action: {
      name: "隔离",
      create: "隔离",
      delete: "解除隔离",
      none: "已保护",
      send_success: "隔离状态修改成功。",
      send_failure: "发生错误：%{error}",
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
  database_room_statistics: {
    name: "数据库房间统计",
    fields: {
      room_id: "房间 ID",
      estimated_size: "估计大小",
    },
    helper: {
      info: "显示 Synapse 数据库中每个房间使用的估计磁盘空间。数字为近似值。",
    },
  },
  user_media_statistics: {
    name: "用户的媒体文件",
    fields: {
      media_count: "媒体文件统计",
      media_length: "媒体文件长度",
    },
  },
  forward_extremities: {
    name: "Forward Extremities",
    fields: {
      id: "事件 ID",
      received_ts: "时间戳",
      depth: "深度",
      state_group: "状态组",
    },
  },
  room_state: {
    name: "状态事件",
    fields: {
      type: "类型",
      content: "内容",
      origin_server_ts: "发送时间",
      sender: "发送者",
    },
  },
  room_media: {
    name: "媒体",
    fields: {
      media_id: "媒体 ID",
    },
    helper: {
      info: "这是上传到房间的媒体列表。无法删除上传到外部媒体存储库的媒体。",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "房间目录",
    fields: {
      world_readable: "访客无需加入即可查看",
      guest_can_join: "访客可以加入",
    },
    action: {
      title: "从目录删除房间 |||| 从目录删除 %{smart_count} 个房间",
      content: "确定要从目录移除此房间？ |||| 确定要从目录移除这 %{smart_count} 个房间？",
      erase: "从房间目录删除",
      create: "发布到房间目录",
      send_success: "房间发布成功。",
      send_failure: "发生错误。",
    },
  },
  destinations: {
    name: "联邦",
    fields: {
      destination: "目标",
      failure_ts: "失败时间戳",
      retry_last_ts: "上次重试时间戳",
      retry_interval: "重试间隔",
      last_successful_stream_ordering: "上次成功流",
      stream_ordering: "流",
    },
    action: { reconnect: "重新连接" },
  },
  registration_tokens: {
    name: "注册令牌",
    fields: {
      token: "令牌",
      valid: "有效令牌",
      uses_allowed: "允许使用次数",
      pending: "待处理",
      completed: "已完成",
      expiry_time: "过期时间",
      length: "长度",
      created_at: "创建时间",
      last_used_at: "最后使用时间",
      revoked_at: "撤销时间",
    },
    helper: { length: "如果未提供令牌，则为生成令牌的长度。" },
    action: {
      revoke: {
        label: "撤销",
        success: "令牌已撤销",
      },
      unrevoke: {
        label: "恢复",
        success: "令牌已恢复",
      },
    },
  },
  account_data: {
    name: "账户数据",
  },
  joined_rooms: {
    name: "已加入的房间",
  },
  memberships: {
    name: "成员资格",
  },
  room_members: {
    name: "成员",
  },
  destination_rooms: {
    name: "房间",
  },
};

export default misc_resources;
