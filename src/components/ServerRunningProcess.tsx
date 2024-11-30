import { useEffect, useState } from "react";
import { useAppContext } from "../App";
import { useDataProvider } from "react-admin";
import { Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// every 5 minutes
const SERVER_CURRENT_PROCCESS_INTERVAL_TIME = 5 * 60 * 1000;

export const useCurrentServerProcess = () => {
  const [serverCommand, setServerCommand] = useState("");
  const [serverLockedAt, setServerLockedAt] = useState("");
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();

  const checkServerRunningProcess = async () => {
    const serverStatus = await dataProvider.getServerRunningProcess(etkeccAdmin);
    if (serverStatus.command) {
      setServerCommand(serverStatus.command);
    }
    if (serverStatus.locked_at) {
      setServerLockedAt(new Date(serverStatus.locked_at).toLocaleString());
    }
  }

  useEffect(() => {
    let serverCheckInterval: NodeJS.Timeout;
    if (etkeccAdmin) {
      checkServerRunningProcess();
      setTimeout(() => {
        serverCheckInterval = setInterval(checkServerRunningProcess, SERVER_CURRENT_PROCCESS_INTERVAL_TIME);
      }, SERVER_CURRENT_PROCCESS_INTERVAL_TIME);
    }

    return () => {
      if (serverCheckInterval) {
        clearInterval(serverCheckInterval);
      }
    }
  }, [etkeccAdmin]);

  return { serverCommand, serverLockedAt };
};

const ServerRunningProcess = () => {
  const theme = useTheme();
  const { serverCommand, serverLockedAt } = useCurrentServerProcess();

  return <Box>
    {serverCommand && serverLockedAt && <Chip  sx={{ background: theme.palette.background.default }} label={`${serverCommand} - ${serverLockedAt}`} />}
  </Box>
};

export default ServerRunningProcess;
