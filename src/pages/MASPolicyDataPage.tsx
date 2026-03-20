import { Box, Card, CardContent, Link, Stack, Typography } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import { useCallback, useEffect, useState } from "react";
import { Button, Loading, Title, useDataProvider, useLocale, useNotify, useTranslate } from "react-admin";

import { useDocTitle } from "../components/hooks/useDocTitle";
import { MASPolicyData, SynapseDataProvider } from "../providers/types";
import { DATE_FORMAT } from "../utils/date";

const MASPolicyDataPage = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const locale = useLocale();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const [policy, setPolicy] = useState<MASPolicyData | null | undefined>(undefined);
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useDocTitle(translate("resources.mas_policy_data.name"));

  const fetchPolicy = useCallback(async () => {
    const data = await dataProvider.getMASPolicyData();
    setPolicy(data);
  }, [dataProvider]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  const handleSave = async () => {
    if (!newUrl) return;
    setSaving(true);
    try {
      const result = await dataProvider.setMASPolicyData(newUrl);
      if (result.success) {
        notify("resources.mas_policy_data.action.save.success");
        setNewUrl("");
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
    <Box sx={{ p: 2, maxWidth: 800 }}>
      <Title title={translate("resources.mas_policy_data.name")} />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {translate("resources.mas_policy_data.current_policy")}
          </Typography>
          {policy ? (
            <Stack spacing={1}>
              <Link href={policy.url} target="_blank" rel="noopener noreferrer" sx={{ wordBreak: "break-all" }}>
                {policy.url}
              </Link>
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
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <MuiTextField
              label={translate("resources.mas_policy_data.fields.url")}
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              fullWidth
              size="small"
              placeholder="https://example.com/privacy-policy"
            />
            <Button
              label="resources.mas_policy_data.action.save.label"
              onClick={handleSave}
              disabled={saving || !newUrl}
              variant="contained"
              sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MASPolicyDataPage;
