import EventIcon from "@mui/icons-material/Event";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FastForwardIcon from "@mui/icons-material/FastForward";
import MessageIcon from "@mui/icons-material/Message";
import UserIcon from "@mui/icons-material/Group";
import HttpsIcon from "@mui/icons-material/Https";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import ViewListIcon from "@mui/icons-material/ViewList";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import MuiList from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  BooleanField,
  DatagridConfigurable,
  DateField,
  DeleteButton,
  FunctionField,
  Link,
  NumberField,
  Pagination,
  ReferenceField,
  ReferenceManyField,
  Show,
  ShowProps,
  SimpleList,
  Tab,
  TabbedShowLayout,
  TextField as RaTextField,
  TopToolbar,
  useGetMany,
  useListContext,
  useLocale,
  useRecordContext,
  useTranslate,
} from "react-admin";
import { RoomHierarchy } from "../../components/rooms/RoomHierarchy";
import { EventLookupDialog } from "../../components/rooms/EventLookupDialog";
import { RoomMessages } from "../../components/rooms/RoomMessages";
import AvatarField from "../../components/users/fields/AvatarField";
import { BlockRoomButton } from "../../components/users/buttons/BlockRoomButton";
import DeleteRoomButton from "../../components/users/buttons/DeleteRoomButton";
import { PurgeHistoryButton } from "../../components/users/buttons/PurgeHistoryButton";
import { QuarantineRoomMediaButton } from "../../components/users/buttons/QuarantineAllMediaButton";
import { DeleteRoomMediaButton } from "../../components/users/buttons/DeleteAllMediaButton";
import { useDocTitle } from "../../components/hooks/useDocTitle";
import { MediaIDField } from "../../components/media";
import { DATE_FORMAT } from "../../utils/date";
import { tt } from "../../utils/safety";
import EmptyState from "../../components/layout/EmptyState";
import { RoomDirectoryUnpublishButton, RoomDirectoryPublishButton } from "../room-directory";
import { MakeAdminBtn, JoinUserBtn, RoomPagination } from "./List";

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
      {baseTitle} <AvatarField source="avatar" sx={{ height: "25px", width: "25px" }} /> {name}
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
              {translate("ketesa.rooms.tabs.detail")}
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
              {translate("ketesa.rooms.tabs.permission")}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.join_rules")}
                </Typography>
                <Typography variant="body2">
                  {record.join_rules
                    ? tt(translate, `resources.rooms.enums.join_rules.${record.join_rules}`, record.join_rules)
                    : "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.guest_access")}
                </Typography>
                <Typography variant="body2">
                  {record.guest_access
                    ? tt(translate, `resources.rooms.enums.guest_access.${record.guest_access}`, record.guest_access)
                    : "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.history_visibility")}
                </Typography>
                <Typography variant="body2">
                  {record.history_visibility
                    ? tt(
                        translate,
                        `resources.rooms.enums.history_visibility.${record.history_visibility}`,
                        record.history_visibility
                      )
                    : "—"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.fields.creator")}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                  <ReferenceField source="creator" reference="users" link="show">
                    <RaTextField source="id" />
                  </ReferenceField>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

const ClickableEventId = ({ eventId, onClick }: { eventId: string; onClick: (eventId: string) => void }) => (
  <Box
    component="button"
    type="button"
    onClick={() => onClick(eventId)}
    sx={{
      all: "unset",
      cursor: "pointer",
      color: "primary.main",
      textDecoration: "underline",
      wordBreak: "break-all",
    }}
  >
    {eventId}
  </Box>
);

const ForwardExtremitiesTab = () => {
  const translate = useTranslate();
  const locale = useLocale();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [lookupEventId, setLookupEventId] = useState<string | null>(null);

  return (
    <>
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
            empty={<EmptyState resource="forward_extremities" />}
            primaryText={record => <ClickableEventId eventId={record.id} onClick={setLookupEventId} />}
            secondaryText={record => (
              <>
                {record.received_ts && new Date(record.received_ts).toLocaleString(locale)}
                {record.state_group && (
                  <>
                    {" "}
                    · {translate("resources.forward_extremities.fields.state_group")}: {record.state_group}
                  </>
                )}
              </>
            )}
            rowClick={false}
          />
        ) : (
          <DatagridConfigurable
            sx={{ width: "100%" }}
            bulkActionButtons={false}
            omit={["depth", "received_ts"]}
            empty={<EmptyState resource="forward_extremities" />}
          >
            <FunctionField
              source="id"
              sortable={false}
              render={record => <ClickableEventId eventId={record.id} onClick={setLookupEventId} />}
            />
            <DateField source="received_ts" showTime options={DATE_FORMAT} sortable={false} locales={locale} />
            <NumberField source="depth" sortable={false} />
            <RaTextField source="state_group" sortable={false} />
          </DatagridConfigurable>
        )}
      </ReferenceManyField>
      <EventLookupDialog
        open={!!lookupEventId}
        onClose={() => setLookupEventId(null)}
        initialEventId={lookupEventId ?? undefined}
      />
    </>
  );
};

