import RoomDirectoryIcon from "@mui/icons-material/FolderShared";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EmptyState from "../components/EmptyState";
import { useMutation } from "@tanstack/react-query";
import {
  BooleanField,
  BulkDeleteButton,
  BulkDeleteButtonProps,
  Button,
  ButtonProps,
  DatagridConfigurable,
  DeleteButtonProps,
  ExportButton,
  DeleteButton,
  List,
  NumberField,
  Pagination,
  ResourceProps,
  SelectColumnsButton,
  SimpleList,
  TextField,
  TopToolbar,
  useCreate,
  useDataProvider,
  useListContext,
  useNotify,
  useTranslate,
  useRecordContext,
  useRefresh,
  useUnselectAll,
} from "react-admin";

import { MakeAdminBtn } from "./rooms";
import AvatarField from "../components/AvatarField";
import { useDocTitle } from "../components/hooks/useDocTitle";
const RoomDirectoryPagination = () => <Pagination rowsPerPageOptions={[100, 500, 1000, 2000]} />;

export const RoomDirectoryUnpublishButton = (props: DeleteButtonProps) => {
  const translate = useTranslate();

  return (
    <DeleteButton
      {...props}
      label="resources.room_directory.action.erase"
      redirect={false}
      mutationMode="pessimistic"
      confirmTitle={translate("resources.room_directory.action.title", {
        smart_count: 1,
      })}
      confirmContent={translate("resources.room_directory.action.content", {
        smart_count: 1,
      })}
      resource="room_directory"
      icon={<RoomDirectoryIcon />}
    />
  );
};

export const RoomDirectoryBulkUnpublishButton = (props: BulkDeleteButtonProps) => (
  <BulkDeleteButton
    {...props}
    label="resources.room_directory.action.erase"
    mutationMode="pessimistic"
    confirmTitle="resources.room_directory.action.title"
    confirmContent="resources.room_directory.action.content"
    resource="room_directory"
    icon={<RoomDirectoryIcon />}
  />
);

export const RoomDirectoryBulkPublishButton = (props: ButtonProps) => {
  const { selectedIds } = useListContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAllRooms = useUnselectAll("rooms");
  const dataProvider = useDataProvider();
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      dataProvider.createMany("room_directory", {
        ids: selectedIds,
        data: {},
      }),
    onSuccess: () => {
      notify("resources.room_directory.action.send_success");
      unselectAllRooms();
      refresh();
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    onError: (error: any) =>
      notify(error?.message || "resources.room_directory.action.send_failure", {
        type: "error",
      }),
  });

  return (
    <Button {...props} label="resources.room_directory.action.create" onClick={mutate} disabled={isPending}>
      <RoomDirectoryIcon />
    </Button>
  );
};

export const RoomDirectoryPublishButton = (props: ButtonProps) => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [create, { isLoading }] = useCreate();

  if (!record) {
    return null;
  }

  const handleSend = () => {
    create(
      "room_directory",
      { data: { id: record.id } },
      {
        onSuccess: () => {
          notify("resources.room_directory.action.send_success");
          refresh();
        },
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        onError: (error: any) =>
          notify(error?.message || "resources.room_directory.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  return (
    <Button {...props} label="resources.room_directory.action.create" onClick={handleSend} disabled={isLoading}>
      <RoomDirectoryIcon />
    </Button>
  );
};

const RoomDirectoryListActions = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <TopToolbar>
      {!isSmall && <SelectColumnsButton />}
      <ExportButton />
    </TopToolbar>
  );
};

export const RoomDirectoryList = () => {
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.room_directory.name", { smart_count: 2 }));
  return (
    <List
      pagination={<RoomDirectoryPagination />}
      perPage={50}
      actions={<RoomDirectoryListActions />}
      empty={<EmptyState />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => (
            <Box component="span" sx={{ wordBreak: "break-all" }}>
              {record.name || record.canonical_alias || record.room_id}
            </Box>
          )}
          secondaryText={record => (
            <>
              {record.canonical_alias && (
                <>
                  <Box component="span" sx={{ wordBreak: "break-all" }}>
                    {record.canonical_alias}
                  </Box>
                  <br />
                </>
              )}
              {translate("resources.rooms.fields.joined_members")}: {record.num_joined_members ?? 0}
            </>
          )}
          linkType="show"
          leftAvatar={record => (
            <AvatarField record={record} source="avatar_src" sx={{ height: "40px", width: "40px" }} />
          )}
        />
      ) : (
        <DatagridConfigurable
          rowClick={id => "/rooms/" + id + "/show"}
          bulkActionButtons={<RoomDirectoryBulkUnpublishButton />}
          omit={["room_id", "canonical_alias", "topic"]}
        >
          <AvatarField
            source="avatar_src"
            sx={{ height: "40px", width: "40px" }}
            label="resources.rooms.fields.avatar"
          />
          <TextField source="name" sortable={false} label="resources.rooms.fields.name" />
          <TextField
            source="room_id"
            sortable={false}
            label="resources.rooms.fields.room_id"
            sx={{ wordBreak: "break-all" }}
          />
          <TextField
            source="canonical_alias"
            sortable={false}
            label="resources.rooms.fields.canonical_alias"
            sx={{ wordBreak: "break-all" }}
          />
          <TextField source="topic" sortable={false} label="resources.rooms.fields.topic" />
          <NumberField source="num_joined_members" sortable={false} label="resources.rooms.fields.joined_members" />
          <BooleanField
            source="world_readable"
            sortable={false}
            label="resources.room_directory.fields.world_readable"
          />
          <BooleanField
            source="guest_can_join"
            sortable={false}
            label="resources.room_directory.fields.guest_can_join"
          />
          <MakeAdminBtn />
        </DatagridConfigurable>
      )}
    </List>
  );
};

const resource: ResourceProps = {
  name: "room_directory",
  icon: RoomDirectoryIcon,
  list: RoomDirectoryList,
};

export default resource;
