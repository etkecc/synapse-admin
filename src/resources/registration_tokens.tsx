import RegistrationTokenIcon from "@mui/icons-material/ConfirmationNumber";
import {
  BooleanInput,
  Create,
  CreateProps,
  Datagrid,
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
} from "react-admin";

import { DATE_FORMAT, dateFormatter, dateParser } from "../utils/date";

const validateToken = [regex(/^[A-Za-z0-9._~-]{0,64}$/)];
const validateUsesAllowed = [number()];
const validateLength = [number(), maxValue(64)];

const registrationTokenFilters = [<BooleanInput source="valid" alwaysOn />];

export const RegistrationTokenList = (props: ListProps) => (
  <List
    {...props}
    filters={registrationTokenFilters}
    filterDefaultValues={{ valid: true }}
    pagination={false}
    perPage={50}
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
      />
    </DatagridConfigurable>
  </List>
);

export const RegistrationTokenCreate = (props: CreateProps) => (
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

export const RegistrationTokenEdit = (props: EditProps) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="token" disabled />
      <NumberInput source="pending" disabled />
      <NumberInput source="completed" disabled />
      <NumberInput source="uses_allowed" validate={validateUsesAllowed} step={1} />
      <DateTimeInput source="expiry_time" parse={dateParser} format={dateFormatter} />
    </SimpleForm>
  </Edit>
);

const resource: ResourceProps = {
  name: "registration_tokens",
  icon: RegistrationTokenIcon,
  list: RegistrationTokenList,
  edit: RegistrationTokenEdit,
  create: RegistrationTokenCreate,
};

export default resource;
