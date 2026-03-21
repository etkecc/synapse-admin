import EventIcon from "@mui/icons-material/Event";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FastForwardIcon from "@mui/icons-material/FastForward";
import MessageIcon from "@mui/icons-material/Message";
import UserIcon from "@mui/icons-material/Group";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import ViewListIcon from "@mui/icons-material/ViewList";
import RoomIcon from "@mui/icons-material/ViewList";
import EmptyState from "../components/EmptyState";
import { RoomHierarchy } from "../components/RoomHierarchy";
import { RoomMessages } from "../components/RoomMessages";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import MuiList from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  BooleanField,
  DateField,
  WrapperField,
  DatagridConfigurable,
  ExportButton,
  FilterButton,
  FunctionField,
  List,
  ListProps,
  NumberField,
  Pagination,
  ReferenceField,
  ReferenceManyField,
  ResourceProps,
  SearchInput,
  SelectColumnsButton,
  SimpleList,
  Show,
  ShowProps,
  Tab,
  TabbedShowLayout,
  TextField as RaTextField,
  TopToolbar,
  useRecordContext,
  useTranslate,
  useListContext,
  useNotify,
  Button as RaButton,
  DeleteButton,
  NullableBooleanInput,
  useLocale,
  useGetMany,
} from "react-admin";
import { Link } from "react-router-dom";
import { useDataProvider } from "react-admin";
import { Confirm } from "react-admin";

import {
  RoomDirectoryBulkUnpublishButton,
  RoomDirectoryBulkPublishButton,
  RoomDirectoryUnpublishButton,
  RoomDirectoryPublishButton,
} from "./room_directory";
import AvatarField from "../components/AvatarField";
import {
  BlockRoomButton,
  BlockRoomBulkButton,
  UnblockRoomBulkButton,
  BlockRoomByIdButton,
} from "../components/BlockRoomButton";
import DeleteRoomButton from "../components/DeleteRoomButton";
import { PurgeHistoryButton } from "../components/PurgeHistoryButton";
import { QuarantineRoomMediaButton } from "../components/QuarantineAllMediaButton";
import { useDocTitle } from "../components/hooks/useDocTitle";
import { MediaIDField } from "../components/media";
import { Room } from "../providers/types";
import { DATE_FORMAT } from "../utils/date";

const RoomPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const RoomTitle = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const baseTitle = translate("resources.rooms.name", 1);

  let name = "";
  if (record) {
    let recordIdentifier = record.id as string;
    if (record.canonical_alias) {
      recordIdentifier = record.canonical_alias;
    }

    name = record.name ? `${record.name} (${recordIdentifier})` : recordIdentifier;
  }

  const pageTitle = record ? `${baseTitle}: ${name}` : baseTitle;
  useDocTitle(pageTitle);
  if (!record) {
    return null;
  }
  return (
    <span>
      {baseTitle} <AvatarField source="avatar_src" sx={{ height: "25px", width: "25px" }} /> {name}
    </span>
  );
};

const RoomShowActions = () => {
  const record = useRecordContext();
  if (!record) {
    return null;
  }
  const publishButton = record?.public ? <RoomDirectoryUnpublishButton /> : <RoomDirectoryPublishButton />;
  // FIXME: refresh after (un)publish
  return (
    <TopToolbar sx={{ flexWrap: "wrap", gap: 0.5, whiteSpace: "normal" }}>
      {publishButton}
      <BlockRoomButton />
      <PurgeHistoryButton />
      <JoinUserBtn />
      <MakeAdminBtn />
      <DeleteRoomButton
        selectedIds={[record.id]}
        confirmTitle="resources.rooms.action.erase.title"
        confirmContent="resources.rooms.action.erase.content"
      />
    </TopToolbar>
  );
};

