import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  useTheme,
  Button,
  Paper,
  Popper,
  ClickAwayListener,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListSubheader,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDataProvider, useStore, useTranslate } from "react-admin";
import { useNavigate } from "react-router";

import { useAppContext } from "../../Context";
import { ServerNotificationsResponse, ServerProcessResponse } from "../../synapse/dataProvider";
import { getTimeSince } from "../../utils/date";

// 5 minutes
const SERVER_NOTIFICATIONS_INTERVAL_TIME = 300000;

const useServerNotifications = () => {
  const [serverNotifications, setServerNotifications] = useStore<ServerNotificationsResponse>("serverNotifications", {
    notifications: [],
    success: false,
  });
  const [serverProcess, _setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
    maintenance: false,
  });
  const { command, locked_at } = serverProcess;

  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { notifications, success } = serverNotifications;

  const fetchNotifications = async () => {
    const notificationsResponse: ServerNotificationsResponse = await dataProvider.getServerNotifications(
      etkeccAdmin,
      command !== ""
    );
    const serverNotifications = [...notificationsResponse.notifications];
    serverNotifications.reverse();
    setServerNotifications({
      ...notificationsResponse,
      notifications: serverNotifications,
      success: notificationsResponse.success,
    });
  };

  const deleteServerNotifications = async () => {
    const deleteResponse = await dataProvider.deleteServerNotifications(etkeccAdmin);
    if (deleteResponse.success) {
      setServerNotifications({
        notifications: [],
        success: true,
      });
    }
  };

  useEffect(() => {
    let serverNotificationsInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    if (etkeccAdmin) {
      fetchNotifications();
      timeoutId = setTimeout(() => {
        // start the interval after the SERVER_NOTIFICATIONS_INTERVAL_TIME to avoid too many requests
        serverNotificationsInterval = setInterval(fetchNotifications, SERVER_NOTIFICATIONS_INTERVAL_TIME);
      }, SERVER_NOTIFICATIONS_INTERVAL_TIME);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (serverNotificationsInterval) {
        clearInterval(serverNotificationsInterval);
      }
    };
  }, [etkeccAdmin, command, locked_at]);

  return { success, notifications, deleteServerNotifications };
};

export const ServerNotificationsBadge = () => {
  const navigate = useNavigate();
  const { success, notifications, deleteServerNotifications } = useServerNotifications();
  const theme = useTheme();
  const translate = useTranslate();

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
    deleteServerNotifications();
    handleClose();
  };

  if (!success) {
    return null;
  }

  return (
    <Box>
      <IconButton onClick={handleOpen} sx={{ color: theme.palette.common.white }}>
        <Tooltip
          title={
            notifications && notifications.length > 0
              ? translate("etkecc.notifications.new_notifications", { smart_count: notifications.length })
              : translate("etkecc.notifications.no_notifications")
          }
        >
          {(notifications && notifications.length > 0 && (
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          )) || <NotificationsIcon />}
        </Tooltip>
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} placement="bottom-end" style={{ zIndex: 1300 }}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
              maxHeight: "350px",
              paddingTop: 0,
              overflowY: "auto",
              minWidth: "300px",
              maxWidth: {
                xs: "100vw", // Full width on mobile
                sm: "400px", // Fixed width on desktop
              },
            }}
          >
            {!notifications || notifications.length === 0 ? (
              <Typography sx={{ p: 1 }} variant="body2">
                {translate("etkecc.notifications.no_notifications")}
              </Typography>
            ) : (
              <List sx={{ p: 0 }} dense={true}>
                <ListSubheader
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="h6">{translate("etkecc.notifications.title")}</Typography>
                  <Box
                    sx={{ cursor: "pointer", color: theme.palette.primary.main }}
                    onClick={() => handleSeeAllNotifications()}
                  >
                    {translate("etkecc.notifications.see_all")}
                  </Box>
                </ListSubheader>
                <Divider />
                {notifications.map((notification, index) => {
                  const { timeI18Nkey, timeI18Nparams } = getTimeSince(notification.sent_at);
                  return (
                    <Fragment key={notification.event_id ? notification.event_id + index : index}>
                      <ListItem
                        onClick={() => handleSeeAllNotifications()}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          overflow: "hidden",
                          "&:hover": {
                            backgroundColor: "action.hover",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              dangerouslySetInnerHTML={{ __html: notification.output.split("\n")[0] }}
                            />
                          }
                        />
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              {translate(timeI18Nkey, timeI18Nparams) + " " + translate("etkecc.notifications.ago")}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </Fragment>
                  );
                })}
                <ListItem>
                  <Button
                    key="clear-all-notifications"
                    onClick={() => handleClearAllNotifications()}
                    size="small"
                    color="error"
                    sx={{
                      pl: 0,
                      pt: 1,
                      verticalAlign: "middle",
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    {translate("etkecc.notifications.clear_all")}
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
