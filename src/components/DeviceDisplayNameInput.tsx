import SaveIcon from "@mui/icons-material/Save";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useNotify, useRecordContext, useTranslate } from "react-admin";

import { jsonClient } from "../providers/httpClients";

const DeviceDisplayNameInput = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const translate = useTranslate();
  const [value, setValue] = useState(record?.display_name || "");
  const [saving, setSaving] = useState(false);

  if (!record) return null;

  const isDirty = value !== (record.display_name || "");

  const handleSave = async () => {
    if (!isDirty) return;
    setSaving(true);
    try {
      const base_url = localStorage.getItem("base_url");
      await jsonClient(
        `${base_url}/_synapse/admin/v2/users/${encodeURIComponent(record.user_id)}/devices/${encodeURIComponent(record.device_id)}`,
        { method: "PUT", body: JSON.stringify({ display_name: value }) }
      );
      notify("resources.devices.action.display_name.success", { type: "success" });
    } catch {
      notify("resources.devices.action.display_name.failure", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <TextField
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={e => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSave();
        }
      }}
      size="small"
      variant="standard"
      disabled={saving}
      label={translate("resources.devices.fields.display_name")}
      slotProps={{
        input: {
          endAdornment: isDirty ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleSave} disabled={saving}>
                <SaveIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
};

export default DeviceDisplayNameInput;