export const MakeAdminBtn = () => {
  const record = useRecordContext() as Room;

  if (!record) {
    return null;
  }

  if (record.joined_local_members < 1) {
    return null;
  }

  const ownMXID = localStorage.getItem("user_id") || "";
  const [open, setOpen] = useState(false);
  const [userIdValue, setUserIdValue] = useState(ownMXID);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await dataProvider.makeRoomAdmin(record.room_id, userIdValue);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      notify("resources.rooms.action.make_admin.success", { type: "success" });
      setOpen(false);
      setUserIdValue("");
    },
    onError: err => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      notify("resources.rooms.action.make_admin.failure", { type: "error", messageArgs: { errMsg: errorMessage } });
      setOpen(false);
      setUserIdValue("");
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserIdValue(event.target.value);
  };

  const handleConfirm = async () => {
    mutate();
    setOpen(false);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <>
      <RaButton
        label="resources.rooms.action.make_admin.assign_admin"
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
        disabled={isPending}
      >
        <PersonIcon />
      </RaButton>
      <Confirm
        isOpen={open}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="resources.rooms.action.make_admin.confirm"
        cancel="ra.action.cancel"
        title={translate("resources.rooms.action.make_admin.title", {
          roomName: record.name ? record.name : record.room_id,
        })}
        content={
          <>
            <Typography sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
              {translate("resources.rooms.action.make_admin.content")}
            </Typography>
            <TextField
              type="text"
              variant="filled"
              value={userIdValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              label={"Matrix ID"}
            />
          </>
        }
      />
    </>
  );
};

export const JoinUserBtn = () => {
  const record = useRecordContext() as Room;

  if (!record) {
    return null;
  }

  const [open, setOpen] = useState(false);
  const [userIdValue, setUserIdValue] = useState("");
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const result = await dataProvider.joinUserToRoom(record.room_id, userIdValue);
      if (!result.success) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      notify("resources.rooms.action.join.success", { type: "success" });
      setOpen(false);
      setUserIdValue("");
    },
    onError: err => {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      notify("resources.rooms.action.join.failure", { type: "error", messageArgs: { errMsg: errorMessage } });
      setOpen(false);
      setUserIdValue("");
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserIdValue(event.target.value);
  };

  const handleConfirm = async () => {
    mutate();
    setOpen(false);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <>
      <RaButton
        label="resources.rooms.action.join.label"
        onClick={e => {
          e.stopPropagation();
          setOpen(true);
        }}
        disabled={isPending}
      >
        <PersonAddIcon />
      </RaButton>
      <Confirm
        isOpen={open}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="resources.rooms.action.join.confirm"
        cancel="ra.action.cancel"
        title={translate("resources.rooms.action.join.title", {
          roomName: record.name ? record.name : record.room_id,
        })}
        content={
          <>
            <Typography sx={{ marginBottom: 2, whiteSpace: "pre-line" }}>
              {translate("resources.rooms.action.join.content")}
            </Typography>
            <TextField
              type="text"
              variant="filled"
              value={userIdValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              label={"Matrix ID"}
            />
          </>
        }
      />
    </>
  );
};

