import RoomDirectoryIcon from "@mui/icons-material/FolderShared";
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
  TopToolbar,
  useCreate,
  useDataProvider,
  useListContext,
  useNotify,
  useTranslate,
  useRecordContext,
  useRefresh,
  useUnselectAll,
  Confirm,
} from "react-admin";
import { useMutation } from "@tanstack/react-query";
import AvatarField from "../components/AvatarField";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import { Typography } from "@mui/material";


const RoomDirectoryPagination = () => <Pagination rowsPerPageOptions={[100, 500, 1000, 2000]} />;

export const RoomDirectoryMakeAdminButton = (props: ButtonProps) => {
  const { selectedIds } = useListContext();
  const [open, setOpen] = useState(false);
  const [userIdValue, setUserIdValue] = useState("");
  const dataProvider = useDataProvider();
  const translate = useTranslate();

  const { mutate: makeRoomAdminn, isPending } = useMutation({
    mutationFn: (data) =>
      dataProvider.makeRoomAdmin(selectedIds, userIdValue),
    onSuccess: () => {
      console.log("SUCCESS");
      // notify("resources.servernotices.action.send_success");
      // unselectAllUsers();
      // closeDialog();
    },
    onError: () =>
      // notify("resources.servernotices.action.send_failure", {
      //   type: "error",
      // }),
      console.log("Failure")
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserIdValue(event.target.value);
  };

  const handleConfirm = async () => {
    console.log("CONFIRMED");
    await makeRoomAdminn();
    // await dataProvider.makeRoomAdmin(selectedIds, userIdValue)
  };
  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button {...props} label="Assign admin" onClick={() => setOpen(true)}><PersonIcon /></Button>
      <Confirm
        isOpen={open}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="resources.rooms.action.make_admin.confirm"
        cancel="ra.action.cancel"
        title="resources.rooms.action.make_admin.title"
        content={<>
          <Typography sx={{ marginBottom: 2}}>{translate("resources.rooms.action.make_admin.content")}</Typography>
          <TextField
            type="text"
            variant="filled"
            value={userIdValue}
            onChange={handleChange}
            label={"user id"}
        /></>}
      />
    </>
  );
};

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
    onError: () =>
      notify("resources.room_directory.action.send_failure", {
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
        onError: () =>
          notify("resources.room_directory.action.send_failure", {
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

const RoomDirectoryListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <ExportButton />
  </TopToolbar>
);

export const RoomDirectoryList = () => (
  <List pagination={<RoomDirectoryPagination />} perPage={100} actions={<RoomDirectoryListActions />}>
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
      <TextField source="room_id" sortable={false} label="resources.rooms.fields.room_id" />
      <TextField source="canonical_alias" sortable={false} label="resources.rooms.fields.canonical_alias" />
      <TextField source="topic" sortable={false} label="resources.rooms.fields.topic" />
      <NumberField source="num_joined_members" sortable={false} label="resources.rooms.fields.joined_members" />
      <BooleanField source="world_readable" sortable={false} label="resources.room_directory.fields.world_readable" />
      <BooleanField source="guest_can_join" sortable={false} label="resources.room_directory.fields.guest_can_join" />
    </DatagridConfigurable>
  </List>
);

const resource: ResourceProps = {
  name: "room_directory",
  icon: RoomDirectoryIcon,
  list: RoomDirectoryList,
};

export default resource;
