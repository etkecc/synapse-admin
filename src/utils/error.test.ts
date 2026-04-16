import { displayError } from "./error";

describe("displayError", () => {
  it("formats the error string correctly", () => {
    expect(displayError("M_UNKNOWN", 500, "Internal server error")).toBe("M_UNKNOWN (500): Internal server error");
  });

  it("handles empty strings", () => {
    expect(displayError("", 0, "")).toBe(" (0): ");
  });

  it("includes all three parts", () => {
    const result = displayError("M_FORBIDDEN", 403, "You are not allowed");
    expect(result).toContain("M_FORBIDDEN");
    expect(result).toContain("403");
    expect(result).toContain("You are not allowed");
  });
});
