import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DevicesIcon from "@mui/icons-material/Devices";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import GetAppIcon from "@mui/icons-material/GetApp";
import UserIcon from "@mui/icons-material/Group";
import LockClockIcon from "@mui/icons-material/LockClock";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import ScienceIcon from "@mui/icons-material/Science";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import ViewListIcon from "@mui/icons-material/ViewList";
import BlockIcon from "@mui/icons-material/Block";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LockIcon from "@mui/icons-material/Lock";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Alert, Box, Divider, List as MuiList, ListItemButton, Paper, Tooltip, Typography } from "@mui/material";
import EmptyState from "../components/EmptyState";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import {
  ArrayInput,
  ArrayField,
  Button,
  DatagridConfigurable,
  DateField,
  Create,
  CreateProps,
  Edit,
  EditProps,
  List,
  ListProps,
  SimpleForm,
  SimpleFormIterator,
  TabbedForm,
  FormTab,
  BooleanField,
  BooleanInput,
  NullableBooleanInput,
  PasswordInput,
  TextField,
  TextInput,
  ReferenceField,
  ReferenceManyField,
  ResourceProps,
  SearchInput,
  SelectInput,
  DeleteButton,
  maxLength,
  regex,
  required,
  useRecordContext,
  useTranslate,
  WrapperField,
  Pagination,
  SaveButton,
  CreateButton,
  ExportButton,
  BulkDeleteButton,
  TopToolbar,
  Toolbar,
  useListContext,
  useNotify,
  Identifier,
  ToolbarClasses,
  FunctionField,
  useDataProvider,
  Confirm,
  useCreate,
  useRedirect,
  useLocale,
  SimpleList,
  useGetMany,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";

import { MakeAdminBtn, RoomBulkActionButtons } from "./rooms";
import AvatarField from "../components/AvatarField";
import EditableAvatarField from "../components/EditableAvatarField";
import DeleteUserButton from "../components/DeleteUserButton";
import { AllowCrossSigningButton } from "../components/AllowCrossSigningButton";
import DeviceCreateButton from "../components/DeviceCreateButton";
import { RenewAccountValidityButton } from "../components/RenewAccountValidityButton";
import { useIsMAS } from "../providers/mas";
import DeviceDisplayNameInput from "../components/DeviceDisplayNameInput";
import DeviceRemoveButton, { DeviceBulkRemoveButton } from "../components/DeviceRemoveButton";
import ExperimentalFeaturesList from "../components/ExperimentalFeatures";
import { FindUserButton } from "../components/FindUserButton";
import { LoginAsUserButton } from "../components/LoginAsUserButton";
import { ResetPasswordButton } from "../components/ResetPasswordButton";
import { ServerNoticeButton, ServerNoticeBulkButton } from "../components/ServerNotices";
import UserAccountData from "../components/UserAccountData";
import UserInfoChips from "../components/UserCounts";
import UserRateLimits from "../components/UserRateLimits";
import { useDocTitle } from "../components/hooks/useDocTitle";
import { MediaIDField, ProtectMediaButton, QuarantineMediaButton } from "../components/media";
import { QuarantineUserMediaButton } from "../components/QuarantineAllMediaButton";
import { User, UsernameAvailabilityResult } from "../providers/types";
import { GetConfig } from "../utils/config";
import { DATE_FORMAT } from "../utils/date";
import { decodeURLComponent } from "../utils/safety";
import { isASManaged } from "../utils/mxid";
import { formatBytes } from "../utils/formatBytes";
import { generateRandomPassword } from "../utils/password";

const choices_medium = [
  { id: "email", name: "resources.users.email" },
  { id: "msisdn", name: "resources.users.msisdn" },
];

const choices_type = [
  { id: "bot", name: "bot" },
  { id: "support", name: "support" },
];

const UserListActions = () => {
  const { isLoading, total } = useListContext();
  return (
    <TopToolbar>
      <FindUserButton />
      <CreateButton />
      <ExportButton disabled={isLoading || total === 0} maxResults={10000} />
      <Button component={Link} to="/import_users" label="CSV Import">
        <GetAppIcon sx={{ transform: "rotate(180deg)", fontSize: "20px" }} />
      </Button>
    </TopToolbar>
  );
};

const UserPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const userFilters = () => {
  const filters = [
    <SearchInput source="name" alwaysOn />,
    <NullableBooleanInput
      label="resources.users.fields.show_deactivated"
      source="deactivated"
      nullLabel="resources.users.fields.filter_user_all"
      falseLabel="resources.users.fields.filter_deactivated_false"
      trueLabel="resources.users.fields.filter_deactivated_true"
      alwaysOn
    />,
    <NullableBooleanInput
      label="resources.users.fields.show_locked"
      source="locked"
      nullLabel="resources.users.fields.filter_user_all"
      falseLabel="resources.users.fields.filter_locked_false"
      trueLabel="resources.users.fields.filter_locked_true"
      alwaysOn
    />,
    // waiting for https://github.com/element-hq/synapse/issues/18016
    // <BooleanInput label="resources.users.fields.show_suspended" source="suspended" alwaysOn />,
    // as of Synapse v1.149.1, filter doesn't work yet, showing all users instead of only shadow banned ones
    // <BooleanInput label="resources.users.fields.show_shadow_banned" source="shadow_banned" alwaysOn />,
  ];
  if (!GetConfig().externalAuthProvider) {
    filters.push(
      <NullableBooleanInput
        label="resources.users.fields.show_guests"
        source="guests"
        nullLabel="resources.users.fields.filter_user_all"
        falseLabel="resources.users.fields.filter_guests_false"
        trueLabel="resources.users.fields.filter_guests_true"
        alwaysOn
      />
    );
  }
  return filters;
};

const UserPreventSelfDelete: React.FC<{
  children: React.ReactNode;
  ownUserIsSelected: boolean;
  asManagedUserIsSelected: boolean;
}> = props => {
  const ownUserIsSelected = props.ownUserIsSelected;
  const asManagedUserIsSelected = props.asManagedUserIsSelected;
  const notify = useNotify();
  const translate = useTranslate();

  const handleDeleteClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (ownUserIsSelected) {
      notify(<Alert severity="error">{translate("resources.users.helper.erase_admin_error")}</Alert>);
      ev.stopPropagation();
    } else if (asManagedUserIsSelected) {
      notify(<Alert severity="error">{translate("resources.users.helper.modify_managed_user_error")}</Alert>);
      ev.stopPropagation();
    }
  };

  return <div onClickCapture={handleDeleteClick}>{props.children}</div>;
};

