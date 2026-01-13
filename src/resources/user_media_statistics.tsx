import PermMediaIcon from "@mui/icons-material/PermMedia";
import {
  BooleanField,
  DatagridConfigurable,
  ExportButton,
  List,
  ListProps,
  NumberField,
  Pagination,
  ReferenceField,
  ResourceProps,
  SearchInput,
  TextField,
  TopToolbar,
  useListContext,
} from "react-admin";

import AvatarField from "../components/AvatarField";
import { DeleteMediaButton, PurgeRemoteMediaButton } from "../components/media";

const ListActions = () => {
  const { isLoading, total } = useListContext();
  return (
    <TopToolbar>
      <DeleteMediaButton />
      <PurgeRemoteMediaButton />
      <ExportButton disabled={isLoading || total === 0} />
    </TopToolbar>
  );
};

const UserMediaStatsPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const userMediaStatsFilters = [<SearchInput source="search_term" alwaysOn />];

export const UserMediaStatsList = (props: ListProps) => (
  <List
    {...props}
    actions={<ListActions />}
    filters={userMediaStatsFilters}
    pagination={<UserMediaStatsPagination />}
    sort={{ field: "media_length", order: "DESC" }}
    perPage={50}
  >
    <DatagridConfigurable rowClick={id => "/users/" + id + "/media"} bulkActionButtons={false}>
      <ReferenceField label="resources.users.fields.avatar" source="id" reference="users" sortable={false} link="">
        <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
      </ReferenceField>
      <TextField source="user_id" label="resources.users.fields.id" />
      <TextField source="displayname" label="resources.users.fields.displayname" />
      <NumberField source="media_count" />
      <NumberField source="media_length" />
      <ReferenceField label="resources.users.fields.is_guest" source="id" reference="users" sortable={false} link="">
        <BooleanField source="is_guest" label="resources.users.fields.is_guest" />
      </ReferenceField>
      <ReferenceField label="resources.users.fields.deactivated" source="id" reference="users" sortable={false} link="">
        <BooleanField source="deactivated" label="resources.users.fields.deactivated" />
      </ReferenceField>
      <ReferenceField label="resources.users.fields.locked" source="id" reference="users" sortable={false} link="">
        <BooleanField source="locked" label="resources.users.fields.locked" />
      </ReferenceField>
      <ReferenceField label="resources.users.fields.erased" source="id" reference="users" sortable={false} link="">
        <BooleanField source="erased" sortable={false} label="resources.users.fields.erased" />
      </ReferenceField>
    </DatagridConfigurable>
  </List>
);

const resource: ResourceProps = {
  name: "user_media_statistics",
  icon: PermMediaIcon,
  list: UserMediaStatsList,
};

export default resource;
