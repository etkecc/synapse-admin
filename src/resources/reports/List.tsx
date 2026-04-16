import SearchIcon from "@mui/icons-material/Search";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import {
  Button,
  DateField,
  ListProps,
  Pagination,
  SimpleList,
  TextField,
  TopToolbar,
  useLocale,
  useTranslate,
} from "react-admin";

import { EventLookupDialog } from "../../components/rooms/EventLookupDialog";
import { useDocTitle } from "../../components/hooks/useDocTitle";
import { DATE_FORMAT } from "../../utils/date";
import { Datagrid, EmptyState, List } from "../../components/layout";

const ReportPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const EventLookupButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="resources.reports.action.event_lookup.label" onClick={() => setOpen(true)}>
        <SearchIcon />
      </Button>
      <EventLookupDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const ReportListActions = () => (
  <TopToolbar>
    <EventLookupButton />
  </TopToolbar>
);

const ellipsisSx = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as const;

export const ReportList = (props: ListProps) => {
  const locale = useLocale();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useDocTitle(translate("resources.reports.name", { smart_count: 2 }));
  return (
    <List
      {...props}
      pagination={<ReportPagination />}
      perPage={50}
      sort={{ field: "received_ts", order: "DESC" }}
      actions={<ReportListActions />}
      empty={<EmptyState />}
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => (
            <Box component="span" sx={{ wordBreak: "break-all" }}>
              #{record.id} {record.name || record.room_id}
            </Box>
          )}
          secondaryText={record => {
            const date = new Date(record.received_ts).toLocaleDateString(locale, DATE_FORMAT);
            const score =
              record.score !== undefined ? ` · ${translate("resources.reports.fields.score")}: ${record.score}` : "";
            return `${date}${score}`;
          }}
          tertiaryText={record => {
            if (!record.user_id) return "";
            return (
              <Box component="span" sx={{ wordBreak: "break-all" }}>
                {record.user_id}
              </Box>
            );
          }}
          rowClick="show"
        />
      ) : (
        <Datagrid
          rowLabel={record => `#${record.id} ${record.name || record.room_id || ""}`.trim()}
          rowClick="show"
          bulkActionButtons={false}
        >
          <TextField source="id" sortable={false} label="resources.reports.fields.id" />
          <DateField
            source="received_ts"
            showTime
            options={DATE_FORMAT}
            sortable={true}
            label="resources.reports.fields.received_ts"
            locales={locale}
          />
          <TextField
            sortable={false}
            source="user_id"
            label="resources.reports.fields.user_id"
            sx={{ ...ellipsisSx, maxWidth: "200px", display: "inline-block" }}
          />
          <TextField
            sortable={false}
            source="name"
            label="resources.reports.fields.name"
            sx={{ ...ellipsisSx, maxWidth: "200px", display: "inline-block" }}
          />
          <TextField sortable={false} source="score" label="resources.reports.fields.score" />
        </Datagrid>
      )}
    </List>
  );
};
