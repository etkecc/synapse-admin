const mas = {
  mas_users: {
    name: "کاربر MAS |||| کاربران MAS",
    fields: {
      id: "شناسه MAS",
      username: "نام کاربری",
      admin: "مدیر",
      locked: "قفل‌شده",
      deactivated: "غیرفعال‌شده",
      legacy_guest: "مهمان قدیمی",
      created_at: "ایجاد شده در",
      locked_at: "قفل شده در",
      deactivated_at: "غیرفعال شده در",
    },
    filter: {
      status: "وضعیت",
      search: "جستجو",
      status_active: "فعال",
      status_locked: "قفل‌شده",
      status_deactivated: "غیرفعال",
    },
    action: {
      lock: { label: "قفل کردن", success: "کاربر قفل شد" },
      unlock: { label: "باز کردن قفل", success: "قفل کاربر باز شد" },
      deactivate: { label: "غیرفعال کردن", success: "کاربر غیرفعال شد" },
      reactivate: { label: "فعال‌سازی مجدد", success: "کاربر دوباره فعال شد" },
      set_admin: { label: "اعطای مدیریت", success: "وضعیت مدیر به‌روز شد" },
      remove_admin: { label: "حذف مدیریت", success: "وضعیت مدیر به‌روز شد" },
      set_password: {
        label: "تنظیم رمز عبور",
        title: "تنظیم رمز عبور",
        success: "رمز عبور تنظیم شد",
        failure: "تنظیم رمز عبور ناموفق بود",
      },
    },
  },
  mas_user_emails: {
    name: "ایمیل |||| ایمیل‌ها",
    empty: "ایمیلی وجود ندارد",
    fields: {
      email: "ایمیل",
      user_id: "شناسه کاربر",
      created_at: "ایجاد شده در",
      actions: "عملیات",
    },
    action: {
      remove: {
        label: "حذف",
        title: "حذف ایمیل",
        content: "حذف %{email}؟",
        success: "ایمیل حذف شد",
      },
      create: { success: "ایمیل اضافه شد" },
    },
  },
  mas_compat_sessions: {
    name: "نشست سازگار |||| نشست‌های سازگار",
    empty: "هیچ نشست سازگاری وجود ندارد",
    fields: {
      user_id: "شناسه کاربر",
      device_id: "شناسه دستگاه",
      created_at: "ایجاد شده در",
      user_agent: "عامل کاربر",
      last_active_at: "آخرین فعالیت",
      last_active_ip: "آخرین IP",
      finished_at: "پایان یافته در",
      human_name: "نام",
      active: "فعال",
    },
    action: {
      finish: {
        label: "پایان",
        title: "پایان نشست؟",
        content: "این نشست پایان خواهد یافت.",
        success: "نشست پایان یافت",
      },
    },
  },
  mas_oauth2_sessions: {
    name: "نشست OAuth2 |||| نشست‌های OAuth2",
    empty: "هیچ نشست OAuth2ای وجود ندارد",
    fields: {
      user_id: "شناسه کاربر",
      client_id: "شناسه مشتری",
      scope: "دامنه دسترسی",
      created_at: "ایجاد شده در",
      user_agent: "عامل کاربر",
      last_active_at: "آخرین فعالیت",
      last_active_ip: "آخرین IP",
      finished_at: "پایان یافته در",
      human_name: "نام",
      active: "فعال",
    },
    action: {
      finish: {
        label: "پایان",
        title: "پایان نشست؟",
        content: "این نشست پایان خواهد یافت.",
        success: "نشست پایان یافت",
      },
    },
  },
  mas_policy_data: {
    name: "داده‌های خط‌مشی",
    current_policy: "خط‌مشی فعلی",
    no_policy: "در حال حاضر هیچ خط‌مشی‌ای تنظیم نشده است.",
    set_policy: "تنظیم خط‌مشی جدید",
    invalid_json: "JSON نامعتبر",
    fields: {
      json_placeholder: "داده‌های خط‌مشی را به‌صورت JSON وارد کنید…",
      created_at: "ایجاد شده در",
    },
    action: {
      save: {
        label: "تنظیم خط‌مشی",
        success: "خط‌مشی به‌روزرسانی شد",
        failure: "به‌روزرسانی خط‌مشی ناموفق بود",
      },
    },
  },
  mas_user_sessions: {
    name: "نشست مرورگر |||| نشست‌های مرورگر",
    fields: {
      user_id: "شناسه کاربر",
      created_at: "ایجاد شده در",
      finished_at: "پایان یافته در",
      user_agent: "عامل کاربر",
      last_active_at: "آخرین فعالیت",
      last_active_ip: "آخرین IP",
      active: "فعال",
    },
    action: {
      finish: {
        label: "پایان",
        title: "پایان نشست؟",
        content: "این نشست مرورگر پایان خواهد یافت.",
        success: "نشست پایان یافت",
      },
    },
  },
  mas_upstream_oauth_links: {
    name: "پیوند OAuth بالادستی |||| پیوندهای OAuth بالادستی",
    fields: {
      user_id: "شناسه کاربر",
      provider_id: "شناسه ارائه‌دهنده",
      subject: "موضوع",
      human_account_name: "نام حساب",
      created_at: "ایجاد شده در",
    },
    helper: {
      provider_id: "شناسه ارائه‌دهنده OAuth بالادستی. آن را در فهرست ارائه‌دهندگان OAuth بالادستی بیابید.",
    },
    action: {
      remove: {
        label: "حذف",
        title: "حذف پیوند OAuth؟",
        content: "پیوند OAuth بالادستی این کاربر حذف خواهد شد.",
        success: "پیوند OAuth حذف شد",
      },
    },
  },
  mas_upstream_oauth_providers: {
    name: "ارائه‌دهنده OAuth |||| ارائه‌دهندگان OAuth",
    fields: {
      issuer: "صادرکننده",
      human_name: "نام",
      brand_name: "برند",
      created_at: "ایجاد شده در",
      disabled_at: "غیرفعال شده در",
      enabled: "فعال",
    },
  },
  mas_personal_sessions: {
    name: "نشست شخصی |||| نشست‌های شخصی",
    empty: "هیچ نشست شخصی وجود ندارد",
    fields: {
      owner_user_id: "شناسه مالک",
      actor_user_id: "کاربر",
      human_name: "نام",
      scope: "دامنه دسترسی",
      created_at: "ایجاد شده در",
      revoked_at: "ابطال شده در",
      last_active_at: "آخرین فعالیت",
      last_active_ip: "آخرین IP",
      expires_at: "انقضا در",
      expires_in: "انقضا در (ثانیه)",
      active: "فعال",
    },
    helper: {
      expires_in: "اختیاری. تعداد ثانیه تا انقضای توکن. برای بدون انقضا خالی بگذارید.",
    },
    action: {
      revoke: {
        label: "ابطال",
        title: "ابطال نشست؟",
        content: "توکن دسترسی به طور دائمی ابطال می‌شود.",
        success: "نشست ابطال شد",
      },
      create: {
        token_title: "توکن دسترسی ایجاد شد",
        token_content: "این توکن را کپی کنید. پس از بستن این پنجره دیگر نمایش داده نمی‌شود.",
      },
    },
  },
  mas_sessions: {
    status: {
      active: "فعال",
      finished: "پایان‌یافته",
      revoked: "لغو شده",
    },
  },
};

export default mas;
