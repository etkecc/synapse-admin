import { useStore } from "ra-core";
import { Box, Stack, Typography, Paper, Link, Chip, Divider, Tooltip, ChipProps } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from "@mui/icons-material/Close";
import EngineeringIcon from '@mui/icons-material/Engineering';
import { ServerStatusComponent, ServerStatusResponse } from "../../synapse/dataProvider";

const getTimeSince = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return "a couple of seconds";
  if (diffInMinutes === 1) return "1 minute";
  return `${diffInMinutes} minutes`;
};

const StatusChip = ({ isOkay, size = "medium", command }: { isOkay: boolean, size?: "small" | "medium", command?: string   }) => {
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

  return (
    <Chip icon={icon} label={label} color={color} variant="outlined" size={size} />
  );
};

const ServerComponentText = ({ text }: { text: string }) => {
  return <Typography variant="body1" dangerouslySetInnerHTML={{ __html: text }} />;
};

const ServerStatusPage = () => {
  const [serverStatus, setServerStatus] = useStore<ServerStatusResponse>("serverStatus", {
    ok: false,
    success: false,
    host: "",
    results: [],
  });
  const [ serverProcess, setServerProcess ] = useStore("serverProcess", { command: "", locked_at: "" });
  const { command, locked_at } = serverProcess;
  const successCheck = serverStatus.success;
  const isOkay = serverStatus.ok;
  const host = serverStatus.host;
  const results = serverStatus.results;

  let groupedResults: Record<string, ServerStatusComponent[]> = {};
  for (const result of results) {
    if (!groupedResults[result.category]) {
      groupedResults[result.category] = [];
    }
    groupedResults[result.category].push(result);
  }

  if (!successCheck) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CloseIcon color="error" />
          <Typography color="error">
            Unable to fetch server status. Please try again later.
          </Typography>
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
      {command && locked_at && (
      <Stack spacing={1} direction="row" alignItems="center">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5">Currently running:</Typography>
          <Typography variant="h5" color="text.secondary">
            <Link href={"https://etke.cc/help/extras/scheduler/#"+command} target="_blank">
              {command}
            </Link>
              <Tooltip title={locked_at.toString()}>
                <Typography component="span" color="text.secondary" sx={{ display: "inline-block", ml: 1 }}>(started {getTimeSince(locked_at)} ago)</Typography>
              </Tooltip>
          </Typography>
        </Box>
      </Stack>
      )}

      <Stack spacing={2} direction="row">
        {Object.keys(groupedResults).map((category, idx) => (
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
                      {result.reason && <Typography color="text.secondary" dangerouslySetInnerHTML={{ __html: result.reason }}/>}
                      {(!result.ok && result.help) && (
                        <Link href={result.help} target="_blank" rel="noopener noreferrer" sx={{ mt: 1 }}>
                          Learn more
                        </Link>
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
