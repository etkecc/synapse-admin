import StorageIcon from "@mui/icons-material/Storage";
import Box from "@mui/material/Box";
import MuiList from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DatagridConfigurable,
  ExportButton,
  FunctionField,
  Link,
  List,
  ListProps,
  ReferenceField,
  ResourceProps,
  TextField,
  TopToolbar,
  useGetMany,
  useListContext,
  useTranslate,
} from "react-admin";

import AvatarField from "../../components/users/fields/AvatarField";
import { useDocTitle } from "../../components/hooks/useDocTitle";
import { formatBytes } from "../../utils/formatBytes";

const ListActions = () => {
  const { isLoading, total } = useListContext();
  return (
    <TopToolbar>
      <ExportButton disabled={isLoading || total === 0} />
    </TopToolbar>
  );
};

const DatabaseRoomStatsMobileList = () => {
  const { data: stats } = useListContext();
  const translate = useTranslate();
  const ids = (stats || []).map(r => r.id);
  const { data: rooms } = useGetMany("rooms", { ids }, { enabled: ids.length > 0 });
  const roomMap = new Map((rooms || []).map(r => [r.id, r]));

  if (!stats?.length) return null;

  return (
    <MuiList disablePadding>
      {stats.map(record => {
        const room = roomMap.get(record.id);
        return (
          <ListItemButton
            key={record.id as string}
            component={Link}
            to={`/rooms/${encodeURIComponent(record.id as string)}/show`}
            sx={{ gap: 1, alignItems: "center" }}
          >
            <AvatarField record={room || record} source="avatar" sx={{ height: "40px", width: "40px" }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                {room?.name || room?.canonical_alias || record.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {translate("resources.rooms.fields.joined_members")}: {room?.joined_members ?? 0}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              {formatBytes(record.estimated_size)}
            </Typography>
          </ListItemButton>
        );
      })}
    </MuiList>
  );
};

export const DatabaseRoomStatsList = (props: ListProps) => {
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.database_room_statistics.name", { smart_count: 2 }));
  return (
    <List {...props} resource="database_room_statistics" actions={<ListActions />} pagination={false} perPage={100}>
      <Box sx={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif", margin: "0.5em" }}>
        {translate("resources.database_room_statistics.helper.info")}
      </Box>
      {isSmall ? (
        <DatabaseRoomStatsMobileList />
      ) : (
        <DatagridConfigurable
          rowClick={id => `/rooms/${encodeURIComponent(id as string)}/show`}
          bulkActionButtons={false}
        >
          <ReferenceField label="resources.rooms.fields.avatar" source="id" reference="rooms" sortable={false} link="">
            <AvatarField source="avatar" sx={{ height: "40px", width: "40px" }} />
          </ReferenceField>
          <TextField source="room_id" sortable={false} />
          <ReferenceField
            label="resources.rooms.fields.canonical_alias"
            source="id"
            reference="rooms"
            sortable={false}
            link=""
          >
            <TextField source="canonical_alias" />
          </ReferenceField>
          <ReferenceField label="resources.rooms.fields.name" source="id" reference="rooms" sortable={false} link="">
            <TextField source="name" />
          </ReferenceField>
          <ReferenceField
            label="resources.rooms.fields.joined_members"
            source="id"
            reference="rooms"
            sortable={false}
            link=""
          >
            <TextField source="joined_members" />
          </ReferenceField>
          <FunctionField
            source="estimated_size"
            sortable={false}
            render={(record: { estimated_size: number }) => formatBytes(record.estimated_size)}
          />
        </DatagridConfigurable>
      )}
    </List>
  );
};

const resource: ResourceProps = {
  name: "database_room_statistics",
  icon: StorageIcon,
  list: DatabaseRoomStatsList,
};

export default resource;
