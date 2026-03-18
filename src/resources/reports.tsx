import PageviewIcon from "@mui/icons-material/Pageview";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ReportIcon from "@mui/icons-material/Warning";
import AlertError from "@mui/icons-material/ErrorOutline";
import ActionCheck from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button as MuiButton,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
  DeleteButton,
  List,
  ListProps,
  NumberField,
  Pagination,
  ReferenceField,
  ResourceProps,
  Show,
  ShowProps,
  SimpleList,
  Tab,
  TabbedShowLayout,
  TextField,
  TopToolbar,
  useDataProvider,
  useLocale,
  useNotify,
  useRecordContext,
  useTranslate,
} from "react-admin";

import AvatarField from "../components/AvatarField";
import { useDocTitle } from "../components/hooks/useDocTitle";
import { SynapseDataProvider } from "../providers/types";
import { DATE_FORMAT } from "../utils/date";

const ReportPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]} />;

const RoomInfoField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const parts = [record.id as string];
  if (record.canonical_alias) parts.push(record.canonical_alias as string);
  if (record.name) parts.push(record.name as string);
  return <span>{parts.join(" ")}</span>;
};

const LabeledField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{children}</Box>
  </Box>
);

const ReportTitle = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const baseTitle = translate("resources.reports.name", { smart_count: 1 });
  const pageTitle = record ? `${baseTitle} #${record.id}` : baseTitle;
  useDocTitle(pageTitle);
  if (!record) return null;
  return <span>{pageTitle}</span>;
};

const ReportBasicTab = () => {
  const translate = useTranslate();
  const locale = useLocale();

  return (
    <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <LabeledField label={translate("resources.reports.fields.id")}>
              <NumberField source="id" label={false} />
            </LabeledField>
            <LabeledField label={translate("resources.reports.fields.received_ts")}>
              <DateField source="received_ts" showTime options={DATE_FORMAT} locales={locale} label={false} />
            </LabeledField>
            <LabeledField label={translate("resources.reports.fields.score")}>
              <NumberField source="score" label={false} />
            </LabeledField>
            <LabeledField label={translate("resources.reports.fields.reason")}>
              <TextField source="reason" label={false} />
            </LabeledField>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card variant="outlined" sx={{ height: "100%" }}>
          <CardContent>
            <LabeledField label={translate("resources.reports.fields.user_id")}>
              <ReferenceField source="user_id" reference="users" link="show" label={false}>
                <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
                <TextField source="id" />
              </ReferenceField>
            </LabeledField>

            <LabeledField label={translate("resources.reports.fields.sender")}>
              <ReferenceField source="sender" reference="users" link="show" label={false}>
                <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
                <TextField source="id" />
              </ReferenceField>
            </LabeledField>

            <LabeledField label={translate("resources.rooms.fields.room_id")}>
              <ReferenceField source="room_id" reference="rooms" link="show" label={false}>
                <AvatarField source="avatar" sx={{ height: "40px", width: "40px" }} />
                <RoomInfoField />
              </ReferenceField>
            </LabeledField>

            <LabeledField label={translate("resources.reports.fields.event_id")}>
              <TextField source="event_id" label={false} sx={{ wordBreak: "break-all" }} />
            </LabeledField>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const EventJsonField = () => {
  const record = useRecordContext();
  if (!record?.event_json) return null;
  return (
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
      {JSON.stringify(record.event_json, null, 4)}
    </Box>
  );
};

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

export const ReportShow = (props: ShowProps) => {
  return (
    <Show {...props} actions={<ReportShowActions />} title={<ReportTitle />}>
      <TabbedShowLayout>
        <Tab label="synapseadmin.reports.tabs.basic" icon={<ViewListIcon />}>
          <ReportBasicTab />
        </Tab>

        <Tab label="synapseadmin.reports.tabs.detail" icon={<PageviewIcon />} path="detail">
          <EventJsonField />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};

const ReportShowActions = () => {
  const record = useRecordContext();

  return (
    <TopToolbar>
      <DeleteButton
        record={record}
        mutationMode="pessimistic"
        confirmTitle="resources.reports.action.erase.title"
        confirmContent="resources.reports.action.erase.content"
      />
    </TopToolbar>
  );
};

const EventLookupButton = () => {
  const [open, setOpen] = useState(false);
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
    >
      {isSmall ? (
        <SimpleList
          primaryText={record => `#${record.id} ${record.name || record.room_id}`}
          secondaryText={record => {
            const date = new Date(record.received_ts).toLocaleDateString(locale, DATE_FORMAT);
            const score =
              record.score !== undefined ? ` · ${translate("resources.reports.fields.score")}: ${record.score}` : "";
            return `${date}${score}`;
          }}
          tertiaryText={record => {
            if (!record.user_id) return "";
            return record.user_id;
          }}
          linkType="show"
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

const resource: ResourceProps = {
  name: "reports",
  icon: ReportIcon,
  list: ReportList,
  show: ReportShow,
};

export default resource;