const UserBulkActionButtons = () => {
  const record = useListContext();
  const [ownUserIsSelected, setOwnUserIsSelected] = useState(false);
  const [asManagedUserIsSelected, setAsManagedUserIsSelected] = useState(false);
  const selectedIds = record.selectedIds;
  const ownUserId = localStorage.getItem("user_id");

  useEffect(() => {
    setOwnUserIsSelected(selectedIds.includes(ownUserId));
    setAsManagedUserIsSelected(selectedIds.some(id => isASManaged(id)));
  }, [selectedIds, ownUserId]);

  return (
    <>
      <ServerNoticeBulkButton />
      <UserPreventSelfDelete ownUserIsSelected={ownUserIsSelected} asManagedUserIsSelected={asManagedUserIsSelected}>
        <DeleteUserButton
          selectedIds={selectedIds}
          confirmTitle="resources.users.helper.erase"
          confirmContent="resources.users.helper.erase_text"
        />
      </UserPreventSelfDelete>
    </>
  );
};

export const UserList = (props: ListProps) => {
  const locale = useLocale();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.users.name", { smart_count: 2 }));
  return (
    <List
      {...props}
      filters={userFilters()}
      filterDefaultValues={{ guests: false, locked: false, suspended: false }} // shadow_banned: no API yet
      sort={{ field: "name", order: "ASC" }}
      actions={<UserListActions />}
      pagination={<UserPagination />}
      perPage={50}
      empty={<EmptyState />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => (
            <Box component="span" sx={{ wordBreak: "break-all" }}>
              {record.displayname || record.id}
            </Box>
          )}
          secondaryText={record => (
            <Box component="span" sx={{ wordBreak: "break-all" }}>
              {record.id}
            </Box>
          )}
          tertiaryText={record => (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {record.admin && (
                <Tooltip title={translate("resources.users.fields.admin")}>
                  <AdminPanelSettingsIcon fontSize="small" color="primary" />
                </Tooltip>
              )}
              {record.locked && (
                <Tooltip title={translate("resources.users.fields.locked")}>
                  <LockIcon fontSize="small" color="warning" />
                </Tooltip>
              )}
              {record.suspended && (
                <Tooltip title={translate("resources.users.fields.suspended")}>
                  <BlockIcon fontSize="small" color="warning" />
                </Tooltip>
              )}
              {record.shadow_banned && (
                <Tooltip title={translate("resources.users.fields.shadow_banned")}>
                  <VisibilityOffIcon fontSize="small" color="warning" />
                </Tooltip>
              )}
              {record.deactivated && (
                <Tooltip title={translate("resources.users.fields.deactivated")}>
                  <NoAccountsIcon fontSize="small" color="error" />
                </Tooltip>
              )}
              {record.erased && (
                <Tooltip title={translate("resources.users.fields.erased")}>
                  <DeleteForeverIcon fontSize="small" color="error" />
                </Tooltip>
              )}
            </Box>
          )}
          linkType="edit"
          leftAvatar={record => (
            <AvatarField record={record} source="avatar_src" sx={{ height: "40px", width: "40px" }} />
          )}
        />
      ) : (
        <DatagridConfigurable
          rowClick={(id: Identifier, resource: string) => `/${resource}/${encodeURIComponent(id)}`}
          bulkActionButtons={<UserBulkActionButtons />}
        >
          <AvatarField
            source="avatar_src"
            sx={{ height: "40px", width: "40px" }}
            sortBy="avatar_url"
            label="resources.users.fields.avatar"
          />
          <TextField
            source="id"
            sx={{
              wordBreak: "break-all",
            }}
            sortBy="name"
            label="resources.users.fields.id"
          />
          <TextField
            source="displayname"
            sx={{
              wordBreak: "break-all",
            }}
            label="resources.users.fields.displayname"
          />
          <BooleanField source="is_guest" label="resources.users.fields.is_guest" />
          <BooleanField source="admin" label="resources.users.fields.admin" />
          <BooleanField source="deactivated" label="resources.users.fields.deactivated" />
          <BooleanField source="locked" label="resources.users.fields.locked" />
          <BooleanField source="shadow_banned" label="resources.users.fields.shadow_banned" />
          <BooleanField source="erased" sortable={false} label="resources.users.fields.erased" />
          <DateField
            source="creation_ts"
            label="resources.users.fields.creation_ts_ms"
            showTime
            options={DATE_FORMAT}
            locales={locale}
          />
        </DatagridConfigurable>
      )}
    </List>
  );
};

