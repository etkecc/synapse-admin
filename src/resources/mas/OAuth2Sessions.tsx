import EmptyState from "../../components/layout/EmptyState";
import DeleteIcon from "@mui/icons-material/Delete";
import HttpsIcon from "@mui/icons-material/Https";
import { Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  BooleanField,
  Button,
  Confirm,
  DatagridConfigurable,
  DateField,
  FunctionField,
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

export const FinishOAuth2SessionButton = () => {
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
      const result = await dataProvider.masFinishSession("mas_oauth2_sessions", record.id as string);
      if (result.success) {
        notify("resources.mas_oauth2_sessions.action.finish.success");
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
        label="resources.mas_oauth2_sessions.action.finish.label"
        onClick={() => setOpen(true)}
        disabled={loading}
        color="error"
      >
        <DeleteIcon />
      </Button>
      <Confirm
        isOpen={open}
        title={translate("resources.mas_oauth2_sessions.action.finish.title")}
        content={translate("resources.mas_oauth2_sessions.action.finish.content")}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const oauth2SessionFilters = [
  <SelectInput
    key="status"
    source="status"
    choices={sessionStatusChoices}
    label="resources.mas_oauth2_sessions.fields.active"
  />,
];

export function MASOAuth2SessionsList(props: ListProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <List {...props} filters={oauth2SessionFilters} pagination={false} perPage={50} empty={<EmptyState />}>
      {isSmall ? (
        <SimpleList
          primaryText={record => record.human_name || record.client_id || String(record.id)}
          secondaryText={record => String(record.user_id || "")}
          tertiaryText={() => <FinishOAuth2SessionButton />}
          linkType={false}
          sx={{ "& .MuiListItemText-secondary": { wordBreak: "break-all" } }}
        />
      ) : (
        <DatagridConfigurable bulkActionButtons={false} rowClick={false}>
          <TextField source="user_id" sortable={false} emptyText="-" />
          <TextField source="client_id" sortable={false} />
          <FunctionField
            source="scope"
            label="resources.mas_oauth2_sessions.fields.scope"
            sortable={false}
            render={(record: { scope?: string }) =>
              record?.scope ? (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {record.scope
                    .split(" ")
                    .filter(Boolean)
                    .map(s => (
                      <Chip key={s} label={s} size="small" variant="outlined" />
                    ))}
                </Box>
              ) : null
            }
          />
          <TextField source="human_name" sortable={false} emptyText="-" />
          <BooleanField source="active" sortable={false} />
          <DateField source="created_at" showTime sortable={false} />
          <DateField source="last_active_at" showTime sortable={false} emptyText="-" />
          <TextField source="last_active_ip" sortable={false} emptyText="-" />
          <DateField source="finished_at" showTime sortable={false} emptyText="-" />
          <FinishOAuth2SessionButton />
        </DatagridConfigurable>
      )}
    </List>
  );
}

export const masOAuth2Sessions: ResourceProps = {
  name: "mas_oauth2_sessions",
  icon: HttpsIcon,
  list: MASOAuth2SessionsList,
};
