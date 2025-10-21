import { Stack, Tooltip, Typography, Box, Link } from "@mui/material";
import { useStore } from "react-admin";

import { EtkeAttribution } from "./EtkeAttribution";
import { GetInstanceConfig } from "./InstanceConfig";
import { ServerProcessResponse } from "../../synapse/dataProvider";
import { getTimeSince } from "../../utils/date";

const CurrentlyRunningCommand = () => {
  const [serverProcess, _setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
    maintenance: false,
  });
  const { command, locked_at, maintenance } = serverProcess;

  if (!command || !locked_at || maintenance) {
    return null;
  }

  const icfg = GetInstanceConfig();
  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5">Currently running:</Typography>
        <Typography variant="h5" color="text.secondary">
          {icfg.disabled.attributions && <Typography>{command}</Typography>}
          <EtkeAttribution>
            <Link href={"https://etke.cc/help/extras/scheduler/#" + command} target="_blank">
              {command}
            </Link>
          </EtkeAttribution>
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