// https://matrix.org/docs/spec/appendices#user-identifiers
// here only local part of user_id
// maxLength = 255 - "@" - ":" - storage.getItem("home_server").length
// storage.getItem("home_server").length is not valid here
const validateUser = [required(), maxLength(253), regex(/^[a-z0-9._=\-+/]+$/, "synapseadmin.users.invalid_user_id")];

const validateAddress = [required(), maxLength(255)];

const UserEditActions = () => {
  const record = useRecordContext();
  const isMAS = useIsMAS();
  const ownUserId = localStorage.getItem("user_id");
  let ownUserIsSelected = false;
  let asManagedUserIsSelected = false;
  if (record && record.id) {
    ownUserIsSelected = record.id === ownUserId;
    asManagedUserIsSelected = isASManaged(record.id);
  }

  return (
    <TopToolbar sx={{ flexWrap: "wrap", gap: 0.5, whiteSpace: "normal" }}>
      {!record?.deactivated && <LoginAsUserButton />}
      {!record?.deactivated && <ResetPasswordButton />}
      {!record?.deactivated && <AllowCrossSigningButton />}
      {!record?.deactivated && !isMAS && <RenewAccountValidityButton />}
      {!record?.deactivated && <ServerNoticeButton />}
      {record && record.id && (
        <UserPreventSelfDelete ownUserIsSelected={ownUserIsSelected} asManagedUserIsSelected={asManagedUserIsSelected}>
          <DeleteUserButton
            selectedIds={[record?.id]}
            confirmTitle="resources.users.helper.erase"
            confirmContent="resources.users.helper.erase_text"
          />
        </UserPreventSelfDelete>
      )}
    </TopToolbar>
  );
};

