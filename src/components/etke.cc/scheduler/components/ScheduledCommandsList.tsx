import { useScheduledCommands } from "../hooks/useScheduledCommands";
import { Loading } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { Paper } from "@mui/material";
import { ListContextProvider, TextField } from "react-admin";
import { Datagrid } from "react-admin";
import { DATE_FORMAT } from "../../../../utils/date";
import { BooleanField, DateField } from "react-admin";

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
          <DateField options={DATE_FORMAT} showTime source="scheduled_at" label="Scheduled at (local time)" />
        </Datagrid>
      </Paper>
    </ListContextProvider>
  </ResourceContextProvider>
  );
};

export default ScheduledCommandsList;