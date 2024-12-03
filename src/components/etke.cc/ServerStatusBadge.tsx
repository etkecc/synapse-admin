import { Avatar, Badge, Theme, Tooltip } from "@mui/material";
import { useEffect } from "react";
import { useAppContext } from "../../App";
import { Button, useDataProvider, useStore } from "react-admin";
import { styled } from '@mui/material/styles';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { BadgeProps } from "@mui/material/Badge";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles";
import { ServerProcessResponse, ServerStatusResponse } from "../../synapse/dataProvider";

interface StyledBadgeProps extends BadgeProps {
  backgroundColor: string;
  badgeColor: string
  theme?: Theme;
}

const StyledBadge = styled(Badge, { shouldForwardProp: (prop) => !['badgeColor', 'backgroundColor'].includes(prop as string) })<StyledBadgeProps>
  (({ theme, backgroundColor, badgeColor }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: backgroundColor,
      color: badgeColor,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 2.5s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
}));

// every 5 minutes
const SERVER_STATUS_INTERVAL_TIME = 5 * 60 * 1000;
// every 5 seconds
const SERVER_CURRENT_PROCCESS_INTERVAL_TIME = 5 * 1000;

const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useStore<ServerStatusResponse>("serverStatus", { ok: false, success: false, host: "", results: [] });
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const isOkay = serverStatus.ok;
  const successCheck = serverStatus.success;

  const checkServerStatus = async () => {
    const serverStatus: ServerStatusResponse = await dataProvider.getServerStatus(etkeccAdmin);
    setServerStatus({
      ok: serverStatus.ok,
      success: serverStatus.success,
      host: serverStatus.host,
      results: serverStatus.results,
    });
  };

  useEffect(() => {
    let serverStatusInterval: NodeJS.Timeout;
    if (etkeccAdmin) {
      checkServerStatus();
      setTimeout(() => {
        // start the interval after 10 seconds to avoid too many requests
        serverStatusInterval = setInterval(checkServerStatus, SERVER_STATUS_INTERVAL_TIME);
      }, 10000);
    }  else {
      setServerStatus({ ok: false, success: false, host: "", results: [] });
    }

    return () => {
      if (serverStatusInterval) {
        clearInterval(serverStatusInterval);
      }
    }
  }, [etkeccAdmin]);

  return { isOkay, successCheck };
};

const useCurrentServerProcess = () => {
  const [serverProcess, setServerProcess] = useStore<ServerProcessResponse>("serverProcess", { command: "", locked_at: "" });
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { command, locked_at } = serverProcess;

  const checkServerRunningProcess = async () => {
    const serverProcess = await dataProvider.getServerRunningProcess(etkeccAdmin);
    setServerProcess({
      ...serverProcess,
      command: serverProcess.command,
      locked_at: serverProcess.locked_at ? new Date(serverProcess.locked_at) : ""
    });
  }

  useEffect(() => {
    let serverCheckInterval: NodeJS.Timeout;
    if (etkeccAdmin) {
      checkServerRunningProcess();
      setTimeout(() => {
        serverCheckInterval = setInterval(checkServerRunningProcess, SERVER_CURRENT_PROCCESS_INTERVAL_TIME);
      }, 5000);
    } else {
      setServerProcess({ command: "", locked_at: "" });
    }

    return () => {
      if (serverCheckInterval) {
        clearInterval(serverCheckInterval);
      }
    }
  }, [etkeccAdmin]);

  return { command, locked_at };
};

const ServerStatusBadge = () => {
    const { isOkay, successCheck } = useServerStatus();
    const { command, locked_at } = useCurrentServerProcess();
    const theme = useTheme();
    const navigate = useNavigate();

    if (!successCheck) {
      return null;
    }

    const handleServerStatusClick = () => {
      navigate("/server_status");
    };

    let tooltipText = "Click to view Server Status";
    let badgeBackgroundColor = isOkay ? theme.palette.success.light : theme.palette.error.main;
    let badgeColor = isOkay ? theme.palette.success.light : theme.palette.error.main;

    if (command && locked_at) {
      badgeBackgroundColor = theme.palette.warning.main;
      badgeColor = theme.palette.warning.main;
      tooltipText = `Running: ${command}; ${tooltipText}`;
    }

    return <Button onClick={handleServerStatusClick} size="medium" sx={{ minWidth: "auto", ".MuiButton-startIcon": { m: 0 }}}>
      <Tooltip title={tooltipText} sx={{ cursor: "pointer" }}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          backgroundColor={badgeBackgroundColor}
          badgeColor={badgeColor}
        >
          <Avatar sx={{ height: 24, width: 24, background: theme.palette.mode === "dark" ? theme.palette.background.default : "#2196f3" }}>
            <MonitorHeartIcon sx={{ height: 22, width: 22, color: theme.palette.common.white }} />
          </Avatar>
        </StyledBadge>
      </Tooltip>
    </Button>
};

export default ServerStatusBadge;
