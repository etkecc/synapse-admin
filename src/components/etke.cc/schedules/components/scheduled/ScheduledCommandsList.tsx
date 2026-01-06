import AddIcon from "@mui/icons-material/Add";
import { Paper } from "@mui/material";
import { Loading, Button, useLocale } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { ListContextProvider, TextField } from "react-admin";
import { Datagrid } from "react-admin";
import { BooleanField, DateField, TopToolbar } from "react-admin";
import { Identifier } from "react-admin";
import { useNavigate } from "react-router-dom";

import { DATE_FORMAT } from "../../../../../utils/date";
import { useScheduledCommands } from "../../hooks/useScheduledCommands";
const ListActions = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/server_actions/scheduled/create");
  };

  return (
    <TopToolbar>
      <Button label="Create" onClick={handleCreate} startIcon={<AddIcon />} />
    </TopToolbar>
  );
};

const ScheduledCommandsList = () => {
  const locale = useLocale();
  const { data, isLoading } = useScheduledCommands();

  const listContext = useList({
    resource: "scheduled",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 50,
    data: data || [],
    isLoading: isLoading,
  });

  if (isLoading) return <Loading />;

  return (
    <ResourceContextProvider value="scheduled">
      <ListContextProvider value={listContext}>
        <ListActions />
        <Paper>
          <Datagrid
            bulkActionButtons={false}
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            rowClick={(id: Identifier, resource: string, record: any) => {
              if (!record) {
                return "";
              }

              if (record.is_recurring) {
                return `/server_actions/${resource}/${id}/show`;
              }

              return `/server_actions/${resource}/${id}`;
            }}
          >
            <TextField source="command" />
            <TextField source="args" label="Arguments" />
            <BooleanField source="is_recurring" label="Is recurring?" />
            <DateField
              options={DATE_FORMAT}
              showTime
              source="scheduled_at"
              label="Run at (local time)"
              locales={locale}
            />
          </Datagrid>
        </Paper>
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export default ScheduledCommandsList;
