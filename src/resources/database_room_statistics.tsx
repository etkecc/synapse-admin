import StorageIcon from "@mui/icons-material/Storage";
import {
  DatagridConfigurable,
  ExportButton,
  FunctionField,
  List,
  ListProps,
  ReferenceField,
  ResourceProps,
  TextField,
  TopToolbar,
  useListContext,
  useTranslate,
} from "react-admin";

import AvatarField from "../components/AvatarField";
import { useDocTitle } from "../components/hooks/useDocTitle";

const ListActions = () => {
  const { isLoading, total } = useListContext();
  return (
    <TopToolbar>
      <ExportButton disabled={isLoading || total === 0} />
    </TopToolbar>
  );
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

export const DatabaseRoomStatsList = (props: ListProps) => {
  const translate = useTranslate();
  useDocTitle(translate("resources.database_room_statistics.name", { smart_count: 2 }));
  return (
    <List {...props} resource="database_room_statistics" actions={<ListActions />} pagination={false} perPage={100}>
      <DatagridConfigurable
        rowClick={id => `/rooms/${encodeURIComponent(id as string)}/show`}
        bulkActionButtons={false}
      >
        <ReferenceField label="resources.rooms.fields.avatar" source="id" reference="rooms" sortable={false} link="">
          <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
        </ReferenceField>
        <TextField source="room_id" sortable={false} />
        <ReferenceField label="resources.rooms.fields.name" source="id" reference="rooms" sortable={false} link="">
          <TextField source="name" />
        </ReferenceField>
        <FunctionField
          source="estimated_size"
          sortable={false}
          render={(record: { estimated_size: number }) => formatBytes(record.estimated_size)}
        />
      </DatagridConfigurable>
    </List>
  );
};

const resource: ResourceProps = {
  name: "database_room_statistics",
  icon: StorageIcon,
  list: DatabaseRoomStatsList,
};

export default resource;
