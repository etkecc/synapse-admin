import SearchIcon from "@mui/icons-material/Search";
import AlertError from "@mui/icons-material/ErrorOutline";
import ActionCheck from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button as MuiButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField as MuiTextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import {
  Button,
  DatagridConfigurable,
  DateField,
  ListProps,
  Pagination,
  SimpleList,
  TextField,
  TopToolbar,
  useDataProvider,
  useLocale,
  useNotify,
  useTranslate,
} from "react-admin";

import EmptyState from "../../components/layout/EmptyState";
import List from "../../components/layout/List";
import { useDocTitle } from "../../components/hooks/useDocTitle";
import { SynapseDataProvider } from "../../providers/types";
import { DATE_FORMAT } from "../../utils/date";

const ReportPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

/* eslint-disable @typescript-eslint/no-explicit-any */
const EventFields = ({ event }: { event: Record<string, any> }) => (
  <Box
    component="pre"
    sx={{
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
      m: 0,
      p: 2,
      fontSize: { xs: "0.75rem", sm: "0.85rem" },
      bgcolor: "action.hover",
      borderRadius: 1,
      overflow: "auto",
      maxWidth: "100%",
    }}
  >
    {JSON.stringify(event, null, 4)}
  </Box>
);

const EventLookupButton = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;

  const handleClose = () => {
    setOpen(false);
    setEventId("");
    setResult(null);
    setError(null);
  };

  const handleFetch = async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const json = await dataProvider.fetchEvent(eventId);
      setResult(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      notify("resources.reports.action.fetch_event_error", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.reports.action.event_lookup.label" onClick={() => setOpen(true)}>
        <SearchIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.reports.action.event_lookup.title")}</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            fullWidth
            label={translate("resources.reports.fields.event_id")}
            value={eventId}
            onChange={e => setEventId(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            onKeyDown={e => {
              if (e.key === "Enter") handleFetch();
            }}
          />
          {loading && <CircularProgress size={24} />}
          {error && (
            <Typography color="error" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}
          {result && <EventFields event={result} />}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleClose} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleFetch}
            disabled={!eventId || loading}
            className="ra-confirm RaConfirm-confirmPrimary"
            startIcon={<ActionCheck />}
          >
            {translate("resources.reports.action.event_lookup.fetch")}
          </MuiButton>
        </DialogActions>
      </Dialog>
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
        <DatagridConfigurable rowClick="show" bulkActionButtons={false}>
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
        </DatagridConfigurable>
      )}
    </List>
  );
};
