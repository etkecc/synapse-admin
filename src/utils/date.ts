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

/**
 * Normalize timestamps to milliseconds.
 *
 * This exists because the upstream APIs used by the users resource are inconsistent:
 *
 * - `GET /_synapse/admin/v2/users/<user_id>` returns `creation_ts` in seconds.
 * - `GET /_synapse/admin/v2/users` and `GET /_synapse/admin/v3/users` return `creation_ts` in milliseconds.
 *
 * The UI expects a single normalized field (`creation_ts_ms`) regardless of which endpoint
 * produced the record. Without normalization, records loaded from the single-user v2 endpoint
 * are interpreted as milliseconds by the browser and render dates around January 1970.
 *
 * We detect second-based Unix timestamps using a simple threshold:
 * current millisecond epoch values are 13 digits, while second-based epoch values are 10 digits.
 * Anything below 1_000_000_000_000 is therefore treated as seconds and multiplied by 1000.
 *
 * This helper is intentionally conservative:
 * - `null` and `undefined` are returned as-is so callers can preserve missing values.
 * - already-normalized millisecond timestamps are returned unchanged.
 */
export const normalizeTS = (value?: number | null): number | null | undefined => {
  if (value == null) {
    return value;
  }

  return value < 1_000_000_000_000 ? value * 1000 : value;
};

interface TimeSinceResult {
  timeI18Nkey: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  timeI18Nparams: Record<string, any>;
}

// assuming date is in format "2025-02-26 20:52:00" where no timezone is specified
export const getTimeSince = (dateToCompare: string): TimeSinceResult => {
  const nowUTC = new Date().getTime();
  if (!dateToCompare.includes("Z")) {
    dateToCompare = dateToCompare + "Z";
  }
  const past = new Date(dateToCompare);

  const pastUTC = past.getTime();
  const diffInMs = nowUTC - pastUTC;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) return { timeI18Nkey: "etkecc.time.less_than_minute", timeI18Nparams: {} };
  if (diffInMinutes === 1) return { timeI18Nkey: "etkecc.time.minutes", timeI18Nparams: { smart_count: 1 } };
  if (diffInMinutes < 60) return { timeI18Nkey: "etkecc.time.minutes", timeI18Nparams: { smart_count: diffInMinutes } };
  if (diffInMinutes < 120) return { timeI18Nkey: "etkecc.time.hours", timeI18Nparams: { smart_count: 1 } };
  if (diffInMinutes < 24 * 60)
    return { timeI18Nkey: "etkecc.time.hours", timeI18Nparams: { smart_count: Math.floor(diffInMinutes / 60) } };
  if (diffInMinutes < 48 * 60) return { timeI18Nkey: "etkecc.time.days", timeI18Nparams: { smart_count: 1 } };
  if (diffInMinutes < 7 * 24 * 60)
    return { timeI18Nkey: "etkecc.time.days", timeI18Nparams: { smart_count: Math.floor(diffInMinutes / (24 * 60)) } };
  if (diffInMinutes < 14 * 24 * 60) return { timeI18Nkey: "etkecc.time.weeks", timeI18Nparams: { smart_count: 1 } };
  if (diffInMinutes < 30 * 24 * 60)
    return {
      timeI18Nkey: "etkecc.time.weeks",
      timeI18Nparams: { smart_count: Math.floor(diffInMinutes / (7 * 24 * 60)) },
    };
  if (diffInMinutes < 60 * 24 * 60) return { timeI18Nkey: "etkecc.time.months", timeI18Nparams: { smart_count: 1 } };

  return {
    timeI18Nkey: "etkecc.time.months",
    timeI18Nparams: { smart_count: Math.floor(diffInMinutes / (30 * 24 * 60)) },
  };
};
