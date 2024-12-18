import { Badge, useTheme, Button, Paper, Popper, ClickAwayListener, Box, List, ListItem, ListItemText, Typography, ListSubheader, IconButton, Divider, Tooltip } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDataProvider, useStore } from "react-admin";
import { useNavigate } from "react-router";
import { Fragment, useEffect, useState } from "react";
import { useAppContext } from "../../Context";
import { ServerNotificationsResponse } from "../../synapse/dataProvider";

// 10 seconds
const SERVER_NOTIFICATIONS_INTERVAL_TIME = 10000;

const useServerNotifications = () => {
  const [serverNotifications, setServerNotifications] = useStore<ServerNotificationsResponse>("serverNotifications", { notifications: [], success: false });
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { notifications, success } = serverNotifications;

  const fetchNotifications = async () => {
    const notificationsResponse: ServerNotificationsResponse = await dataProvider.getServerNotifications(etkeccAdmin);
    setServerNotifications({
      ...notificationsResponse,
      notifications: notificationsResponse.notifications,
      success: notificationsResponse.success
    });
  };

  const deleteServerNotifications = async () => {
    const deleteResponse = await dataProvider.deleteServerNotifications(etkeccAdmin);
    if (deleteResponse.success) {
      await fetchNotifications();
    }
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

  return { success, notifications, deleteServerNotifications };
};

export const ServerNotificationsBadge = () => {
  const navigate = useNavigate();
  const { success, notifications, deleteServerNotifications } = useServerNotifications();
  const theme = useTheme();

  // Modify menu state to work with Popper
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSeeAllNotifications = () => {
    handleClose();
    navigate("/server_notifications");
  };

  const handleClearAllNotifications = async () => {
    deleteServerNotifications()
    handleClose();
  };

  if (!success) {
    return null;
  }

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton onClick={handleOpen} sx={{ color: theme.palette.common.white }}>
        <Tooltip title={notifications && notifications.length > 0 ? `${notifications.length} new notifications` : `No notifications yet`}>
        {notifications && notifications.length > 0 && (
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        ) || <NotificationsIcon />}
        </Tooltip>
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
              maxHeight: "350px",
              overflowY: "auto",
              minWidth: "300px",
              maxWidth: {
                xs: "100vw", // Full width on mobile
                sm: "400px"  // Fixed width on desktop
              }
            }}
          >
            {(!notifications || notifications.length === 0) ? (
              <Typography sx={{ p: 1 }} variant="body2">No new notifications</Typography>
            ) : (
              <List sx={{ p: 0 }} dense={true}>
                <ListSubheader
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                    backgroundColor: "inherit",
                  }}
                >
                    <Typography variant="h6">Notifications</Typography>
                    <Box sx={{ cursor: "pointer", color: theme.palette.primary.main }} onClick={() => handleSeeAllNotifications()}>See all notifications</Box>
                  </ListSubheader>
                <Divider />
                {notifications.map((notification) => (
                  <Fragment key={notification.event_id}>
                    <ListItem
                      onClick={() => handleSeeAllNotifications()}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                          cursor: "pointer"
                        }
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                            dangerouslySetInnerHTML={{ __html: notification.output.split("\n")[0] }}
                          />
                        }
                      />
                    </ListItem>
                    <Divider />
                  </Fragment>
                ))}
                <ListItem>
                  <Button
                    onClick={() => handleClearAllNotifications()}
                    size="small"
                    color="error"
                    sx={{
                      pl: 0,
                      pt: 1,
                      verticalAlign: "middle"
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Clear all
                  </Button>
                </ListItem>
              </List>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};
