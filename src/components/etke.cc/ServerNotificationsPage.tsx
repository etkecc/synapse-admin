import { Box, Typography, Paper, Button } from "@mui/material"
import { Stack } from "@mui/material"
import { useStore } from "react-admin"
import dataProvider, { ServerNotificationsResponse } from "../../synapse/dataProvider"
import { useAppContext } from "../../Context";
import DeleteIcon from "@mui/icons-material/Delete";
const DisplayTime = ({ date }: { date: string }) => {
  const dateFromDateString = new Date(date);
  return <>{dateFromDateString.toLocaleString()}</>;
};

const ServerNotificationsPage = () => {
  const { etkeccAdmin } = useAppContext();
  const [serverNotifications, setServerNotifications] = useStore<ServerNotificationsResponse>("serverNotifications", {
      notifications: [],
      success: false,
  });

  const notifications = serverNotifications.notifications;

  return (
    <Stack spacing={3} mt={3}>
      <Stack spacing={1} direction="row" alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 1 }}>
          <Typography variant="h4">Server Notifications</Typography>
          <Button variant="text" color="error" onClick={async () => {
            await dataProvider.deleteServerNotifications(etkeccAdmin);
            setServerNotifications({
              notifications: [],
              success: true,
            });
          }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Clear
          </Button>
        </Box>
      </Stack>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <Typography>No new notifications.</Typography>
        </Paper>
      ) : (
        notifications.map((notification) => (
          <Paper key={notification.event_id} sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                <DisplayTime date={notification.sent_at} />
              </Typography>
              <Typography dangerouslySetInnerHTML={{ __html: notification.output }} />
            </Stack>
          </Paper>
        ))
      )}
    </Stack>
  );
};

export default ServerNotificationsPage;
