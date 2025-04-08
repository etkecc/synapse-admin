import RestoreIcon from "@mui/icons-material/Restore";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Typography, Link, Divider } from "@mui/material";
import { Stack } from "@mui/material";

import RecurringCommandsList from "./schedules/components/recurring/RecurringCommandsList";
import ScheduledCommandsList from "./schedules/components/scheduled/ScheduledCommandsList";
import CurrentlyRunningCommand from "./CurrentlyRunningCommand";
import ServerCommandsPanel from "./ServerCommandsPanel";
const ServerActionsPage = () => {
  return (
    <Stack spacing={3} mt={3}>
      <Stack spacing={2} direction="column">
        <CurrentlyRunningCommand />
        <ServerCommandsPanel />
      </Stack>

      <Divider sx={{ my: 4, borderWidth: 1 }} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">
          <ScheduleIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Scheduled commands
        </Typography>
        <Typography variant="body1">
          The following commands are scheduled to run at specific times. You can view their details and modify them as
          needed. More details about the mode can be found{" "}
          <Link href="https://etke.cc/help/extras/scheduler/#schedule" target="_blank">
            here
          </Link>
          .
        </Typography>
        <ScheduledCommandsList />
      </Box>

      <Divider sx={{ my: 4, borderWidth: 2 }} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">
          <RestoreIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Recurring commands
        </Typography>
        <Typography variant="body1">
          The following commands are set to run at specific weekday and time (weekly). You can view their details and
          modify them as needed. More details about the mode can be found{" "}
          <Link href="https://etke.cc/help/extras/scheduler/#recurring" target="_blank">
            here
          </Link>
          .
        </Typography>
        <RecurringCommandsList />
      </Box>
    </Stack>
  );
};

export default ServerActionsPage;
