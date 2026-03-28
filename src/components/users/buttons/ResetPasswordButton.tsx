import ActionCheck from "@mui/icons-material/CheckCircle";
import AlertError from "@mui/icons-material/ErrorOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Button, useDataProvider, useNotify, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../../../providers/types";
import { generateRandomPassword } from "../../../utils/password";

export const ResetPasswordButton = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [logoutDevices, setLogoutDevices] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;

  if (!record) {
    return null;
  }

  const handleOpen = () => {
    setPassword("");
    setLogoutDevices(false);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleGeneratePassword = () => {
    setPassword(generateRandomPassword());
  };

  const handleConfirm = async () => {
    if (!password) {
      notify("resources.users.action.reset_password.error_no_password", { type: "error" });
      return;
    }

    setLoading(true);
    try {
      const result = await dataProvider.resetPassword(record.id, password, logoutDevices);
      if (result.success) {
        notify("resources.users.action.reset_password.success");
        handleClose();
      } else {
        notify(result.error || "resources.users.action.reset_password.failure", { type: "error" });
      }
    } catch {
      notify("resources.users.action.reset_password.failure", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.users.action.reset_password.label" onClick={handleOpen} disabled={loading}>
        <LockResetIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.users.action.reset_password.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {translate("resources.users.action.reset_password.helper", { user: record.id })}
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label={translate("resources.users.action.reset_password.password")}
            value={password}
            onChange={e => setPassword(e.target.value)}
            sx={{ mb: 1 }}
          />
          <MuiButton variant="outlined" onClick={handleGeneratePassword} sx={{ mb: 2, display: "block" }}>
            {translate("resources.users.action.generate_password")}
          </MuiButton>
          <FormControlLabel
            control={<Switch checked={logoutDevices} onChange={e => setLogoutDevices(e.target.checked)} />}
            label={translate("resources.users.action.reset_password.logout_devices")}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleClose} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleConfirm}
            disabled={!password || loading}
            className="ra-confirm RaConfirm-confirmPrimary"
            autoFocus
            startIcon={<ActionCheck />}
          >
            {translate("ra.action.confirm")}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetPasswordButton;
