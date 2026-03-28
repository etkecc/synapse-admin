import ScheduleIcon from "@mui/icons-material/Schedule";
import { ResourceProps } from "react-admin";

import { ScheduledTaskList } from "./List";

export { ScheduledTaskList } from "./List";

const resource: ResourceProps = {
  name: "scheduled_tasks",
  icon: ScheduleIcon,
  list: ScheduledTaskList,
};

export default resource;
