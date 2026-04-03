import EmptyState from "../../components/layout/EmptyState";
import DeleteIcon from "@mui/icons-material/Delete";
import HttpsIcon from "@mui/icons-material/Https";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  BooleanField,
  Button,
  Confirm,
  DatagridConfigurable,
  DateField,
  List,
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

import { SynapseDataProvider } from "../../providers/types";
import { sessionStatusChoices } from "./shared";

export const FinishUserSessionButton = () => {
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
      const result = await dataProvider.masFinishUserSession(record.id as string);
      if (result.success) {
        notify("resources.mas_user_sessions.action.finish.success");
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
        label="resources.mas_user_sessions.action.finish.label"
        onClick={() => setOpen(true)}
        disabled={loading}
        color="error"
      >
        <DeleteIcon />
      </Button>
      <Confirm
        isOpen={open}
        title={translate("resources.mas_user_sessions.action.finish.title")}
        content={translate("resources.mas_user_sessions.action.finish.content")}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const userSessionFilters = [
  <SelectInput
    key="status"
    source="status"
    choices={sessionStatusChoices}
    label="resources.mas_user_sessions.fields.active"
  />,
];

export function MASUserSessionsList(props: ListProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <List {...props} filters={userSessionFilters} pagination={false} perPage={50} empty={<EmptyState />}>
      {isSmall ? (
        <SimpleList
          primaryText={record => String(record.user_id || "")}
          secondaryText={record => String(record.user_agent || record.last_active_ip || "")}
          tertiaryText={() => <FinishUserSessionButton />}
          rowClick={false}
        />
      ) : (
        <DatagridConfigurable bulkActionButtons={false} rowClick={false}>
          <TextField source="user_id" sortable={false} />
          <BooleanField source="active" sortable={false} />
          <DateField source="created_at" showTime sortable={false} />
          <DateField source="last_active_at" showTime sortable={false} emptyText="-" />
          <TextField source="last_active_ip" sortable={false} emptyText="-" />
          <TextField source="user_agent" sortable={false} emptyText="-" />
          <DateField source="finished_at" showTime sortable={false} emptyText="-" />
          <FinishUserSessionButton />
        </DatagridConfigurable>
      )}
    </List>
  );
}

export const masUserSessions: ResourceProps = {
  name: "mas_user_sessions",
  icon: HttpsIcon,
  list: MASUserSessionsList,
};