export const UserCreate = (props: CreateProps) => {
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();
  const theme = useTheme();

  useDocTitle(translate("ra.action.create_item", { item: translate("resources.users.name") }));

  const [open, setOpen] = useState(false);
  const [userIsAvailable, setUserIsAvailable] = useState<boolean | undefined>();
  const [userAvailabilityEl, setUserAvailabilityEl] = useState<React.ReactElement | false>(
    <Typography component="span"></Typography>
  );
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [create] = useCreate();

  const checkAvailability = async (event: React.FocusEvent<HTMLInputElement>) => {
    const username = event.target.value;
    const result: UsernameAvailabilityResult = await dataProvider.checkUsernameAvailability(username);
    setUserIsAvailable(!!result?.available);
    if (result?.available) {
      setUserAvailabilityEl(
        <Typography component="span" variant="body2" sx={{ color: theme.palette.success.main }}>
          ✔️ {translate("resources.users.helper.username_available")}
        </Typography>
      );
    } else {
      setUserAvailabilityEl(
        <Typography component="span" variant="body2" sx={{ color: theme.palette.warning.main }}>
          ⚠️ {result?.error || "unknown error"}
        </Typography>
      );
    }
  };

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const postSave = (data: Record<string, any>) => {
    setFormData(data);
    if (!userIsAvailable) {
      setOpen(true);
      return;
    }

    create(
      "users",
      { data: data },
      {
        onSuccess: (resource: User) => {
          notify("ra.notification.created", { messageArgs: { smart_count: 1 } });
          redirect(() => {
            return `users/${encodeURIComponent(resource.id as string)}`;
          });
        },
      }
    );
  };

  const handleConfirm = () => {
    setOpen(false);
    updateUser();
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const updateUser = () => {
    create(
      "users",
      { data: formData },
      {
        onSuccess: (resource: User) => {
          notify("ra.notification.updated", { messageArgs: { smart_count: 1 } });
          redirect(() => {
            return `users/${encodeURIComponent(resource.id as string)}`;
          });
        },
      }
    );
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={postSave}>
        <TextInput
          source="id"
          autoComplete="off"
          validate={validateUser}
          onBlur={checkAvailability}
          helperText={userAvailabilityEl}
        />
        <TextInput source="displayname" validate={maxLength(256)} />
        <UserPasswordInput source="password" autoComplete="new-password" helperText="resources.users.helper.password" />
        <SelectInput source="user_type" choices={choices_type} translateChoice={false} resettable />
        <BooleanInput source="admin" />
        <ArrayInput source="threepids">
          <SimpleFormIterator disableReordering>
            <SelectInput source="medium" choices={choices_medium} validate={required()} />
            <TextInput source="address" validate={validateAddress} />
          </SimpleFormIterator>
        </ArrayInput>
        <ArrayInput source="external_ids" label="synapseadmin.users.tabs.sso">
          <SimpleFormIterator disableReordering>
            <TextInput source="auth_provider" validate={required()} />
            <TextInput source="external_id" label="resources.users.fields.id" validate={required()} />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
      <Confirm
        isOpen={open}
        title="resources.users.action.overwrite_title"
        content="resources.users.action.overwrite_content"
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="resources.users.action.overwrite_confirm"
        cancel="resources.users.action.overwrite_cancel"
      />
    </Create>
  );
};

const UserTitle = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const baseTitle = translate("resources.users.name", { smart_count: 1 });

  const username = record ? (record.displayname ? `${record.displayname} (${record.name})` : `${record.name}`) : "";
  const pageTitle = record ? `${baseTitle} ${username}` : baseTitle;
  useDocTitle(pageTitle);
  if (!record) {
    return null;
  }
  return (
    <span>
      {baseTitle} <AvatarField source="avatar_src" sx={{ height: "25px", width: "25px" }} /> {username}
    </span>
  );
};

const UserEditToolbar = () => {
  const record = useRecordContext();
  const ownUserId = localStorage.getItem("user_id");
  let ownUserIsSelected = false;
  let asManagedUserIsSelected = false;
  if (record && record.id) {
    ownUserIsSelected = record.id === ownUserId;
    asManagedUserIsSelected = isASManaged(record.id);
  }

  return (
    <>
      <div className={ToolbarClasses.defaultToolbar}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <SaveButton />
          <UserPreventSelfDelete
            ownUserIsSelected={ownUserIsSelected}
            asManagedUserIsSelected={asManagedUserIsSelected}
          >
            <DeleteButton />
          </UserPreventSelfDelete>
        </Toolbar>
      </div>
    </>
  );
};

const UserBooleanInput = props => {
  const translate = useTranslate();
  const record = useRecordContext();
  const ownUserId = localStorage.getItem("user_id");
  let ownUserIsSelected = false;
  let asManagedUserIsSelected = false;
  if (record) {
    ownUserIsSelected = record.id === ownUserId;
    asManagedUserIsSelected = isASManaged(record.id);
    if (["locked", "deactivated", "erased"].includes(props.source) && record[props.source]) {
      // we want to allow re-activating locked/deactivated/erased users even if they are AS managed
      asManagedUserIsSelected = false;
    }
  }

  const { icon, ...rest } = props;
  const label = icon ? (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
      {icon}
      {translate(rest.label || `resources.users.fields.${rest.source}`)}
    </Box>
  ) : undefined;

  return (
    <UserPreventSelfDelete ownUserIsSelected={ownUserIsSelected} asManagedUserIsSelected={asManagedUserIsSelected}>
      <BooleanInput disabled={ownUserIsSelected || asManagedUserIsSelected} {...rest} {...(label ? { label } : {})} />
    </UserPreventSelfDelete>
  );
};

