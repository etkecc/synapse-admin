import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
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
  useRecordContext,
  Confirm,
} from "react-admin";
import { useTheme } from "@mui/material/styles";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
} from "@mui/material";
import { useAppContext } from "../../../../Context";
import { useScheduledCommands } from "../hooks/useScheduledCommands";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ScheduledCommand } from "../../../../synapse/dataProvider";
import DeleteIcon from "@mui/icons-material/Delete";

const CustomDeleteButton = () => {
  const record = useRecordContext() as ScheduledCommand;
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await dataProvider.deleteScheduledCommand(etkeccAdmin, record.id);
      notify("scheduled_commands.action.delete_success", { type: "success" });
      navigate("/scheduler_commands");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      notify(`Error: ${errorMessage}`, { type: "error" });
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        sx={{ color: theme.palette.error.main }}
        label="Delete"
        onClick={handleClick}
        disabled={isDeleting}
        startIcon={<DeleteIcon />}
      />
      <Confirm
        isOpen={open}
        title="Delete Scheduled Command"
        content={`Are you sure you want to delete the command: ${record?.command || ''}?`}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
    </>
  );
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
  const pageTitle = isCreating ? "Create Scheduled Command" : "Edit Scheduled Command";

  useEffect(() => {
    if (!isCreating && scheduledCommands) {
      const commandToEdit = scheduledCommands.find(cmd => cmd.id === id);
      if (commandToEdit) {
        setCommand(commandToEdit);
      }
      setLoading(false);
    }
  }, [id, scheduledCommands, isCreating]);

  const handleSubmit = async (data) => {
    try {
      let result;

      data.scheduled_at = new Date(data.scheduled_at).toISOString();

      console.log(data, isCreating);
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

      navigate("/scheduler_commands");
    } catch (error) {
      console.log("ERROR", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      notify("scheduled_commands.action.update_failure", { type: "error" });
    }
  };

  if (loading || isLoadingList) {
    return <Loading />;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        label="Back"
        onClick={() => navigate("/scheduler_commands")}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      />

      <Card>
        <CardHeader title={pageTitle} />
        <CardContent>
          <Form defaultValues={command || undefined} onSubmit={handleSubmit} record={command || undefined} warnWhenUnsavedChanges>
            <Box display="flex" flexDirection="column" gap={2}>
              {command && <TextInput readOnly source="id" label="ID" fullWidth required />}
              <TextInput readOnly={command !== null} source="command" label="Command" fullWidth required />
              <TextInput source="args" label="Arguments" fullWidth multiline />
              <BooleanInput source="is_recurring" label="Is recurring" />
              <DateTimeInput source="scheduled_at" label="Scheduled at" fullWidth required />
              <Box mt={2} display="flex" justifyContent="space-between">
                <SaveButton label={isCreating ? "Create" : "Update"} />
                {!isCreating && <CustomDeleteButton />}
              </Box>
            </Box>
          </Form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ScheduledCommandEdit;