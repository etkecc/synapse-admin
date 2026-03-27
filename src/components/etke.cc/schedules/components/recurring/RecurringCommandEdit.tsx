import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Card, CardContent, CardHeader, Box, Alert, Autocomplete, TextField, Typography, Link } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Form,
  TextInput,
  SaveButton,
  useNotify,
  useDataProvider,
  useLocale,
  Loading,
  Button,
  SelectInput,
  TimeInput,
  useParams,
  useRedirect,
  useTranslate,
  Title,
} from "react-admin";
import { useWatch, useFormContext } from "react-hook-form";

import RecurringDeleteButton from "./RecurringDeleteButton";
import { useAppContext } from "../../../../../Context";
import { RecurringCommand } from "../../../../../providers/types";
import { useDocTitle } from "../../../../hooks/useDocTitle";
import { EtkeAttribution } from "../../../EtkeAttribution";
import { useServerCommands } from "../../../hooks/useServerCommands";
import { useUnits } from "../../../hooks/useUnits";
import { useRecurringCommands } from "../../hooks/useRecurringCommands";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const transformCommandsToChoices = (commands: Record<string, any>) => {
  return Object.entries(commands).map(([key, value]) => ({
    id: key,
    name: value.name,
    description: value.description,
  }));
};

const ArgumentsField = ({ serverCommands, units }) => {
  const translate = useTranslate();
  const { setValue } = useFormContext();
  const selectedCommand = useWatch({ name: "command" });
  const argsValue = useWatch({ name: "args" });
  const showArgs = selectedCommand && serverCommands[selectedCommand]?.args === true;

  if (!showArgs) return null;

  if (selectedCommand === "restart") {
    return (
      <Autocomplete
        freeSolo
        options={Object.keys(units)}
        inputValue={argsValue || ""}
        onInputChange={(_e, value) => {
          setValue("args", units[value] || value, { shouldDirty: true });
        }}
        renderInput={params => (
          <TextField {...params} label={translate("etkecc.actions.table.arguments")} required fullWidth />
        )}
      />
    );
  }

  return <TextInput required source="args" label={translate("etkecc.actions.table.arguments")} fullWidth multiline />;
};

const RecurringCommandEdit = () => {
  const { id } = useParams();
  const navigate = useRedirect();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const queryClient = useQueryClient();
  const locale = useLocale();
  const translate = useTranslate();
  const { etkeccAdmin } = useAppContext();
  const [command, setCommand] = useState<RecurringCommand | undefined>(undefined);
  const isCreating = typeof id === "undefined";
  const [loading, setLoading] = useState(!isCreating);
  const { data: recurringCommands, isLoading: isLoadingList } = useRecurringCommands();
  const { serverCommands, isLoading: isLoadingServerCommands } = useServerCommands();
  const { units } = useUnits();
  const pageTitle = isCreating
    ? translate("etkecc.actions.recurring_title_create")
    : translate("etkecc.actions.recurring_title_edit");
  useDocTitle(pageTitle);

  const commandChoices = transformCommandsToChoices(serverCommands);
  const dayOfWeekChoices = [
    { id: "Monday", name: translate("etkecc.actions.days.monday") },
    { id: "Tuesday", name: translate("etkecc.actions.days.tuesday") },
    { id: "Wednesday", name: translate("etkecc.actions.days.wednesday") },
    { id: "Thursday", name: translate("etkecc.actions.days.thursday") },
    { id: "Friday", name: translate("etkecc.actions.days.friday") },
    { id: "Saturday", name: translate("etkecc.actions.days.saturday") },
    { id: "Sunday", name: translate("etkecc.actions.days.sunday") },
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

      if (isCreating) {
        await dataProvider.createRecurringCommand(etkeccAdmin, locale, submissionData);
        notify("etkecc.actions.recurring.action.create_success", { type: "success" });
      } else {
        await dataProvider.updateRecurringCommand(etkeccAdmin, locale, {
          ...submissionData,
          id: id,
        });
        notify("etkecc.actions.recurring.action.update_success", { type: "success" });
      }

      // Invalidate scheduled commands queries
      queryClient.invalidateQueries({ queryKey: ["scheduledCommands"] });

      navigate("/server_actions");
    } catch (error) {
      console.error("Error saving recurring command:", error);
      notify("etkecc.actions.recurring.action.update_failure", { type: "error" });
    }
  };

  if (loading || isLoadingList || isLoadingServerCommands) {
    return <Loading />;
  }

  return (
    <>
      <Title title={pageTitle} />
      <Box sx={{ mt: 2, maxWidth: { xs: "100vw", sm: "calc(100vw - 32px)" }, overflowX: "auto" }}>
        <Button
          label={translate("etkecc.actions.buttons.back")}
          onClick={() => navigate("/server_actions")}
          sx={{ mb: 2 }}
        >
          <ArrowBackIcon />
        </Button>

        <Card>
          <CardHeader title={pageTitle} />
          <CardContent>
            {command && (
              <EtkeAttribution>
                <Alert severity="info">
                  <Typography variant="body1" sx={{ px: 2 }}>
                    {translate("etkecc.actions.command_details_intro")}{" "}
                    <Link
                      href={`https://etke.cc/help/extras/scheduler/#${command.command}`}
                      target="_blank"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {`etke.cc/help/extras/scheduler/#${command.command}`}
                    </Link>
                    .
                  </Typography>
                </Alert>
              </EtkeAttribution>
            )}
            <Form
              defaultValues={command || undefined}
              onSubmit={handleSubmit}
              record={command || undefined}
              warnWhenUnsavedChanges
            >
              <Box display="flex" flexDirection="column" gap={2}>
                {!isCreating && (
                  <TextInput readOnly source="id" label={translate("etkecc.actions.form.id")} fullWidth required />
                )}
                <SelectInput
                  source="command"
                  choices={commandChoices}
                  label={translate("etkecc.actions.form.command")}
                  fullWidth
                  required
                />
                <ArgumentsField serverCommands={serverCommands} units={units} />
                <SelectInput
                  source="day_of_week"
                  choices={dayOfWeekChoices}
                  label={translate("etkecc.actions.form.day_of_week")}
                  fullWidth
                  required
                />
                <TimeInput
                  source="execution_time"
                  label={translate("etkecc.actions.table.time_utc")}
                  fullWidth
                  required
                />
                <Box mt={2} display="flex" justifyContent="space-between">
                  <SaveButton
                    label={
                      isCreating
                        ? translate("etkecc.actions.buttons.create")
                        : translate("etkecc.actions.buttons.update")
                    }
                  />
                  {!isCreating && <RecurringDeleteButton />}
                </Box>
              </Box>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default RecurringCommandEdit;
