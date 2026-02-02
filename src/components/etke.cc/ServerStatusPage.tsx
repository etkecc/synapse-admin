import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { Box, Stack, Typography, Paper, Link, Chip, Divider, ChipProps } from "@mui/material";
import { useStore, useTranslate } from "ra-core";
import { Title } from "react-admin";

import CurrentlyRunningCommand from "./CurrentlyRunningCommand";
import { EtkeAttribution } from "./EtkeAttribution";
import { ServerProcessResponse, ServerStatusComponent, ServerStatusResponse } from "../../synapse/dataProvider";
import { useDocTitle } from "../hooks/useDocTitle";

const StatusChip = ({
  isOkay,
  size = "medium",
  errorLabel = "Error",
  command,
}: {
  isOkay: boolean;
  size?: "small" | "medium";
  errorLabel?: string;
  command?: string;
}) => {
  let label = "OK";
  let icon = <CheckIcon />;
  let color: ChipProps["color"] = "success";
  if (!isOkay) {
    label = errorLabel;
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
  const translate = useTranslate();
  useDocTitle(translate("etkecc.status.name"));
  const errorLabel = translate("etkecc.status.error");
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
      <>
        <Title title={translate("etkecc.status.name")} />
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography color="info">
              {translate("etkecc.maintenance.title")}
              <br />
              {translate("etkecc.maintenance.note")}
            </Typography>
          </Stack>
        </Paper>
      </>
    );
  }

  if (!successCheck) {
    return (
      <>
        <Title title={translate("etkecc.status.name")} />
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography color="info">{translate("etkecc.status.loading")}</Typography>
          </Stack>
        </Paper>
      </>
    );
  }

  return (
    <>
      <Title title={translate("etkecc.status.name")} />
      <Stack spacing={3} mt={3}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4">{translate("etkecc.status.status")}:</Typography>
            <StatusChip isOkay={isOkay} command={command} errorLabel={errorLabel} />
          </Box>
          <Typography variant="h5" color="primary" fontWeight="medium">
            {host}
          </Typography>
        </Stack>

        <CurrentlyRunningCommand />

        <EtkeAttribution>
          <Typography variant="body1">
            {translate("etkecc.status.intro1")}{" "}
            <Link href="https://etke.cc/services/monitoring/" target="_blank">
              etke.cc/services/monitoring
            </Link>
            .
            <br />
            {translate("etkecc.status.intro2")}{" "}
            <Link
              href="https://etke.cc/services/monitoring/#what-to-do-if-the-monitoring-report-shows-issues"
              target="_blank"
            >
              etke.cc/services/monitoring/#what-to-do-if-the-monitoring-report-shows-issues
            </Link>
            .
          </Typography>
        </EtkeAttribution>

        <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
          {Object.keys(groupedResults).map((category, _idx) => (
            <Box key={`category_${category}`} sx={{ flex: 1 }}>
              <Typography variant="h5" mb={1}>
                {translate(`etkecc.status.category.${category}`)}
              </Typography>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack spacing={1} divider={<Divider />}>
                  {groupedResults[category].map((result, idx) => (
                    <Box key={`${category}_${idx}`}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <StatusChip isOkay={result.ok} size="small" errorLabel={errorLabel} />
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
                              {translate("etkecc.status.help")}
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
    </>
  );
};

export default ServerStatusPage;
