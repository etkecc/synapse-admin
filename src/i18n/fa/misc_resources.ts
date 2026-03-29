const misc_resources = {
  scheduled_tasks: {
    name: "وظیفه زمان‌بندی‌شده |||| وظایف زمان‌بندی‌شده",
    fields: {
      id: "ID",
      action: "عملیات",
      status: "وضعیت",
      timestamp: "مهر زمانی",
      resource_id: "شناسه منبع",
      result: "نتیجه",
      error: "خطا",
      max_timestamp: "قبل از تاریخ",
    },
    status: {
      scheduled: "زمان‌بندی‌شده",
      active: "فعال",
      complete: "تکمیل‌شده",
      cancelled: "لغوشده",
      failed: "ناموفق",
    },
  },
  connections: {
    name: "اتصالات",
    fields: {
      last_seen: "تاریخ",
      ip: "آدرس آی پی",
      user_agent: "عامل کاربر",
    },
  },
  devices: {
    name: "دستگاه |||| دستگاه‌ها",
    fields: {
      device_id: "شناسه دستگاه",
      display_name: "نام دستگاه",
      last_seen_ts: "مهر زمان",
      last_seen_ip: "آدرس آی پی",
      last_seen_user_agent: "عامل کاربر",
      dehydrated: "کم‌آب",
    },
    action: {
      erase: {
        title: "حذف کردن %{id}",
        title_bulk: "حذف %{smart_count} دستگاه |||| حذف %{smart_count} دستگاه",
        content: 'آیا مطمئن هستید که می خواهید دستگاه را حذف کنید؟ "%{name}"?',
        content_bulk:
          "آیا مطمئن هستید که می‌خواهید %{smart_count} دستگاه را حذف کنید؟ |||| آیا مطمئن هستید که می‌خواهید %{smart_count} دستگاه را حذف کنید؟",
        success: "دستگاه با موفقیت حذف شد.",
        failure: "خطایی رخ داده است.",
      },
      display_name: {
        success: "نام دستگاه به‌روزرسانی شد",
        failure: "به‌روزرسانی نام دستگاه ناموفق بود",
      },
      create: {
        label: "ایجاد دستگاه",
        title: "ایجاد دستگاه جدید",
        success: "دستگاه ایجاد شد",
        failure: "ایجاد دستگاه ناموفق بود",
      },
    },
  },
  users_media: {
    name: "رسانه‌ها",
    fields: {
      media_id: "شناسه رسانه",
      media_length: "اندازه فایل (به بایت)",
      media_type: "نوع",
      upload_name: "نام فایل",
      quarantined_by: "قرنطینه شده توسط",
      safe_from_quarantine: "امان از قرنطینه",
      created_ts: "ایجاد شده",
      last_access_ts: "آخرین دسترسی",
    },
    action: {
      open: "باز کردن فایل رسانه در پنجره جدید",
    },
  },
  protect_media: {
    action: {
      create: "محافظت",
      delete: "لغو محافظت",
      none: "در قرنطینه",
      send_success: "وضعیت حفاظت با موفقیت تغییر کرد.",
      send_failure: "خطایی رخ داده است.",
    },
  },
  quarantine_media: {
    action: {
      name: "قرنطینه",
      create: "قرنطینه",
      delete: "رفع قرنطینه",
      none: "محافظت شده",
      send_success: "وضعیت قرنطینه با موفقیت تغییر کرد.",
      send_failure: "خطایی رخ داده است: %{error}",
    },
  },
  pushers: {
    name: "ارسال‌کننده اعلان |||| ارسال‌کننده‌های اعلان",
    fields: {
      app: "برنامه",
      app_display_name: "نام نمایش برنامه",
      app_id: "شناسه برنامه",
      device_display_name: "نام نمایشی برنامه",
      kind: "نوع",
      lang: "زبان",
      profile_tag: "برچسب پروفایل",
      pushkey: "کلید",
      data: { url: "URL" },
    },
  },
  servernotices: {
    name: "اطلاعیه‌های سرور",
    send: "ارسال اعلانات سرور",
    fields: {
      body: "پیام",
    },
    action: {
      send: "ارسال یادداشت",
      send_success: "اعلان سرور با موفقیت ارسال شد.",
      send_failure: "خطایی رخ داده است.",
    },
    helper: {
      send: "اعلان سرور را برای کاربران انتخاب شده ارسال می کند. ویژگی 'اعلامیه های سرور' باید در سرور فعال شود.",
    },
  },
  database_room_statistics: {
    name: "آمار پایگاه داده اتاق‌ها",
    fields: {
      room_id: "شناسه اتاق",
      estimated_size: "اندازه تخمینی",
    },
    helper: {
      info: "فضای دیسک تخمینی مورد استفاده هر اتاق در پایگاه داده Synapse را نشان می‌دهد. اعداد تقریبی هستند.",
    },
  },
  user_media_statistics: {
    name: "رسانه کاربران",
    fields: {
      media_count: "شمارش رسانه ها",
      media_length: "طول رسانه",
    },
  },
  forward_extremities: {
    name: "Forward Extremities",
    fields: {
      id: "شناسه رویداد",
      received_ts: "مهر زمان",
      depth: "عمق",
      state_group: "گروه وضعیت",
    },
  },
  room_state: {
    name: "رویدادهای وضعیت",
    fields: {
      type: "نوع",
      content: "محتوا",
      origin_server_ts: "زمان ارسال",
      sender: "فرستنده",
    },
  },
  room_media: {
    name: "رسانه‌ها",
    fields: {
      media_id: "شناسه رسانه",
    },
    helper: {
      info: "این یک لیست از رسانه‌ها است که در اتاق بارگذاری شده است. نمی‌توان رسانه‌ها را حذف کرد که در اتاق‌های خارجی بارگذاری شده اند.",
    },
    action: {
      error: "%{errcode} (%{errstatus}) %{error}",
    },
  },
  room_directory: {
    name: "راهنمای اتاق",
    fields: {
      world_readable: "کاربران مهمان می توانند بدون عضویت مشاهده کنند",
      guest_can_join: "کاربران مهمان ممکن است ملحق شوند",
    },
    action: {
      title: "اتاق را از فهرست حذف کنید |||| حذف کنید %{smart_count} اتاق ها از دایرکتوری",
      content:
        "آیا مطمئنید که می‌خواهید این اتاق را از فهرست راهنمای حذف کنید؟ |||| آیا مطمئن هستید که می‌خواهید این موارد را %{smart_count} از راهنمای اتاق‌ها حذف کنید؟",
      erase: "حذف از فهرست اتاق",
      create: "انتشار در راهنما اتاق",
      send_success: "اتاق با موفقیت منتشر شد.",
      send_failure: "خطایی رخ داده است.",
    },
  },
  destinations: {
    name: "سرورهای مرتبط",
    fields: {
      destination: "آدرس",
      failure_ts: "زمان شکست",
      retry_last_ts: "آخرین زمان اتصال",
      retry_interval: "بازه امتحان مجدد",
      last_successful_stream_ordering: "آخرین جریان موفق",
      stream_ordering: "جریان",
    },
    action: { reconnect: "دوباره وصل شوید" },
  },
  registration_tokens: {
    name: "توکن های ثبت نام",
    fields: {
      token: "توکن",
      valid: "توکن معتبر",
      uses_allowed: "موارد استفاده مجاز",
      pending: "انتظار",
      completed: "تکمیل شد",
      expiry_time: "زمان انقضا",
      length: "طول",
      created_at: "تاریخ ایجاد",
      last_used_at: "آخرین استفاده",
      revoked_at: "تاریخ ابطال",
    },
    helper: { length: "طول توکن در صورت عدم ارائه توکن." },
    action: {
      revoke: {
        label: "ابطال",
        success: "توکن ابطال شد",
      },
      unrevoke: {
        label: "بازیابی",
        success: "توکن بازیابی شد",
      },
    },
  },
};

export default misc_resources;
