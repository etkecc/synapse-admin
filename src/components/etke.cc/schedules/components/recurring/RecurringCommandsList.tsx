import AddIcon from "@mui/icons-material/Add";
import { Paper } from "@mui/material";
import { Loading, Button, useLocale } from "react-admin";
import { DateField } from "react-admin";
import { Datagrid } from "react-admin";
import { ListContextProvider, TextField, TopToolbar, Identifier } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { useNavigate } from "react-router-dom";

import { DATE_FORMAT } from "../../../../../utils/date";
import { useRecurringCommands } from "../../hooks/useRecurringCommands";

const ListActions = () => {
  const navigate = useNavigate();

  return (
    <TopToolbar>
      <Button label="Create" onClick={() => navigate("/server_actions/recurring/create")} startIcon={<AddIcon />} />
    </TopToolbar>
  );
};

const RecurringCommandsList = () => {
  const locale = useLocale();
  const { data, isLoading } = useRecurringCommands();

  const listContext = useList({
    resource: "recurring",
    sort: { field: "scheduled_at", order: "DESC" },
    perPage: 50,
    data: data || [],
    isLoading: isLoading,
  });

  if (isLoading) return <Loading />;

  return (
    <ResourceContextProvider value="recurring">
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

              return `/server_actions/${resource}/${id}`;
            }}
          >
            <TextField source="command" />
            <TextField source="args" label="Arguments" />
            <TextField source="time" label="Time (UTC)" />
            <DateField
              options={DATE_FORMAT}
              showTime
              source="scheduled_at"
              label="Next run at (local time)"
              locales={locale}
            />
          </Datagrid>
        </Paper>
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export default RecurringCommandsList;
