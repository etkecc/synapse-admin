import { Loading, Button, useNotify, useRefresh, useCreatePath } from "react-admin";
import { DateField } from "react-admin";
import { Datagrid } from "react-admin";
import { Box, Paper } from "@mui/material";
import { ListContextProvider, TextField, DeleteButton, TopToolbar } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { DATE_FORMAT } from "../../../../../utils/date";
import { useRecurringCommands } from "../../hooks/useRecurringCommands";
import { useAppContext } from "../../../../../Context";
import { useDataProvider } from "react-admin";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

const ListActions = () => {
  const createPath = useCreatePath();

  return (
    <TopToolbar>
      <Button
        label="Create"
        component={Link}
        to={createPath({
          type: "create",
          resource: "recurring-command",
        })}
        startIcon={<AddIcon />}
      />
    </TopToolbar>
  );
};

const RecurringCommandsList = () => {
  const { data, isLoading, error } = useRecurringCommands();
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const listContext = useList({
    resource: "recurring_commands",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 10,
    data: data || [], // Provide the data from your custom hook
    isLoading: isLoading,
  });

  if (isLoading) return <Loading />;

  const handleDelete = async (id) => {
    try {
      await dataProvider.deleteRecurringCommand(etkeccAdmin, id);
      notify("Recurring command deleted successfully", { type: "success" });
      refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      notify(`Error: ${errorMessage}`, { type: "error" });
    }
  };

  return (<ResourceContextProvider value="recurring_commands">
    <ListContextProvider value={listContext}>
      <ListActions />
      <Paper>
        <Datagrid bulkActionButtons={false} rowClick="show">
          <TextField source="command" />
          <TextField source="args" />
          <TextField source="time" label="Time (UTC)" />
          <DateField options={DATE_FORMAT} showTime source="scheduled_at" label="Scheduled at (local time)" />
          <DeleteButton resource="recurring_commands" onClick={(e) => {
            e.stopPropagation();
            handleDelete(e.currentTarget.dataset.id);
          }} />
        </Datagrid>
      </Paper>
    </ListContextProvider>
  </ResourceContextProvider>
  );
};

export default RecurringCommandsList;