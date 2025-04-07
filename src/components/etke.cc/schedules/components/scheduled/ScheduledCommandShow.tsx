import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Box, Card, CardContent, CardHeader, Typography, Link } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Loading,
  Button,
  useDataProvider,
  useNotify,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  RecordContextProvider,
} from "react-admin";
import { useParams, useNavigate } from "react-router-dom";

import ScheduledDeleteButton from "./ScheduledDeleteButton";
import { useAppContext } from "../../../../../Context";
import { ScheduledCommand } from "../../../../../synapse/dataProvider";
import { useScheduledCommands } from "../../hooks/useScheduledCommands";

const ScheduledCommandShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { etkeccAdmin } = useAppContext();
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
    // notify("Command not found", { type: "error" });
    // navigate("/server_schedules");
    return null;
  }
  console.log(command);

  return (
    <Box sx={{ mt: 2 }}>
      <Button label="Back" onClick={() => navigate("/server_schedules")} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} />

      <RecordContextProvider value={command}>
        <Card>
          <CardHeader title="Scheduled Command Details" />
          <CardContent>
            {command && (
              <Alert severity="info">
                <Typography variant="body" sx={{ px: 2 }}>
                  You can find more details about the command{" "}
                  <Link href={`https://etke.cc/help/extras/scheduler/#${command.command}`} target="_blank">
                    here
                  </Link>
                  .
                </Typography>
              </Alert>
            )}
            <SimpleShowLayout>
              <TextField source="id" label="ID" />
              <TextField source="command" label="Command" />
              {command.args && <TextField source="args" label="Arguments" />}
              <BooleanField source="is_recurring" label="Is recurring" />
              <DateField source="scheduled_at" label="Scheduled at" showTime />
            </SimpleShowLayout>
            {command.is_recurring && (
              <Alert severity="warning">
                Scheduled commands created from a recurring one are not editable as they will be regenerated
                automatically. Please edit the recurring command instead.
              </Alert>
            )}
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
