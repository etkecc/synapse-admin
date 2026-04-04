import AutorenewIcon from "@mui/icons-material/Autorenew";
import ErrorIcon from "@mui/icons-material/Error";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { get } from "lodash";
import { MouseEvent } from "react";
import {
  Button,
  DatagridConfigurable,
  DateField,
  DateFieldProps,
  FunctionField,
  ListProps,
  Pagination,
  RaRecord,
  ReferenceField,
  ReferenceManyField,
  SearchInput,
  Show,
  ShowProps,
  SimpleList,
  Tab,
  TabbedShowLayout,
  TextField,
  TopToolbar,
  useDelete,
  useLocale,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
} from "react-admin";
import List from "../../components/layout/List";

import EmptyState from "../../components/layout/EmptyState";
import { useDocTitle } from "../../components/hooks/useDocTitle";
import { DATE_FORMAT } from "../../utils/date";

const DestinationPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const destinationFilters = [<SearchInput source="destination" alwaysOn />];

export const DestinationReconnectButton = () => {
  const record = useRecordContext();
  const refresh = useRefresh();
  const notify = useNotify();
  const [handleReconnect, { isLoading }] = useDelete();

  // Reconnect is not required if no error has occurred. (`failure_ts`)
  if (!record || !record.failure_ts) return null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Prevents redirection to the detail page when clicking in the list
    e.stopPropagation();

    handleReconnect(
      "destinations",
      { id: record.id },
      {
        onSuccess: () => {
          notify("ra.notification.updated", {
            messageArgs: { smart_count: 1 },
          });
          refresh();
        },
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        onError: (error: any) => {
          notify(error?.message || "ra.message.error", { type: "error" });
        },
      }
    );
  };

  return (
    <Button label="resources.destinations.action.reconnect" onClick={handleClick} disabled={isLoading}>
      <AutorenewIcon />
    </Button>
  );
};

const DestinationShowActions = () => (
  <TopToolbar>
    <DestinationReconnectButton />
  </TopToolbar>
);

const DestinationTitle = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const text = `${translate("resources.destinations.name", 1)} ${record?.destination}`;
  useDocTitle(text);

  return <span>{text}</span>;
};

const RetryDateField = (props: DateFieldProps) => {
  const record = useRecordContext(props);
  if (props.source && get(record, props.source) === 0) {
    return <DateField {...props} record={{ ...record, [props.source]: null }} />;
  }
  return <DateField {...props} />;
};

const destinationFieldRender = (record: RaRecord) => {
  if (record.retry_last_ts > 0) {
    return (
      <>
        <ErrorIcon fontSize="inherit" color="error" sx={{ verticalAlign: "middle" }} />

        {record.destination}
      </>
    );
  }
  return <> {record.destination} </>;
};

export const DestinationList = (props: ListProps) => {
  const locale = useLocale();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.destinations.name", 2));
  return (
    <List
      {...props}
      filters={destinationFilters}
      pagination={<DestinationPagination />}
      sort={{ field: "destination", order: "ASC" }}
      perPage={50}
      empty={<EmptyState />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => (
            <Box component="span" sx={{ wordBreak: "break-all" }}>
              {record.destination}
            </Box>
          )}
          secondaryText={record =>
            record.failure_ts ? (
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                <ErrorIcon fontSize="inherit" color="error" />
                {translate("resources.destinations.fields.failure_ts")}:{" "}
                {new Date(record.failure_ts).toLocaleString(locale)}
              </Box>
            ) : null
          }
          tertiaryText={record => (record.failure_ts ? <DestinationReconnectButton /> : null)}
          rowClick={id => `${id}/show/rooms`}
        />
      ) : (
        <DatagridConfigurable rowClick={id => `${id}/show/rooms`} bulkActionButtons={false}>
          <FunctionField
            source="destination"
            render={destinationFieldRender}
            label="resources.destinations.fields.destination"
          />
          <DateField
            source="failure_ts"
            showTime
            options={DATE_FORMAT}
            label="resources.destinations.fields.failure_ts"
            locales={locale}
          />
          <RetryDateField
            source="retry_last_ts"
            showTime
            options={DATE_FORMAT}
            label="resources.destinations.fields.retry_last_ts"
            locales={locale}
          />
          <TextField source="retry_interval" label="resources.destinations.fields.retry_interval" />
          <TextField
            source="last_successful_stream_ordering"
            label="resources.destinations.fields.last_successful_stream_ordering"
          />
          <DestinationReconnectButton />
        </DatagridConfigurable>
      )}
    </List>
  );
};

export const DestinationShow = (props: ShowProps) => {
  const translate = useTranslate();
  const locale = useLocale();
  return (
    <Show
      actions={<DestinationShowActions />}
      title={<DestinationTitle />}
      {...props}
      sx={{ "& .RaShow-card": { maxWidth: { xs: "100vw", sm: "calc(100vw - 32px)" }, overflowX: "auto" } }}
    >
      <TabbedShowLayout sx={{ "& .MuiTabs-scroller": { overflowX: "auto !important" } }}>
        <Tab label="status" icon={<ViewListIcon />}>
          <TextField source="destination" />
          <DateField source="failure_ts" showTime options={DATE_FORMAT} locales={locale} />
          <DateField source="retry_last_ts" showTime options={DATE_FORMAT} locales={locale} />
          <TextField source="retry_interval" />
          <TextField source="last_successful_stream_ordering" />
        </Tab>

        <Tab label={translate("resources.rooms.name", { smart_count: 2 })} icon={<FolderSharedIcon />} path="rooms">
          <ReferenceManyField
            reference="destination_rooms"
            target="destination"
            label={false}
            pagination={<DestinationPagination />}
            perPage={50}
          >
            <DatagridConfigurable
              style={{ width: "100%" }}
              rowClick={id => `/rooms/${id}/show`}
              empty={<EmptyState resource="destination_rooms" />}
            >
              <TextField source="room_id" label="resources.rooms.fields.room_id" sx={{ wordBreak: "break-all" }} />
              <TextField source="stream_ordering" sortable={false} />
              <ReferenceField
                label="resources.rooms.fields.name"
                source="id"
                reference="rooms"
                sortable={false}
                link=""
              >
                <TextField source="name" sortable={false} />
              </ReferenceField>
            </DatagridConfigurable>
          </ReferenceManyField>
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};
