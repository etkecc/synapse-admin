export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

export const dateParser = (v: string | number | Date): number => {
  const d = new Date(v);
  return d.getTime();
};

export const dateFormatter = (v: string | number | Date | undefined | null): string => {
  if (v === undefined || v === null) return "";
  const d = new Date(v);

  const pad = "00";
  const year = d.getFullYear().toString();
  const month = (pad + (d.getMonth() + 1).toString()).slice(-2);
  const day = (pad + d.getDate().toString()).slice(-2);
  const hour = (pad + d.getHours().toString()).slice(-2);
  const minute = (pad + d.getMinutes().toString()).slice(-2);

  // target format yyyy-MM-ddThh:mm
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

// assuming date is in format "2025-02-26 20:52:00" where no timezone is specified
export const getTimeSince = (dateToCompare: string) => {
  const nowUTC = new Date().getTime();
  if (!dateToCompare.includes("Z")) {
    dateToCompare = dateToCompare + "Z";
  }
  const past = new Date(dateToCompare);

  const pastUTC = past.getTime();
  const diffInMs = nowUTC - pastUTC;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return "a couple of seconds";
  if (diffInMinutes === 1) return "1 minute";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes`;
  if (diffInMinutes < 120) return "1 hour";
  if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)} hours`;
  if (diffInMinutes < 48 * 60) return "1 day";
  if (diffInMinutes < 7 * 24 * 60) return `${Math.floor(diffInMinutes / (24 * 60))} days`;
  if (diffInMinutes < 14 * 24 * 60) return "1 week";
  if (diffInMinutes < 30 * 24 * 60) return `${Math.floor(diffInMinutes / (7 * 24 * 60))} weeks`;
  if (diffInMinutes < 60 * 24 * 60) return "1 month";
  return `${Math.floor(diffInMinutes / (30 * 24 * 60))} months`;
};
