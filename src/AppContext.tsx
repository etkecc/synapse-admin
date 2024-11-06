import { createContext, useContext } from "react";
import { Config } from "./components/config";

export const AppContext = createContext({});

export const useAppContext = () => useContext(AppContext) as Config;
