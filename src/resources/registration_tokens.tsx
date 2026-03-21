import BlockIcon from "@mui/icons-material/Block";
import RegistrationTokenIcon from "@mui/icons-material/ConfirmationNumber";
import RestoreIcon from "@mui/icons-material/RestoreFromTrash";
import EmptyState from "../components/EmptyState";
import { useState } from "react";
import {
  BooleanInput,
  Button,
  Create,
  CreateProps,
  DatagridConfigurable,
  DateField,
  DateTimeInput,
  Edit,
  EditProps,
  List,
  ListProps,
  maxValue,
  number,
  NumberField,
  NumberInput,
  regex,
  ResourceProps,
  SaveButton,
  SimpleForm,
  TextInput,
  TextField,
  Toolbar,
  useDataProvider,
  useLocale,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
} from "react-admin";

import { useDocTitle } from "../components/hooks/useDocTitle";
import { useIsMAS } from "../providers/mas";
import { SynapseDataProvider } from "../providers/types";
import { DATE_FORMAT, dateFormatter, dateParser } from "../utils/date";

const validateToken = [regex(/^[A-Za-z0-9._~-]{0,64}$/)];
const validateUsesAllowed = [number()];
const validateLength = [number(), maxValue(64)];

const registrationTokenFilters = [<BooleanInput key="valid" source="valid" />];

export const RegistrationTokenList = (props: ListProps) => {
  const locale = useLocale();
  const translate = useTranslate();
  const isMAS = useIsMAS();
  useDocTitle(translate("resources.registration_tokens.name", { smart_count: 2 }));
  return (
    <List
      {...props}
      filters={registrationTokenFilters}
      filterDefaultValues={{ valid: true }}
      pagination={false}
      perPage={50}
      empty={<EmptyState />}
    >
      <DatagridConfigurable rowClick="edit">
        <TextField source="token" sortable={false} label="resources.registration_tokens.fields.token" />
        <NumberField source="uses_allowed" sortable={false} label="resources.registration_tokens.fields.uses_allowed" />
        <NumberField source="pending" sortable={false} label="resources.registration_tokens.fields.pending" />
        <NumberField source="completed" sortable={false} label="resources.registration_tokens.fields.completed" />
        <DateField
          source="expiry_time"
          showTime
          options={DATE_FORMAT}
          sortable={false}
          label="resources.registration_tokens.fields.expiry_time"
          locales={locale}
        />
        {isMAS && (
          <DateField
            source="created_at"
            showTime
            options={DATE_FORMAT}
            sortable={false}
            label="resources.registration_tokens.fields.created_at"
            locales={locale}
          />
        )}
        {isMAS && (
          <DateField
            source="last_used_at"
            showTime
            options={DATE_FORMAT}
            sortable={false}
            label="resources.registration_tokens.fields.last_used_at"
            locales={locale}
          />
        )}
        {isMAS && (
          <DateField
            source="revoked_at"
            showTime
            options={DATE_FORMAT}
            sortable={false}
            label="resources.registration_tokens.fields.revoked_at"
            locales={locale}
          />
        )}
      </DatagridConfigurable>
    </List>
  );
};

export const RegistrationTokenCreate = (props: CreateProps) => {
  const translate = useTranslate();
  useDocTitle(translate("ra.action.create_item", { item: translate("resources.registration_tokens.name") }));

  return (
    <Create {...props} redirect="list">
      <SimpleForm
        toolbar={
          <Toolbar>
            {/* It is possible to create tokens per default without input. */}
            <SaveButton alwaysEnable />
          </Toolbar>
        }
      >
        <TextInput source="token" autoComplete="off" validate={validateToken} resettable />
        <NumberInput
          source="length"
          validate={validateLength}
          helperText="resources.registration_tokens.helper.length"
          step={1}
        />
        <NumberInput source="uses_allowed" validate={validateUsesAllowed} step={1} />
        <DateTimeInput source="expiry_time" parse={dateParser} />
      </SimpleForm>
    </Create>
  );
};

const RevokeTokenButton = () => {
  const record = useRecordContext();
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const isMAS = useIsMAS();

  if (!record || !isMAS) return null;

  const isRevoked = !!record.revoked_at;

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.revokeRegistrationToken(record.id as string, !isRevoked);
      if (result.success) {
        notify(
          isRevoked
            ? "resources.registration_tokens.action.unrevoke.success"
            : "resources.registration_tokens.action.revoke.success"
        );
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
    <Button
      label={
        isRevoked
          ? "resources.registration_tokens.action.unrevoke.label"
          : "resources.registration_tokens.action.revoke.label"
      }
      onClick={handleClick}
      disabled={loading}
    >
      {isRevoked ? <RestoreIcon /> : <BlockIcon />}
    </Button>
  );
};

const RegistrationTokenEditToolbar = () => (
  <Toolbar>
    <SaveButton />
    <RevokeTokenButton />
  </Toolbar>
);

export const RegistrationTokenEdit = (props: EditProps) => {
  const translate = useTranslate();
  const isMAS = useIsMAS();
  useDocTitle(`${translate("ra.action.edit")} ${translate("resources.registration_tokens.name")}`);

  return (
    <Edit
      {...props}
      sx={{ "& .RaEdit-card": { maxWidth: { xs: "100vw", sm: "calc(100vw - 32px)" }, overflowX: "auto" } }}
    >
      <SimpleForm toolbar={<RegistrationTokenEditToolbar />}>
        <TextInput source="token" disabled />
        <NumberInput source="pending" disabled />
        <NumberInput source="completed" disabled />
        <NumberInput source="uses_allowed" validate={validateUsesAllowed} step={1} />
        <DateTimeInput source="expiry_time" parse={dateParser} format={dateFormatter} />
        {isMAS && <DateTimeInput source="created_at" disabled />}
        {isMAS && <DateTimeInput source="last_used_at" disabled />}
        {isMAS && <DateTimeInput source="revoked_at" disabled />}
      </SimpleForm>
    </Edit>
  );
};

const resource: ResourceProps = {
  name: "registration_tokens",
  icon: RegistrationTokenIcon,
  list: RegistrationTokenList,
  edit: RegistrationTokenEdit,
  create: RegistrationTokenCreate,
};

export default resource;
