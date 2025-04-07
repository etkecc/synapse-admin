import { useState, useEffect } from "react";
import { useDataProvider } from "react-admin";

import { useAppContext } from "../../../Context";
import { ServerCommand } from "../../../synapse/dataProvider";

export const useServerCommands = () => {
  const { etkeccAdmin } = useAppContext();
  const [isLoading, setLoading] = useState(true);
  const [serverCommands, setServerCommands] = useState<Record<string, ServerCommand>>({});
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchServerCommands = async () => {
      const serverCommandsResponse = await dataProvider.getServerCommands(etkeccAdmin);
      if (serverCommandsResponse) {
        const serverCommands = serverCommandsResponse;
        Object.keys(serverCommandsResponse).forEach((command: string) => {
          serverCommands[command].additionalArgs = "";
        });
        setServerCommands(serverCommands);
      }
      setLoading(false);
    };
    fetchServerCommands();
  }, [dataProvider, etkeccAdmin]);

  return { isLoading, serverCommands, setServerCommands };
};
