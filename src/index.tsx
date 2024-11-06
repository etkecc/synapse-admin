import React from "react";

import { createRoot } from "react-dom/client";

import App from "./App";
import { Config, WellKnownKey, LoadConfig } from "./components/config";
import { AppContext } from "./AppContext";
import storage from "./storage";

// load config.json
let props: Config = {};
try {
  const resp = await fetch("config.json");
  const configJSON = await resp.json();
  console.log("Loaded config.json", configJSON);
  props = LoadConfig(configJSON as Config);
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
      props = LoadConfig(configWK[WellKnownKey] as Config);
    }
  } catch (e) {
    console.log(`https://${homeserver}/.well-known/matrix/client not found, skipping`, e);
  }
}

createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <AppContext.Provider value={props}>
          <App />
        </AppContext.Provider>
      </React.StrictMode>
);
