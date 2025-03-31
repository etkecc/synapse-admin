import { Box, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "@mui/material"
import { BooleanField, Datagrid, DateField, List, ListContextProvider, Loading, ResourceContextProvider, TextField, useDataProvider, useList } from "react-admin";
import { useAppContext } from "../../Context";
import ScheduleIcon from '@mui/icons-material/Schedule';
import RestoreIcon from '@mui/icons-material/Restore';
import { DATE_FORMAT } from "../../utils/date";
const useScheduledCommands = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { data, isLoading, error } = useQuery({
    queryKey: ["scheduledCommands"],
    queryFn: () => dataProvider.getScheduledCommands(etkeccAdmin),
  });

  return { data, isLoading, error };
};

const ScheduledCommandsList = () => {
  const { data, isLoading, error } = useScheduledCommands();
  const listContext = useList({
    resource: "scheduled_commands",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 10,
    data: data || [], // Provide the data from your custom hook
    isLoading: isLoading,
  });
  if (isLoading) return <Loading />;

  return (<ResourceContextProvider value="scheduled_commands">
    <ListContextProvider value={listContext}>
      <Paper>
        <Datagrid bulkActionButtons={false} rowClick="edit">
          <TextField source="command" />
          <TextField source="id" />
          <TextField source="args" />
          <BooleanField source="is_recurring" />
          <DateField options={DATE_FORMAT} showTime source="scheduled_at" />
        </Datagrid>
      </Paper>
    </ListContextProvider>
  </ResourceContextProvider>
  );
};

const useRecurringCommands = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const { data, isLoading, error } = useQuery({
    queryKey: ["recurringCommands"],
    queryFn: () => dataProvider.getRecurringCommands(etkeccAdmin),
  });

  return { data, isLoading, error };
};

const RecurringCommandsList = () => {
  const { data, isLoading, error } = useRecurringCommands();
  const listContext = useList({
    resource: "scheduled_commands",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 10,
    data: data || [], // Provide the data from your custom hook
    isLoading: isLoading,
  });
  if (isLoading) return <Loading />;

  return (<ResourceContextProvider value="scheduled_commands">
    <ListContextProvider value={listContext}>
      <Paper>
      <Datagrid bulkActionButtons={false} rowClick="edit">
        <TextField source="command" />
        <TextField source="id" />
        <TextField source="args" />
        <TextField source="time" />
        <DateField options={DATE_FORMAT} showTime source="scheduled_at" />
      </Datagrid>
      </Paper>
    </ListContextProvider>
  </ResourceContextProvider>
  );
};

const SchedulerCommandsPage = () => {
  const { data, isLoading, error } = useScheduledCommands();
  const listContext = useList({
    resource: "scheduled_commands",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 10,
    data: data || [], // Provide the data from your custom hook
    isLoading: isLoading,
  });
  console.log("D1", data);
  console.log("D12", listContext);

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
