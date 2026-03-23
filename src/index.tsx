import React from "react";
import { createRoot } from "react-dom/client";

import "./assets/fonts.css";
import { App } from "./App";
import { ConfigProvider } from "./Context";
import { FetchInstanceConfig, GetInstanceConfig } from "./components/etke.cc/InstanceConfig";
import { createI18nProvider } from "./i18n";
import { FetchConfig, GetConfig } from "./utils/config";

await FetchConfig();
await FetchInstanceConfig(GetConfig().etkeccAdmin, "");
const i18nProvider = await createI18nProvider();

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
    <ConfigProvider>
      <App i18nProvider={i18nProvider} />
    </ConfigProvider>
  </React.StrictMode>
);

// Fade out and remove the static loader overlay
const loader = document.getElementById("loader");
if (loader) {
  loader.classList.add("fade-out");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });
}