const UserPasswordInput = props => {
  const record = useRecordContext();
  let asManagedUserIsSelected = false;
  const translate = useTranslate();

  // Get form context to update field value
  const form = useFormContext();
  if (record) {
    asManagedUserIsSelected = isASManaged(record.id);
  }

  const generatePassword = () => {
    const password = generateRandomPassword();
    form.setValue("password", password, { shouldDirty: true });
  };

  // Get the current deactivated state and the original value
  const deactivated = form.watch("deactivated");
  const deactivatedFromRecord = record?.deactivated;

  // Custom validation for reactivation case
  const validatePasswordOnReactivation = value => {
    if (deactivatedFromRecord === true && deactivated === false && !GetConfig().externalAuthProvider && !value) {
      return translate("resources.users.helper.password_required_for_reactivation");
    }
    return undefined;
  };

  let passwordHelperText = "resources.users.helper.create_password";

  if (asManagedUserIsSelected) {
    passwordHelperText = "resources.users.helper.modify_managed_user_error";
  } else if (deactivatedFromRecord === true && deactivated === false && !GetConfig().externalAuthProvider) {
    passwordHelperText = "resources.users.helper.password_required_for_reactivation";
  } else if (record) {
    passwordHelperText = "resources.users.helper.password";
  }

  return (
    <>
      <PasswordInput
        {...props}
        validate={validatePasswordOnReactivation}
        helperText={passwordHelperText}
        disabled={asManagedUserIsSelected}
      />
      <Button
        variant="outlined"
        label="resources.users.action.generate_password"
        onClick={generatePassword}
        sx={{ marginBottom: "10px" }}
        disabled={asManagedUserIsSelected}
      />
    </>
  );
};

const ErasedBooleanInput = props => {
  const record = useRecordContext();
  const form = useFormContext();
  const deactivated = form.watch("deactivated");
  const erased = form.watch("erased");

  const erasedFromRecord = record?.erased;
  const deactivatedFromRecord = record?.deactivated;

  useEffect(() => {
    // If the user was erased and deactivated, by unchecking Erased, we want to also uncheck Deactivated
    if (erasedFromRecord === true && erased === false) {
      form.setValue("deactivated", false);
    }
  }, [deactivatedFromRecord, erased, erasedFromRecord, form]);

  return <UserBooleanInput disabled={!deactivated} {...props} />;
};

