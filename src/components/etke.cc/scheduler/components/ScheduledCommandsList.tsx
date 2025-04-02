import { useScheduledCommands } from "../hooks/useScheduledCommands";
import { Loading, Button, useNotify, useRefresh, useCreatePath } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { Paper } from "@mui/material";
import { ListContextProvider, TextField } from "react-admin";
import { Datagrid } from "react-admin";
import { DATE_FORMAT } from "../../../../utils/date";
import { BooleanField, DateField, TopToolbar } from "react-admin";
import { useAppContext } from "../../../../Context";
import { useDataProvider } from "react-admin";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const ListActions = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/scheduled_commands/create");
  };

  return (
    <TopToolbar>
      <Button
        label="Create"
        onClick={handleCreate}
        startIcon={<AddIcon />}
      />
    </TopToolbar>
  );
};

const ScheduledCommandsList = () => {
  const { data, isLoading, error } = useScheduledCommands();
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const createPath = useCreatePath();

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
      <ListActions />
      <Paper>
        <Datagrid bulkActionButtons={false} rowClick="edit">
          <TextField source="command" />
          <TextField source="id" />
          <TextField source="args" />
          <BooleanField source="is_recurring" />
          <DateField options={DATE_FORMAT} showTime source="scheduled_at" label="Scheduled at (local time)" />
        </Datagrid>
      </Paper>
    </ListContextProvider>
  </ResourceContextProvider>
  );
};

export default ScheduledCommandsList;