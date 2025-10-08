import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { AppContext } from "./Context";
import { FetchInstanceConfig } from "./components/etke.cc/InstanceConfig";
import { FetchConfig, GetConfig } from "./utils/config";

await FetchConfig();
await FetchInstanceConfig(GetConfig().etkeccAdmin);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContext.Provider value={GetConfig()}>
      <App />
    </AppContext.Provider>
  </React.StrictMode>
);
