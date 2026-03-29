import _farsiMessages from "ra-language-farsi";

const farsiMessages = ("default" in _farsiMessages ? _farsiMessages.default : _farsiMessages) as typeof _farsiMessages;

const fixedFarsiMessages = {
  ...farsiMessages,
  ra: {
    ...farsiMessages.ra,
    action: {
      ...farsiMessages.ra.action,
      reset: "بازنشانی",
      search_columns: "جستجوی ستون‌ها",
      select_all_button: "انتخاب همه",
    },
    auth: {
      ...farsiMessages.ra.auth,
      email: "ایمیل",
    },
    message: {
      ...farsiMessages.ra.message,
      placeholder_data_warning: "مشکل شبکه: به‌روزرسانی داده‌ها ناموفق بود.",
      select_all_limit_reached: "تعداد انتخاب‌ها زیاد است. فقط %{max} مورد اول انتخاب شد.",
    },
    guesser: {
      empty: {
        title: "داده‌ای برای نمایش نیست",
        message: "لطفاً ارائه‌دهندهٔ داده را بررسی کنید",
      },
    },
    notification: {
      ...farsiMessages.ra.notification,
      offline: "بدون اتصال. داده‌ها قابل دریافت نیستند.",
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const common: Record<string, any> = {
  ...fixedFarsiMessages,
  ketesa: {
    auth: {
      base_url: "آدرس سرور",
      welcome: "به پنل مدیریت سیناپس خوش آمدید، %{name}",
      description:
        "تکامل Synapse Admin. مدیریت، نظارت و نگهداری سرور Matrix خود را از یک رابط ساده و تمیز انجام دهید. مناسب برای سرورهای خصوصی کوچک و جوامع فدرال بزرگ.",
      server_version: "نسخه",
      username_error: "لطفاً شناسه کاربر را وارد کنید: '@user:domain'",
      protocol_error: "URL باید با 'http://' یا 'https://' شروع شود",
      url_error: "آدرس وارد شده یک سرور معتبر نیست",
      sso_sign_in: "با SSO وارد شوید",
      credentials: "اعتبارنامه",
      access_token: "توکن دسترسی",
      supports_specs: "پشتیبانی از مشخصات Matrix",
      logout_acces_token_dialog: {
        title: "شما در حال استفاده از یک نشانه دسترسی ماتریکس موجود هستید.",
        content:
          "آیا می‌خواهید این جلسه (که می‌تواند در جای دیگر، مانند یک کلاینت ماتریکس استفاده شود) را نابود کنید یا فقط از پنل مدیریت خارج شوید؟",
        confirm: "نابودی جلسه",
        cancel: "فقط خروج از پنل مدیریت",
      },
    },
    users: {
      invalid_user_id: "بخش محلی یک شناسه کاربری ماتریکس بدون سرور خانگی.",
      tabs: {
        sso: "SSO",
        experimental: "تجربی",
        limits: "محدودیت ها",
        account_data: "داده های کاربر",
        sessions: "نشست‌ها",
      },
      danger_zone: "منطقه خطرناک",
    },
    rooms: {
      details: "جزئیات اتاق",
      tabs: {
        basic: "اصلی",
        members: "اعضا",
        detail: "جزئیات",
        permission: "مجوزها",
        media: "رسانه ها",
        messages: "پیام‌ها",
        hierarchy: "سلسله‌مراتب",
      },
    },
    reports: { tabs: { basic: "اصلی", detail: "جزئیات" } },
    admin_config: {
      soft_failed_events: "رویدادهای شکست نرم",
      spam_flagged_events: "رویدادهای علامت‌گذاری‌شده به‌عنوان هرزنامه",
      success: "تنظیمات مدیر به‌روزرسانی شد",
      failure: "به‌روزرسانی تنظیمات مدیر ناموفق بود",
    },
  },
  import_users: {
    error: {
      at_entry: "در هنگام ورود %{entry}: %{message}",
      error: "Error",
      required_field: "فیلد الزامی '%{field}' وجود ندارد",
      invalid_value: "خطا در خط %{row}. '%{field}' فیلد ممکن است فقط 'درست' یا 'نادرست' باشد",
      unreasonably_big: "از بارگذاری فایل هایی با حجم غیر منطقی خودداری کنید %{size} مگابایت",
      already_in_progress: "یک بارگذاری از قبل در حال انجام است",
      id_exits: "شناسه %{id} موجود است",
    },
    title: "کاربران را از طریق فایل CSV وارد کنید",
    goToPdf: "رفتن به PDF",
    cards: {
      importstats: {
        header: "کاربران پردازش شده برای وارد کردن",
        users_total: "%{smart_count} user in CSV file |||| %{smart_count} users in CSV file",
        guest_count: "%{smart_count} guest |||| %{smart_count} guests",
        admin_count: "%{smart_count} admin |||| %{smart_count} admins",
      },
      conflicts: {
        header: "استراتژی متغارض",
        mode: {
          stop: "توقف",
          skip: "نمایش خطا و رد شدن",
        },
      },
      ids: {
        header: "شناسنامه ها",
        all_ids_present: "شناسه های موجود در هر ورودی",
        count_ids_present: "%{smart_count} ورود با شناسه |||| %{smart_count} ورودی با شناسه",
        mode: {
          ignore: "شناسه ها را در CSV نادیده بگیر و شناسه های جدید ایجاد کن",
          update: "سوابق موجود را به روز کنید",
        },
      },
      passwords: {
        header: "رمز عبور",
        all_passwords_present: "رمزهای عبور موجود در هر ورودی",
        count_passwords_present: "%{smart_count} ورود با رمز عبور |||| %{smart_count} ورودی با رمز عبور",
        use_passwords: "از پسوردهای CSV استفاده کنید",
      },
      upload: {
        header: "Input CSV file",
        explanation:
          "در اینجا می توانید فایلی را با مقادیر جدا شده با کاما بارگذاری کنید که برای ایجاد یا به روز رسانی کاربران پردازش می شود. فایل باید شامل فیلدهای 'id' و 'displayname' باشد. می توانید یک فایل نمونه را از اینجا دانلود و تطبیق دهید: ",
      },
      startImport: {
        simulate_only: "فقط شبیه سازی",
        run_import: "بارگذاری",
      },
      results: {
        header: "بارگذاری نتایج",
        total: "%{smart_count} ورودی در کل |||| %{smart_count} ورودی ها در کل",
        successful: "%{smart_count} ورودی ها با موفقیت وارد شدند",
        skipped: "%{smart_count} ورودی ها نادیده گرفته شدند",
        download_skipped: "دانلود رکوردهای نادیده گرفته شده",
        with_error: "%{smart_count} ورود با خطا ||| %{smart_count} ورودی های دارای خطا",
        simulated_only: "اجرا فقط شبیه سازی شد",
      },
    },
  },
  delete_media: {
    name: "رسانه ها",
    fields: {
      before_ts: "آخرین دسترسی قبل",
      size_gt: "بزرگتر از آن (به بایت)",
      keep_profiles: "تصاویر پروفایل را نگه دارید",
    },
    action: {
      send: "حذف رسانه ها",
      send_success: "%{smart_count} فایل رسانه‌ای با موفقیت حذف شد.",
      send_success_none: "هیچ فایل رسانه‌ای با معیارهای مشخص شده مطابقت نداشت. چیزی حذف نشد.",
      send_failure: "خطایی رخ داده است.",
    },
    helper: {
      send: "این API رسانه های محلی را از دیسک سرور خود حذف می کند. این شامل هر تصویر کوچک محلی و کپی از رسانه دانلود شده است. این API بر رسانه‌هایی که در مخازن رسانه خارجی آپلود شده‌اند تأثیری نخواهد گذاشت.",
    },
  },
  purge_remote_media: {
    name: "رسانه‌های از راه دور",
    fields: {
      before_ts: "آخرین دسترسی قبل از",
    },
    action: {
      send: "پاک کردن رسانه‌های از راه دور",
      send_success: "%{smart_count} فایل رسانه‌ای از راه دور با موفقیت پاک شد.",
      send_success_none: "هیچ فایل رسانه‌ای از راه دور با معیارهای مشخص شده مطابقت نداشت. چیزی پاک نشد.",
      send_failure: "درخواست برای پاک کردن رسانه‌های از راه دور با خطا مواجه شد.",
    },
    helper: {
      send: "این API کش رسانه‌های از راه دور را از دیسک سرور شما پاک می‌کند. این شامل هر گونه بندانگشتی محلی و نسخه‌های رسانه‌های دانلود شده می‌شود. این API بر رسانه‌های آپلود شده به مخزن رسانه سرور تأثیری نخواهد داشت.",
    },
  },
  etkecc: {
    billing: {
      name: "صورتحساب",
      title: "سوابق پرداخت",
      no_payments: "هیچ پرداختی یافت نشد.",
      no_payments_helper: "اگر فکر می‌کنید این یک خطاست، لطفاً با پشتیبانی etke.cc از طریق این آدرس تماس بگیرید:",
      description1:
        "از اینجا می‌توانید پرداخت‌ها را مشاهده کنید و فاکتور صادر کنید. درباره مدیریت اشتراک‌ها بیشتر در اینجا بخوانید:",
      description2:
        "اگر می‌خواهید ایمیل صورتحساب خود را تغییر دهید یا اطلاعات شرکت را اضافه کنید، لطفاً با پشتیبانی etke.cc از طریق این آدرس تماس بگیرید:",
      fields: {
        transaction_id: "شناسه تراکنش",
        email: "ایمیل",
        type: "نوع",
        amount: "مبلغ",
        paid_at: "زمان پرداخت",
        invoice: "فاکتور",
      },
      enums: {
        type: {
          subscription: "اشتراک",
          one_time: "یک‌باره",
        },
      },
      helper: {
        download_invoice: "دانلود فاکتور",
        downloading: "در حال دانلود...",
        download_started: "دانلود فاکتور آغاز شد.",
        invoice_not_available: "در انتظار",
        loading: "در حال بارگذاری اطلاعات صورتحساب...",
        loading_failed1: "در بارگذاری اطلاعات صورتحساب مشکلی پیش آمد.",
        loading_failed2: "لطفاً بعداً دوباره تلاش کنید.",
        loading_failed3: "اگر مشکل ادامه داشت، لطفاً با پشتیبانی etke.cc از طریق این آدرس تماس بگیرید:",
        loading_failed4: "با پیام خطای زیر:",
      },
    },
    status: {
      name: "وضعیت سرور",
      badge: {
        default: "برای مشاهده وضعیت سرور کلیک کنید",
        running: "در حال اجرا: %{command}. %{text}",
      },
      category: {
        "Host Metrics": "شاخص‌های میزبان",
        Network: "شبکه",
        HTTP: "HTTP",
        Matrix: "Matrix",
      },
      status: "وضعیت",
      error: "خطا",
      loading: "در حال دریافت وضعیت سلامت لحظه‌ای سرور... لطفاً کمی صبر کنید!",
      intro1: "این گزارش پایش لحظه‌ایِ سرور شماست. می‌توانید درباره آن بیشتر در",
      intro2: "اگر هر یک از بررسی‌های زیر شما را نگران می‌کند، لطفاً اقدامات پیشنهادی را در",
      help: "راهنما",
    },
    maintenance: {
      title: "سیستم در حال حاضر در حالت تعمیر و نگهداری است.",
      try_again: "لطفاً بعداً دوباره تلاش کنید.",
      note: "نیازی نیست بابت این موضوع با پشتیبانی تماس بگیرید؛ ما از قبل در حال رسیدگی هستیم!",
    },
    actions: {
      name: "فرمان‌های سرور",
      available_title: "فرمان‌های در دسترس",
      available_description: "فرمان‌های زیر قابل اجرا هستند.",
      available_help_intro: "جزئیات بیشتر هرکدام در",
      scheduled_title: "فرمان‌های زمان‌بندی‌شده",
      scheduled_description:
        "فرمان‌های زیر برای اجرا در زمان‌های مشخص برنامه‌ریزی شده‌اند. می‌توانید جزئیات را ببینید و در صورت نیاز تغییر دهید.",
      recurring_title: "فرمان‌های تکرارشونده",
      recurring_description:
        "فرمان‌های زیر طوری تنظیم شده‌اند که هر هفته در روز و زمان مشخص اجرا شوند. می‌توانید جزئیات را ببینید و در صورت نیاز تغییر دهید.",
      scheduled_help_intro: "جزئیات بیشتر درباره این حالت در",
      recurring_help_intro: "جزئیات بیشتر درباره این حالت در",
      maintenance_title: "سیستم در حال حاضر در حالت تعمیر و نگهداری است.",
      maintenance_try_again: "لطفاً بعداً دوباره تلاش کنید.",
      maintenance_note: "نیازی نیست بابت این موضوع با پشتیبانی تماس بگیرید؛ ما از قبل در حال رسیدگی هستیم!",
      maintenance_commands_blocked: "تا زمانی که حالت تعمیر و نگهداری غیرفعال نشود، امکان اجرای فرمان‌ها نیست.",
      table: {
        command: "فرمان",
        description: "توضیحات",
        arguments: "آرگومان‌ها",
        is_recurring: "تکرارشونده؟",
        run_at: "اجرا (زمان محلی)",
        next_run_at: "اجرای بعدی (زمان محلی)",
        time_utc: "زمان (UTC)",
        time_local: "زمان (محلی)",
      },
      buttons: {
        create: "ایجاد",
        update: "به‌روزرسانی",
        back: "بازگشت",
        delete: "حذف",
        run: "اجرا",
      },
      command_scheduled: "فرمان زمان‌بندی شد: %{command}",
      command_scheduled_args: "با آرگومان‌های اضافی: %{args}",
      expect_prefix: "نتیجه را به‌زودی در صفحه",
      expect_suffix: "مشاهده خواهید کرد.",
      notifications_link: "اعلان‌ها",
      command_help_title: "راهنمای %{command}",
      scheduled_title_create: "ایجاد فرمان زمان‌بندی‌شده",
      scheduled_title_edit: "ویرایش فرمان زمان‌بندی‌شده",
      recurring_title_create: "ایجاد فرمان تکرارشونده",
      recurring_title_edit: "ویرایش فرمان تکرارشونده",
      scheduled_details_title: "جزئیات فرمان زمان‌بندی‌شده",
      recurring_warning:
        "فرمان‌های زمان‌بندی‌شده‌ای که از یک فرمان تکرارشونده ایجاد شده‌اند قابل ویرایش نیستند، چون به‌طور خودکار دوباره ساخته می‌شوند. لطفاً فرمان تکرارشونده را ویرایش کنید.",
      command_details_intro: "جزئیات بیشتر درباره فرمان در",
      form: {
        id: "شناسه",
        command: "فرمان",
        scheduled_at: "زمان‌بندی‌شده برای",
        day_of_week: "روز هفته",
      },
      delete_scheduled_title: "حذف فرمان زمان‌بندی‌شده",
      delete_recurring_title: "حذف فرمان تکرارشونده",
      delete_confirm: "آیا از حذف فرمان %{command} مطمئن هستید؟",
      errors: {
        unknown: "خطای ناشناخته‌ای رخ داد",
        delete_failed: "خطا: %{error}",
      },
      days: {
        monday: "دوشنبه",
        tuesday: "سه‌شنبه",
        wednesday: "چهارشنبه",
        thursday: "پنج‌شنبه",
        friday: "جمعه",
        saturday: "شنبه",
        sunday: "یکشنبه",
      },
      scheduled: {
        action: {
          create_success: "فرمان زمان‌بندی‌شده با موفقیت ایجاد شد",
          update_success: "فرمان زمان‌بندی‌شده با موفقیت به‌روزرسانی شد",
          update_failure: "خطایی رخ داده است",
          delete_success: "فرمان زمان‌بندی‌شده با موفقیت حذف شد",
          delete_failure: "خطایی رخ داده است",
        },
      },
      recurring: {
        action: {
          create_success: "فرمان تکرارشونده با موفقیت ایجاد شد",
          update_success: "فرمان تکرارشونده با موفقیت به‌روزرسانی شد",
          update_failure: "خطایی رخ داده است",
          delete_success: "فرمان تکرارشونده با موفقیت حذف شد",
          delete_failure: "خطایی رخ داده است",
        },
      },
    },
    notifications: {
      title: "اعلان‌ها",
      new_notifications: "%{smart_count} اعلان جدید",
      no_notifications: "هنوز اعلانی وجود ندارد",
      see_all: "مشاهده همه اعلان‌ها",
      clear_all: "حذف همه",
      ago: "پیش",
    },
    currently_running: {
      command: "در حال اجرا:",
      started_ago: "(از %{time} پیش شروع شده)",
    },
    time: {
      less_than_minute: "چند ثانیه",
      minutes: "%{smart_count} دقیقه",
      hours: "%{smart_count} ساعت",
      days: "%{smart_count} روز",
      weeks: "%{smart_count} هفته",
      months: "%{smart_count} ماه",
    },
    support: {
      name: "پشتیبانی",
      menu_label: "تماس با پشتیبانی",
      description: "یک درخواست پشتیبانی باز کنید یا درخواست موجود را پیگیری کنید. تیم ما در اسرع وقت پاسخ خواهد داد.",
      create_title: "درخواست پشتیبانی جدید",
      no_requests: "هنوز درخواست پشتیبانی وجود ندارد.",
      no_messages: "هنوز پیامی وجود ندارد.",
      closed_message: "این درخواست بسته شده است. اگر هنوز مشکلی دارید، لطفاً یک درخواست جدید باز کنید.",
      fields: {
        subject: "موضوع",
        message: "پیام",
        reply: "پاسخ",
        status: "وضعیت",
        created_at: "ایجاد شده",
        updated_at: "آخرین به‌روزرسانی",
      },
      status: {
        active: "در انتظار اپراتور",
        open: "باز",
        closed: "بسته",
        pending: "در انتظار شما",
      },
      buttons: {
        new_request: "درخواست جدید",
        submit: "ارسال",
        cancel: "لغو",
        send: "ارسال",
        back: "بازگشت به پشتیبانی",
      },
      helper: {
        loading: "در حال بارگذاری درخواست‌های پشتیبانی...",
        reply_hint: "Ctrl+Enter برای ارسال",
        reply_placeholder: "لطفاً تا حد امکان جزئیات بیشتری ارائه دهید.",
        before_contact_title: "پیش از تماس با ما",
        help_pages_prompt: "لطفاً ابتدا صفحات راهنما را بررسی کنید:",
        services_prompt: "ما فقط خدمات فهرست‌شده در صفحه خدمات را ارائه می‌دهیم:",
        topics_prompt: "ما فقط در موضوعات پشتیبانی‌شده می‌توانیم کمک کنیم:",
        scope_confirm_label:
          "صفحات راهنما را بررسی کرده‌ام و تأیید می‌کنم که این درخواست با موضوعات پشتیبانی‌شده مطابقت دارد.",
        english_only_notice: "پشتیبانی فقط به زبان انگلیسی ارائه می‌شود.",
        response_time_prompt: "پاسخ ظرف ۴۸ ساعت. به پاسخ سریع‌تر نیاز دارید؟ ببینید:",
      },
      actions: {
        create_success: "درخواست پشتیبانی با موفقیت ایجاد شد.",
        create_failure: "ایجاد درخواست پشتیبانی ناموفق بود.",
        send_failure: "ارسال پیام ناموفق بود.",
      },
    },
  },
};

export default common;
