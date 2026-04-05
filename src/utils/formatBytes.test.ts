import { formatBytes } from "./formatBytes";

describe("formatBytes", () => {
  it("formats zero bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
  });

  it("formats bytes without decimals", () => {
    expect(formatBytes(1023)).toBe("1023 B");
  });

  it("formats kilobytes with one decimal place", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
  });

  it("caps units at terabytes", () => {
    expect(formatBytes(1024 ** 5)).toBe("1024.0 TB");
  });
});
