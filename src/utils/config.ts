import storage from "../storage";

export interface Config {
  restrictBaseUrl: string | string[];
  asManagedUsers: RegExp[];
  menu: MenuItem[];
}

export interface MenuItem {
  label: string;
  icon: string;
  url: string;
}

export const WellKnownKey = "cc.etke.synapse-admin";

// current configuration
let config: Config = {
  restrictBaseUrl: "",
  asManagedUsers: [],
  menu: [],
};

export const FetchConfig = async () => {
  try {
    const resp = await fetch("config.json");
    const configJSON = await resp.json();
    console.log("Loaded config.json", configJSON);
    LoadConfig(configJSON);
  } catch (e) {
    console.error(e);
  }

  // if home_server is set, try to load https://home_server/.well-known/matrix/client
  const homeserver = storage.getItem("home_server");
  if (homeserver) {
    try {
      const resp = await fetch(`https://${homeserver}/.well-known/matrix/client`);
        const configWK = await resp.json();
      if (!configWK[WellKnownKey]) {
        console.log(`Loaded https://${homeserver}.well-known/matrix/client, but it doesn't contain ${WellKnownKey} key, skipping`, configWK);
      } else {
          console.log(`Loaded https://${homeserver}.well-known/matrix/client`, configWK);
            LoadConfig(configWK[WellKnownKey]);
        }
    } catch (e) {
      console.log(`https://${homeserver}/.well-known/matrix/client not found, skipping`, e);
    }
  }

}

// load config from context
export const LoadConfig = (context: any) => {
  if (context?.restrictBaseUrl) {
    config.restrictBaseUrl = context.restrictBaseUrl as string | string[];
  }

  if (context?.asManagedUsers) {
    config.asManagedUsers = context.asManagedUsers.map((regex: string) => new RegExp(regex));
  }

  let menu: MenuItem[] = [];
  if (context?.menu) {
    menu = context.menu as MenuItem[];
  }
  if (menu.length > 0) {
    config.menu = menu;
  }
}

// get config
export const GetConfig = (): Config => {
  return config;
}


// clear config
export const ClearConfig = () => {
  // config.json
  config = {} as Config;
  // session
  storage.clear();
}
