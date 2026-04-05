import { JSONStringify, decodeURLComponent } from "./safety";

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
