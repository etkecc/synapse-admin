import EmptyState from "../../components/layout/EmptyState";
import DeleteIcon from "@mui/icons-material/Delete";
import DevicesIcon from "@mui/icons-material/Devices";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  BooleanField,
  Button,
  Confirm,
  DatagridConfigurable,
  DateField,
  ListProps,
  ResourceProps,
  SelectInput,
  SimpleList,
  TextField,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
} from "react-admin";
import List from "../../components/layout/List";

import { SynapseDataProvider } from "../../providers/types";
import { sessionStatusChoices } from "./shared";

export const FinishCompatSessionButton = () => {
  const record = useRecordContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const translate = useTranslate();

  if (!record || !record.active) return null;

  const handleConfirm = async () => {
    setOpen(false);
    setLoading(true);
    try {
      const result = await dataProvider.masFinishSession("mas_compat_sessions", record.id as string);
      if (result.success) {
        notify("resources.mas_compat_sessions.action.finish.success");
        refresh();
      } else {
        notify(result.error || "ra.notification.http_error", { type: "error" });
      }
    } catch {
      notify("ra.notification.http_error", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label="resources.mas_compat_sessions.action.finish.label"
        onClick={() => setOpen(true)}
        disabled={loading}
        color="error"
      >
        <DeleteIcon />
      </Button>
      <Confirm
        isOpen={open}
        title={translate("resources.mas_compat_sessions.action.finish.title")}
        content={translate("resources.mas_compat_sessions.action.finish.content")}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const compatSessionFilters = [
  <SelectInput
    key="status"
    source="status"
    choices={sessionStatusChoices}
    label="resources.mas_compat_sessions.fields.active"
  />,
];

export function MASCompatSessionsList(props: ListProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <List {...props} filters={compatSessionFilters} pagination={false} perPage={50} empty={<EmptyState />}>
      {isSmall ? (
        <SimpleList
          primaryText={record => record.human_name || record.device_id || String(record.id)}
          secondaryText={record => String(record.user_id || "")}
          tertiaryText={() => <FinishCompatSessionButton />}
          rowClick={false}
        />
      ) : (
        <DatagridConfigurable bulkActionButtons={false} rowClick={false}>
          <TextField source="user_id" sortable={false} />
          <TextField source="device_id" sortable={false} emptyText="-" />
          <TextField source="human_name" sortable={false} emptyText="-" />
          <BooleanField source="active" sortable={false} />
          <DateField source="created_at" showTime sortable={false} />
          <DateField source="last_active_at" showTime sortable={false} emptyText="-" />
          <TextField source="last_active_ip" sortable={false} emptyText="-" />
          <DateField source="finished_at" showTime sortable={false} emptyText="-" />
          <FinishCompatSessionButton />
        </DatagridConfigurable>
      )}
    </List>
  );
}

export const masCompatSessions: ResourceProps = {
  name: "mas_compat_sessions",
  icon: DevicesIcon,
  list: MASCompatSessionsList,
};
