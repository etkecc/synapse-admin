import { useState, useEffect } from "react";
import { useDataProvider, useLocale } from "react-admin";

import { useAppContext } from "../../../Context";
import { ServerCommand } from "../../../synapse/dataProvider";
import { GetInstanceConfig } from "../InstanceConfig";

export const useServerCommands = () => {
  const icfg = GetInstanceConfig();
  const { etkeccAdmin } = useAppContext();
  const locale = useLocale();
  const [isLoading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [serverCommands, setServerCommands] = useState<Record<string, ServerCommand>>({});
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchServerCommands = async () => {
      const serverCommandsResponse = await dataProvider.getServerCommands(etkeccAdmin, locale);
      if (serverCommandsResponse?.maintenance) {
        setMaintenance(true);
        setLoading(false);
        return;
      }
      if (serverCommandsResponse) {
        const serverCommands = serverCommandsResponse.commands;
        Object.keys(serverCommandsResponse.commands).forEach((command: string) => {
          serverCommands[command].additionalArgs = "";
        });

        if (icfg.disabled.payments || icfg.disabled.attributions) {
          delete serverCommands["price"];
          delete serverCommands["payments"];
        }

        setServerCommands(serverCommands);
      }
      setLoading(false);
    };
    fetchServerCommands();
  }, [dataProvider, etkeccAdmin, locale, icfg.disabled.attributions, icfg.disabled.payments]);

  return { isLoading, maintenance, serverCommands, setServerCommands };
};
