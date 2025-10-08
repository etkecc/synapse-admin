import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { Box, Stack, Typography, Paper, Link, Chip, Divider, ChipProps } from "@mui/material";
import { useStore } from "ra-core";

import CurrentlyRunningCommand from "./CurrentlyRunningCommand";
import { EtkeAttribution } from "./EtkeAttribution";
import { ServerProcessResponse, ServerStatusComponent, ServerStatusResponse } from "../../synapse/dataProvider";

const StatusChip = ({
  isOkay,
  size = "medium",
  command,
}: {
  isOkay: boolean;
  size?: "small" | "medium";
  command?: string;
}) => {
  let label = "OK";
  let icon = <CheckIcon />;
  let color: ChipProps["color"] = "success";
  if (!isOkay) {
    label = "Error";
    icon = <CloseIcon />;
    color = "error";
  }

  if (command) {
    label = command;
    color = "warning";
    icon = <EngineeringIcon />;
  }

  return <Chip icon={icon} label={label} color={color} variant="outlined" size={size} />;
};

const ServerComponentText = ({ text }: { text: string }) => {
  return <Typography variant="body1" dangerouslySetInnerHTML={{ __html: text }} />;
};

const ServerStatusPage = () => {
  const [serverStatus, _setServerStatus] = useStore<ServerStatusResponse>("serverStatus", {
    ok: false,
    success: false,
    maintenance: false,
    host: "",
    results: [],
  });
  const [serverProcess, _setServerProcess] = useStore<ServerProcessResponse>("serverProcess", {
    command: "",
    locked_at: "",
    maintenance: false,
  });
  const { command } = serverProcess;
  const successCheck = serverStatus.success;
  const isMaintenance = serverStatus.maintenance;
  const isOkay = serverStatus.ok;
  const host = serverStatus.host;
  const results = serverStatus.results;

  const groupedResults: Record<string, ServerStatusComponent[]> = {};
  for (const result of results) {
    if (!groupedResults[result.category]) {
      groupedResults[result.category] = [];
    }
    groupedResults[result.category].push(result);
  }

  if (isMaintenance) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography color="info">
            The monitoring system is currently in maintenance mode. Please try again later.
            <br />
            You don't need to contact support about that, we are already working on it!
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (!successCheck) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography color="info">Fetching real-time server health... Just a moment!</Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing={3} mt={3}>
      <Stack spacing={1} direction="row" alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h4">Status:</Typography>
          <StatusChip isOkay={isOkay} command={command} />
        </Box>
        <Typography variant="h5" color="primary" fontWeight="medium">
          {host}
        </Typography>
      </Stack>

      <CurrentlyRunningCommand />

      <EtkeAttribution>
        <Typography variant="body1">
          This is a{" "}
          <Link href="https://etke.cc/services/monitoring/" target="_blank">
            monitoring report
          </Link>{" "}
          of the server. If any of the checks below concern you, please check the{" "}
          <Link
            href="https://etke.cc/services/monitoring/#what-to-do-if-the-monitoring-report-shows-issues"
            target="_blank"
          >
            suggested actions
          </Link>
          .
        </Typography>
      </EtkeAttribution>

      <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
        {Object.keys(groupedResults).map((category, _idx) => (
          <Box key={`category_${category}`} sx={{ flex: 1 }}>
            <Typography variant="h5" mb={1}>
              {category}
            </Typography>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Stack spacing={1} divider={<Divider />}>
                {groupedResults[category].map((result, idx) => (
                  <Box key={`${category}_${idx}`}>
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StatusChip isOkay={result.ok} size="small" />
                        {result.label.url ? (
                          <Link href={result.label.url} target="_blank" rel="noopener noreferrer">
                            <ServerComponentText text={result.label.text} />
                          </Link>
                        ) : (
                          <ServerComponentText text={result.label.text} />
                        )}
                      </Box>
                      {result.reason && (
                        <Typography color="text.secondary" dangerouslySetInnerHTML={{ __html: result.reason }} />
                      )}
                      {!result.ok && result.help && (
                        <EtkeAttribution>
                          <Link href={result.help} target="_blank" rel="noopener noreferrer" sx={{ mt: 1 }}>
                            Learn more
                          </Link>
                        </EtkeAttribution>
                      )}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
};

export default ServerStatusPage;
