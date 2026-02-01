import AddIcon from "@mui/icons-material/Add";
import { Paper } from "@mui/material";
import { Loading, Button, useLocale, useTranslate } from "react-admin";
import { DateField, useRecordContext } from "react-admin";
import { Datagrid } from "react-admin";
import { ListContextProvider, TextField, TopToolbar, Identifier } from "react-admin";
import { ResourceContextProvider, useList } from "react-admin";
import { useNavigate } from "react-router-dom";

import { DATE_FORMAT } from "../../../../../utils/date";
import { useRecurringCommands } from "../../hooks/useRecurringCommands";

const ListActions = () => {
  const navigate = useNavigate();
  const translate = useTranslate();

  return (
    <TopToolbar>
      <Button
        label={translate("etkecc.actions.buttons.create")}
        onClick={() => navigate("/server_actions/recurring/create")}
        startIcon={<AddIcon />}
      />
    </TopToolbar>
  );
};

const RecurringTimeField = ({ label: _label }: { label?: string }) => {
  const record = useRecordContext();
  const translate = useTranslate();
  const locale = useLocale();
  const titleCase = (value: string) => {
    if (!value) {
      return value;
    }
    const [first, ...rest] = value;
    return first.toLocaleUpperCase(locale) + rest.join("");
  };
  if (record?.scheduled_at) {
    const date = new Date(record.scheduled_at);
    if (!Number.isNaN(date.getTime())) {
      const formatted = new Intl.DateTimeFormat(locale, {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
      return <span>{titleCase(formatted)}</span>;
    }
  }
  if (!record?.time) {
    return null;
  }

  const [day, time] = String(record.time).split(" ");
  if (!day || !time) {
    return <span>{record.time}</span>;
  }

  const dayKey = day.toLowerCase();
  const translatedDay = translate(`etkecc.actions.days.${dayKey}`);
  const dayLabel = translatedDay === `etkecc.actions.days.${dayKey}` ? day : translatedDay;
  return (
    <span>
      {dayLabel} {time}
    </span>
  );
};

const RecurringCommandsList = () => {
  const locale = useLocale();
  const translate = useTranslate();
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
            <TextField source="args" label={translate("etkecc.actions.table.arguments")} />
            <RecurringTimeField label={translate("etkecc.actions.table.time_local")} />
            <DateField
              options={DATE_FORMAT}
              showTime
              source="scheduled_at"
              label={translate("etkecc.actions.table.next_run_at")}
              locales={locale}
            />
          </Datagrid>
        </Paper>
      </ListContextProvider>
    </ResourceContextProvider>
  );
};

export default RecurringCommandsList;
