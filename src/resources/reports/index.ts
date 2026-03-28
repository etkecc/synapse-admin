import ReportIcon from "@mui/icons-material/Warning";
import { ResourceProps } from "react-admin";

import { ReportList } from "./List";
import { ReportShow } from "./Show";

export { ReportList } from "./List";
export { ReportShow } from "./Show";

const resource: ResourceProps = {
  name: "reports",
  icon: ReportIcon,
  list: ReportList,
  show: ReportShow,
};

export default resource;
