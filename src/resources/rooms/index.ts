import ViewListIcon from "@mui/icons-material/ViewList";
import { ResourceProps } from "react-admin";

import { RoomList } from "./List";
import { RoomShow } from "./Show";

export { MakeAdminBtn, JoinUserBtn, RoomBulkActionButtons, RoomList } from "./List";
export { RoomShow } from "./Show";

const resource: ResourceProps = {
  name: "rooms",
  icon: ViewListIcon,
  list: RoomList,
  show: RoomShow,
};

export default resource;