const RoomOverviewTab = () => {
  const translate = useTranslate();
  const record = useRecordContext();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  if (!record) return null;

  const isEncrypted = !!record.encryption;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          gap: 2,
          alignItems: isSmall ? "center" : "flex-start",
        }}
      >
        <AvatarField source="avatar" sx={{ height: "96px", width: "96px" }} label="resources.rooms.fields.avatar" />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ wordBreak: "break-word" }}>
            {record.name || record.canonical_alias || record.room_id}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
            {record.room_id}
          </Typography>
          {record.canonical_alias && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, wordBreak: "break-all" }}>
              {record.canonical_alias}
            </Typography>
          )}
          {record.topic && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, whiteSpace: "pre-wrap" }}>
              {record.topic}
            </Typography>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            <Chip
              size="small"
              icon={isEncrypted ? <HttpsIcon fontSize="small" /> : <NoEncryptionIcon fontSize="small" />}
              label={isEncrypted ? record.encryption : translate("resources.rooms.enums.unencrypted")}
              color={isEncrypted ? "success" : "default"}
              variant="outlined"
            />
            <Chip size="small" label={`v${record.version}`} variant="outlined" />
            {record.public && (
              <Chip size="small" label={translate("resources.rooms.fields.public")} color="info" variant="outlined" />
            )}
            {record.federatable && (
              <Chip size="small" label={translate("resources.rooms.fields.federatable")} variant="outlined" />
            )}
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
          gap: 2,
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {translate("synapseadmin.rooms.tabs.detail")}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.joined_members")}
                </Typography>
                <Typography variant="body2">{record.joined_members ?? "—"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.joined_local_members")}
                </Typography>
                <Typography variant="body2">{record.joined_local_members ?? "—"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.joined_local_devices")}
                </Typography>
                <Typography variant="body2">{record.joined_local_devices ?? "—"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.state_events")}
                </Typography>
                <Typography variant="body2">{record.state_events ?? "—"}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {translate("synapseadmin.rooms.tabs.permission")}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.join_rules")}
                </Typography>
                <Typography variant="body2">
                  {record.join_rules ? translate(`resources.rooms.enums.join_rules.${record.join_rules}`) : "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.guest_access")}
                </Typography>
                <Typography variant="body2">
                  {record.guest_access ? translate(`resources.rooms.enums.guest_access.${record.guest_access}`) : "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.history_visibility")}
                </Typography>
                <Typography variant="body2">
                  {record.history_visibility
                    ? translate(`resources.rooms.enums.history_visibility.${record.history_visibility}`)
                    : "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.creator")}
                </Typography>
                <ReferenceField source="creator" reference="users" link="show">
                  <RaTextField source="id" sx={{ wordBreak: "break-all" }} />
                </ReferenceField>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const RoomMembersMobileList = () => {
  const { data: members } = useListContext();
  const ids = (members || []).map(r => r.id);
  const { data: users } = useGetMany("users", { ids }, { enabled: ids.length > 0 });
  const userMap = new Map((users || []).map(u => [u.id, u]));

  if (!members?.length) return null;

  return (
    <MuiList disablePadding>
      {members.map(record => {
        const user = userMap.get(record.id);
        return (
          <ListItemButton
            key={record.id as string}
            component={Link}
            to={"/users/" + record.id}
            sx={{ gap: 1, alignItems: "center" }}
          >
            <AvatarField record={user || record} source="avatar_src" sx={{ height: "40px", width: "40px" }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                {user?.displayname || record.id}
              </Typography>
              {user?.displayname && (
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                  {record.id}
                </Typography>
              )}
            </Box>
          </ListItemButton>
        );
      })}
    </MuiList>
  );
};

export const RoomShow = (props: ShowProps) => {
  const translate = useTranslate();
  const locale = useLocale();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Show
      {...props}
      actions={<RoomShowActions />}
      title={<RoomTitle />}
      sx={{ "& .RaShow-card": { maxWidth: { xs: "100vw", sm: "calc(100vw - 32px)" }, overflowX: "auto" } }}
    >
      <TabbedShowLayout sx={{ "& .MuiTabs-scroller": { overflowX: "auto !important" } }}>
        <Tab label="synapseadmin.rooms.tabs.basic" icon={<ViewListIcon />}>
          <RoomOverviewTab />
        </Tab>

        <Tab label="synapseadmin.rooms.tabs.members" icon={<UserIcon />} path="members">
          <MakeAdminBtn />
          <ReferenceManyField
            reference="room_members"
            target="room_id"
            label={false}
            perPage={10}
            pagination={<RoomPagination />}
          >
            {isSmall ? (
              <RoomMembersMobileList />
            ) : (
              <DatagridConfigurable sx={{ width: "100%" }} rowClick={id => "/users/" + id} bulkActionButtons={false}>
                <ReferenceField
                  label="resources.users.fields.avatar"
                  source="id"
                  reference="users"
                  sortable={false}
                  link=""
                >
                  <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
                </ReferenceField>
                <RaTextField source="id" sortable={false} label="resources.users.fields.id" sx={{ wordBreak: "break-all" }} />
                <ReferenceField
                  label="resources.users.fields.displayname"
                  source="id"
                  reference="users"
                  sortable={false}
                  link=""
                >
                  <RaTextField source="displayname" sortable={false} />
                </ReferenceField>
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
                <ReferenceField
                  label="resources.users.fields.locked"
                  source="id"
                  reference="users"
                  sortable={false}
                  link=""
                >
                  <BooleanField source="locked" label="resources.users.fields.locked" />
                </ReferenceField>
                <ReferenceField
                  label="resources.users.fields.erased"
                  source="id"
                  reference="users"
                  sortable={false}
                  link=""
                >
                  <BooleanField source="erased" sortable={false} label="resources.users.fields.erased" />
                </ReferenceField>
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </Tab>

        <Tab label="synapseadmin.rooms.tabs.media" icon={<PermMediaIcon />} path="media">
          <Alert severity="warning">{translate("resources.room_media.helper.info")}</Alert>
          <QuarantineRoomMediaButton />
          <ReferenceManyField
            reference="room_media"
            target="room_id"
            label={false}
            pagination={<Pagination />}
            perPage={10}
          >
            {isSmall ? (
              <SimpleList
                primaryText={() => (
                  <Box sx={{ wordBreak: "break-all" }}>
                    <MediaIDField source="media_id" />
                  </Box>
                )}
                tertiaryText={() => <DeleteButton mutationMode="pessimistic" redirect={false} />}
                linkType={false}
              />
            ) : (
              <DatagridConfigurable sx={{ width: "100%" }} bulkActionButtons={false}>
                <MediaIDField source="media_id" />
                <DeleteButton mutationMode="pessimistic" redirect={false} />
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </Tab>

        <Tab label={translate("resources.room_state.name", { smart_count: 2 })} icon={<EventIcon />} path="state">
          <ReferenceManyField
            reference="room_state"
            target="room_id"
            label={false}
            pagination={<Pagination />}
            perPage={10}
          >
            {isSmall ? (
              <SimpleList
                primaryText={record => record.type}
                secondaryText={record => (
                  <>
                    {record.origin_server_ts && new Date(record.origin_server_ts).toLocaleString(locale)}
                    {record.sender && (
                      <>
                        <br />
                        <Box component="span" sx={{ wordBreak: "break-all" }}>
                          {record.sender}
                        </Box>
                      </>
                    )}
                    <Box
                      component="pre"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        m: 0,
                        mt: 0.5,
                        p: 1,
                        fontSize: "0.75rem",
                        bgcolor: "action.hover",
                        borderRadius: 1,
                        overflow: "auto",
                        maxWidth: "100%",
                      }}
                    >
                      {JSON.stringify(record.content, null, 2)}
                    </Box>
                  </>
                )}
                linkType={false}
              />
            ) : (
              <DatagridConfigurable sx={{ width: "100%" }} bulkActionButtons={false}>
                <RaTextField source="type" sortable={false} />
                <DateField source="origin_server_ts" showTime options={DATE_FORMAT} sortable={false} locales={locale} />
                <FunctionField
                  source="content"
                  sortable={false}
                  render={record => `${JSON.stringify(record.content, null, 2)}`}
                />
                <ReferenceField source="sender" reference="users" sortable={false}>
                  <RaTextField source="id" sx={{ wordBreak: "break-all" }} />
                </ReferenceField>
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </Tab>

        <Tab label="synapseadmin.rooms.tabs.messages" icon={<MessageIcon />} path="messages">
          <RoomMessages />
        </Tab>

        <Tab label="synapseadmin.rooms.tabs.hierarchy" icon={<AccountTreeIcon />} path="hierarchy">
          <RoomHierarchy />
        </Tab>

        <Tab label="resources.forward_extremities.name" icon={<FastForwardIcon />} path="forward_extremities">
          <Box
            sx={{
              fontFamily: "Roboto, Helvetica, Arial, sans-serif",
              margin: "0.5em",
            }}
          >
            {translate("resources.rooms.helper.forward_extremities")}
          </Box>
          <ReferenceManyField
            reference="forward_extremities"
            target="room_id"
            label={false}
            pagination={<Pagination />}
            perPage={10}
          >
            {isSmall ? (
              <SimpleList
                primaryText={record => (
                  <Box component="span" sx={{ wordBreak: "break-all" }}>
                    {record.id}
                  </Box>
                )}
                secondaryText={record => (
                  <>
                    {record.received_ts && new Date(record.received_ts).toLocaleString(locale)}
                    {record.state_group && <> · {translate("resources.forward_extremities.fields.state_group")}: {record.state_group}</>}
                  </>
                )}
                linkType={false}
              />
            ) : (
              <DatagridConfigurable sx={{ width: "100%" }} bulkActionButtons={false} omit={["depth", "received_ts"]}>
                <RaTextField source="id" sortable={false} sx={{ wordBreak: "break-all" }} />
                <DateField source="received_ts" showTime options={DATE_FORMAT} sortable={false} locales={locale} />
                <NumberField source="depth" sortable={false} />
                <RaTextField source="state_group" sortable={false} />
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

export const RoomBulkActionButtons = () => {
  const record = useListContext();
  return (
    <>
      <BlockRoomBulkButton />
      <UnblockRoomBulkButton />
      <RoomDirectoryBulkPublishButton />
      <RoomDirectoryBulkUnpublishButton />
      <DeleteRoomButton
        selectedIds={record.selectedIds}
        confirmTitle="resources.rooms.action.erase.title"
        confirmContent="resources.rooms.action.erase.content"
      />
    </>
  );
};

const roomFilters = [
  <SearchInput key="search_term" source="search_term" alwaysOn />,
  <NullableBooleanInput key="public_rooms" source="public_rooms" label="resources.rooms.filter.public_rooms" />,
  <NullableBooleanInput key="empty_rooms" source="empty_rooms" label="resources.rooms.filter.empty_rooms" />,
];

const RoomListActions = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <TopToolbar>
      <FilterButton />
      <BlockRoomByIdButton />
      {!isSmall && <SelectColumnsButton />}
      <ExportButton />
    </TopToolbar>
  );
};

export const RoomList = (props: ListProps) => {
  const theme = useTheme();
  const translate = useTranslate();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.rooms.name", { smart_count: 2 }));

  return (
    <List
      {...props}
      pagination={<RoomPagination />}
      sort={{ field: "name", order: "ASC" }}
      filters={roomFilters}
      actions={<RoomListActions />}
      perPage={50}
      empty={<EmptyState />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => (
            <Box component="span" sx={{ wordBreak: "break-all" }}>
              {record.name || record.canonical_alias || record.id}
            </Box>
          )}
          secondaryText={record => (
            <>
              {translate("resources.rooms.fields.joined_members")}: {record.joined_members ?? 0}
              {record.creator && (
                <>
                  <br />
                  <Box component="span" sx={{ wordBreak: "break-all" }}>
                    {translate("resources.rooms.fields.creator")}: {record.creator}
                  </Box>
                </>
              )}
            </>
          )}
          tertiaryText={record => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {record.is_encrypted ? (
                <Tooltip title={translate("resources.rooms.fields.encryption")}>
                  <HttpsIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                </Tooltip>
              ) : (
                <Tooltip title={translate("resources.rooms.fields.encryption")}>
                  <NoEncryptionIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
                </Tooltip>
              )}
            </Box>
          )}
          linkType="show"
          leftAvatar={record => <AvatarField record={record} source="avatar_src" sx={{ height: "40px", width: "40px" }} />}
        />
      ) : (
      <DatagridConfigurable
        rowClick="show"
        bulkActionButtons={<RoomBulkActionButtons />}
        omit={["joined_local_members", "state_events", "version", "federatable", "join_rules"]}
      >
        <ReferenceField
          reference="rooms"
          source="id"
          label="resources.users.fields.avatar"
          link={false}
          sortable={false}
        >
          <AvatarField source="avatar" sx={{ height: "40px", width: "40px" }} />
        </ReferenceField>
        <RaTextField source="id" label="resources.rooms.fields.room_id" sortable={false} />
        <WrapperField source="encryption" sortBy="encryption" label="resources.rooms.fields.encryption">
          <BooleanField
            source="is_encrypted"
            sortBy="encryption"
            TrueIcon={HttpsIcon}
            FalseIcon={NoEncryptionIcon}
            label={<HttpsIcon />}
            sx={{
              [`& [data-testid="true"]`]: { color: theme.palette.success.main },
              [`& [data-testid="false"]`]: { color: theme.palette.error.main },
            }}
          />
        </WrapperField>
        <FunctionField
          source="name"
          sx={{
            wordBreak: "break-all",
          }}
          render={record => record["name"] || record["canonical_alias"] || record["id"]}
          label="resources.rooms.fields.name"
        />
        <RaTextField source="joined_members" label="resources.rooms.fields.joined_members" />
        <RaTextField source="joined_local_members" label="resources.rooms.fields.joined_local_members" />
        <RaTextField source="state_events" label="resources.rooms.fields.state_events" />
        <RaTextField source="version" label="resources.rooms.fields.version" />
        <RaTextField source="join_rules" label="resources.rooms.fields.join_rules" />
        <ReferenceField source="creator" reference="users">
          <RaTextField source="id" label="resources.rooms.fields.creator" sx={{ wordBreak: "break-all" }} />
        </ReferenceField>
        <BooleanField source="federatable" label="resources.rooms.fields.federatable" />
        <BooleanField source="public" label="resources.rooms.fields.public" />
        <WrapperField label="resources.rooms.fields.actions">
          <MakeAdminBtn />
        </WrapperField>
      </DatagridConfigurable>
      )}
    </List>
  );
};

const resource: ResourceProps = {
  name: "rooms",
  icon: RoomIcon,
  list: RoomList,
  show: RoomShow,
};

export default resource;
