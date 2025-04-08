import { Stack, Tooltip, Typography, Box, Link } from "@mui/material";
import { useStore } from "react-admin";

import { ServerProcessResponse } from "../../synapse/dataProvider";
import { getTimeSince } from "../../utils/date";

const CurrentlyRunningCommand = () => {
  const [serverProcess, setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
  });
  const { command, locked_at } = serverProcess;

  if (!command || !locked_at) {
    return null;
  }

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5">Currently running:</Typography>
        <Typography variant="h5" color="text.secondary">
          <Link href={"https://etke.cc/help/extras/scheduler/#" + command} target="_blank">
            {command}
          </Link>
          <Tooltip title={locked_at.toString()}>
            <Typography component="span" color="text.secondary" sx={{ display: "inline-block", ml: 1 }}>
              (started {getTimeSince(locked_at)} ago)
            </Typography>
          </Tooltip>
        </Typography>
      </Box>
    </Stack>
  );
};

export default CurrentlyRunningCommand;
