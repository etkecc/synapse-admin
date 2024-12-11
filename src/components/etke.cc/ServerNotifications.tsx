import { Badge, useTheme, IconButton, Paper, Popper, ClickAwayListener, Box } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import { useDataProvider } from "react-admin";
import { useEffect, useState } from "react";
import { useAppContext } from "../../Context";
import { ServerNotification, ServerNotificationsResponse } from "../../synapse/dataProvider";

// 10 seconds
const SERVER_NOTIFICATIONS_INTERVAL_TIME = 10000;

export const ServerNotifications = () => {
  const dataProvider = useDataProvider();
  const { etkeccAdmin } = useAppContext();
  const [success, setSuccess] = useState(false);
  const [notifications, setNotifications] = useState<ServerNotification[]>([]);
  const theme = useTheme();

  // Modify menu state to work with Popper
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotifications = async () => {
    const notificationsResponse: ServerNotificationsResponse = await dataProvider.getServerNotifications(etkeccAdmin);
    setNotifications(notificationsResponse.notifications);
    setSuccess(notificationsResponse.success);
  };

  useEffect(() => {
    let serverNotificationsInterval: NodeJS.Timeout;
    if (etkeccAdmin) {
      fetchNotifications();
      setTimeout(() => {
        // start the interval after 10 seconds to avoid too many requests
        serverNotificationsInterval = setInterval(fetchNotifications, SERVER_NOTIFICATIONS_INTERVAL_TIME);
      }, 10000);
    }

    return () => {
      if (serverNotificationsInterval) {
        clearInterval(serverNotificationsInterval);
      }
    }
  }, [etkeccAdmin]);

  return (
    <>
      <IconButton onClick={handleClick} sx={{ color: theme.palette.common.white }}>
        <Badge badgeContent={notifications.length} color="primary">
          <MailIcon />
        </Badge>
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            sx={{
              p: 1,
              maxHeight: "300px",
              overflowY: "auto",
              minWidth: "300px"
            }}
          >
            {notifications.length === 0 ? (
              <div style={{ padding: "8px 16px" }}>No notifications</div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  onClick={handleClose}
                  sx={{
                    p: 2,
                    "&:hover": {
                      backgroundColor: "action.hover",
                      cursor: "pointer"
                    }
                  }}
                >
                  <Box dangerouslySetInnerHTML={{ __html: notification.output }} />
                </div>
              ))
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};
