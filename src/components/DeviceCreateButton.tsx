import ActionCheck from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import AlertError from "@mui/icons-material/ErrorOutline";
import { Button as MuiButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Button, useNotify, useRecordContext, useRefresh, useTranslate } from "react-admin";

import { jsonClient } from "../providers/httpClients";
import { invalidateManyRefCache } from "../providers/resourceMap";

const DeviceCreateButton = () => {
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const refresh = useRefresh();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!record) return null;

  const handleClose = () => {
    setOpen(false);
    setDeviceId("");
  };

  const handleConfirm = async () => {
    if (!deviceId.trim()) return;
    setLoading(true);
    try {
      const base_url = localStorage.getItem("base_url");
      await jsonClient(`${base_url}/_synapse/admin/v2/users/${encodeURIComponent(record.id as string)}/devices`, {
        method: "POST",
        body: JSON.stringify({ device_id: deviceId.trim() }),
      });
      invalidateManyRefCache("devices");
      notify("resources.devices.action.create.success", { type: "success" });
      handleClose();
      refresh();
    } catch {
      notify("resources.devices.action.create.failure", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.devices.action.create.label" onClick={() => setOpen(true)}>
        <AddIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.devices.action.create.title")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label={translate("resources.devices.fields.device_id")}
            value={deviceId}
            onChange={e => setDeviceId(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && deviceId.trim()) handleConfirm();
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleClose} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleConfirm}
            disabled={!deviceId.trim() || loading}
            className="ra-confirm RaConfirm-confirmPrimary"
            startIcon={<ActionCheck />}
          >
            {translate("ra.action.create")}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeviceCreateButton;
