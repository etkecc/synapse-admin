import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Card, CardContent, CardHeader, Box } from "@mui/material";
import { Typography, Link } from "@mui/material";
import { useState, useEffect } from "react";
import {
  Form,
  TextInput,
  DateTimeInput,
  SaveButton,
  useNotify,
  useDataProvider,
  Loading,
  Button,
  BooleanInput,
  SelectInput,
} from "react-admin";
import { useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

import ScheduleDeleteButton from "./ScheduledDeleteButton";
import { useAppContext } from "../../../../../Context";
import { ScheduledCommand } from "../../../../../synapse/dataProvider";
import { useServerCommands } from "../../../hooks/useServerCommands";
import { useScheduledCommands } from "../../hooks/useScheduledCommands";

const transformCommandsToChoices = (commands: Record<string, any>) => {
  return Object.entries(commands).map(([key, value]) => ({
    id: key,
    name: value.name,
    description: value.description,
  }));
};

const ArgumentsField = ({ serverCommands }) => {
  const selectedCommand = useWatch({ name: "command" });
  const showArgs = selectedCommand && serverCommands[selectedCommand]?.args === true;

  if (!showArgs) return null;

  return <TextInput required source="args" label="Arguments" fullWidth multiline />;
};

const ScheduledCommandEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { etkeccAdmin } = useAppContext();
  const [command, setCommand] = useState<ScheduledCommand | null>(null);
  const isCreating = typeof id === "undefined";
  const [loading, setLoading] = useState(!isCreating);
  const { data: scheduledCommands, isLoading: isLoadingList } = useScheduledCommands();
  const { serverCommands, isLoading: isLoadingServerCommands } = useServerCommands();
  const pageTitle = isCreating ? "Create Scheduled Command" : "Edit Scheduled Command";

  const commandChoices = transformCommandsToChoices(serverCommands);

  useEffect(() => {
    if (!isCreating && scheduledCommands) {
      const commandToEdit = scheduledCommands.find(cmd => cmd.id === id);
      if (commandToEdit) {
        setCommand(commandToEdit);
      }
      setLoading(false);
    }
  }, [id, scheduledCommands, isCreating]);

  const handleSubmit = async data => {
    try {
      let result;

      data.scheduled_at = new Date(data.scheduled_at).toISOString();

      if (isCreating) {
        result = await dataProvider.createScheduledCommand(etkeccAdmin, data);
        notify("scheduled_commands.action.create_success", { type: "success" });
      } else {
        result = await dataProvider.updateScheduledCommand(etkeccAdmin, {
          ...data,
          id: id,
        });
        notify("scheduled_commands.action.update_success", { type: "success" });
      }

      navigate("/server_actions");
    } catch (error) {
      notify("scheduled_commands.action.update_failure", { type: "error" });
    }
  };

  if (loading || isLoadingList) {
    return <Loading />;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Button label="Back" onClick={() => navigate("/server_actions")} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} />

      <Card>
        <CardHeader title={pageTitle} />
        {command && (
          <Typography variant="body1" sx={{ px: 2 }}>
            You can find more details about the command{" "}
            <Link href={`https://etke.cc/help/extras/scheduler/#${command.command}`} target="_blank">
              here
            </Link>
            .
          </Typography>
        )}
        <CardContent>
          <Form
            defaultValues={command || undefined}
            onSubmit={handleSubmit}
            record={command || undefined}
            warnWhenUnsavedChanges
          >
            <Box display="flex" flexDirection="column" gap={2}>
              {command && <TextInput readOnly source="id" label="ID" fullWidth required />}
              <SelectInput
                readOnly={!isCreating}
                source="command"
                choices={commandChoices}
                label="Command"
                fullWidth
                required
              />
              <ArgumentsField serverCommands={serverCommands} />
              <DateTimeInput source="scheduled_at" label="Scheduled at" fullWidth required />
              <Box mt={2} display="flex" justifyContent="space-between">
                <SaveButton label={isCreating ? "Create" : "Update"} />
                {!isCreating && <ScheduleDeleteButton />}
              </Box>
            </Box>
          </Form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ScheduledCommandEdit;
