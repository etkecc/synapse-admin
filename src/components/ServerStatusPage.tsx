import { useStore } from "ra-core";
import { Box, Stack, Typography, Paper, Link, Chip, Divider } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CloseIcon from "@mui/icons-material/Close";
import { ServerStatusComponent, ServerStatusResponse } from "../synapse/dataProvider";
import { group } from "console";

const StatusChip = ({ isOkay, size = "medium" }: { isOkay: boolean, size?: "small" | "medium" }) => {
  return isOkay ? (
    <Chip icon={<CheckBoxIcon />} label="OK" color="success" variant="outlined" size={size} />
  ) : (
    <Chip icon={<CloseIcon />} label="Error" color="error" variant="outlined" size={size} />
  );
};

const ServerComponentText = ({ text }: { text: string }) => {
  return <Typography variant="body1" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*/g, "") }} />;
};

const ServerStatusPage = () => {
  const [serverStatus, setServerStatus] = useStore<ServerStatusResponse>("serverStatus", {
    ok: false,
    success: false,
    host: "",
    results: [],
  });
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
          <StatusChip isOkay={isOkay} />
        </Box>
        <Typography variant="h5" color="primary" fontWeight="medium">
          {host}
        </Typography>
      </Stack>

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
                      {result.reason && <Typography color="text.secondary">{result.reason}</Typography>}
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
