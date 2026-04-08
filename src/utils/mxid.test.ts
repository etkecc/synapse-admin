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

  // ---------------------------------------------------------------------------
  // isMXID
  // ---------------------------------------------------------------------------

  describe("isMXID", () => {
    describe("valid MXIDs", () => {
      it("accepts a simple domain server name", () => {
        expect(isMXID("@alice:example.org")).toBe(true);
      });

      it("accepts a subdomain server name", () => {
        expect(isMXID("@alice:matrix.example.org")).toBe(true);
      });

      it("accepts a domain with port", () => {
        expect(isMXID("@alice:example.org:8448")).toBe(true);
      });

      it("accepts a host:port server name (no TLD, e.g. dev/test envs)", () => {
        expect(isMXID("@managed-bot:synapse:8008")).toBe(true);
      });

      it("accepts an IPv4 server name", () => {
        expect(isMXID("@alice:192.168.1.1")).toBe(true);
      });

      it("accepts an IPv4 server name with port", () => {
        expect(isMXID("@alice:192.168.1.1:8448")).toBe(true);
      });

      it("accepts an IPv6 server name (loopback)", () => {
        expect(isMXID("@alice:[::1]")).toBe(true);
      });

      it("accepts an IPv6 server name with port", () => {
        expect(isMXID("@alice:[::1]:8448")).toBe(true);
      });

      it("accepts a full IPv6 server name with port", () => {
        expect(isMXID("@alice:[2001:db8::1]:8448")).toBe(true);
      });

      it("accepts a localpart with underscores (appservice/bridge users)", () => {
        expect(isMXID("@_bridge_bot:example.org")).toBe(true);
      });

      it("accepts a localpart with hyphens", () => {
        expect(isMXID("@managed-mas:example.org")).toBe(true);
      });

      it("accepts a localpart with dots", () => {
        expect(isMXID("@alice.smith:example.org")).toBe(true);
      });
    });

    describe("invalid MXIDs", () => {
      it("rejects a plain username with no sigil or server", () => {
        expect(isMXID("alice")).toBe(false);
      });

      it("rejects a username missing the server part", () => {
        expect(isMXID("@alice")).toBe(false);
      });

      it("rejects a username with an empty server part", () => {
        expect(isMXID("@alice:")).toBe(false);
      });

      it("rejects an empty string", () => {
        expect(isMXID("")).toBe(false);
      });

      it("rejects a string with an empty localpart", () => {
        expect(isMXID("@:example.org")).toBe(false);
      });

      it("rejects a double-@ prefix", () => {
        expect(isMXID("@@alice:example.org")).toBe(false);
      });

      it("rejects a localpart that contains @", () => {
        expect(isMXID("@al@ice:example.org")).toBe(false);
      });

      it("rejects a server-only string with no @-prefix", () => {
        expect(isMXID(":example.org")).toBe(false);
      });

      it("rejects undefined coerced to string", () => {
        expect(isMXID(undefined as unknown as string)).toBe(false);
      });
    });
  });

  // ---------------------------------------------------------------------------
  // getLocalpart
  // ---------------------------------------------------------------------------

  describe("getLocalpart", () => {
    it("extracts localpart from a simple MXID", () => {
      expect(getLocalpart("@alice:example.org")).toBe("alice");
    });

    it("extracts localpart from a MXID with port", () => {
      expect(getLocalpart("@alice:example.org:8448")).toBe("alice");
    });

    it("extracts localpart from a MXID with IPv4 server", () => {
      expect(getLocalpart("@alice:192.168.1.1:8448")).toBe("alice");
    });

    it("extracts localpart from a MXID with IPv6 server", () => {
      expect(getLocalpart("@alice:[::1]:8448")).toBe("alice");
    });

    it("extracts localpart with hyphens and underscores", () => {
      expect(getLocalpart("@_bridge-bot:example.org")).toBe("_bridge-bot");
    });

    it("returns the input unchanged when there is no @ prefix", () => {
      expect(getLocalpart("alice")).toBe("alice");
    });

    it("returns the input unchanged when there is no colon", () => {
      expect(getLocalpart("@alice")).toBe("@alice");
    });

    it("returns a non-MXID string unchanged", () => {
      expect(getLocalpart("just-a-string")).toBe("just-a-string");
    });
  });

  // ---------------------------------------------------------------------------
  // returnMXID
  // ---------------------------------------------------------------------------

  describe("returnMXID", () => {
    it("returns an already-valid MXID unchanged (simple domain)", () => {
      localStorage.setItem("home_server", "example.org");
      expect(returnMXID("@alice:example.org")).toBe("@alice:example.org");
    });

    it("returns an already-valid MXID unchanged (domain with port)", () => {
      localStorage.setItem("home_server", "example.org:8448");
      expect(returnMXID("@alice:example.org:8448")).toBe("@alice:example.org:8448");
    });

    it("returns an already-valid MXID unchanged (IPv4 with port)", () => {
      localStorage.setItem("home_server", "192.168.1.1:8448");
      expect(returnMXID("@alice:192.168.1.1:8448")).toBe("@alice:192.168.1.1:8448");
    });

    it("returns an already-valid MXID unchanged (IPv6 with port)", () => {
      localStorage.setItem("home_server", "[::1]:8448");
      expect(returnMXID("@alice:[::1]:8448")).toBe("@alice:[::1]:8448");
    });

    it("builds a MXID from a bare localpart", () => {
      localStorage.setItem("home_server", "example.org");
      expect(returnMXID("alice")).toBe("@alice:example.org");
    });

    it("builds a MXID from a bare localpart when homeserver has a port", () => {
      localStorage.setItem("home_server", "example.org:8448");
      expect(returnMXID("alice")).toBe("@alice:example.org:8448");
    });

    it("builds a MXID from a bare localpart when homeserver is IPv4 with port", () => {
      localStorage.setItem("home_server", "192.168.1.1:8448");
      expect(returnMXID("alice")).toBe("@alice:192.168.1.1:8448");
    });

    it("builds a MXID from a bare localpart when homeserver is IPv6", () => {
      localStorage.setItem("home_server", "[::1]:8448");
      expect(returnMXID("alice")).toBe("@alice:[::1]:8448");
    });

    it("strips the leading @ when building from @-prefixed localpart", () => {
      localStorage.setItem("home_server", "example.org");
      expect(returnMXID("@alice")).toBe("@alice:example.org");
    });
  });

  // ---------------------------------------------------------------------------
  // isSystemUser
  // ---------------------------------------------------------------------------

  describe("isSystemUser", () => {
    it("returns false when asManagedUsers is empty", () => {
      expect(isSystemUser("@alice:example.org")).toBe(false);
    });

    it("returns false when the id does not match any pattern", () => {
      LoadConfig({
        restrictBaseUrl: "https://example.org",
        corsCredentials: "same-origin",
        asManagedUsers: ["^@bot:example\\.org$"],
        menu: [],
        etkeccAdmin: "",
      });
      expect(isSystemUser("@alice:example.org")).toBe(false);
    });

    it("returns true when the id matches a string pattern", () => {
      LoadConfig({
        restrictBaseUrl: "https://example.org",
        corsCredentials: "same-origin",
        asManagedUsers: ["^@bot:example\\.org$"],
        menu: [],
        etkeccAdmin: "",
      });
      expect(isSystemUser("@bot:example.org")).toBe(true);
    });

    it("returns true when the id matches a RegExp pattern", () => {
      LoadConfig({
        restrictBaseUrl: "https://example.org",
        corsCredentials: "same-origin",
        asManagedUsers: [/^@bot:/],
        menu: [],
        etkeccAdmin: "",
      });
      expect(isSystemUser("@bot:example.org")).toBe(true);
    });

    it("matches appservice users with port in server name", () => {
      LoadConfig({
        restrictBaseUrl: "https://example.org",
        corsCredentials: "same-origin",
        asManagedUsers: ["^@managed-[a-zA-Z0-9\\-]+:synapse:8008$"],
        menu: [],
        etkeccAdmin: "",
      });
      expect(isSystemUser("@managed-mas:synapse:8008")).toBe(true);
      expect(isSystemUser("@alice:synapse:8008")).toBe(false);
    });

    it("clears the cache when config changes", () => {
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
  });

  // ---------------------------------------------------------------------------
  // generateRandomMXID
  // ---------------------------------------------------------------------------

  describe("generateRandomMXID", () => {
    it("generates a MXID for the current homeserver (simple domain)", () => {
      localStorage.setItem("home_server", "example.org");
      const randomValues = new Uint32Array([0, 1, 2, 3, 4, 5, 6, 7]);
      const cryptoSpy = vi.spyOn(global.crypto, "getRandomValues").mockReturnValue(randomValues);

      expect(generateRandomMXID()).toBe("@01234567:example.org");

      cryptoSpy.mockRestore();
    });

    it("generates a valid MXID for a homeserver with a port", () => {
      localStorage.setItem("home_server", "example.org:8448");
      const randomValues = new Uint32Array([0, 1, 2, 3, 4, 5, 6, 7]);
      const cryptoSpy = vi.spyOn(global.crypto, "getRandomValues").mockReturnValue(randomValues);

      const result = generateRandomMXID();
      expect(result).toBe("@01234567:example.org:8448");
      expect(isMXID(result)).toBe(true);

      cryptoSpy.mockRestore();
    });

    it("generates a valid MXID for an IPv6 homeserver", () => {
      localStorage.setItem("home_server", "[::1]:8448");
      const randomValues = new Uint32Array([0, 1, 2, 3, 4, 5, 6, 7]);
      const cryptoSpy = vi.spyOn(global.crypto, "getRandomValues").mockReturnValue(randomValues);

      const result = generateRandomMXID();
      expect(result).toBe("@01234567:[::1]:8448");
      expect(isMXID(result)).toBe(true);

      cryptoSpy.mockRestore();
    });
  });
});
