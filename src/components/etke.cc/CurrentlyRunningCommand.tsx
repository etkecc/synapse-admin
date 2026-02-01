import EngineeringIcon from "@mui/icons-material/Engineering";
import { Tooltip, Typography, Link, Alert } from "@mui/material";
import { useStore, useTranslate } from "react-admin";

import { EtkeAttribution } from "./EtkeAttribution";
import { GetInstanceConfig } from "./InstanceConfig";
import { ServerProcessResponse } from "../../synapse/dataProvider";
import { getTimeSince } from "../../utils/date";

const CurrentlyRunningCommand = () => {
  const translate = useTranslate();
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
  const { timeI18Nkey, timeI18Nparams } = getTimeSince(locked_at);
  const timeSince = translate(timeI18Nkey, timeI18Nparams);
  return (
    <Alert icon={<EngineeringIcon />} severity="warning">
      <Typography variant="h5">
        {translate("etkecc.currently_running.command")}{" "}
        {icfg.disabled.attributions && <Typography>{command}</Typography>}
        <EtkeAttribution>
          <Link href={"https://etke.cc/help/extras/scheduler/#" + command} target="_blank">
            {command}
          </Link>
        </EtkeAttribution>
        <Tooltip title={locked_at.toString()}>
          <Typography component="span" color="text.secondary" sx={{ display: "inline-block", ml: 1 }}>
            {translate("etkecc.currently_running.started_ago", { time: timeSince })}
          </Typography>
        </Tooltip>
      </Typography>
    </Alert>
  );
};

export default CurrentlyRunningCommand;
