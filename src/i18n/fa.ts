import farsiMessages from "ra-language-farsi";

import { SynapseTranslationMessages } from ".";

const fa: SynapseTranslationMessages = {
  ...farsiMessages,
  synapseadmin: {
    auth: {
      base_url: "آدرس سرور",
      welcome: "به پنل مدیریت سیناپس خوش آمدید!",
      server_version: "نسخه",
      username_error: "لطفاً شناسه کاربر را وارد کنید: '@user:domain'",
      protocol_error: "URL باید با 'http://' یا 'https://' شروع شود",
      url_error: "آدرس وارد شده یک سرور معتبر نیست",
      sso_sign_in: "با SSO وارد شوید",
      credentials: "اعتبارنامه",
      access_token: "توکن دسترسی",
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
      tabs: { sso: "SSO", experimental: "تجربی", limits: "محدودیت ها", account_data: "داده های کاربر" },
    },
    rooms: {
      tabs: {
        basic: "اصلی",
        members: "اعضا",
        detail: "جزئیات",
        permission: "مجوزها",
        media: "رسانه ها",
      },
    },
    reports: { tabs: { basic: "اصلی", detail: "جزئیات" } },
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
      send_success: "درخواست با موفقیت ارسال شد.",
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
      send_success: "درخواست پاک کردن رسانه‌های از راه دور ارسال شد.",
      send_failure: "درخواست برای پاک کردن رسانه‌های از راه دور با خطا مواجه شد.",
    },
    helper: {
      send: "این API کش رسانه‌های از راه دور را از دیسک سرور شما پاک می‌کند. این شامل هر گونه بندانگشتی محلی و نسخه‌های رسانه‌های دانلود شده می‌شود. این API بر رسانه‌های آپلود شده به مخزن رسانه سرور تأثیری نخواهد داشت.",
    },
  },
  resources: {
    users: {
      name: "کاربر |||| کاربران",
      email: "ایمیل",
      msisdn: "شماره تلفن",
      threepid: "ایمیل / شماره تلفن",
      fields: {
        avatar: "آواتار",
        id: "شناسه کاربر",
        name: "نام",
        is_guest: "مهمان",
        admin: "مدیر سرور",
        deactivated: "غیرفعال",
        locked: "قفل شده",
        suspended: "معلق",
        guests: "نمایش مهمانان",
        show_deactivated: "نمایش کاربران غیرفعال شده",
        show_locked: "نمایش کاربران قفل شده",
        show_suspended: "نمایش کاربران معلق",
        user_id: "جستجوی کاربر",
        displayname: "نام نمایشی",
        password: "رمز عبور",
        avatar_url: "آواتار سرور",
        avatar_src: "آواتار",
        medium: "متوسط",
        threepids: "سرویس احراز هویت",
        address: "آدرس",
        creation_ts_ms: "ساخته شده در",
        consent_version: "Consent نسخه",
        auth_provider: "ارائه دهنده",
        user_type: "نوع کاربر",
      },
      helper: {
        password_required_for_reactivation: "برای فعالسازی مجدد حساب باید رمز عبور وارد کنید.",
        admin: "مدیر سرور دارای کنترل کامل بر روی سرور و کاربران آن است.",
        lock: "ممنوعیت استفاده از سرور توسط کاربر. این یک عملیات غیر مخرب است که می تواند برگردانده شود.",
        password: "با تغییر رمز عبور کاربر از تمام دستگاه ها خارج می شود.",
        create_password: "رمز عبور قوی و امنی را با استفاده از دکمه زیر ایجاد کنید.",
        deactivate: "برای فعالسازی مجدد حساب باید رمز عبور وارد کنید.",
        suspend: "کاربران معلق نمی توانند وارد شوند و پیام های آنها به دیگران نمایش داده نمی شود.",
        erase: "کاربر را به عنوان GDPR پاک شده علامت گذاری کنید",
        erase_text:
          "وهذا يعني أن الرسائل المرسلة من قبل المستخدم (المستخدمين) ستظل مرئية من قبل أي شخص كان في الغرفة عند إرسال هذه الرسائل، ولكنها مخفية عن المستخدمين الذين ينضمون إلى الغرفة بعد ذلك.",
        erase_admin_error: "حذف المستخدم الخاص غير مسموح به.",
        modify_managed_user_error: "لا يُسمح بتغيير المستخدم الذي يديره النظام.",
        username_available: "نام کاربری موجود",
      },
      badge: {
        you: "شما",
        bot: "ربات",
        admin: "مدیر",
        support: "پشتیبان",
        regular: "کاربر عادی",
        system_managed: "مدیریت سیستم",
      },
      action: {
        erase: "پاک کردن اطلاعات کاربر",
        erase_avatar: "محو الصورة الرمزية",
        delete_media: "حذف جميع الوسائط التي تم تحميلها بواسطة المستخدم (المستخدمين)",
        redact_events: "تنقيح جميع الأحداث المرسلة من قبل المستخدم (-s)",
        generate_password: "توليد رمز عبور",
        overwrite_title: "هشدار!",
        overwrite_content:
          "این نام کاربری قبلا استفاده شده است. آیا مطمئن هستید که می خواهید کاربر موجود را بازنویسی کنید؟",
        overwrite_cancel: "انصراف",
        overwrite_confirm: "بازنویسی",
      },
      limits: {
        messages_per_second: "پیام در ثانیه",
        messages_per_second_text: "تعداد عملیاتی که می تواند در یک ثانیه انجام شود.",
        burst_count: "تعداد پیچیدگی",
        burst_count_text: "تعداد عملیاتی که می تواند قبل از محدودیت انجام شود.",
      },
      account_data: {
        title: "داده های کاربر",
        global: "عمومی",
        rooms: "اتاق ها",
      },
    },
    rooms: {
      name: "اتاق |||| اتاق ها",
      fields: {
        room_id: "شناسه اتاق",
        name: "نام",
        canonical_alias: "نام مستعار",
        joined_members: "اعضا",
        joined_local_members: "اعضای محلی",
        joined_local_devices: "دستگاه های محلی",
        state_events: "رویدادهای حالت / پیچیدگی",
        version: "نسخه",
        is_encrypted: "رمزگذاری شده است",
        encryption: "رمزگذاری",
        federatable: "Federatable",
        public: "قابل مشاهده در فهرست اتاق",
        creator: "سازنده",
        join_rules: "به قوانین بپیوندید",
        guest_access: "دسترسی مهمان",
        history_visibility: "مشاهده تاریخچه",
        topic: "موضوع",
        avatar: "آواتار",
        actions: "عملیات",
      },
      helper: {
        forward_extremities:
          "اندام های رو به جلو، رویدادهای برگ در انتهای نمودار غیر چرخه ای جهت دار (DAG) در یک اتاق هستند، رویدادهایی که فرزند ندارند. هر چه تعداد بیشتری در یک اتاق وجود داشته باشد، وضوح حالت بیشتری را که سیناپس باید انجام دهد (نکته: این یک عملیات گران است). در حالی که Synapse کدی برای جلوگیری از وجود تعداد زیادی از این موارد در یک زمان در اتاق دارد، گاهی اوقات باگ‌ها می‌توانند دوباره ظاهر شوند. اگر اتاقی بیش از 10 انتهای رو به جلو دارد، بهتر است بررسی کنید که کدام اتاق مقصر است و احتمالاً آنها را با استفاده از جستارهای SQL ذکر شده در آن حذف کنید. #1760.",
      },
      enums: {
        join_rules: {
          public: "عمومی",
          knock: "در زدن",
          invite: "دعوت کردن",
          private: "خصوصی",
        },
        guest_access: {
          can_join: "مهمانان می توانند ملحق شوند",
          forbidden: "مهمانان نمی توانند ملحق شوند",
        },
        history_visibility: {
          invited: "از آنجایی که دعوت شده است",
          joined: "از زمانی که پیوست",
          shared: "از آنجایی که به اشتراک گذاشته شده است",
          world_readable: "هر کسی",
        },
        unencrypted: "رمزگذاری نشده",
      },
      action: {
        erase: {
          title: "حذف اتاق",
          content:
            "آیا مطمئن هستید که می خواهید اتاق را حذف کنید؟ این قابل بازگشت نیست. همه پیام ها و رسانه های مشترک در اتاق از سرور حذف می شوند!",
          fields: {
            block: "حذف",
          },
          success: "اتاق با موفقیت حذف شد.",
          failure: "خطایی رخ داده است.",
        },
        make_admin: {
          assign_admin: "مدیر انتخاب کنید",
          title: "مدیر اتاق %{roomName} را انتخاب کنید",
          confirm: "مدیر انتخاب کنید",
          content:
            "کامل MXID کاربری را وارد کنید که به عنوان مدیر تنظیم شود.\nهشدار: برای این کار، اتاق باید حداقل یک اعضای محلی به عنوان مدیر داشته باشد.",
          success: "کاربر به عنوان مدیر اتاق تنظیم شد.",
          failure: "کاربر به عنوان مدیر اتاق تنظیم نشد. %{errMsg}",
        },
      },
    },
    reports: {
      name: "رویداد گزارش شده |||| رویدادهای گزارش شده",
      fields: {
        id: "شناسه",
        received_ts: "زمان گزارش",
        user_id: "گوینده",
        name: "نام اتاق",
        score: "نمره",
        reason: "دلیل",
        event_id: "شناسه رویداد",
        event_json: {
          origin: "سرور مبدا",
          origin_server_ts: "زمان ارسال",
          type: "نوع رویداد",
          content: {
            msgtype: "نوع محتوا",
            body: "محتوا",
            format: "قالب",
            formatted_body: "محتوای قالب بندی شده",
            algorithm: "الگوریتم",
          },
        },
      },
    },
    connections: {
      name: "اتصالات",
      fields: {
        last_seen: "تاریخ",
        ip: "آدرس آی پی",
        user_agent: "نماینده کاربر",
      },
    },
    devices: {
      name: "دستگاه |||| دستگاه ها",
      fields: {
        device_id: "شناسه دستگاه",
        display_name: "نام دستگاه",
        last_seen_ts: "مهر زمان",
        last_seen_ip: "آدرس آی پی",
      },
      action: {
        erase: {
          title: "حذف کردن %{id}",
          content: 'آیا مطمئن هستید که می خواهید دستگاه را حذف کنید؟ "%{name}"?',
          success: "دستگاه با موفقیت حذف شد.",
          failure: "خطایی رخ داده است.",
        },
      },
    },
    users_media: {
      name: "رسانه ها",
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
    },
    protect_media: {
      action: {
        create: "محافظت نشده، حفاظت ایجاد کنید",
        delete: "محافظت شده، حفاظت را بردارید",
        none: "در قرنطینه",
        send_success: "وضعیت حفاظت با موفقیت تغییر کرد.",
        send_failure: "خطایی رخ داده است.",
      },
    },
    quarantine_media: {
      action: {
        name: "قرنطینه",
        create: "به قرنطینه اضافه کنید",
        delete: "در قرنطینه، غیر قرنطینه",
        none: "از قرنطینه محافظت می شود",
        send_success: "وضعیت قرنطینه با موفقیت تغییر کرد.",
        send_failure: "خطایی رخ داده است.",
      },
    },
    pushers: {
      name: "هل دهنده |||| هل دهنده ها",
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
      name: "اطلاعیه های سرور",
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
        state_group: "گروه دولتی",
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
      name: "رسانه ها",
      fields: {
        media_id: "شناسه رسانه",
      },
      helper: {
        info: "این یک لیست از رسانه ها است که در اتاق بارگذاری شده است. نمی توان رسانه ها را حذف کرد که در اتاق های خارجی بارگذاری شده اند.",
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
          "آیا مطمئنید که می خواهید این اتاق را از فهرست راهنمای حذف کنید؟ |||| آیا مطمئن هستید که می خواهید این موارد را %{smart_count} از راهنمای اتاق ها حذف کنید؟",
        erase: "حذف از فهرست اتاق",
        create: "انتشار در راهنما اتاق",
        send_success: "اتاق با موفقیت منتشر شد.",
        send_failure: "خطایی رخ داده است.",
      },
    },
    destinations: {
      name: "سرور های مرتبط",
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
      },
      helper: { length: "طول توکن در صورت عدم ارائه توکن." },
    },
  },
};
export default fa;
