import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Card, CardContent, CardHeader, Box, Alert, Typography, Link } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Form,
  TextInput,
  SaveButton,
  useNotify,
  useDataProvider,
  Loading,
  Button,
  SelectInput,
  TimeInput,
} from "react-admin";
import { useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

import RecurringDeleteButton from "./RecurringDeleteButton";
import { useAppContext } from "../../../../../Context";
import { RecurringCommand } from "../../../../../synapse/dataProvider";
import { useServerCommands } from "../../../hooks/useServerCommands";
import { useRecurringCommands } from "../../hooks/useRecurringCommands";

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

const RecurringCommandEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();
  const { etkeccAdmin } = useAppContext();
  const [command, setCommand] = useState<RecurringCommand | undefined>(undefined);
  const isCreating = typeof id === "undefined";
  const [loading, setLoading] = useState(!isCreating);
  const { data: recurringCommands, isLoading: isLoadingList } = useRecurringCommands();
  const { serverCommands, isLoading: isLoadingServerCommands } = useServerCommands();
  const pageTitle = isCreating ? "Create Recurring Command" : "Edit Recurring Command";

  const commandChoices = transformCommandsToChoices(serverCommands);
  const dayOfWeekChoices = [
    { id: "Monday", name: "Monday" },
    { id: "Tuesday", name: "Tuesday" },
    { id: "Wednesday", name: "Wednesday" },
    { id: "Thursday", name: "Thursday" },
    { id: "Friday", name: "Friday" },
    { id: "Saturday", name: "Saturday" },
    { id: "Sunday", name: "Sunday" },
  ];

  useEffect(() => {
    if (!isCreating && recurringCommands) {
      const commandToEdit = recurringCommands.find(cmd => cmd.id === id);
      if (commandToEdit) {
        const timeValue = commandToEdit.time || "";
        const timeParts = timeValue.split(" ");

        const parsedCommand = {
          ...commandToEdit,
          day_of_week: timeParts.length > 1 ? timeParts[0] : "Monday",
          execution_time: timeParts.length > 1 ? timeParts[1] : timeValue,
        };

        setCommand(parsedCommand);
      }
      setLoading(false);
    }
  }, [id, recurringCommands, isCreating]);

  const handleSubmit = async data => {
    try {
      // Format the time from the Date object to a string in HH:MM format
      let formattedTime = "00:00";

      if (data.execution_time instanceof Date) {
        const hours = String(data.execution_time.getHours()).padStart(2, "0");
        const minutes = String(data.execution_time.getMinutes()).padStart(2, "0");
        formattedTime = `${hours}:${minutes}`;
      } else if (typeof data.execution_time === "string") {
        formattedTime = data.execution_time;
      }

      const submissionData = {
        ...data,
        time: `${data.day_of_week} ${formattedTime}`,
      };

      delete submissionData.day_of_week;
      delete submissionData.execution_time;
      delete submissionData.scheduled_at;

      // Only include args when it's required for the selected command
      const selectedCommand = data.command;
      if (!selectedCommand || !serverCommands[selectedCommand]?.args) {
        delete submissionData.args;
      }

      let result;

      if (isCreating) {
        result = await dataProvider.createRecurringCommand(etkeccAdmin, submissionData);
        notify("recurring_commands.action.create_success", { type: "success" });
      } else {
        result = await dataProvider.updateRecurringCommand(etkeccAdmin, {
          ...submissionData,
          id: id,
        });
        notify("recurring_commands.action.update_success", { type: "success" });
      }

      // Invalidate scheduled commands queries
      queryClient.invalidateQueries({ queryKey: ["scheduledCommands"] });

      navigate("/server_schedules");
    } catch (error) {
      notify("recurring_commands.action.update_failure", { type: "error" });
    }
  };

  if (loading || isLoadingList || isLoadingServerCommands) {
    return <Loading />;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Button label="Back" onClick={() => navigate("/server_schedules")} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} />

      <Card>
        <CardHeader title={pageTitle} />
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
          <Form
            defaultValues={command || undefined}
            onSubmit={handleSubmit}
            record={command || undefined}
            warnWhenUnsavedChanges
          >
            <Box display="flex" flexDirection="column" gap={2}>
              {!isCreating && <TextInput readOnly source="id" label="ID" fullWidth required />}
              <SelectInput source="command" choices={commandChoices} label="Command" fullWidth required />
              <ArgumentsField serverCommands={serverCommands} />
              <SelectInput source="day_of_week" choices={dayOfWeekChoices} label="Day of Week" fullWidth required />
              <TimeInput source="execution_time" label="Time" fullWidth required />
              <Box mt={2} display="flex" justifyContent="space-between">
                <SaveButton label={isCreating ? "Create" : "Update"} />
                {!isCreating && <RecurringDeleteButton />}
              </Box>
            </Box>
          </Form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecurringCommandEdit;
