import { PlayArrow, CheckCircle, HelpCenter, Construction } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  TextField,
  Box,
  Link,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Loading, useDataProvider, useCreatePath, useLocale, useStore, useTranslate } from "react-admin";
import { Link as RouterLink } from "react-router-dom";

import { EtkeAttribution } from "./EtkeAttribution";
import { useAppContext } from "../../Context";
import { useServerCommands } from "./hooks/useServerCommands";
import { ServerCommand, ServerProcessResponse } from "../../synapse/dataProvider";
import { Icons } from "../../utils/icons";

const renderIcon = (icon: string) => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const IconComponent = Icons[icon] as React.ComponentType<any> | undefined;
  return IconComponent ? (
    <IconComponent sx={{ verticalAlign: "middle", mr: 1, display: { xs: "none", md: "inline-block" } }} />
  ) : null;
};

const ServerCommandsPanel = () => {
  const { etkeccAdmin } = useAppContext();
  if (!etkeccAdmin) {
    return null;
  }

  const createPath = useCreatePath();
  const translate = useTranslate();
  const { isLoading, maintenance, serverCommands, setServerCommands } = useServerCommands();
  const [serverProcess, setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
    maintenance: false,
  });
  const [commandIsRunning, setCommandIsRunning] = useState<boolean>(serverProcess.command !== "");
  const [commandResult, setCommandResult] = useState<React.ReactNode[]>([]);
  const dataProvider = useDataProvider();
  const locale = useLocale();

  useEffect(() => {
    if (serverProcess.command === "") {
      setCommandIsRunning(false);
    }
  }, [serverProcess]);

  const setCommandAdditionalArgs = (command: string, additionalArgs: string) => {
    const updatedServerCommands = { ...serverCommands };
    updatedServerCommands[command].additionalArgs = additionalArgs;
    setServerCommands(updatedServerCommands);
  };

  const runCommand = async (command: string) => {
    setCommandResult([]);
    setCommandIsRunning(true);

    try {
      const additionalArgs = serverCommands[command].additionalArgs || "";
      const requestParams = additionalArgs ? { args: additionalArgs } : {};

      const response = await dataProvider.runServerCommand(etkeccAdmin, command, requestParams);

      if (response.maintenance) {
        setCommandIsRunning(false);
        setCommandResult([
          <Box key="maintenance-warning">
            {translate("etkecc.actions.maintenance_title")} {translate("etkecc.actions.maintenance_commands_blocked")}{" "}
            {translate("etkecc.actions.maintenance_note")}
          </Box>,
        ]);
        return;
      }

      if (!response.success) {
        setCommandIsRunning(false);
        return;
      }

      // Update UI with success message
      const commandResults = buildCommandResultMessages(command, additionalArgs);
      setCommandResult(commandResults);

      // Reset the additional args field
      resetCommandArgs(command);

      // Update server process status
      await updateServerProcessStatus(serverCommands[command]);
    } catch (error) {
      console.error("Error running command:", error);
      setCommandIsRunning(false);
    }
  };

  const buildCommandResultMessages = (command: string, additionalArgs: string): React.ReactNode[] => {
    const results: React.ReactNode[] = [];

    let commandScheduledText = translate("etkecc.actions.command_scheduled", { command });
    if (additionalArgs) {
      commandScheduledText += `, ${translate("etkecc.actions.command_scheduled_args", { args: additionalArgs })}`;
    }

    results.push(<Box key="command-text">{commandScheduledText}</Box>);
    results.push(
      <Box key="notification-link">
        {translate("etkecc.actions.expect_prefix")}{" "}
        <RouterLink to={createPath({ resource: "server_notifications", type: "list" })}>
          {translate("etkecc.actions.notifications_link")}
        </RouterLink>{" "}
        {translate("etkecc.actions.expect_suffix")}
      </Box>
    );

    return results;
  };

  const resetCommandArgs = (command: string) => {
    const updatedServerCommands = { ...serverCommands };
    updatedServerCommands[command].additionalArgs = "";
    setServerCommands(updatedServerCommands);
  };

  const updateServerProcessStatus = async (command: ServerCommand) => {
    const commandIsLocking = command.with_lock;
    const serverProcess = await dataProvider.getServerRunningProcess(etkeccAdmin, locale, true);
    if (!commandIsLocking && serverProcess.command === "") {
      // if command is not locking, we simulate the "lock" mechanism so notifications will be refetched
      serverProcess["command"] = command.name;
      serverProcess["locked_at"] = new Date().toISOString();
    }

    setServerProcess({ ...serverProcess });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (maintenance) {
    return (
      <Alert severity="info">
        {translate("etkecc.actions.maintenance_title")}
        <br />
        {translate("etkecc.actions.maintenance_try_again")}
        <br />
        {translate("etkecc.actions.maintenance_note")}
      </Alert>
    );
  }

  return (
    <>
      <Typography variant="h5">
        <Construction sx={{ verticalAlign: "middle", mr: 1 }} /> {translate("etkecc.actions.available_title")}
      </Typography>
      <EtkeAttribution>
        <Typography variant="body1" sx={{ mt: 0 }}>
          {translate("etkecc.actions.available_description")} {translate("etkecc.actions.available_help_intro")}{" "}
          <Link href="https://etke.cc/help/extras/scheduler/#commands" target="_blank">
            etke.cc/help/extras/scheduler/#commands
          </Link>
          .
        </Typography>
      </EtkeAttribution>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: { xs: 100, md: 450 } }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{translate("etkecc.actions.table.command")}</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}></TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                {translate("etkecc.actions.table.description")}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(serverCommands).map(([command, { icon, args, description, additionalArgs }]) => (
              <TableRow key={command}>
                <TableCell scope="row">
                  <Box>
                    {renderIcon(icon)}
                    {command}
                  </Box>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  <Link href={"https://etke.cc/help/extras/scheduler/#" + command} target="_blank">
                    <Button
                      size="small"
                      startIcon={<HelpCenter />}
                      title={translate("etkecc.actions.command_help_title", { command })}
                    />
                  </Link>
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{description}</TableCell>
                <TableCell sx={{ display: { xs: "table-cell", md: "table-cell" } }}>
                  {args && (
                    <TextField
                      size="small"
                      variant="standard"
                      label={translate("etkecc.actions.table.arguments")}
                      onChange={e => {
                        setCommandAdditionalArgs(command, e.target.value);
                      }}
                      value={additionalArgs}
                    />
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    label={translate("etkecc.actions.buttons.run")}
                    startIcon={<PlayArrow />}
                    onClick={() => {
                      runCommand(command);
                    }}
                    disabled={
                      commandIsRunning || (args && typeof additionalArgs === "string" && additionalArgs.length === 0)
                    }
                  ></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {commandResult.length > 0 && (
        <Alert icon={<CheckCircle fontSize="inherit" />} severity="success">
          {commandResult.map((result, index) => (
            <div key={index}>{result}</div>
          ))}
        </Alert>
      )}
    </>
  );
};

export default ServerCommandsPanel;
