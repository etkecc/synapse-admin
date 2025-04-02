import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/material"
import ScheduleIcon from '@mui/icons-material/Schedule';
import RestoreIcon from '@mui/icons-material/Restore';
import ScheduledCommandsList from "./ScheduledCommandsList";
import RecurringCommandsList from "./RecurringCommandsList";

const SchedulerCommandsPage = () => {
  return (
    <Stack spacing={3} mt={3}>
      <Stack spacing={1} direction="row" alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h4">Scheduler Commands</Typography>
        </Box>
      </Stack>
      <Stack spacing={1} direction="column" alignItems="center">
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ mb: 2 }} variant="h5"><ScheduleIcon sx={{ verticalAlign: "middle" }} /> Scheduled:</Typography>
          <ScheduledCommandsList />
        </Box>
      </Stack>
      <Stack spacing={1} direction="column" alignItems="center">
        <Box sx={{ width: "100%" }}>
          <Typography sx={{ mb: 2 }} variant="h5"><RestoreIcon sx={{ verticalAlign: "middle" }} /> Recurring:</Typography>
          <RecurringCommandsList />
        </Box>
      </Stack>
    </Stack>
  );
};

export default SchedulerCommandsPage;
