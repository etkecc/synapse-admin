import {
  ClearConfig,
  FetchWellKnownConfig,
  GetConfig,
  LoadConfig,
  SetExternalAuthProvider,
  SubscribeConfig,
  WellKnownKey,
} from "./config";

describe("config utils", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    ClearConfig();
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
    });
  });

  it("converts managed-user patterns to regular expressions", () => {
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "include",
      asManagedUsers: ["^@bot:example\\.org$"],
      menu: [],
      etkeccAdmin: "admin",
    });

    const config = GetConfig();
    expect(config.corsCredentials).toBe("include");
    expect(config.etkeccAdmin).toBe("admin");
    expect(config.asManagedUsers[0]).toBeInstanceOf(RegExp);
    expect((config.asManagedUsers[0] as RegExp).test("@bot:example.org")).toBe(true);
  });

  it("loads external auth provider from localStorage when omitted from context", () => {
    localStorage.setItem("external_auth_provider", "true");

    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
    });

    expect(GetConfig().externalAuthProvider).toBe(true);
  });

  it("preserves static config on clear while dropping runtime auth state", () => {
    SetExternalAuthProvider(true);

    ClearConfig();

    const config = GetConfig();
    expect(config.restrictBaseUrl).toBe("https://example.org");
    expect(config.corsCredentials).toBe("same-origin");
    expect(config.externalAuthProvider).toBeUndefined();
    expect(localStorage.length).toBe(0);
  });

  it("notifies subscribers when config changes", () => {
    const listener = vi.fn();
    const unsubscribe = SubscribeConfig(listener);

    LoadConfig({
      restrictBaseUrl: "https://updated.example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
    });

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("sets wellKnownDiscovery when provided in context", () => {
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
      wellKnownDiscovery: false,
    });

    expect(GetConfig().wellKnownDiscovery).toBe(false);
  });

  it("sets wellKnownDiscovery to true when explicitly provided", () => {
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
      wellKnownDiscovery: true,
    });

    expect(GetConfig().wellKnownDiscovery).toBe(true);
  });

  it("does not overwrite wellKnownDiscovery when omitted from context", () => {
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
      wellKnownDiscovery: false,
    });

    // omitting wellKnownDiscovery in a subsequent LoadConfig should not reset it
    LoadConfig({
      restrictBaseUrl: "https://example.org",
      corsCredentials: "same-origin",
      asManagedUsers: [],
      menu: [],
      etkeccAdmin: "",
    });

    expect(GetConfig().wellKnownDiscovery).toBe(false);
  });

  it("loads well-known config using the host from restrictBaseUrl when home_server is unset", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          [WellKnownKey]: {
            asManagedUsers: ["^@wk:example\\.org$"],
            menu: [],
          },
        })
      )
    );

    const loaded = await FetchWellKnownConfig();

    expect(loaded).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith("https://example.org/.well-known/matrix/client");
    expect((GetConfig().asManagedUsers[0] as RegExp).test("@wk:example.org")).toBe(true);
  });
});
