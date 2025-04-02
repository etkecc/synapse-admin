import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import {
  SimpleForm,
  TextInput,
  DateTimeInput,
  SaveButton,
  useNotify,
  useDataProvider,
  Loading,
  Button,
} from "react-admin";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
} from "@mui/material";
import { useAppContext } from "../../../../Context";
import { useRecurringCommands } from "../hooks/useRecurringCommands";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RecurringCommandEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const { etkeccAdmin } = useAppContext();
  const [command, setCommand] = useState({
    command: "",
    args: "",
    time: "00:00",
    scheduled_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(id !== "create");
  const { data: recurringCommands, isLoading: isLoadingList } = useRecurringCommands();
  const isCreating = id === "create";
  const pageTitle = isCreating ? "Create Recurring Command" : "Edit Recurring Command";

  useEffect(() => {
    if (!isCreating && recurringCommands) {
      const commandToEdit = recurringCommands.find(cmd => cmd.id === id);
      if (commandToEdit) {
        setCommand(commandToEdit);
      }
      setLoading(false);
    }
  }, [id, recurringCommands, isCreating]);

  const handleSubmit = async (data) => {
    try {
      let result;

      if (isCreating) {
        result = await dataProvider.createRecurringCommand(etkeccAdmin, data);
        notify("Recurring command created successfully", { type: "success" });
      } else {
        result = await dataProvider.updateRecurringCommand(etkeccAdmin, {
          ...data,
          id: id,
        });
        notify("Recurring command updated successfully", { type: "success" });
      }

      navigate("/scheduler");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      notify(`Error: ${errorMessage}`, { type: "error" });
    }
  };

  if (loading || isLoadingList) {
    return <Loading />;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        label="Back"
        onClick={() => navigate("/scheduler")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      />

      <Card>
        <CardHeader title={pageTitle} />
        <CardContent>
          <SimpleForm
            onSubmit={handleSubmit}
            record={command}
            warnWhenUnsavedChanges
          >
            <Box display="flex" flexDirection="column" gap={2}>
              <TextInput source="command" label="Command" fullWidth required />
              <TextInput source="args" label="Arguments" fullWidth multiline />
              <TextInput source="time" label="Time (HH:MM in UTC)" fullWidth required />
              <DateTimeInput source="scheduled_at" label="Initial execution date and time" fullWidth required />
              <Box mt={2}>
                <SaveButton label={isCreating ? "Create" : "Update"} />
              </Box>
            </Box>
          </SimpleForm>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecurringCommandEdit;