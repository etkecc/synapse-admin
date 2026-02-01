import AddIcon from "@mui/icons-material/Add";
import { Paper } from "@mui/material";
import { Loading, Button, useLocale, useTranslate } from "react-admin";
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
  const translate = useTranslate();

  const handleCreate = () => {
    navigate("/server_actions/scheduled/create");
  };

  return (
    <TopToolbar>
      <Button label={translate("etkecc.actions.buttons.create")} onClick={handleCreate} startIcon={<AddIcon />} />
    </TopToolbar>
  );
};

const ScheduledCommandsList = () => {
  const locale = useLocale();
  const translate = useTranslate();
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
            <TextField source="command" label={translate("etkecc.actions.table.command")} />
            <TextField source="args" label={translate("etkecc.actions.table.arguments")} />
            <BooleanField source="is_recurring" label={translate("etkecc.actions.table.is_recurring")} />
            <DateField
              options={DATE_FORMAT}
              showTime
              source="scheduled_at"
              label={translate("etkecc.actions.table.run_at")}
              locales={locale}
            />
          </Datagrid>
        </Paper>
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export default ScheduledCommandsList;
