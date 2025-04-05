import { Box, Typography, Link, Alert, Divider } from "@mui/material";
import { Stack } from "@mui/material"
import ScheduleIcon from '@mui/icons-material/Schedule';
import RestoreIcon from '@mui/icons-material/Restore';
import ScheduledCommandsList from "./scheduled/ScheduledCommandsList";
import RecurringCommandsList from "./recurring/RecurringCommandsList";

const ServerSchedulesPage = () => {
  return (
    <Stack spacing={3} mt={3}>
      <Stack spacing={1} direction="column">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h4">Server Schedules</Typography>
        </Box>
        <Alert severity="info">
          <Typography variant="body1">
            This is a web interface for the <Link target="_blank" href="https://etke.cc/help/extras/scheduler/">Scheduler Service</Link> that allows you to manage and maintain your server without using the Matrix bot directly.
          </Typography>
        </Alert>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">
          <ScheduleIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Scheduled commands
        </Typography>
        <Typography variant="body1">
          The following commands are scheduled to run at specific times. You can view their details and modify them as needed.
          More details about the mode can be found <Link href="https://etke.cc/help/extras/scheduler/#schedule" target="_blank">here</Link>.
        </Typography>
        <ScheduledCommandsList />
      </Box>

      <Divider sx={{ my: 4, borderWidth: 2 }} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">
          <RestoreIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Recurring commands
        </Typography>
        <Typography variant="body1">
          The following commands are set to run at specific weekday and time (weekly).
          You can view their details and modify them as needed.
          More details about the mode can be found <Link href="https://etke.cc/help/extras/scheduler/#recurring" target="_blank">here</Link>.
        </Typography>
        <RecurringCommandsList />
      </Box>
    </Stack>
  );
};

export default ServerSchedulesPage;
