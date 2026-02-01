import de from "./de";
import en from "./en";
import fa from "./fa";
import fr from "./fr";
import itMessages from "./it";
import ja from "./ja";
import ru from "./ru";
import uk from "./uk";
import zh from "./zh";

const locales = {
  de,
  fa,
  fr,
  it: itMessages,
  ja,
  ru,
  uk,
  zh,
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const collectKeys = (value: unknown, prefix = "", out = new Set<string>()) => {
  if (!isPlainObject(value)) return out;

  for (const [key, child] of Object.entries(value)) {
    const next = prefix ? `${prefix}.${key}` : key;
    out.add(next);
    if (isPlainObject(child)) {
      collectKeys(child, next, out);
    }
  }
  return out;
};

const diffKeys = (reference: Set<string>, target: Set<string>) => {
  const missing: string[] = [];
  const extra: string[] = [];

  for (const key of reference) {
    if (!target.has(key)) missing.push(key);
  }
  for (const key of target) {
    if (!reference.has(key)) extra.push(key);
  }

  missing.sort();
  extra.sort();
  return { missing, extra };
};

describe("i18n translation keys", () => {
  const referenceKeys = collectKeys(en);

  for (const [locale, messages] of Object.entries(locales)) {
    it(`${locale} matches en key set`, () => {
      const keys = collectKeys(messages);
      const { missing, extra } = diffKeys(referenceKeys, keys);

      if (missing.length || extra.length) {
        const parts: string[] = [];
        if (missing.length) {
          parts.push(`missing (${missing.length}): ${missing.join(", ")}`);
        }
        if (extra.length) {
          parts.push(`extra (${extra.length}): ${extra.join(", ")}`);
        }
        throw new Error(parts.join(" | "));
      }
    });
  }
});
