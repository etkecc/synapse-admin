import { AppContextType, MenuItem } from "../AppContext";
import storage from "../storage";

export const WellKnownKey = "cc.etke.synapse-admin";

export const LoadConfig = (context: AppContextType): AppContextType => {
  if (context.restrictBaseUrl) {
    storage.setItem("restrict_base_url", JSON.stringify(context.restrictBaseUrl));
  }

  if (context.asManagedUsers) {
    storage.setItem("as_managed_users", JSON.stringify(context.asManagedUsers));
  }

  let menu: MenuItem[] = [];
  if (context.menu) {
    menu = context.menu;
  }
  if (context.supportURL) {
    const migratedSupportURL = {
      label: "Contact support",
      icon: "SupportAgent",
      url: context.supportURL,
    };
    console.warn("supportURL config option is deprecated. Please, use the menu option instead. Automatically migrated to the new menu option:", migratedSupportURL);
    menu.push(migratedSupportURL as MenuItem);
  }
  if (menu.length > 0) {
    storage.setItem("menu", JSON.stringify(menu));
  }

  // below we try to calculate "final" config, which will contain values from context and already set values in storage
  let finalAsManagedUsers: string[] = [];
  try {
    finalAsManagedUsers = JSON.parse(storage.getItem("as_managed_users") || "");
  } catch (e) {}

  let finalMenu: MenuItem[] = [];
  try {
    finalMenu = JSON.parse(storage.getItem("menu") || "");
  } catch (e) {}

  return {
    restrictBaseUrl: storage.getItem("restrict_base_url") || "",
    asManagedUsers: finalAsManagedUsers,
    supportURL: storage.getItem("support_url") || "",
    menu: finalMenu,
  } as AppContextType;

}
