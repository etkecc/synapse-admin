import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Typography, Paper, Button } from "@mui/material";
import { Stack } from "@mui/material";
import { Tooltip } from "@mui/material";
import { Title, useLocale, useStore, useTranslate } from "react-admin";

import { useAppContext } from "../../Context";
import dataProvider, { ServerNotificationsResponse } from "../../synapse/dataProvider";
import { getTimeSince } from "../../utils/date";
import { useDocTitle } from "../hooks/useDocTitle";

const ServerNotificationsPage = () => {
  const locale = useLocale();
  const translate = useTranslate();
  const { etkeccAdmin } = useAppContext();
  const [serverNotifications, setServerNotifications] = useStore<ServerNotificationsResponse>("serverNotifications", {
    notifications: [],
    success: false,
  });

  useDocTitle(translate("etkecc.notifications.title"));

  const notifications = serverNotifications.notifications;

  return (
    <>
      <Title title={translate("etkecc.notifications.title")} />
      <Stack spacing={3} mt={3}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 1 }}>
            <Typography variant="h4">{translate("etkecc.notifications.title")}</Typography>
            <Button
              variant="text"
              color="error"
              onClick={async () => {
                await dataProvider.deleteServerNotifications(etkeccAdmin, locale);
                setServerNotifications({
                  notifications: [],
                  success: true,
                });
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> {translate("etkecc.notifications.clear_all")}
            </Button>
          </Box>
        </Stack>

        {notifications.length === 0 ? (
          <Paper sx={{ p: 2 }}>
            <Typography>{translate("etkecc.notifications.no_notifications")}</Typography>
          </Paper>
        ) : (
          notifications.map((notification, index) => {
            const { timeI18Nkey, timeI18Nparams } = getTimeSince(notification.sent_at);
            const tooltipTitle = new Date(notification.sent_at.replace(" ", "T") + "Z").toLocaleString(locale);
            return (
              <Paper key={notification.event_id ? notification.event_id : index} sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                    <Tooltip title={tooltipTitle}>
                      <span>
                        {translate(timeI18Nkey, timeI18Nparams) + " " + translate("etkecc.notifications.ago")}
                      </span>
                    </Tooltip>
                  </Typography>
                  <Typography dangerouslySetInnerHTML={{ __html: notification.output }} />
                </Stack>
              </Paper>
            );
          })
        )}
      </Stack>
    </>
  );
};

export default ServerNotificationsPage;