const JoinedRoomsMobileList = () => {
  const { data: joinedRooms } = useListContext();
  const translate = useTranslate();
  const ids = (joinedRooms || []).map(r => r.id);
  const { data: rooms } = useGetMany("rooms", { ids }, { enabled: ids.length > 0 });
  const roomMap = new Map((rooms || []).map(r => [r.id, r]));

  if (!joinedRooms?.length) return null;

  return (
    <MuiList disablePadding>
      {joinedRooms.map(record => {
        const room = roomMap.get(record.id);
        return (
          <ListItemButton
            key={record.id as string}
            component={Link}
            to={"/rooms/" + record.id + "/show"}
            sx={{ gap: 1, alignItems: "center" }}
          >
            <AvatarField record={room || record} source="avatar" sx={{ height: "40px", width: "40px" }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                {room?.name || room?.canonical_alias || record.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {translate("resources.rooms.fields.joined_members")}: {room?.joined_members ?? 0}
                {room?.creator && (
                  <>
                    <br />
                    <Box component="span" sx={{ wordBreak: "break-all" }}>
                      {translate("resources.rooms.fields.creator")}: {room.creator}
                    </Box>
                  </>
                )}
              </Typography>
            </Box>
          </ListItemButton>
        );
      })}
    </MuiList>
  );
};

const MembershipsMobileList = () => {
  const { data: memberships } = useListContext();
  const translate = useTranslate();
  const ids = (memberships || []).map(r => r.id);
  const { data: rooms } = useGetMany("rooms", { ids }, { enabled: ids.length > 0 });
  const roomMap = new Map((rooms || []).map(r => [r.id, r]));

  if (!memberships?.length) return null;

  return (
    <MuiList disablePadding>
      {memberships.map(record => {
        const room = roomMap.get(record.id);
        return (
          <ListItemButton
            key={record.id as string}
            component={Link}
            to={"/rooms/" + record.id + "/show"}
            sx={{ gap: 1, alignItems: "center" }}
          >
            <AvatarField record={room || record} source="avatar" sx={{ height: "40px", width: "40px" }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                {room?.name || record.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {translate("resources.users.membership", { smart_count: 1 })}: {record.membership}
              </Typography>
            </Box>
          </ListItemButton>
        );
      })}
    </MuiList>
  );
};

export const UserEdit = (props: EditProps) => {
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const locale = useLocale();

  return (
    <Edit
      {...props}
      title={<UserTitle />}
      actions={<UserEditActions />}
      mutationMode="pessimistic"
      sx={{ "& .RaEdit-card": { maxWidth: { xs: "100vw", sm: "calc(100vw - 32px)" }, overflowX: "auto" } }}
      queryOptions={{
        meta: {
          include: ["features"], // Tell your dataProvider to include features
        },
      }}
    >
      <TabbedForm toolbar={<UserEditToolbar />} sx={{ "& .MuiTabs-scroller": { overflowX: "auto !important" } }}>
        <FormTab label={translate("resources.users.name", { smart_count: 1 })} icon={<PersonPinIcon />}>
          <Box
            sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 4, width: "100%", mb: 2, mt: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 140,
                gap: 2,
              }}
            >
              <EditableAvatarField source="avatar_src" />
              <UserInfoChips />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextInput source="id" readOnly fullWidth />
              <TextInput source="displayname" fullWidth />
              <SelectInput source="user_type" choices={choices_type} translateChoice={false} resettable fullWidth />
              <UserPasswordInput
                source="password"
                autoComplete="new-password"
                helperText="resources.users.helper.password"
              />
            </Box>
          </Box>

          <Divider sx={{ width: "100%", my: 2 }} />

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 4, width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <UserBooleanInput
                source="suspended"
                helperText="resources.users.helper.suspend"
                icon={<BlockIcon fontSize="small" />}
              />
              <UserBooleanInput
                source="shadow_banned"
                helperText="resources.users.helper.shadow_ban"
                icon={<VisibilityOffIcon fontSize="small" />}
              />
              <UserBooleanInput
                sx={{ color: theme.palette.warning.main }}
                source="locked"
                helperText="resources.users.helper.lock"
                icon={<LockIcon fontSize="small" />}
              />
            </Box>
            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                p: 2,
                borderColor: theme.palette.error.main,
                borderStyle: "dashed",
              }}
            >
              <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                {translate("synapseadmin.users.danger_zone")}
              </Typography>
              <UserBooleanInput
                source="admin"
                helperText="resources.users.helper.admin"
                icon={<AdminPanelSettingsIcon fontSize="small" />}
              />
              <UserBooleanInput
                sx={{ color: theme.palette.error.main }}
                source="deactivated"
                helperText="resources.users.helper.deactivate"
                icon={<NoAccountsIcon fontSize="small" />}
              />
              <ErasedBooleanInput
                sx={{ color: theme.palette.error.main, marginLeft: "25px" }}
                source="erased"
                helperText="resources.users.helper.erase"
                icon={<DeleteForeverIcon fontSize="small" />}
              />
            </Paper>
          </Box>
        </FormTab>

        <FormTab label="resources.users.threepid" icon={<ContactMailIcon />} path="threepid">
          <ArrayInput source="threepids">
            <SimpleFormIterator disableReordering>
              <SelectInput source="medium" choices={choices_medium} />
              <TextInput source="address" />
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>

        <FormTab label="synapseadmin.users.tabs.sso" icon={<AssignmentIndIcon />} path="sso">
          <ArrayInput source="external_ids" label={false}>
            <SimpleFormIterator disableReordering>
              <TextInput source="auth_provider" validate={required()} />
              <TextInput source="external_id" label="resources.users.fields.id" validate={required()} />
            </SimpleFormIterator>
          </ArrayInput>
        </FormTab>

        <FormTab label={translate("resources.devices.name", { smart_count: 2 })} icon={<DevicesIcon />} path="devices">
          <DeviceCreateButton />
          <ReferenceManyField
            reference="devices"
            target="user_id"
            label={false}
            pagination={<UserPagination />}
            perPage={10}
          >
            <Box sx={{ width: "100%" }}>
              {isSmall ? (
                <SimpleList
                  primaryText={record => (
                    <Box component="span" sx={{ wordBreak: "break-all" }}>
                      {record.device_id}
                    </Box>
                  )}
                  secondaryText={record => (
                    <>
                      {record.last_seen_ip && <>{record.last_seen_ip}<br /></>}
                      {record.last_seen_ts && new Date(record.last_seen_ts).toLocaleString(locale)}
                      <Box sx={{ mt: 1 }}>
                        <DeviceDisplayNameInput />
                      </Box>
                    </>
                  )}
                  tertiaryText={() => <DeviceRemoveButton />}
                  linkType={false}
                />
              ) : (
                <DatagridConfigurable
                  bulkActionButtons={<DeviceBulkRemoveButton />}
                  omit={["last_seen_user_agent", "dehydrated"]}
                >
                  <TextField source="device_id" sortable={false} />
                  <DeviceDisplayNameInput />
                  <TextField source="last_seen_ip" sortable={false} />
                  <TextField source="last_seen_user_agent" sortable={false} />
                  <DateField source="last_seen_ts" showTime options={DATE_FORMAT} sortable={false} locales={locale} />
                  <BooleanField source="dehydrated" sortable={false} />
                  <WrapperField label="resources.rooms.fields.actions">
                    <DeviceRemoveButton />
                  </WrapperField>
                </DatagridConfigurable>
              )}
            </Box>
          </ReferenceManyField>
        </FormTab>

        <FormTab label="resources.connections.name" icon={<SettingsInputComponentIcon />} path="connections">
          <ReferenceField reference="connections" source="id" label={false} link={false}>
            <ArrayField source="devices[].sessions[0].connections" label="resources.connections.name">
              {isSmall ? (
                <SimpleList
                  primaryText={record => record.ip}
                  secondaryText={record => (
                    <>
                      {record.last_seen && new Date(record.last_seen).toLocaleString(locale)}
                      {record.user_agent && (
                        <>
                          <br />
                          <Box component="span" sx={{ wordBreak: "break-all" }}>
                            {record.user_agent}
                          </Box>
                        </>
                      )}
                    </>
                  )}
                  linkType={false}
                />
              ) : (
                <DatagridConfigurable sx={{ width: "100%" }} bulkActionButtons={false}>
                  <TextField source="ip" sortable={false} />
                  <DateField source="last_seen" showTime options={DATE_FORMAT} sortable={false} locales={locale} />
                  <TextField source="user_agent" sortable={false} style={{ width: "100%" }} />
                </DatagridConfigurable>
              )}
            </ArrayField>
          </ReferenceField>
        </FormTab>

        <FormTab
          label={translate("resources.users_media.name", { smart_count: 2 })}
          icon={<PermMediaIcon />}
          path="media"
        >
          <QuarantineUserMediaButton />
          <ReferenceManyField
            reference="users_media"
            target="user_id"
            label={false}
            pagination={<UserPagination />}
            perPage={10}
            sort={{ field: "created_ts", order: "DESC" }}
          >
            {isSmall ? (
              <SimpleList
                primaryText={record => (
                  <Box component="span" sx={{ wordBreak: "break-all" }}>
                    {record.upload_name ? decodeURLComponent(record.upload_name) : record.media_id}
                  </Box>
                )}
                secondaryText={record => (
                  <>
                    {formatBytes(record.media_length)}
                    {record.media_type && <> · {record.media_type}</>}
                    <br />
                    {new Date(record.created_ts).toLocaleString(locale)}
                  </>
                )}
                tertiaryText={() => (
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <QuarantineMediaButton />
                    <ProtectMediaButton />
                    <DeleteButton mutationMode="pessimistic" redirect={false} />
                  </Box>
                )}
                linkType={false}
              />
            ) : (
              <DatagridConfigurable sx={{ width: "100%" }} bulkActionButtons={<BulkDeleteButton />}>
                <MediaIDField source="media_id" />
                <DateField source="created_ts" showTime options={DATE_FORMAT} locales={locale} />
                <DateField source="last_access_ts" showTime options={DATE_FORMAT} locales={locale} />
                <FunctionField source="media_length" render={record => formatBytes(record.media_length)} />
                <TextField source="media_type" sx={{ display: "block", width: 200, wordBreak: "break-word" }} />
                <FunctionField
                  source="upload_name"
                  render={record => (record.upload_name ? decodeURLComponent(record.upload_name) : "")}
                />
                <TextField source="quarantined_by" />
                <QuarantineMediaButton />
                <ProtectMediaButton />
                <DeleteButton mutationMode="pessimistic" redirect={false} />
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </FormTab>

        <FormTab label={translate("resources.rooms.name", { smart_count: 2 })} icon={<ViewListIcon />} path="rooms">
          <ReferenceManyField
            reference="joined_rooms"
            target="user_id"
            label={false}
            perPage={10}
            pagination={<Pagination />}
          >
            {isSmall ? (
              <JoinedRoomsMobileList />
            ) : (
              <DatagridConfigurable
                sx={{ width: "100%" }}
                rowClick={id => "/rooms/" + id + "/show"}
                bulkActionButtons={<RoomBulkActionButtons />}
              >
                <ReferenceField reference="rooms" source="id" label={false} link={false} sortable={false}>
                  <AvatarField source="avatar" sx={{ height: "40px", width: "40px" }} />
                </ReferenceField>
                <TextField source="id" label="resources.rooms.fields.room_id" sortable={false} sx={{ wordBreak: "break-all" }} />
                <ReferenceField
                  reference="rooms"
                  source="id"
                  label="resources.rooms.fields.name"
                  link={false}
                  sortable={false}
                >
                  <TextField
                    source="name"
                    sx={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  />
                </ReferenceField>
                <ReferenceField
                  reference="rooms"
                  source="id"
                  label="resources.rooms.fields.joined_members"
                  link={false}
                  sortable={false}
                >
                  <TextField source="joined_members" sortable={false} />
                </ReferenceField>
                <ReferenceField reference="rooms" source="id" label={false} link={false} sortable={false}>
                  <MakeAdminBtn />
                </ReferenceField>
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </FormTab>

        <FormTab
          label={translate("resources.users.membership", { smart_count: 2 })}
          icon={<FormatListBulletedIcon />}
          path="memberships"
        >
          <ReferenceManyField
            reference="memberships"
            target="user_id"
            label={false}
            perPage={10}
            pagination={<Pagination />}
          >
            {isSmall ? (
              <MembershipsMobileList />
            ) : (
              <DatagridConfigurable
                sx={{ width: "100%" }}
                rowClick={id => "/rooms/" + id + "/show"}
                bulkActionButtons={false}
              >
                <ReferenceField reference="rooms" source="id" label={false} link={false} sortable={false}>
                  <AvatarField source="avatar" sx={{ height: "40px", width: "40px" }} />
                </ReferenceField>
                <TextField source="id" label="resources.rooms.fields.room_id" sortable={false} sx={{ wordBreak: "break-all" }} />
                <ReferenceField
                  reference="rooms"
                  source="id"
                  label="resources.rooms.fields.name"
                  link={false}
                  sortable={false}
                >
                  <TextField source="name" />
                </ReferenceField>
                <TextField
                  source="membership"
                  label={translate("resources.users.membership", { smart_count: 1 })}
                  sortable={false}
                />
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </FormTab>

        <FormTab
          label={translate("resources.pushers.name", { smart_count: 2 })}
          icon={<NotificationsIcon />}
          path="pushers"
        >
          <ReferenceManyField
            reference="pushers"
            target="user_id"
            label={false}
            pagination={<Pagination />}
            perPage={10}
          >
            {isSmall ? (
              <SimpleList
                primaryText={record => (
                  <Box component="span" sx={{ wordBreak: "break-all" }}>
                    {record.app_display_name || record.app_id}
                  </Box>
                )}
                secondaryText={record => (
                  <>
                    {record.kind}
                    {record.device_display_name && <> · {record.device_display_name}</>}
                    {record.pushkey && (
                      <>
                        <br />
                        <Box component="span" sx={{ wordBreak: "break-all" }}>
                          {record.pushkey}
                        </Box>
                      </>
                    )}
                  </>
                )}
                linkType={false}
              />
            ) : (
              <DatagridConfigurable
                sx={{ width: "100%" }}
                bulkActionButtons={false}
                omit={["app_id", "data.url", "profile_tag", "pushkey"]}
              >
                <TextField source="kind" sortable={false} />
                <TextField source="app_display_name" sortable={false} />
                <TextField source="app_id" sortable={false} />
                <TextField source="data.url" sortable={false} />
                <TextField source="device_display_name" sortable={false} />
                <TextField source="lang" sortable={false} />
                <TextField source="profile_tag" sortable={false} />
                <TextField source="pushkey" sortable={false} />
              </DatagridConfigurable>
            )}
          </ReferenceManyField>
        </FormTab>

        <FormTab label="synapseadmin.users.tabs.experimental" icon={<ScienceIcon />} path="experimental">
          <ExperimentalFeaturesList />
        </FormTab>

        <FormTab label="synapseadmin.users.tabs.limits" icon={<LockClockIcon />} path="limits">
          <UserRateLimits />
        </FormTab>

        <FormTab label="synapseadmin.users.tabs.account_data" icon={<DocumentScannerIcon />} path="accountdata">
          <UserAccountData />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

const resource: ResourceProps = {
  name: "users",
  icon: UserIcon,
  list: UserList,
  edit: UserEdit,
  create: UserCreate,
};

export default resource;
