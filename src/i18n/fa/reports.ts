const reports = {
  name: "رویداد گزارش شده |||| رویدادهای گزارش شده",
  fields: {
    id: "شناسه",
    received_ts: "زمان گزارش",
    user_id: "گوینده",
    name: "نام اتاق",
    score: "نمره",
    reason: "دلیل",
    event_id: "شناسه رویداد",
    sender: "فرستنده",
  },
  action: {
    erase: {
      title: "حذف رویداد گزارش‌شده",
      content: "آیا مطمئن هستید که می‌خواهید رویداد گزارش‌شده را حذف کنید؟ این کار قابل بازگشت نیست.",
    },
    event_lookup: {
      label: "جستجوی رویداد",
      title: "دریافت رویداد با شناسه",
      fetch: "دریافت",
    },
    fetch_event_error: "دریافت رویداد با خطا مواجه شد",
  },
};

export default reports;
