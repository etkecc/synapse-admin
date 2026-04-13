import { JSONStringify, decodeURLComponent, encodeURLComponent, tt } from "./safety";

describe("encodeURLComponent", () => {
  it("returns a plain string unchanged", () => {
    expect(encodeURLComponent("plain.jpg")).toBe("plain.jpg");
  });

  it("encodes spaces as %20", () => {
    expect(encodeURLComponent("my file.png")).toBe("my%20file.png");
  });

  it("encodes & as %26", () => {
    expect(encodeURLComponent("a&b")).toBe("a%26b");
  });

  it("encodes # as %23", () => {
    expect(encodeURLComponent("file#1.txt")).toBe("file%231.txt");
  });

  it("encodes + as %2B", () => {
    expect(encodeURLComponent("a+b")).toBe("a%2Bb");
  });

  it("encodes non-ASCII characters", () => {
    expect(encodeURLComponent("résumé.pdf")).toBe("r%C3%A9sum%C3%A9.pdf");
  });

  it("returns an empty string unchanged", () => {
    expect(encodeURLComponent("")).toBe("");
  });
});

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
