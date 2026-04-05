import { Mock } from "vitest";
import { fetchUtils } from "react-admin";

import { isValidBaseUrl, splitMxid, resolveBaseUrlWithWellKnown } from "./matrix";

vi.mock("react-admin", () => ({
  fetchUtils: {
    fetchJson: vi.fn(),
  },
}));

describe("splitMxid", () => {
  test.each([
    // valid — hostname
    ["@name:domain.tld", { name: "name", domain: "domain.tld" }],
    ["@name:domain.tld:8448", { name: "name", domain: "domain.tld:8448" }],
    // valid — single-label / localhost
    ["@name:localhost", { name: "name", domain: "localhost" }],
    ["@name:localhost:8448", { name: "name", domain: "localhost:8448" }],
    // valid — IPv4
    ["@name:192.168.1.1", { name: "name", domain: "192.168.1.1" }],
    ["@name:192.168.1.1:8448", { name: "name", domain: "192.168.1.1:8448" }],
    // valid — IPv6
    ["@name:[::1]", { name: "name", domain: "[::1]" }],
    ["@name:[::1]:8448", { name: "name", domain: "[::1]:8448" }],
    ["@name:[2001:db8::1]", { name: "name", domain: "[2001:db8::1]" }],
    ["@name:[2001:db8::1]:8448", { name: "name", domain: "[2001:db8::1]:8448" }],
    // invalid
    ["foo", undefined],
    ["@noserver", undefined],
    ["notanmxid:domain.tld", undefined],
  ])("splitMxid(%s)", (mxid, expected) => {
    expect(splitMxid(mxid)).toEqual(expected);
  });
});

describe("isValidBaseUrl", () => {
  test.each([
    // valid — hostname
    ["http://foo.bar", true],
    ["https://foo.bar", true],
    ["https://foo.bar:1234", true],
    ["https://foo.bar/", true],
    ["https://foo.bar:1234/", true],
    // valid — IPv4
    ["http://192.168.1.1", true],
    ["https://192.168.1.1:8448", true],
    // valid — IPv6
    ["http://[::1]", true],
    ["https://[::1]", true],
    ["http://[::1]:8448", true],
    ["https://[::1]:8448/", true],
    ["https://[2001:db8::1]", true],
    ["https://[2001:db8::1]:443", true],
    ["https://[2001:db8::1]:443/", true],
    ["http://[2001:db8:cafe::1]:7000", true],
    // invalid — missing / wrong protocol
    [undefined, false],
    [null, false],
    ["", false],
    [{}, false],
    ["foo.bar", false],
    ["ftp://foo.bar", false],
    ["http:/foo.bar", false],
    // invalid — has path
    ["http://foo.bar/path", false],
    ["https://[::1]/path", false],
    // invalid — bare IPv6 without brackets
    ["http://::1", false],
  ])("isValidBaseUrl(%s) === %s", (url, expected) => {
    expect(isValidBaseUrl(url)).toBe(expected);
  });
});

describe("resolveBaseUrlWithWellKnown", () => {
  const fetchJsonMock = fetchUtils.fetchJson as Mock;

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
