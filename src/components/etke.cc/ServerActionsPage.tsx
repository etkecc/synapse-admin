import RestoreIcon from "@mui/icons-material/Restore";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Typography, Link } from "@mui/material";
import { Stack } from "@mui/material";

import CurrentlyRunningCommand from "./CurrentlyRunningCommand";
import { EtkeAttribution } from "./EtkeAttribution";
import ServerCommandsPanel from "./ServerCommandsPanel";
import RecurringCommandsList from "./schedules/components/recurring/RecurringCommandsList";
import ScheduledCommandsList from "./schedules/components/scheduled/ScheduledCommandsList";
const ServerActionsPage = () => (
  <Stack spacing={3} mt={3}>
    <Stack direction="column">
      <CurrentlyRunningCommand />
      <ServerCommandsPanel />
    </Stack>

    <Box sx={{ mt: 2 }}>
      <Typography variant="h5">
        <ScheduleIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Scheduled commands
      </Typography>
      <Typography variant="body1">
        The following commands are scheduled to run at specific times. You can view their details and modify them as
        needed.
        <EtkeAttribution>
          <Typography>
            More details about the mode can be found{" "}
            <Link href="https://etke.cc/help/extras/scheduler/#schedule" target="_blank">
              here
            </Link>
            .
          </Typography>
        </EtkeAttribution>
      </Typography>
      <ScheduledCommandsList />
    </Box>

    <Box sx={{ mt: 2 }}>
      <Typography variant="h5">
        <RestoreIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Recurring commands
      </Typography>
      <Typography variant="body1">
        The following commands are set to run at specific weekday and time (weekly). You can view their details and
        modify them as needed.
        <EtkeAttribution>
          <Typography>
            More details about the mode can be found{" "}
            <Link href="https://etke.cc/help/extras/scheduler/#recurring" target="_blank">
              here
            </Link>
            .
          </Typography>
        </EtkeAttribution>
      </Typography>
      <RecurringCommandsList />
    </Box>
  </Stack>
);

export default ServerActionsPage;
