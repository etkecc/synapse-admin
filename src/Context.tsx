import { createContext, useContext, useEffect, useState } from "react";

import { Config, GetConfig, SubscribeConfig } from "./utils/config";

export const AppContext = createContext<Config>({} as Config);

export const useAppContext = () => useContext(AppContext) as Config;

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<Config>(GetConfig());

  useEffect(() => {
    return SubscribeConfig(() => {
      setConfig(GetConfig());
    });
  }, []);

  return <AppContext.Provider value={config}>{children}</AppContext.Provider>;
};
