import React from "react";

import { createRoot } from "react-dom/client";

import {App, AppContext } from "./App";
import { FetchConfig, GetConfig } from "./utils/config";
import storage from "./storage";

await FetchConfig();

createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <AppContext.Provider value={GetConfig()}>
          <App />
        </AppContext.Provider>
      </React.StrictMode>
);
