import EmptyState from "../../components/layout/EmptyState";
import DeleteIcon from "@mui/icons-material/Delete";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  AutocompleteInput,
  Button,
  Confirm,
  Create,
  CreateProps,
  DatagridConfigurable,
  DateField,
  List,
  ListProps,
  ReferenceInput,
  ResourceProps,
  SaveButton,
  SearchInput,
  SimpleList,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
} from "react-admin";

import { SynapseDataProvider } from "../../providers/types";

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
      <Button
        label="resources.mas_user_emails.action.remove.label"
        onClick={() => setOpen(true)}
        disabled={loading}
        color="error"
      >
        <DeleteIcon />
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

export function MASUserEmailsList(props: ListProps) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <List {...props} filters={userEmailFilters} pagination={false} perPage={50} empty={<EmptyState />}>
      {isSmall ? (
        <SimpleList
          primaryText={record => String(record.email || "")}
          secondaryText={record => String(record.user_id || "")}
          tertiaryText={() => <DeleteEmailButton />}
          linkType={false}
        />
      ) : (
        <DatagridConfigurable bulkActionButtons={false} rowClick={false}>
          <TextField source="email" sortable={false} />
          <TextField source="user_id" sortable={false} />
          <DateField source="created_at" showTime sortable={false} />
          <DeleteEmailButton />
        </DatagridConfigurable>
      )}
    </List>
  );
}

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

export const masUserEmails: ResourceProps = {
  name: "mas_user_emails",
  icon: ContactMailIcon,
  list: MASUserEmailsList,
  create: MASUserEmailCreate,
};
