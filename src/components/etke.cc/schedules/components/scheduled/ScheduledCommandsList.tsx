import { useScheduledCommands } from "../../hooks/useScheduledCommands";
import { Loading, Button, useNotify, useRefresh, useCreatePath, useRecordContext } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { Paper } from "@mui/material";
import { ListContextProvider, TextField } from "react-admin";
import { Datagrid } from "react-admin";
import { DATE_FORMAT } from "../../../../../utils/date";
import { BooleanField, DateField, TopToolbar } from "react-admin";
import { useAppContext } from "../../../../../Context";
import { useDataProvider } from "react-admin";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Identifier } from "react-admin";
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

  const listContext = useList({
    resource: "scheduled_commands",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 50,
    data: data || [],
    isLoading: isLoading,
  });

  if (isLoading) return <Loading />;

  return (<ResourceContextProvider value="scheduled_commands">
    <ListContextProvider value={listContext}>
      <ListActions />
      <Paper>
        <Datagrid bulkActionButtons={false} rowClick={(id: Identifier, resource: string, record: any) => {
           if (!record) {
             return "";
           }

           if (record.is_recurring) {
             return `/${resource}/${id}/show`;
           }

           return `/${resource}/${id}`;
        }} >
          <TextField source="command" />
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