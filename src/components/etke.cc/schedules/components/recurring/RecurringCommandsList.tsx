import { Loading, Button } from "react-admin";
import { DateField } from "react-admin";
import { Datagrid } from "react-admin";
import { Paper } from "@mui/material";
import { ListContextProvider, TextField, TopToolbar } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { DATE_FORMAT } from "../../../../../utils/date";
import { useRecurringCommands } from "../../hooks/useRecurringCommands";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const ListActions = () => {
  const navigate = useNavigate();

  return (
    <TopToolbar>
      <Button
        label="Create"
        onClick={() => navigate("/recurring_commands/create")}
        startIcon={<AddIcon />}
      />
    </TopToolbar>
  );
};

const RecurringCommandsList = () => {
  const { data, isLoading, error } = useRecurringCommands();

  const listContext = useList({
    resource: "recurring_commands",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 50,
    data: data || [],
    isLoading: isLoading,
  });

  if (isLoading) return <Loading />;

  return (<ResourceContextProvider value="recurring_commands">
    <ListContextProvider value={listContext}>
      <ListActions />
      <Paper>
        <Datagrid bulkActionButtons={false} rowClick="edit">
          <TextField source="command" />
          <TextField source="args" label="Arguments" />
          <TextField source="time" label="Time (UTC)" />
          <DateField options={DATE_FORMAT} showTime source="scheduled_at" label="Next run at (local time)" />
        </Datagrid>
      </Paper>
    </ListContextProvider>
  </ResourceContextProvider>
  );
};

export default RecurringCommandsList;
