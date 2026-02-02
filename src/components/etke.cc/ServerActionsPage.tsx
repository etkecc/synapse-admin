import RestoreIcon from "@mui/icons-material/Restore";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Box, Typography, Link, Stack } from "@mui/material";
import { Title, useTranslate } from "react-admin";

import CurrentlyRunningCommand from "./CurrentlyRunningCommand";
import { EtkeAttribution } from "./EtkeAttribution";
import ServerCommandsPanel from "./ServerCommandsPanel";
import { useDocTitle } from "../hooks/useDocTitle";
import RecurringCommandsList from "./schedules/components/recurring/RecurringCommandsList";
import ScheduledCommandsList from "./schedules/components/scheduled/ScheduledCommandsList";

const ServerActionsPage = () => {
  const translate = useTranslate();
  useDocTitle(translate("etkecc.actions.name"));

  return (
    <>
      <Title title={translate("etkecc.actions.name")} />
      <Stack spacing={3} mt={3}>
        <Stack direction="column">
          <CurrentlyRunningCommand />
          <ServerCommandsPanel />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">
            <ScheduleIcon sx={{ verticalAlign: "middle", mr: 1 }} /> {translate("etkecc.actions.scheduled_title")}
          </Typography>
          <Typography variant="body1">{translate("etkecc.actions.scheduled_description")}</Typography>
          <EtkeAttribution>
            <Typography>
              {translate("etkecc.actions.scheduled_help_intro")}{" "}
              <Link href="https://etke.cc/help/extras/scheduler/#schedule" target="_blank">
                etke.cc/help/extras/scheduler/#schedule
              </Link>
              .
            </Typography>
          </EtkeAttribution>
          <ScheduledCommandsList />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">
            <RestoreIcon sx={{ verticalAlign: "middle", mr: 1 }} /> {translate("etkecc.actions.recurring_title")}
          </Typography>
          <Typography variant="body1">{translate("etkecc.actions.recurring_description")}</Typography>
          <EtkeAttribution>
            <Typography>
              {translate("etkecc.actions.recurring_help_intro")}{" "}
              <Link href="https://etke.cc/help/extras/scheduler/#recurring" target="_blank">
                etke.cc/help/extras/scheduler/#recurring
              </Link>
              .
            </Typography>
          </EtkeAttribution>
          <RecurringCommandsList />
        </Box>
      </Stack>
    </>
  );
};

export default ServerActionsPage;
