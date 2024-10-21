import { createContext, useContext } from "react";

interface AppContextType {
  restrictBaseUrl: string | string[];
  asManagedUsers: string[];
  supportURL: string;
  menu: MenuItem[];
}

interface MenuItem {
  label: string;
  icon: string;
  url: string;
}

export const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext) as AppContextType;
