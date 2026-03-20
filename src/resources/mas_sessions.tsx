import ContactMailIcon from "@mui/icons-material/ContactMail";
import DevicesIcon from "@mui/icons-material/Devices";
import HttpsIcon from "@mui/icons-material/Https";
import KeyIcon from "@mui/icons-material/Key";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField as MuiTextField,
} from "@mui/material";
import { useState } from "react";
import {
  AutocompleteInput,
  BooleanField,
  Button,
  Confirm,
  Create,
  CreateProps,
  Datagrid,
  DateField,
  List,
  ListProps,
  ReferenceInput,
  ResourceProps,
  SaveButton,
  SearchInput,
  SelectInput,
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

import { SynapseDataProvider } from "../providers/types";

// ─── Shared status filter ────────────────────────────────────────────────────

const sessionStatusChoices = [
  { id: "active", name: "Active" },
  { id: "finished", name: "Finished" },
];

const personalSessionStatusChoices = [
  { id: "active", name: "Active" },
  { id: "revoked", name: "Revoked" },
];

// ─── Compat Sessions ─────────────────────────────────────────────────────────

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
      >
        <StopCircleIcon />
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

export const MASCompatSessionsList = (props: ListProps) => (
  <List {...props} filters={compatSessionFilters} pagination={false} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick={false}>
      <TextField source="user_id" sortable={false} />
      <TextField source="device_id" sortable={false} emptyText="-" />
      <TextField source="human_name" sortable={false} emptyText="-" />
      <BooleanField source="active" sortable={false} />
      <DateField source="created_at" showTime sortable={false} />
      <DateField source="last_active_at" showTime sortable={false} emptyText="-" />
      <TextField source="last_active_ip" sortable={false} emptyText="-" />
      <DateField source="finished_at" showTime sortable={false} emptyText="-" />
      <FinishCompatSessionButton />
    </Datagrid>
  </List>
);

// ─── OAuth2 Sessions ─────────────────────────────────────────────────────────

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
      >
        <StopCircleIcon />
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

export const MASOAuth2SessionsList = (props: ListProps) => (
  <List {...props} filters={oauth2SessionFilters} pagination={false} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick={false}>
      <TextField source="user_id" sortable={false} emptyText="-" />
      <TextField source="client_id" sortable={false} />
      <TextField source="scope" sortable={false} />
      <TextField source="human_name" sortable={false} emptyText="-" />
      <BooleanField source="active" sortable={false} />
      <DateField source="created_at" showTime sortable={false} />
      <DateField source="last_active_at" showTime sortable={false} emptyText="-" />
      <TextField source="last_active_ip" sortable={false} emptyText="-" />
      <DateField source="finished_at" showTime sortable={false} emptyText="-" />
      <FinishOAuth2SessionButton />
    </Datagrid>
  </List>
);

// ─── Personal Sessions ───────────────────────────────────────────────────────

export const RevokePersonalSessionButton = () => {
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
      >
        <StopCircleIcon />
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

export const MASPersonalSessionsList = (props: ListProps) => (
  <List {...props} filters={personalSessionFilters} pagination={false} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick={false}>
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
    </Datagrid>
  </List>
);

export const MASPersonalSessionCreate = (props: CreateProps) => {
  const [token, setToken] = useState<string | null>(null);
  const redirect = useRedirect();
  const translate = useTranslate();

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
        >
          <ReferenceInput source="actor_user_id" reference="mas_users">
            <AutocompleteInput
              optionText="username"
              optionValue="id"
              label="resources.mas_personal_sessions.fields.actor_user_id"
              filterToQuery={search => ({ search })}
              isRequired
            />
          </ReferenceInput>
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

// ─── User Emails ─────────────────────────────────────────────────────────────

const DeleteEmailButton = () => {
  const record = useRecordContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const translate = useTranslate();

  if (!record) return null;

  const handleConfirm = async () => {
    setOpen(false);
    setLoading(true);
    try {
      await dataProvider.delete("mas_user_emails", { id: record.id, previousData: record });
      notify("resources.mas_user_emails.action.remove.success");
      refresh();
    } catch {
      notify("ra.notification.http_error", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.mas_user_emails.action.remove.label" onClick={() => setOpen(true)} disabled={loading}>
        <StopCircleIcon />
      </Button>
      <Confirm
        isOpen={open}
        title={translate("resources.mas_user_emails.action.remove.title")}
        content={translate("resources.mas_user_emails.action.remove.content", { email: record.email })}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const userEmailFilters = [<SearchInput key="email" source="email" alwaysOn />];

export const MASUserEmailsList = (props: ListProps) => (
  <List {...props} filters={userEmailFilters} pagination={false} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick={false}>
      <TextField source="email" sortable={false} />
      <TextField source="user_id" sortable={false} />
      <DateField source="created_at" showTime sortable={false} />
      <DeleteEmailButton />
    </Datagrid>
  </List>
);

export const MASUserEmailCreate = (props: CreateProps) => (
  <Create {...props} redirect="list">
    <SimpleForm
      toolbar={
        <Toolbar>
          <SaveButton />
        </Toolbar>
      }
    >
      <ReferenceInput source="user_id" reference="mas_users">
        <AutocompleteInput
          optionText="username"
          optionValue="id"
          label="resources.mas_user_emails.fields.user_id"
          filterToQuery={search => ({ search })}
          isRequired
        />
      </ReferenceInput>
      <TextInput source="email" required label="resources.mas_user_emails.fields.email" />
    </SimpleForm>
  </Create>
);

// ─── User Sessions (browser sessions) ────────────────────────────────────────

const FinishUserSessionButton = () => {
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
      <Button label="resources.mas_user_sessions.action.finish.label" onClick={() => setOpen(true)} disabled={loading}>
        <StopCircleIcon />
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

export const MASUserSessionsList = (props: ListProps) => (
  <List {...props} filters={userSessionFilters} pagination={false} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick={false}>
      <TextField source="user_id" sortable={false} />
      <BooleanField source="active" sortable={false} />
      <DateField source="created_at" showTime sortable={false} />
      <DateField source="last_active_at" showTime sortable={false} emptyText="-" />
      <TextField source="last_active_ip" sortable={false} emptyText="-" />
      <TextField source="user_agent" sortable={false} emptyText="-" />
      <DateField source="finished_at" showTime sortable={false} emptyText="-" />
      <FinishUserSessionButton />
    </Datagrid>
  </List>
);

// ─── Upstream OAuth Links ─────────────────────────────────────────────────────

const DeleteOAuthLinkButton = () => {
  const record = useRecordContext();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const translate = useTranslate();

  if (!record) return null;

  const handleConfirm = async () => {
    setOpen(false);
    setLoading(true);
    try {
      await dataProvider.delete("mas_upstream_oauth_links", { id: record.id, previousData: record });
      notify("resources.mas_upstream_oauth_links.action.remove.success");
      refresh();
    } catch {
      notify("ra.notification.http_error", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label="resources.mas_upstream_oauth_links.action.remove.label"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        <StopCircleIcon />
      </Button>
      <Confirm
        isOpen={open}
        title={translate("resources.mas_upstream_oauth_links.action.remove.title")}
        content={translate("resources.mas_upstream_oauth_links.action.remove.content")}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const oauthLinkFilters = [<SearchInput key="user_id" source="user_id" alwaysOn />];

export const MASUpstreamOAuthLinksList = (props: ListProps) => (
  <List {...props} filters={oauthLinkFilters} pagination={false} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick={false}>
      <TextField source="user_id" sortable={false} />
      <TextField source="provider_id" sortable={false} />
      <TextField source="subject" sortable={false} />
      <TextField source="human_account_name" sortable={false} emptyText="-" />
      <DateField source="created_at" showTime sortable={false} />
      <DeleteOAuthLinkButton />
    </Datagrid>
  </List>
);

export const MASUpstreamOAuthLinkCreate = (props: CreateProps) => (
  <Create {...props} redirect="list">
    <SimpleForm
      toolbar={
        <Toolbar>
          <SaveButton />
        </Toolbar>
      }
    >
      <ReferenceInput source="user_id" reference="mas_users">
        <AutocompleteInput
          optionText="username"
          optionValue="id"
          label="resources.mas_upstream_oauth_links.fields.user_id"
          filterToQuery={search => ({ search })}
          isRequired
        />
      </ReferenceInput>
      <TextInput
        source="provider_id"
        required
        label="resources.mas_upstream_oauth_links.fields.provider_id"
        fullWidth
        helperText="resources.mas_upstream_oauth_links.helper.provider_id"
      />
      <TextInput source="subject" required label="resources.mas_upstream_oauth_links.fields.subject" fullWidth />
      <TextInput
        source="human_account_name"
        label="resources.mas_upstream_oauth_links.fields.human_account_name"
        fullWidth
      />
    </SimpleForm>
  </Create>
);

// ─── Upstream OAuth Providers ─────────────────────────────────────────────────

export const MASUpstreamOAuthProvidersList = (props: ListProps) => (
  <List {...props} pagination={false} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick={false}>
      <TextField source="human_name" sortable={false} emptyText="-" />
      <TextField source="brand_name" sortable={false} emptyText="-" />
      <TextField source="issuer" sortable={false} emptyText="-" />
      <BooleanField source="enabled" sortable={false} />
      <DateField source="created_at" showTime sortable={false} />
    </Datagrid>
  </List>
);

// ─── Resource prop objects ────────────────────────────────────────────────────

export const masCompatSessions: ResourceProps = {
  name: "mas_compat_sessions",
  icon: DevicesIcon,
  list: MASCompatSessionsList,
};

export const masOAuth2Sessions: ResourceProps = {
  name: "mas_oauth2_sessions",
  icon: HttpsIcon,
  list: MASOAuth2SessionsList,
};

export const masPersonalSessions: ResourceProps = {
  name: "mas_personal_sessions",
  icon: KeyIcon,
  list: MASPersonalSessionsList,
  create: MASPersonalSessionCreate,
};

export const masUserEmails: ResourceProps = {
  name: "mas_user_emails",
  icon: ContactMailIcon,
  list: MASUserEmailsList,
  create: MASUserEmailCreate,
};

export const masUserSessions: ResourceProps = {
  name: "mas_user_sessions",
  icon: HttpsIcon,
  list: MASUserSessionsList,
};

export const masUpstreamOAuthLinks: ResourceProps = {
  name: "mas_upstream_oauth_links",
  icon: HttpsIcon,
  list: MASUpstreamOAuthLinksList,
  create: MASUpstreamOAuthLinkCreate,
};

export const masUpstreamOAuthProviders: ResourceProps = {
  name: "mas_upstream_oauth_providers",
  icon: HttpsIcon,
  list: MASUpstreamOAuthProvidersList,
};
