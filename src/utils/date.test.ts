import { normalizeTS } from "./date";

describe("normalizeTS", () => {
  it("converts second-based unix timestamps to milliseconds", () => {
    expect(normalizeTS(1560432506)).toBe(1560432506000);
  });

  it("keeps millisecond-based unix timestamps unchanged", () => {
    expect(normalizeTS(1560432668000)).toBe(1560432668000);
  });

  it("returns null and undefined unchanged", () => {
    expect(normalizeTS(null)).toBeNull();
    expect(normalizeTS(undefined)).toBeUndefined();
  });
});
