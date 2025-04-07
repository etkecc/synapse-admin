import RestoreIcon from "@mui/icons-material/Restore";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Typography, Link, Alert, Divider } from "@mui/material";
import { Stack } from "@mui/material";

import RecurringCommandsList from "./recurring/RecurringCommandsList";
import ScheduledCommandsList from "./scheduled/ScheduledCommandsList";

const ServerSchedulesPage = () => {
  return (
    <Stack spacing={3} mt={3}>
      <Stack spacing={1} direction="column">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h4">Server Schedules</Typography>
        </Box>
        <Typography variant="body1">
          Here you can{" "}
          <Link target="_blank" href="https://etke.cc/help/extras/scheduler/#schedule">
            schedule
          </Link>{" "}
          commands to run them either once at a certain time or on{" "}
          <Link target="_blank" href="https://etke.cc/help/extras/scheduler/#recurring">
            a recurring basis
          </Link>
          .
        </Typography>
      </Stack>

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

export default ServerSchedulesPage;
