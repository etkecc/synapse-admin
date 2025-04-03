import { useEffect, useState } from "react";
import { Button, Loading, useDataProvider, useCreatePath, useStore } from "react-admin";
import { useAppContext } from "../../Context";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, TextField, Box } from "@mui/material";
import { PlayArrow, CheckCircle } from "@mui/icons-material";
import { Icons } from "../../utils/icons";
import { ServerCommand, ServerProcessResponse } from "../../synapse/dataProvider";
import { Link } from "react-router-dom";
import { useServerCommands } from "./hooks/useServerCommands";

const renderIcon = (icon: string) => {
  const IconComponent = Icons[icon] as React.ComponentType<any> | undefined;
  return IconComponent ? <IconComponent sx={{ verticalAlign: "middle", mr: 1 }} /> : null;
}

const ServerCommandsPanel = () => {
  const { etkeccAdmin } = useAppContext();
  if (!etkeccAdmin) {
    return null;
  }

  const createPath = useCreatePath();
  const { isLoading, serverCommands, setServerCommands } = useServerCommands();
  const [serverProcess, setServerProcess] = useStore<ServerProcessResponse>("serverProcess", { command: "", locked_at: "" });
  const [commandIsRunning, setCommandIsRunning] = useState<boolean>(serverProcess.command !== "");
  const [commandResult, setCommandResult] = useState<React.ReactNode[]>([]);
  const dataProvider = useDataProvider();

  useEffect(() => {
    if (serverProcess.command === "") {
      setCommandIsRunning(false);
    }
  }, [serverProcess]);

  const setCommandAdditionalArgs = (command: string, additionalArgs: string) => {
    const updatedServerCommands = {...serverCommands};
    updatedServerCommands[command].additionalArgs = additionalArgs;
    setServerCommands(updatedServerCommands);
  }

  const runCommand = async (command: string) => {
    setCommandResult([]);
    setCommandIsRunning(true);

    try {
      const additionalArgs = serverCommands[command].additionalArgs || "";
      const requestParams = additionalArgs ? { args: additionalArgs } : {};

      const response = await dataProvider.runServerCommand(etkeccAdmin, command, requestParams);

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
      setCommandIsRunning(false);
    }
  };

  const buildCommandResultMessages = (command: string, additionalArgs: string): React.ReactNode[] => {
    const results: React.ReactNode[] = [];

    let commandScheduledText = `Command scheduled: ${command}`;
    if (additionalArgs) {
      commandScheduledText += `, with additional args: ${additionalArgs}`;
    }

    results.push(<Box key="command-text">{commandScheduledText}</Box>);
    results.push(
      <Box key="notification-link">
        Expect your result in the <Link to={createPath({ resource: "server_notifications", type: "list" })}>Notifications</Link> page soon.
      </Box>
    );

    return results;
  };

  const resetCommandArgs = (command: string) => {
    const updatedServerCommands = {...serverCommands};
    updatedServerCommands[command].additionalArgs = "";
    setServerCommands(updatedServerCommands);
  };

  const updateServerProcessStatus = async (command: ServerCommand) => {
    const commandIsLocking = command.with_lock;
    const serverProcess = await dataProvider.getServerRunningProcess(etkeccAdmin, true);
    if (!commandIsLocking && serverProcess.command === "") {
      // if command is not locking, we simulate the "lock" mechanism so notifications will be refetched
      serverProcess["command"] = command.name;
      serverProcess["locked_at"] = new Date().toISOString();
    }

    setServerProcess({...serverProcess});
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <h2>Server Commands</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 450 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Command</TableCell>
              <TableCell>Description</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(serverCommands).map(([command, { icon, args, description, additionalArgs }]) => (
              <TableRow
                key={command}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">
                  <Box>
                    {renderIcon(icon)}
                    {command}
                  </Box>
                </TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>
                  {args && (
                    <TextField
                      size="small"
                      variant="standard"
                      onChange={(e) => {
                        setCommandAdditionalArgs(command, e.target.value);
                      }}
                      value={additionalArgs}
                    />
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    label="Run"
                    startIcon={<PlayArrow />}
                    onClick={() => {
                      runCommand(command);
                    }}
                    disabled={
                      commandIsRunning ||
                      (args && typeof additionalArgs === "string" && additionalArgs.length === 0)
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