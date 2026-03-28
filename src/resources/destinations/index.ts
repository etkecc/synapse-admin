import DestinationsIcon from "@mui/icons-material/CloudQueue";
import { ResourceProps } from "react-admin";

import { DestinationList, DestinationShow } from "./List";

export { DestinationList, DestinationReconnectButton, DestinationShow } from "./List";

const resource: ResourceProps = {
  name: "destinations",
  icon: DestinationsIcon,
  list: DestinationList,
  show: DestinationShow,
};

export default resource;
