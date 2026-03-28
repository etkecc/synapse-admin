import PermMediaIcon from "@mui/icons-material/PermMedia";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  BooleanField,
  DatagridConfigurable,
  ExportButton,
  FunctionField,
  List,
  ListProps,
  NumberField,
  Pagination,
  ReferenceField,
  ResourceProps,
  SearchInput,
  SimpleList,
  TextField,
  TopToolbar,
  useListContext,
  useTranslate,
} from "react-admin";

import AvatarField from "../../components/users/fields/AvatarField";
import EmptyState from "../../components/layout/EmptyState";
import { useDocTitle } from "../../components/hooks/useDocTitle";
import { formatBytes } from "../../utils/formatBytes";
import { DeleteMediaButton, PurgeRemoteMediaButton } from "../../components/media";

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

export const UserMediaStatsList = (props: ListProps) => {
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.user_media_statistics.name", { smart_count: 2 }));
  return (
    <List
      {...props}
      actions={<ListActions />}
      filters={userMediaStatsFilters}
      pagination={<UserMediaStatsPagination />}
      sort={{ field: "media_length", order: "DESC" }}
      perPage={50}
      empty={<EmptyState />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => (
            <Box component="span" sx={{ wordBreak: "break-all" }}>
              {record.displayname || record.user_id}
            </Box>
          )}
          secondaryText={record => (
            <>
              {record.displayname && (
                <>
                  <Box component="span" sx={{ wordBreak: "break-all" }}>
                    {record.user_id}
                  </Box>
                  <br />
                </>
              )}
              {translate("resources.user_media_statistics.fields.media_count")}: {record.media_count}
              {" · "}
              {translate("resources.user_media_statistics.fields.media_length")}: {formatBytes(record.media_length)}
            </>
          )}
          rowClick={id => "/users/" + id + "/media"}
        />
      ) : (
        <DatagridConfigurable rowClick={id => "/users/" + id + "/media"} bulkActionButtons={false}>
          <ReferenceField label="resources.users.fields.avatar" source="id" reference="users" sortable={false} link="">
            <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
          </ReferenceField>
          <TextField source="user_id" label="resources.users.fields.id" sx={{ wordBreak: "break-all" }} />
          <TextField source="displayname" label="resources.users.fields.displayname" />
          <NumberField source="media_count" />
          <FunctionField source="media_length" render={record => formatBytes(record.media_length)} />
          <ReferenceField
            label="resources.users.fields.is_guest"
            source="id"
            reference="users"
            sortable={false}
            link=""
          >
            <BooleanField source="is_guest" label="resources.users.fields.is_guest" />
          </ReferenceField>
          <ReferenceField
            label="resources.users.fields.deactivated"
            source="id"
            reference="users"
            sortable={false}
            link=""
          >
            <BooleanField source="deactivated" label="resources.users.fields.deactivated" />
          </ReferenceField>
          <ReferenceField label="resources.users.fields.locked" source="id" reference="users" sortable={false} link="">
            <BooleanField source="locked" label="resources.users.fields.locked" />
          </ReferenceField>
          <ReferenceField label="resources.users.fields.erased" source="id" reference="users" sortable={false} link="">
            <BooleanField source="erased" sortable={false} label="resources.users.fields.erased" />
          </ReferenceField>
        </DatagridConfigurable>
      )}
    </List>
  );
};

const resource: ResourceProps = {
  name: "user_media_statistics",
  icon: PermMediaIcon,
  list: UserMediaStatsList,
};

export default resource;
