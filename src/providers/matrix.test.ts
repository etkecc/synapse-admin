import { fetchUtils } from "react-admin";

import { isValidBaseUrl, splitMxid, resolveBaseUrlWithWellKnown } from "./matrix";

jest.mock("react-admin", () => ({
  fetchUtils: {
    fetchJson: jest.fn(),
  },
}));

describe("splitMxid", () => {
  it("splits valid MXIDs", () =>
    expect(splitMxid("@name:domain.tld")).toEqual({
      name: "name",
      domain: "domain.tld",
    }));
  it("rejects invalid MXIDs", () => expect(splitMxid("foo")).toBeUndefined());
});

describe("isValidBaseUrl", () => {
  it("accepts a http URL", () => expect(isValidBaseUrl("http://foo.bar")).toBeTruthy());
  it("accepts a https URL", () => expect(isValidBaseUrl("https://foo.bar")).toBeTruthy());
  it("accepts a valid URL with port", () => expect(isValidBaseUrl("https://foo.bar:1234")).toBeTruthy());
  it("rejects undefined base URLs", () => expect(isValidBaseUrl(undefined)).toBeFalsy());
  it("rejects null base URLs", () => expect(isValidBaseUrl(null)).toBeFalsy());
  it("rejects empty base URLs", () => expect(isValidBaseUrl("")).toBeFalsy());
  it("rejects non-string base URLs", () => expect(isValidBaseUrl({})).toBeFalsy());
  it("rejects base URLs without protocol", () => expect(isValidBaseUrl("foo.bar")).toBeFalsy());
  it("rejects base URLs with path", () => expect(isValidBaseUrl("http://foo.bar/path")).toBeFalsy());
  it("rejects invalid base URLs", () => expect(isValidBaseUrl("http:/foo.bar")).toBeFalsy());
});

describe("resolveBaseUrlWithWellKnown", () => {
  const fetchJsonMock = fetchUtils.fetchJson as jest.Mock;

  afterEach(() => {
    fetchJsonMock.mockReset();
  });

  it("returns well-known base_url when present", async () => {
    fetchJsonMock.mockResolvedValueOnce({
      json: {
        "m.homeserver": { base_url: "https://api.example.com" },
      },
    });

    await expect(resolveBaseUrlWithWellKnown("https://example.com")).resolves.toBe("https://api.example.com");
    expect(fetchJsonMock).toHaveBeenCalledWith("https://example.com/.well-known/matrix/client", { method: "GET" });
  });

  it("falls back to provided URL when well-known fails", async () => {
    fetchJsonMock.mockRejectedValueOnce(new Error("nope"));

    await expect(resolveBaseUrlWithWellKnown("https://example.com/")).resolves.toBe("https://example.com");
  });
});
