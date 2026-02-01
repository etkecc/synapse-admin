import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Box, Card, CardContent, CardHeader, Typography, Link } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Loading,
  Button,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  RecordContextProvider,
  useLocale,
  useTranslate,
} from "react-admin";
import { useParams, useNavigate } from "react-router-dom";

import ScheduledDeleteButton from "./ScheduledDeleteButton";
import { ScheduledCommand } from "../../../../../synapse/dataProvider";
import { EtkeAttribution } from "../../../EtkeAttribution";
import { useScheduledCommands } from "../../hooks/useScheduledCommands";

const ScheduledCommandShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const locale = useLocale();
  const translate = useTranslate();
  const [command, setCommand] = useState<ScheduledCommand | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: scheduledCommands, isLoading: isLoadingList } = useScheduledCommands();

  useEffect(() => {
    if (scheduledCommands) {
      const commandToShow = scheduledCommands.find(cmd => cmd.id === id);
      if (commandToShow) {
        setCommand(commandToShow);
      }
      setLoading(false);
    }
  }, [id, scheduledCommands]);

  if (loading || isLoadingList) {
    return <Loading />;
  }

  if (!command) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        label={translate("etkecc.actions.buttons.back")}
        onClick={() => navigate("/server_actions")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      />

      <RecordContextProvider value={command}>
        <Card>
          <CardHeader title={translate("etkecc.actions.scheduled_details_title")} />
          <CardContent>
            {command && (
              <EtkeAttribution>
                <Alert severity="info">
                  <Typography variant="body1" sx={{ px: 2 }}>
                    {translate("etkecc.actions.command_details_intro")}{" "}
                    <Link href={`https://etke.cc/help/extras/scheduler/#${command.command}`} target="_blank">
                      {`etke.cc/help/extras/scheduler/#${command.command}`}
                    </Link>
                    .
                  </Typography>
                </Alert>
              </EtkeAttribution>
            )}
            <SimpleShowLayout>
              <TextField source="id" label={translate("etkecc.actions.form.id")} />
              <TextField source="command" label={translate("etkecc.actions.form.command")} />
              {command.args && <TextField source="args" label={translate("etkecc.actions.table.arguments")} />}
              <BooleanField source="is_recurring" label={translate("etkecc.actions.table.is_recurring")} />
              <DateField
                source="scheduled_at"
                label={translate("etkecc.actions.form.scheduled_at")}
                showTime
                locales={locale}
              />
            </SimpleShowLayout>
            {command.is_recurring && <Alert severity="warning">{translate("etkecc.actions.recurring_warning")}</Alert>}
          </CardContent>
        </Card>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <ScheduledDeleteButton />
        </Box>
      </RecordContextProvider>
    </Box>
  );
};

export default ScheduledCommandShow;
