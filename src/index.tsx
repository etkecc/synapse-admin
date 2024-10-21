import React from "react";

import { createRoot } from "react-dom/client";

import App from "./App";
import { AppContext, MenuItem } from "./AppContext";
import storage from "./storage";

fetch("config.json")
  .then(res => res.json())
  .then(props => {
    if (props.asManagedUsers) {
      storage.setItem("as_managed_users", JSON.stringify(props.asManagedUsers));
    }

    let menu: MenuItem[] = [];
    if (props.menu) {
      menu = props.menu;
    }
    if (props.supportURL) {
      const migratedSupportURL = {
        label: "Contact support",
        icon: "SupportAgent",
        url: props.supportURL,
      };
      console.warn("supportURL config option is deprecated. Please, use the menu option instead. Automatically migrated to the new menu option:", migratedSupportURL);
      menu.push(migratedSupportURL as MenuItem);
    }
    if (menu.length > 0) {
      storage.setItem("menu", JSON.stringify(menu));
    }

    return createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <AppContext.Provider value={props}>
          <App />
        </AppContext.Provider>
      </React.StrictMode>
    )
  });
