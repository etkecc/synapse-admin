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
  useLocale,
  Loading,
  Button,
  SelectInput,
  useTranslate,
  Title,
} from "react-admin";
import { useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";

import ScheduleDeleteButton from "./ScheduledDeleteButton";
import { useAppContext } from "../../../../../Context";
import { ScheduledCommand } from "../../../../../synapse/dataProvider";
import { useDocTitle } from "../../../../hooks/useDocTitle";
import { EtkeAttribution } from "../../../EtkeAttribution";
import { useServerCommands } from "../../../hooks/useServerCommands";
import { useScheduledCommands } from "../../hooks/useScheduledCommands";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const transformCommandsToChoices = (commands: Record<string, any>) => {
  return Object.entries(commands).map(([key, value]) => ({
    id: key,
    name: value.name,
    description: value.description,
  }));
};

const ArgumentsField = ({ serverCommands }) => {
  const translate = useTranslate();
  const selectedCommand = useWatch({ name: "command" });
  const showArgs = selectedCommand && serverCommands[selectedCommand]?.args === true;

  if (!showArgs) return null;

  return <TextInput required source="args" label={translate("etkecc.actions.table.arguments")} fullWidth multiline />;
};

const ScheduledCommandEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const locale = useLocale();
  const translate = useTranslate();
  const { etkeccAdmin } = useAppContext();
  const [command, setCommand] = useState<ScheduledCommand | null>(null);
  const isCreating = typeof id === "undefined";
  const [loading, setLoading] = useState(!isCreating);
  const { data: scheduledCommands, isLoading: isLoadingList } = useScheduledCommands();
  const { serverCommands } = useServerCommands();
  const pageTitle = isCreating
    ? translate("etkecc.actions.scheduled_title_create")
    : translate("etkecc.actions.scheduled_title_edit");
  useDocTitle(pageTitle);

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
      data.scheduled_at = new Date(data.scheduled_at).toISOString();
      if (isCreating) {
        await dataProvider.createScheduledCommand(etkeccAdmin, locale, data);
        notify("etkecc.actions.scheduled.action.create_success", { type: "success" });
      } else {
        await dataProvider.updateScheduledCommand(etkeccAdmin, locale, {
          ...data,
          id: id,
        });
        notify("etkecc.actions.scheduled.action.update_success", { type: "success" });
      }

      navigate("/server_actions");
    } catch (error) {
      console.log("Error saving scheduled command:", error);
      notify("etkecc.actions.scheduled.action.update_failure", { type: "error" });
    }
  };

  if (loading || isLoadingList) {
    return <Loading />;
  }

  return (
    <>
      <Title title={pageTitle} />
      <Box sx={{ mt: 2 }}>
        <Button
          label={translate("etkecc.actions.buttons.back")}
          onClick={() => navigate("/server_actions")}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        />

        <Card>
          <CardHeader title={pageTitle} />
          {command && (
            <EtkeAttribution>
              <Typography variant="body1" sx={{ px: 2 }}>
                {translate("etkecc.actions.command_details_intro")}{" "}
                <Link href={`https://etke.cc/help/extras/scheduler/#${command.command}`} target="_blank">
                  {`etke.cc/help/extras/scheduler/#${command.command}`}
                </Link>
                .
              </Typography>
            </EtkeAttribution>
          )}
          <CardContent>
            <Form
              defaultValues={command || undefined}
              onSubmit={handleSubmit}
              record={command || undefined}
              warnWhenUnsavedChanges
            >
              <Box display="flex" flexDirection="column" gap={2}>
                {command && (
                  <TextInput readOnly source="id" label={translate("etkecc.actions.form.id")} fullWidth required />
                )}
                <SelectInput
                  readOnly={!isCreating}
                  source="command"
                  choices={commandChoices}
                  label={translate("etkecc.actions.form.command")}
                  fullWidth
                  required
                />
                <ArgumentsField serverCommands={serverCommands} />
                <DateTimeInput
                  source="scheduled_at"
                  label={translate("etkecc.actions.form.scheduled_at")}
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
                  {!isCreating && <ScheduleDeleteButton />}
                </Box>
              </Box>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ScheduledCommandEdit;
