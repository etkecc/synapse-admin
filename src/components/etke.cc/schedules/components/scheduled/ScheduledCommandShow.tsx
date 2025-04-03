import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Alert, Box, Card, CardContent, CardHeader } from "@mui/material";
import { useAppContext } from "../../../../../Context";
import { useScheduledCommands } from "../../hooks/useScheduledCommands";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ScheduledCommand } from "../../../../../synapse/dataProvider";
import ScheduledDeleteButton from "./ScheduledDeleteButton";

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

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        label="Back"
        onClick={() => navigate("/server_schedules")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      />

      <RecordContextProvider value={command}>
        <Card>
          <CardHeader title="Scheduled Command Details" />
          <CardContent>
            <SimpleShowLayout>
              <TextField source="id" label="ID" />
              <TextField source="command" label="Command" />
              <TextField source="args" label="Arguments" />
              <BooleanField source="is_recurring" label="Is recurring" />
              <DateField source="scheduled_at" label="Scheduled at" showTime />
            </SimpleShowLayout>
            <Alert severity="warning">Recurring commands are not editable as they will be regenerated on the next run.</Alert>
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