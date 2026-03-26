import { Divider, ListItemText, MenuItem, Switch } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDataProvider, useNotify, useTranslate } from "react-admin";

import { AdminClientConfig, SynapseDataProvider } from "../providers/types";

const defaultConfig: AdminClientConfig = {
  return_soft_failed_events: false,
  return_policy_server_spammy_events: false,
};

// Module-level cache: survives menu open/close remounts, resets on page reload (unlike localStorage-based stores)
let cachedConfig: AdminClientConfig | null = null;

export const AdminClientConfigItems = () => {
  const dataProvider = useDataProvider<SynapseDataProvider>();
  const notify = useNotify();
  const translate = useTranslate();
  const [config, setConfig] = useState<AdminClientConfig>(cachedConfig ?? defaultConfig);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current || cachedConfig) return;
    fetched.current = true;
    dataProvider.getAdminClientConfig().then(cfg => {
      cachedConfig = cfg;
      setConfig(cfg);
    });
  }, [dataProvider]);

  const handleToggle = async (key: keyof AdminClientConfig) => {
    const newConfig = { ...config, [key]: !config[key] };
    cachedConfig = newConfig;
    setConfig(newConfig);
    try {
      await dataProvider.setAdminClientConfig(newConfig);
      notify(translate("ketesa.admin_config.success"), { type: "success" });
    } catch {
      cachedConfig = config;
      setConfig(config);
      notify(translate("ketesa.admin_config.failure"), { type: "error" });
    }
  };

  return (
    <>
      <MenuItem dense onClick={() => handleToggle("return_soft_failed_events")}>
        <ListItemText primary={translate("ketesa.admin_config.soft_failed_events")} />
        <Switch checked={config.return_soft_failed_events} size="small" edge="end" />
      </MenuItem>
      <MenuItem dense onClick={() => handleToggle("return_policy_server_spammy_events")}>
        <ListItemText primary={translate("ketesa.admin_config.spam_flagged_events")} />
        <Switch checked={config.return_policy_server_spammy_events} size="small" edge="end" />
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
    </>
  );
};
