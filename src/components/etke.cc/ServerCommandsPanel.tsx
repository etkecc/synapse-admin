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
  Autocomplete,
  Box,
  Button as MuiButton,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  Button,
  Link as RouterLink,
  Loading,
  useDataProvider,
  useCreatePath,
  useLocale,
  useStore,
  useTranslate,
} from "react-admin";

import { EtkeAttribution } from "./EtkeAttribution";
import { useAppContext } from "../../Context";
import { useServerCommands } from "./hooks/useServerCommands";
import { useUnits } from "./hooks/useUnits";
import { ServerCommand, ServerProcessResponse } from "../../providers/types";
import { Icons } from "../../utils/icons";

const renderIcon = (icon: string) => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const IconComponent = Icons[icon] as React.ComponentType<any> | undefined;
  return IconComponent ? <IconComponent sx={{ verticalAlign: "middle", mr: 1 }} /> : null;
};

const ServerCommandsPanel = () => {
  const { etkeccAdmin } = useAppContext();
  const createPath = useCreatePath();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { isLoading, maintenance, serverCommands, setServerCommands } = useServerCommands();
  const { units } = useUnits();
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

  if (!etkeccAdmin) {
    return null;
  }

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
      {isSmall ? (
        <Stack spacing={1} sx={{ mt: 2 }}>
          {Object.entries(serverCommands).map(([command, { icon, args, description, additionalArgs }]) => (
            <Paper key={command} sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                {renderIcon(icon)}
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {command}
                </Typography>
                <Link href={"https://etke.cc/help/extras/scheduler/#" + command} target="_blank" sx={{ ml: "auto" }}>
                  <HelpCenter fontSize="small" />
                </Link>
              </Box>
              {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {description}
                </Typography>
              )}
              <Stack spacing={1}>
                {args && command === "restart" && (
                  <Autocomplete
                    freeSolo
                    size="small"
                    options={Object.keys(units)}
                    inputValue={additionalArgs || ""}
                    onInputChange={(_e, value) => {
                      setCommandAdditionalArgs(command, units[value] || value);
                    }}
                    renderInput={params => (
                      <TextField {...params} variant="standard" label={translate("etkecc.actions.table.arguments")} />
                    )}
                  />
                )}
                {args && command !== "restart" && (
                  <TextField
                    size="small"
                    variant="standard"
                    label={translate("etkecc.actions.table.arguments")}
                    onChange={e => {
                      setCommandAdditionalArgs(command, e.target.value);
                    }}
                    value={additionalArgs}
                    fullWidth
                  />
                )}
                <MuiButton
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrow />}
                  fullWidth
                  onClick={() => {
                    runCommand(command);
                  }}
                  disabled={
                    commandIsRunning || (args && typeof additionalArgs === "string" && additionalArgs.length === 0)
                  }
                >
                  {translate("etkecc.actions.buttons.run")}
                </MuiButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 450 }} size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{translate("etkecc.actions.table.command")}</TableCell>
                <TableCell></TableCell>
                <TableCell>{translate("etkecc.actions.table.description")}</TableCell>
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
                  <TableCell>
                    <Link href={"https://etke.cc/help/extras/scheduler/#" + command} target="_blank">
                      <Button
                        size="small"
                        startIcon={<HelpCenter />}
                        title={translate("etkecc.actions.command_help_title", { command })}
                      />
                    </Link>
                  </TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell>
                    {args && command === "restart" && (
                      <Autocomplete
                        freeSolo
                        size="small"
                        options={Object.keys(units)}
                        inputValue={additionalArgs || ""}
                        onInputChange={(_e, value) => {
                          setCommandAdditionalArgs(command, units[value] || value);
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={translate("etkecc.actions.table.arguments")}
                          />
                        )}
                      />
                    )}
                    {args && command !== "restart" && (
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
                      onClick={() => {
                        runCommand(command);
                      }}
                      disabled={
                        commandIsRunning || (args && typeof additionalArgs === "string" && additionalArgs.length === 0)
                      }
                    >
                      <PlayArrow />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {commandResult.length > 0 && (
        <Alert icon={<CheckCircle fontSize="inherit" />} severity="success">
          {commandResult.map((result, index) => (
            <div key={`cmd-result-${index}`}>{result}</div>
          ))}
        </Alert>
      )}
    </>
  );
};

export default ServerCommandsPanel;
