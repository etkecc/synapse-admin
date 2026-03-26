/**
 * Decode a URI component, and if it fails, return the original string.
 */
export const decodeURLComponent = (str: string): string => {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
};

/**
 * Safely convert a value to a JSON string representation.
 * If JSON.stringify fails, returns the fallback string.
 */
export const JSONStringify = (value: unknown, fallback = ""): string => {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};
