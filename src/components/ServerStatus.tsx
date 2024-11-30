import { Avatar, Box, Badge, Theme, Tooltip, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppContext } from "../App";
import { Button, useDataProvider, useStore } from "react-admin";
import { styled } from '@mui/material/styles';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { BadgeProps } from "@mui/material/Badge";
import { useNavigate } from "react-router";
import { useTheme } from "@mui/material/styles";

interface StyledBadgeProps extends BadgeProps {
  isOkay: boolean;
  theme?: Theme;
}

const StyledBadge = styled(Badge, { shouldForwardProp: (prop) => prop !== 'isOkay' })<StyledBadgeProps>(({ theme, isOkay }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: isOkay ? theme.palette.success.main : theme.palette.error.main,
      color: isOkay ? theme.palette.success.main : theme.palette.error.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
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

const useServerStatus = () => {
  const [serverStatus, setServerStatus] = useStore("serverStatus", { ok: false, success: false, host: "", actionable: false, results: [] });
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const isOkay = serverStatus.ok;
  const successCheck = serverStatus.success;

  const checkServerStatus = async () => {
    const serverStatus = await dataProvider.getServerStatus(etkeccAdmin);
    setServerStatus({
      ok: serverStatus.ok,
      success: serverStatus.success,
      host: serverStatus.host,
      actionable: serverStatus.actionable,
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
      }, SERVER_STATUS_INTERVAL_TIME);
    }

    return () => {
      if (serverStatusInterval) {
        clearInterval(serverStatusInterval);
      }
    }
  }, [etkeccAdmin]);

  return { isOkay, successCheck };
};

const ServerStatus = () => {
    const { isOkay, successCheck } = useServerStatus();
    const theme = useTheme();
    const navigate = useNavigate();

    if (!successCheck) {
      return null;
    }

    const handleServerStatusClick = () => {
      navigate("/server_status");
    };

    return <Button onClick={handleServerStatusClick} size="medium" sx={{ minWidth: "auto", ".MuiButton-startIcon": { m: 0 }}}>
      <Tooltip title="Click to view Server Status" sx={{ cursor: "pointer" }}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          isOkay={isOkay}
        >
          <Avatar sx={{ height: 24, width: 24, background: theme.palette.mode === "dark" ? theme.palette.background.default : "#2196f3" }}>
            <MonitorHeartIcon sx={{ height: 22, width: 22, color: theme.palette.common.white }} />
          </Avatar>
        </StyledBadge>
      </Tooltip>
    </Button>
};

export default ServerStatus;