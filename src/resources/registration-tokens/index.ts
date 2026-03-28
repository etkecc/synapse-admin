import RegistrationTokenIcon from "@mui/icons-material/ConfirmationNumber";
import { ResourceProps } from "react-admin";

import { RegistrationTokenCreate } from "./Create";
import { RegistrationTokenEdit } from "./Edit";
import { RegistrationTokenList } from "./List";

export { RegistrationTokenCreate } from "./Create";
export { RegistrationTokenEdit } from "./Edit";
export { RegistrationTokenList } from "./List";

const resource: ResourceProps = {
  name: "registration_tokens",
  icon: RegistrationTokenIcon,
  list: RegistrationTokenList,
  edit: RegistrationTokenEdit,
  create: RegistrationTokenCreate,
};

export default resource;
