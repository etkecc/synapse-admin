import ScheduleIcon from "@mui/icons-material/Schedule";
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DatagridConfigurable,
  DateField,
  DateTimeInput,
  FunctionField,
  List,
  ListProps,
  Pagination,
  ResourceProps,
  SelectInput,
  SimpleList,
  TextField,
  TextInput,
  useLocale,
  useTranslate,
} from "react-admin";

import EmptyState from "../components/EmptyState";
import { useDocTitle } from "../components/hooks/useDocTitle";
import { DATE_FORMAT, dateParser } from "../utils/date";
import { JSONStringify } from "../utils/safety";

const ScheduledTaskPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const statusColors: Record<string, "default" | "info" | "success" | "warning" | "error"> = {
  scheduled: "default",
  active: "info",
  complete: "success",
  cancelled: "warning",
  failed: "error",
};

const StatusChip = ({ status }: { status: string }) => {
  const translate = useTranslate();
  return (
    <Chip
      label={translate(`resources.scheduled_tasks.status.${status}`, { _: status })}
      color={statusColors[status] || "default"}
      size="small"
    />
  );
};

const scheduledTaskFilters = (translate: ReturnType<typeof useTranslate>) => [
  <SelectInput
    key="status"
    source="status"
    alwaysOn
    choices={["scheduled", "active", "complete", "cancelled", "failed"].map(s => ({
      id: s,
      name: translate(`resources.scheduled_tasks.status.${s}`),
    }))}
    label="resources.scheduled_tasks.fields.status"
  />,
  <TextInput key="action_name" source="action_name" label="resources.scheduled_tasks.fields.action" />,
  <TextInput key="resource_id" source="resource_id" label="resources.scheduled_tasks.fields.resource_id" />,
  <DateTimeInput
    key="max_timestamp"
    source="max_timestamp"
    label="resources.scheduled_tasks.fields.max_timestamp"
    parse={dateParser}
  />,
];

export const ScheduledTaskList = (props: ListProps) => {
  const locale = useLocale();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.scheduled_tasks.name", { smart_count: 2 }));

  return (
    <List
      {...props}
      pagination={<ScheduledTaskPagination />}
      perPage={50}
      sort={{ field: "id", order: "DESC" }}
      filters={scheduledTaskFilters(translate)}
      empty={<EmptyState />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => (
            <>
              {record.action} <StatusChip status={record.status} />
            </>
          )}
          secondaryText={record => new Date(record.timestamp_ms).toLocaleDateString(locale, DATE_FORMAT)}
          tertiaryText={record => record.resource_id || ""}
          linkType={false}
        />
      ) : (
        <DatagridConfigurable bulkActionButtons={false}>
          <TextField source="id" sortable={false} label="resources.scheduled_tasks.fields.id" />
          <TextField source="action" sortable={false} label="resources.scheduled_tasks.fields.action" />
          <FunctionField
            source="status"
            sortable={false}
            label="resources.scheduled_tasks.fields.status"
            render={record => <StatusChip status={record.status} />}
          />
          <DateField
            source="timestamp_ms"
            showTime
            options={DATE_FORMAT}
            sortable={false}
            label="resources.scheduled_tasks.fields.timestamp"
            locales={locale}
          />
          <TextField source="resource_id" sortable={false} label="resources.scheduled_tasks.fields.resource_id" />
          <FunctionField
            source="result"
            sortable={false}
            label="resources.scheduled_tasks.fields.result"
            render={record => JSONStringify(record.result)}
          />
          <TextField source="error" sortable={false} label="resources.scheduled_tasks.fields.error" />
        </DatagridConfigurable>
      )}
    </List>
  );
};

const resource: ResourceProps = {
  name: "scheduled_tasks",
  icon: ScheduleIcon,
  list: ScheduledTaskList,
};

export default resource;
