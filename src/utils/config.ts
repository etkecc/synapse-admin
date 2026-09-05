import createLogger from "./logger";

const log = createLogger("config");

export interface Config {
  restrictBaseUrl: string | string[];
  corsCredentials: string;
  asManagedUsers: RegExp[] | string[];
  menu: MenuItem[];
  externalAuthProvider?: boolean;
  etkeccAdmin?: string;
  wellKnownDiscovery?: boolean;
}

export interface MenuItem {
  label: string;
  i18n?: Record<string, string>;
  icon: string;
  url: string;
}

export const WellKnownKey = "cc.etke.ketesa";
export const WellKnownKeyLegacy = "cc.etke.synapse-admin";

type ConfigListener = () => void;

const configListeners = new Set<ConfigListener>();

const notifyConfigListeners = () => {
  configListeners.forEach(listener => listener());
};

// current configuration
let config: Config = {
  restrictBaseUrl: "",
  corsCredentials: "same-origin",
  asManagedUsers: [],
  menu: [],
  etkeccAdmin: "",
};

export const FetchConfig = async () => {
  // Loads config.json, honoring vite base url (import.meta.env.BASE_URL); appends a trailing slash if missing.
  let configJSONUrl = "config.json";
  if (import.meta.env.BASE_URL) {
    configJSONUrl = `${import.meta.env.BASE_URL.replace(/\/?$/, "/")}config.json`;
  }
  try {
    const resp = await fetch(configJSONUrl);
    const configJSON = await resp.json();
    log.debug("config.json loaded", { url: configJSONUrl });
    LoadConfig(configJSON);
  } catch (e) {
    log.warn("config.json not found, using defaults", e);
  }

  await FetchWellKnownConfig();

  if (config.externalAuthProvider !== undefined) {
    SetExternalAuthProvider(config.externalAuthProvider);
  }
};

export const FetchWellKnownConfig = async () => {
  let protocol = "https";
  const baseURL = localStorage.getItem("base_url");
  if (baseURL && baseURL.startsWith("http://")) {
    protocol = "http";
  }

  // if home_server is set, try to load https://home_server/.well-known/matrix/client
  let homeserver = localStorage.getItem("home_server");
  // if it is not set, attempt to identify homeserver from the restrictBaseUrl config
  if (!homeserver) {
    const restrictBaseUrl = config.restrictBaseUrl;
    const configured = typeof restrictBaseUrl === "string" ? restrictBaseUrl : (restrictBaseUrl?.[0] ?? "");
    if (configured !== "") {
      try {
        const url = new URL(configured);
        if (url.host) {
          homeserver = url.host;
          // protocol rides with the host it came from; dial an http-only deployment over https and it just hangs.
          protocol = url.protocol.replace(":", "");
        }
      } catch (e) {
        log.warn("invalid restrictBaseUrl, skipping", { restrictBaseUrl: configured, error: e });
      }
    }
  }

  if (!homeserver) {
    return false;
  }

  try {
    const resp = await fetch(`${protocol}://${homeserver}/.well-known/matrix/client`);
    const configWK = await resp.json();
    const wkConfig = configWK[WellKnownKey] || configWK[WellKnownKeyLegacy];
    if (!wkConfig) {
      log.debug("well-known loaded but no Ketesa config key found", {
        homeserver,
        expectedKey: WellKnownKey,
        legacyKey: WellKnownKeyLegacy,
        response: configWK,
      });
      return false;
    }

    log.info("well-known config loaded", { homeserver });
    // Well-known config intentionally overlays config.json (including restrictBaseUrl); well-known is admin-trusted.
    LoadConfig(wkConfig);
    return true;
  } catch (e) {
    log.debug("well-known not found, skipping", { homeserver, error: e });
    return false;
  }
};

// Loads config from context; processes each key separately to avoid overwriting the config or fighting TS types.
export const LoadConfig = (context: Config) => {
  const nextConfig: Config = { ...config };
  let changed = false;
  if (context?.restrictBaseUrl) {
    nextConfig.restrictBaseUrl = context.restrictBaseUrl as string | string[];
    changed = true;
  }

  if (context?.corsCredentials) {
    nextConfig.corsCredentials = context.corsCredentials;
    changed = true;
  }

  if (context?.asManagedUsers) {
    nextConfig.asManagedUsers = context.asManagedUsers.map((regex: string | RegExp) =>
      typeof regex === "string" ? new RegExp(regex) : regex
    );
    changed = true;
  }

  let menu: MenuItem[] = [];
  if (context?.menu) {
    menu = context.menu as MenuItem[];
  }
  if (menu.length > 0) {
    nextConfig.menu = menu;
    changed = true;
  }

  if (context?.externalAuthProvider !== undefined) {
    nextConfig.externalAuthProvider = context.externalAuthProvider;
    changed = true;
  }
  // if not set in context, try to load from localStorage
  if (nextConfig.externalAuthProvider === undefined) {
    const storedExternalAuthProvider = localStorage.getItem("external_auth_provider");
    if (storedExternalAuthProvider !== null) {
      nextConfig.externalAuthProvider = storedExternalAuthProvider === "true";
      changed = true;
    }
  }

  if (context?.wellKnownDiscovery !== undefined) {
    nextConfig.wellKnownDiscovery = context.wellKnownDiscovery;
    changed = true;
  }

  if (context?.etkeccAdmin) {
    nextConfig.etkeccAdmin = context.etkeccAdmin;
    changed = true;
  }

  if (changed) {
    config = nextConfig;
    log.debug("config updated", { config });
    notifyConfigListeners();
  }
};

// get config
export const GetConfig = (): Config => {
  return config;
};

// Clears session-specific runtime state; static deployment config stays so login behaves correctly after logout.
export const ClearConfig = () => {
  config = { ...config, externalAuthProvider: undefined };
  localStorage.clear();
  notifyConfigListeners();
};

// workaround for external auth providers (like OIDC, LDAP, etc.) to signal that some functionality should be disabled
export const SetExternalAuthProvider = (value: boolean) => {
  config = { ...config, externalAuthProvider: value };
  localStorage.setItem("external_auth_provider", value ? "true" : "false");
  notifyConfigListeners();
};

export const SubscribeConfig = (listener: ConfigListener) => {
  configListeners.add(listener);
  return () => {
    configListeners.delete(listener);
  };
};
