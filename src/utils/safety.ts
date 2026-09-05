export const decodeURLComponent = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};

export const encodeURLComponent = (str: string): string => {
  try {
    return encodeURIComponent(str);
  } catch {
    return str;
  }
};

// Try-translate: react-admin translate() returns the key itself when missing; this returns fallback for dynamic keys.
export const tt = (translate: (key: string) => string, key: string, fallback: string): string => {
  const t = translate(key);
  return t !== key ? t : fallback;
};

export const JSONStringify = (value: unknown, fallback = ""): string => {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};
