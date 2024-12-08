import { createContext, useContext } from "react";

import { Config } from "./utils/config";

export const AppContext = createContext<Config | undefined>(undefined);

export const useAppContext = () => useContext(AppContext) as Config;