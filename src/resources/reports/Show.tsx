import PageviewIcon from "@mui/icons-material/Pageview";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  DateField,
  DeleteButton,
  NumberField,
  ReferenceField,
  Show,
  ShowProps,
  Tab,
  TabbedShowLayout,
  TextField,
  TopToolbar,
  useLocale,
  useRecordContext,
  useTranslate,
} from "react-admin";

import AvatarField from "../../components/users/fields/AvatarField";
import { useDocTitle } from "../../components/hooks/useDocTitle";
import { DATE_FORMAT } from "../../utils/date";

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

const RoomInfoField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const parts = [record.id as string];
  if (record.canonical_alias) parts.push(record.canonical_alias as string);
  if (record.name) parts.push(record.name as string);
  return <span style={{ wordBreak: "break-all" }}>{parts.join(" ")}</span>;
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
                <TextField source="id" sx={{ wordBreak: "break-all" }} />
              </ReferenceField>
            </LabeledField>

            <LabeledField label={translate("resources.reports.fields.sender")}>
              <ReferenceField source="sender" reference="users" link="show" label={false}>
                <AvatarField source="avatar_src" sx={{ height: "40px", width: "40px" }} />
                <TextField source="id" sx={{ wordBreak: "break-all" }} />
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

export const ReportShow = (props: ShowProps) => {
  return (
    <Show
      {...props}
      actions={<ReportShowActions />}
      title={<ReportTitle />}
      sx={{ "& .RaShow-card": { maxWidth: { xs: "100vw", sm: "calc(100vw - 32px)" }, overflowX: "auto" } }}
    >
      <TabbedShowLayout sx={{ "& .MuiTabs-scroller": { overflowX: "auto !important" } }}>
        <Tab label="ketesa.reports.tabs.basic" icon={<ViewListIcon />}>
          <ReportBasicTab />
        </Tab>

        <Tab label="ketesa.reports.tabs.detail" icon={<PageviewIcon />} path="detail">
          <EventJsonField />
        </Tab>
      </TabbedShowLayout>
    </Show>
  );
};