const RoomStateTab = () => {
  const locale = useLocale();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [lookupEventId, setLookupEventId] = useState<string | null>(null);

  return (
    <>
      <ReferenceManyField
        reference="room_state"
        target="room_id"
        label={false}
        pagination={<Pagination />}
        perPage={10}
      >
        {isSmall ? (
          <SimpleList
            empty={<EmptyState resource="room_state" />}
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
            rowClick={id => {
              setLookupEventId(String(id));
              return false;
            }}
          />
        ) : (
          <DatagridConfigurable
            sx={{ width: "100%" }}
            bulkActionButtons={false}
            empty={<EmptyState resource="room_state" />}
            rowClick={id => {
              setLookupEventId(String(id));
              return false;
            }}
          >
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
      <EventLookupDialog
        open={!!lookupEventId}
        onClose={() => setLookupEventId(null)}
        initialEventId={lookupEventId ?? undefined}
      />
    </>
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

const RoomShowLayout = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isSpace = record?.room_type === "m.space";
  const [localMembersOnly, setLocalMembersOnly] = useState(false);

  return (
    <TabbedShowLayout sx={{ "& .MuiTabs-scroller": { overflowX: "auto !important" } }}>
      <Tab label="ketesa.rooms.tabs.basic" icon={<ViewListIcon />}>
        <RoomOverviewTab />
      </Tab>

      <Tab label="ketesa.rooms.tabs.members" icon={<UserIcon />} path="members">
        <MakeAdminBtn />
        <Box sx={{ px: 2, pt: 1 }}>
          <FormControlLabel
            control={
              <Switch checked={localMembersOnly} onChange={e => setLocalMembersOnly(e.target.checked)} size="small" />
            }
            label={translate("resources.rooms.filter.local_members_only")}
          />
        </Box>
        <ReferenceManyField
          reference="room_members"
          target="room_id"
          label={false}
          perPage={10}
          pagination={<RoomPagination />}
          filter={{ localOnly: localMembersOnly }}
        >
          {isSmall ? (
            <RoomMembersMobileList />
          ) : (
            <DatagridConfigurable
              sx={{ width: "100%" }}
              rowClick={id => "/users/" + id}
              bulkActionButtons={false}
              empty={<EmptyState resource="room_members" />}
            >
              <ReferenceField
                label="resources.users.fields.avatar"
                source="id"
                reference="users"
                sortable={false}
                link=""
              >
                <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
              </ReferenceField>
              <RaTextField
                source="id"
                sortable={false}
                label="resources.users.fields.id"
                sx={{ wordBreak: "break-all" }}
              />
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

      <Tab label="ketesa.rooms.tabs.media" icon={<PermMediaIcon />} path="media">
        <Alert severity="warning">{translate("resources.room_media.helper.info")}</Alert>
        <QuarantineRoomMediaButton />
        <DeleteRoomMediaButton />
        <ReferenceManyField
          reference="room_media"
          target="room_id"
          label={false}
          pagination={<Pagination />}
          perPage={10}
        >
          {isSmall ? (
            <SimpleList
              empty={<EmptyState resource="room_media" />}
              primaryText={() => (
                <Box sx={{ wordBreak: "break-all" }}>
                  <MediaIDField source="media_id" />
                </Box>
              )}
              tertiaryText={() => <DeleteButton mutationMode="pessimistic" redirect={false} />}
              rowClick={false}
            />
          ) : (
            <DatagridConfigurable
              sx={{ width: "100%" }}
              bulkActionButtons={false}
              empty={<EmptyState resource="room_media" />}
            >
              <MediaIDField source="media_id" />
              <DeleteButton mutationMode="pessimistic" redirect={false} />
            </DatagridConfigurable>
          )}
        </ReferenceManyField>
      </Tab>

      <Tab label={translate("resources.room_state.name", { smart_count: 2 })} icon={<EventIcon />} path="state">
        <RoomStateTab />
      </Tab>

      <Tab label="ketesa.rooms.tabs.messages" icon={<MessageIcon />} path="messages">
        <RoomMessages />
      </Tab>

      {isSpace && (
        <Tab label="ketesa.rooms.tabs.hierarchy" icon={<AccountTreeIcon />} path="hierarchy">
          <RoomHierarchy />
        </Tab>
      )}

      <Tab label="resources.forward_extremities.name" icon={<FastForwardIcon />} path="forward_extremities">
        <ForwardExtremitiesTab />
      </Tab>
    </TabbedShowLayout>
  );
};

export const RoomShow = (props: ShowProps) => {
  return (
    <Show
      {...props}
      actions={<RoomShowActions />}
      title={<RoomTitle />}
      sx={{ "& .RaShow-card": { maxWidth: { xs: "100vw", sm: "calc(100vw - 32px)" }, overflowX: "auto" } }}
    >
      <RoomShowLayout />
    </Show>
  );
};
