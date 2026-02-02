import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { AppContext } from "./Context";
import { FetchInstanceConfig, GetInstanceConfig } from "./components/etke.cc/InstanceConfig";
import { FetchConfig, GetConfig } from "./utils/config";

await FetchConfig();
await FetchInstanceConfig(GetConfig().etkeccAdmin);

// we set base title here to be used in useDocTitle hook
// as a tricky workaround since hooks can't be used outside components,
// and react-admin doesn't provide a way to set document title directly
const icfg = GetInstanceConfig();
document.head.dataset.baseTitle = icfg.name || "Synapse Admin";
// set <title> based on instance name, only if it's not already set
if (icfg.name && !document.title.includes(icfg.name)) {
  document.title = icfg.name;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContext.Provider value={GetConfig()}>
      <App />
    </AppContext.Provider>
  </React.StrictMode>
);
