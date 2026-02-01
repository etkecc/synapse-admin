import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import { Avatar, Badge, Box, Theme, Tooltip } from "@mui/material";
import { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { Button, useDataProvider, useStore, useTranslate } from "react-admin";
import { useNavigate } from "react-router";

import { useAppContext } from "../../Context";
import { ServerProcessResponse, ServerStatusResponse } from "../../synapse/dataProvider";

interface StyledBadgeProps extends BadgeProps {
  backgroundColor: string;
  badgeColor: string;
  theme?: Theme;
}

const StyledBadge = styled(Badge, {
  shouldForwardProp: prop => !["badgeColor", "backgroundColor"].includes(prop as string),
})<StyledBadgeProps>(({ theme, backgroundColor, badgeColor }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: backgroundColor,
    color: badgeColor,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 2.5s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

// every 5 minutes
const SERVER_STATUS_INTERVAL_TIME = 5 * 60 * 1000;
// every 5 seconds
const SERVER_CURRENT_PROCCESS_INTERVAL_TIME = 5 * 1000;

const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useStore<ServerStatusResponse>("serverStatus", {
    ok: false,
    success: false,
    maintenance: false,
    host: "",
    results: [],
  });
  const [serverProcess, _setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
    maintenance: false,
  });
  const { command } = serverProcess;
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const isOkay = serverStatus.ok;
  const successCheck = serverStatus.success;
  const maintenance = serverStatus.maintenance;

  const checkServerStatus = async () => {
    const serverStatus: ServerStatusResponse = await dataProvider.getServerStatus(etkeccAdmin, command !== "");
    setServerStatus({
      ok: serverStatus.ok,
      maintenance: serverStatus.maintenance,
      success: serverStatus.success,
      host: serverStatus.host,
      results: serverStatus.results,
    });
  };

  useEffect(() => {
    let serverStatusInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (etkeccAdmin) {
      checkServerStatus();
      timeoutId = setTimeout(() => {
        // start the interval after 10 seconds to avoid too many requests
        serverStatusInterval = setInterval(checkServerStatus, SERVER_STATUS_INTERVAL_TIME);
      }, 10000);
    } else {
      setServerStatus({ ok: false, success: false, host: "", results: [] });
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (serverStatusInterval) {
        clearInterval(serverStatusInterval);
      }
    };
  }, [etkeccAdmin, command]);

  return { isOkay, successCheck, maintenance };
};

const useCurrentServerProcess = () => {
  const [serverProcess, setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
    maintenance: false,
  });
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { command, locked_at, maintenance } = serverProcess;

  const checkServerRunningProcess = async () => {
    const serverProcess: ServerProcessResponse = await dataProvider.getServerRunningProcess(
      etkeccAdmin,
      command !== ""
    );
    setServerProcess({
      ...serverProcess,
      command: serverProcess.command,
      locked_at: serverProcess.locked_at,
      maintenance: serverProcess.maintenance,
    });
  };

  useEffect(() => {
    let serverCheckInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (etkeccAdmin) {
      checkServerRunningProcess();
      timeoutId = setTimeout(() => {
        serverCheckInterval = setInterval(checkServerRunningProcess, SERVER_CURRENT_PROCCESS_INTERVAL_TIME);
      }, 5000);
    } else {
      setServerProcess({ command: "", locked_at: "", maintenance: false });
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (serverCheckInterval) {
        clearInterval(serverCheckInterval);
      }
    };
  }, [etkeccAdmin, command]);

  return { command, locked_at, maintenance };
};

export const ServerStatusStyledBadge = ({
  command,
  locked_at,
  isOkay,
  isLoaded,
  isMaintenance = false,
  inSidebar = false,
}: {
  command: string;
  locked_at: string;
  isOkay: boolean;
  isLoaded: boolean;
  isMaintenance?: boolean;
  inSidebar: boolean;
}) => {
  const theme = useTheme();
  let badgeBackgroundColor =
    isLoaded && !isMaintenance
      ? isOkay
        ? theme.palette.success.light
        : theme.palette.error.main
      : theme.palette.grey[600];
  let badgeColor =
    isLoaded && !isMaintenance
      ? isOkay
        ? theme.palette.success.light
        : theme.palette.error.main
      : theme.palette.grey[600];

  if (command && locked_at) {
    badgeBackgroundColor = theme.palette.warning.main;
    badgeColor = theme.palette.warning.main;
  }
  let avatarBackgroundColor = theme.palette.mode === "dark" ? theme.palette.background.default : "#2196f3";
  if (inSidebar) {
    avatarBackgroundColor = theme.palette.grey[600];
  }

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      backgroundColor={badgeBackgroundColor}
      badgeColor={badgeColor}
    >
      <Avatar sx={{ height: 24, width: 24, background: avatarBackgroundColor }}>
        <MonitorHeartIcon sx={{ height: 22, width: 22, color: theme.palette.common.white }} />
      </Avatar>
    </StyledBadge>
  );
};

const ServerStatusBadge = () => {
  const translate = useTranslate();
  const { isOkay, successCheck, maintenance } = useServerStatus();
  const { command, locked_at } = useCurrentServerProcess();
  const navigate = useNavigate();

  if (!successCheck) {
    return null;
  }

  const handleServerStatusClick = () => {
    navigate("/server_status");
  };

  let tooltipText = translate("etkecc.status.badge.default");

  if (command && locked_at) {
    tooltipText = translate("etkecc.status.badge.running", {
      command: command,
      text: tooltipText,
    });
  }

  return (
    <Button onClick={handleServerStatusClick} size="medium" sx={{ minWidth: "auto", ".MuiButton-startIcon": { m: 0 } }}>
      <Tooltip title={tooltipText} sx={{ cursor: "pointer" }}>
        <Box>
          <ServerStatusStyledBadge
            inSidebar={false}
            command={command || ""}
            locked_at={locked_at || ""}
            isOkay={isOkay}
            isLoaded={successCheck}
            isMaintenance={maintenance}
          />
        </Box>
      </Tooltip>
    </Button>
  );
};

export default ServerStatusBadge;
