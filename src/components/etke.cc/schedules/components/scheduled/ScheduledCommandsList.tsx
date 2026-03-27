import AddIcon from "@mui/icons-material/Add";
import { Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Loading, Button, useLocale, useTranslate, useRedirect } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { ListContextProvider, TextField } from "react-admin";
import { Datagrid } from "react-admin";
import { BooleanField, DateField, TopToolbar } from "react-admin";
import { Identifier } from "react-admin";

import { DATE_FORMAT } from "../../../../../utils/date";
import { useScheduledCommands } from "../../hooks/useScheduledCommands";
const ListActions = () => {
  const redirect = useRedirect();
  const translate = useTranslate();

  const handleCreate = () => {
    redirect("/server_actions/scheduled/create");
  };

  return (
    <TopToolbar>
      <Button label={translate("etkecc.actions.buttons.create")} onClick={handleCreate}>
        <AddIcon />
      </Button>
    </TopToolbar>
  );
};

const ScheduledCommandsList = () => {
  const locale = useLocale();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
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
            {!isSmall && <TextField source="args" label={translate("etkecc.actions.table.arguments")} />}
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
