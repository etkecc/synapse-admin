import { LoadConfig } from "./config";
import { generateRandomMXID, getLocalpart, isMXID, isSystemUser, returnMXID } from "./mxid";

describe("mxid utils", () => {
  beforeEach(() => {
    localStorage.clear();
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
    });
  });

  it("validates Matrix user ids", () => {
    expect(isMXID("@alice:example.org")).toBe(true);
    expect(isMXID("alice")).toBe(false);
  });

  it("extracts the localpart from MXIDs", () => {
    expect(getLocalpart("@alice:example.org")).toBe("alice");
    expect(getLocalpart("alice")).toBe("alice");
  });

  it("returns existing MXIDs unchanged", () => {
    localStorage.setItem("home_server", "example.org");

    expect(returnMXID("@alice:example.org")).toBe("@alice:example.org");
  });

  it("preserves MXIDs when the homeserver includes a port", () => {
    localStorage.setItem("home_server", "example.org:8448");

    expect(returnMXID("@alice:example.org:8448")).toBe("@alice:example.org:8448");
  });

  it("builds an MXID from a localpart", () => {
    localStorage.setItem("home_server", "example.org");

    expect(returnMXID("alice")).toBe("@alice:example.org");
    expect(returnMXID("@alice")).toBe("@alice:example.org");
  });

  it("clears the managed-user cache when config changes", () => {
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: ["^@bot:example\\.org$"],
      menu: [],
      etkeccAdmin: "",
    });

    expect(isSystemUser("@bot:example.org")).toBe(true);

    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: ["^@admin:example\\.org$"],
      menu: [],
      etkeccAdmin: "",
    });

    expect(isSystemUser("@bot:example.org")).toBe(false);
    expect(isSystemUser("@admin:example.org")).toBe(true);
  });

  it("generates a random MXID for the current homeserver", () => {
    localStorage.setItem("home_server", "example.org");
    const randomValues = new Uint32Array([0, 1, 2, 3, 4, 5, 6, 7]);
    const cryptoSpy = vi.spyOn(global.crypto, "getRandomValues").mockReturnValue(randomValues);

    expect(generateRandomMXID()).toBe("@01234567:example.org");

    cryptoSpy.mockRestore();
  });
});
