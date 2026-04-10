import { JSONStringify, decodeURLComponent, tt } from "./safety";

describe("decodeURLComponent", () => {
  it("decodes valid url-encoded strings", () => {
    expect(decodeURLComponent("hello%20world")).toBe("hello world");
  });

  it("returns the original string when decoding fails", () => {
    expect(decodeURLComponent("%E0%A4%A")).toBe("%E0%A4%A");
  });
});

describe("JSONStringify", () => {
  it("returns strings unchanged", () => {
    expect(JSONStringify("plain text")).toBe("plain text");
  });

  it("returns the fallback for nullish values", () => {
    expect(JSONStringify(null, "fallback")).toBe("fallback");
    expect(JSONStringify(undefined, "fallback")).toBe("fallback");
  });

  it("stringifies plain objects", () => {
    expect(JSONStringify({ ok: true })).toBe('{"ok":true}');
  });

  it("returns the fallback when JSON.stringify throws", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(JSONStringify(circular, "fallback")).toBe("fallback");
  });
});

describe("tt", () => {
  it("returns the translation when the key has a translation (translate returns a different value)", () => {
    const translate = (_key: string) => "Translated value";
    expect(tt(translate, "some.key", "fallback")).toBe("Translated value");
  });

  it("returns the fallback when translate returns the key unchanged (no translation found)", () => {
    const translate = (key: string) => key;
    expect(tt(translate, "some.key", "fallback")).toBe("fallback");
  });

  it("uses the fallback for unknown keys even with a non-trivial key path", () => {
    const translate = (key: string) => key;
    expect(tt(translate, "resources.rooms.enums.join_rules.unknown_variant", "unknown_variant")).toBe(
      "unknown_variant"
    );
  });

  it("returns the translation when it differs from the key", () => {
    const translate = (_key: string) => "Public";
    expect(tt(translate, "resources.rooms.enums.join_rules.public", "public")).toBe("Public");
  });
});
