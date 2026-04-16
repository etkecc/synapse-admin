import { generateDeviceId, generateRandomPassword } from "./password";

const ALLOWED_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~`!@#$%^&*()_-+={[}]|:;'.?/<>,";
const ALPHANUMERIC = /^[A-Za-z0-9]+$/;

describe("generateRandomPassword", () => {
  it("returns 64 characters by default", () => {
    expect(generateRandomPassword()).toHaveLength(64);
  });

  it("returns the requested length", () => {
    expect(generateRandomPassword(10)).toHaveLength(10);
    expect(generateRandomPassword(128)).toHaveLength(128);
  });

  it("only contains characters from the allowed set", () => {
    const pw = generateRandomPassword(200);
    for (const char of pw) {
      expect(ALLOWED_CHARS).toContain(char);
    }
  });

  it("produces different values on successive calls", () => {
    const a = generateRandomPassword();
    const b = generateRandomPassword();
    expect(a).not.toBe(b);
  });
});

describe("generateDeviceId", () => {
  it("returns exactly 16 characters", () => {
    expect(generateDeviceId()).toHaveLength(16);
  });

  it("contains only alphanumeric characters", () => {
    const id = generateDeviceId();
    expect(ALPHANUMERIC.test(id)).toBe(true);
  });

  it("produces different values on successive calls", () => {
    const a = generateDeviceId();
    const b = generateDeviceId();
    expect(a).not.toBe(b);
  });
});
