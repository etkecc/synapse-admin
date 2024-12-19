import React from "react";

import { createRoot } from "react-dom/client";

import { App } from "./App";
import { AppContext } from "./Context";
import { FetchConfig, GetConfig } from "./utils/config";

await FetchConfig();

createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <AppContext.Provider value={GetConfig()}>
          <App />
        </AppContext.Provider>
      </React.StrictMode>
);
