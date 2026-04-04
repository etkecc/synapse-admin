import EmptyState from "../../components/layout/EmptyState";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyIcon from "@mui/icons-material/Key";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField as MuiTextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AutocompleteInput,
  BooleanField,
  Button,
  Confirm,
  Create,
  CreateProps,
  DatagridConfigurable,
  DateField,
  ListProps,
  ReferenceInput,
  ResourceProps,
  SaveButton,
  SelectInput,
  SimpleList,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRedirect,
  useRefresh,
  useTranslate,
} from "react-admin";
import List from "../../components/layout/List";

import { SynapseDataProvider } from "../../providers/types";
import { personalSessionStatusChoices } from "./shared";

export const RevokePersonalSessionButton = () => {
  const record = useRecordContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const translate = useTranslate();

  if (!record || !record.active) return <span>—</span>;

  const handleConfirm = async () => {
    setOpen(false);
    setLoading(true);
    try {
      const result = await dataProvider.masRevokePersonalSession(record.id as string);
      if (result.success) {
        notify("resources.mas_personal_sessions.action.revoke.success");
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
        label="resources.mas_personal_sessions.action.revoke.label"
        onClick={() => setOpen(true)}
        disabled={loading}
        color="error"
      >
        <DeleteIcon />
      </Button>
      <Confirm
        isOpen={open}
        title={translate("resources.mas_personal_sessions.action.revoke.title")}
        content={translate("resources.mas_personal_sessions.action.revoke.content")}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const personalSessionFilters = [
  <SelectInput
    key="status"
    source="status"
    choices={personalSessionStatusChoices}
    label="resources.mas_personal_sessions.fields.active"
  />,
];

export function MASPersonalSessionsList(props: ListProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <List {...props} filters={personalSessionFilters} pagination={false} perPage={50} empty={<EmptyState />}>
      {isSmall ? (
        <SimpleList
          primaryText={record => record.human_name || String(record.id)}
          secondaryText={record => String(record.scope || "")}
          tertiaryText={() => <RevokePersonalSessionButton />}
          rowClick={false}
          sx={{ "& .MuiListItemText-secondary": { wordBreak: "break-all" } }}
        />
      ) : (
        <DatagridConfigurable bulkActionButtons={false} rowClick={false}>
          <TextField source="owner_user_id" sortable={false} emptyText="-" />
          <TextField source="human_name" sortable={false} emptyText="-" />
          <TextField source="scope" sortable={false} />
          <BooleanField source="active" sortable={false} />
          <DateField source="created_at" showTime sortable={false} />
          <DateField source="last_active_at" showTime sortable={false} emptyText="-" />
          <TextField source="last_active_ip" sortable={false} emptyText="-" />
          <DateField source="expires_at" showTime sortable={false} emptyText="-" />
          <DateField source="revoked_at" showTime sortable={false} emptyText="-" />
          <RevokePersonalSessionButton />
        </DatagridConfigurable>
      )}
    </List>
  );
}

export const MASPersonalSessionCreate = (props: CreateProps) => {
  const [token, setToken] = useState<string | null>(null);
  const redirect = useRedirect();
  const translate = useTranslate();
  const [searchParams] = useSearchParams();
  const presetUserId = searchParams.get("actor_user_id");

  const handleSuccess = (record: Record<string, unknown>) => {
    const tok = record.access_token as string | null | undefined;
    if (tok) {
      setToken(tok);
    } else {
      redirect("list", "mas_personal_sessions");
    }
  };

  return (
    <>
      <Create {...props} mutationOptions={{ onSuccess: handleSuccess }}>
        <SimpleForm
          toolbar={
            <Toolbar>
              <SaveButton />
            </Toolbar>
          }
          defaultValues={presetUserId ? { actor_user_id: presetUserId } : undefined}
        >
          {presetUserId ? (
            <TextInput
              source="actor_user_id"
              disabled
              label="resources.mas_personal_sessions.fields.actor_user_id"
              fullWidth
            />
          ) : (
            <ReferenceInput source="actor_user_id" reference="mas_users">
              <AutocompleteInput
                optionText="username"
                optionValue="id"
                label="resources.mas_personal_sessions.fields.actor_user_id"
                filterToQuery={search => ({ search })}
                isRequired
              />
            </ReferenceInput>
          )}
          <TextInput source="scope" required label="resources.mas_personal_sessions.fields.scope" fullWidth />
          <TextInput source="human_name" required label="resources.mas_personal_sessions.fields.human_name" fullWidth />
          <TextInput
            source="expires_in"
            label="resources.mas_personal_sessions.fields.expires_in"
            fullWidth
            helperText="resources.mas_personal_sessions.helper.expires_in"
          />
        </SimpleForm>
      </Create>
      <Dialog open={!!token} maxWidth="sm" fullWidth>
        <DialogTitle>{translate("resources.mas_personal_sessions.action.create.token_title")}</DialogTitle>
        <DialogContent>
          <p>{translate("resources.mas_personal_sessions.action.create.token_content")}</p>
          <MuiTextField
            value={token || ""}
            fullWidth
            multiline
            rows={3}
            InputProps={{ readOnly: true }}
            onClick={e => (e.target as HTMLInputElement).select()}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => redirect("list", "mas_personal_sessions")}>OK</MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const masPersonalSessions: ResourceProps = {
  name: "mas_personal_sessions",
  icon: KeyIcon,
  list: MASPersonalSessionsList,
};
