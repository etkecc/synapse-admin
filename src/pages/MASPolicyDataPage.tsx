import SaveIcon from "@mui/icons-material/Save";
import { Box, Button as MuiButton, Card, CardContent, Stack, Typography } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import { Loading, Title, useDataProvider, useLocale, useNotify, useTranslate } from "react-admin";

import { useDocTitle } from "../components/hooks/useDocTitle";
import { MASPolicyData, SynapseDataProvider } from "../providers/types";
import { DATE_FORMAT } from "../utils/date";

const MASPolicyDataPage = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const locale = useLocale();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const [policy, setPolicy] = useState<MASPolicyData | null | undefined>(undefined);
  const [newJson, setNewJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useDocTitle(translate("resources.mas_policy_data.name"));

  const fetchPolicy = useCallback(async () => {
    const data = await dataProvider.getMASPolicyData();
    setPolicy(data);
  }, [dataProvider]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  const handleJsonChange = (value: string) => {
    setNewJson(value);
    if (!value) {
      setJsonError(null);
      return;
    }
    try {
      JSON.parse(value);
      setJsonError(null);
    } catch {
      setJsonError(translate("resources.mas_policy_data.invalid_json"));
    }
  };

  const isValidJson = newJson !== "" && jsonError === null;

  const handleSave = async () => {
    if (!isValidJson) return;
    setSaving(true);
    try {
      const parsed = JSON.parse(newJson);
      const result = await dataProvider.setMASPolicyData(parsed);
      if (result.success) {
        notify("resources.mas_policy_data.action.save.success");
        setNewJson("");
        setJsonError(null);
        await fetchPolicy();
      } else {
        notify(result.error || "resources.mas_policy_data.action.save.failure", { type: "error" });
      }
    } catch {
      notify("resources.mas_policy_data.action.save.failure", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (policy === undefined) return <Loading />;

  return (
    <Box sx={{ p: 2 }}>
      <Title title={translate("resources.mas_policy_data.name")} />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {translate("resources.mas_policy_data.current_policy")}
          </Typography>
          {policy ? (
            <Stack spacing={1}>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  overflow: "auto",
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap",
                }}
              >
                {JSON.stringify(policy.data, null, 2)}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {translate("resources.mas_policy_data.fields.created_at")}:{" "}
                {new Date(policy.created_at).toLocaleString(locale, DATE_FORMAT)}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {translate("resources.mas_policy_data.no_policy")}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {translate("resources.mas_policy_data.set_policy")}
          </Typography>
          <Stack direction="column" spacing={2} alignItems="flex-start">
            <MuiTextField
              label={translate("resources.mas_policy_data.fields.json_placeholder")}
              value={newJson}
              onChange={e => handleJsonChange(e.target.value)}
              fullWidth
              size="small"
              multiline
              minRows={4}
              error={!!jsonError}
              helperText={jsonError ?? " "}
              slotProps={{ input: { style: { fontFamily: "monospace" } } }}
            />
            <MuiButton
              onClick={handleSave}
              disabled={saving || !isValidJson}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
            >
              {translate("resources.mas_policy_data.action.save.label")}
            </MuiButton>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MASPolicyDataPage;
