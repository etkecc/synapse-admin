import { Badge, useTheme, Button, Paper, Popper, ClickAwayListener, Box, List, ListItem, ListItemText, Typography, ListSubheader, IconButton } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDataProvider, useStore } from "react-admin";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
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
    console.log("notificationsResponse", notificationsResponse);
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

  return { notifications, deleteServerNotifications };
};

export const ServerNotificationsBadge = () => {
  const navigate = useNavigate();
  const { notifications, deleteServerNotifications } = useServerNotifications();
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

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton onClick={handleOpen} sx={{ color: theme.palette.common.white }}>
        <Badge badgeContent={notifications.length} color="warning">
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
            elevation={3}
            sx={{
              p: 1,
              maxHeight: "300px",
              overflowY: "auto",
              minWidth: "300px",
              maxWidth: {
                xs: "100vw", // Full width on mobile
                sm: "400px"  // Fixed width on desktop
              }
            }}
          >
            {notifications.length === 0 ? (
              <Typography sx={{ p: 1 }} variant="body2">No new notifications</Typography>
            ) : (
              <List sx={{ p: 0 }} dense={true}>
                <ListSubheader
                  sx={{
                    fontWeight: "bold",
                    color: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.paper,
                    cursor: "pointer"
                  }}
                  onClick={() => handleSeeAllNotifications()}
                >
                    See all notifications
                  </ListSubheader>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.event_id}
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
                ))}
                <ListItem>
                  <Button
                    onClick={(e) => handleClearAllNotifications()}
                    size="small"
                    color="error"
                    sx={{
                      pl: 0
                    }}
                  >
                    <DeleteIcon fontSize="small" />
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
