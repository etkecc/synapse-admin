import UserIcon from "@mui/icons-material/Group";
import { ResourceProps } from "react-admin";

export { UserList } from "./List";
export { UserEdit } from "./Edit";
export { UserCreate } from "./Create";

import { UserList } from "./List";
import { UserEdit } from "./Edit";
import { UserCreate } from "./Create";

const resource: ResourceProps = {
  name: "users",
  icon: UserIcon,
  list: UserList,
  edit: UserEdit,
  create: UserCreate,
};

export default resource;
