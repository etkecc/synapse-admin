import ActionCheck from "@mui/icons-material/CheckCircle";
import AlertError from "@mui/icons-material/ErrorOutline";
import LoginIcon from "@mui/icons-material/Login";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Button, useDataProvider, useLocale, useNotify, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../providers/types";

export const LoginAsUserButton = () => {
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [useExpiry, setUseExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [validUntilMs, setValidUntilMs] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;

  if (!record) {
    return null;
  }

  const handleOpen = () => {
    setUseExpiry(false);
    setExpiryDate("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const validUntil = useExpiry && expiryDate ? new Date(expiryDate).getTime() : undefined;
      const result = await dataProvider.loginAsUser(record.id, validUntil);
      if (result.success && result.access_token) {
        setAccessToken(result.access_token);
        setValidUntilMs(validUntil);
        handleClose();
        setResultOpen(true);
      } else {
        notify(result.error || "resources.users.action.login_as.failure", { type: "error" });
      }
    } catch {
      notify("resources.users.action.login_as.failure", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResultClose = () => {
    setResultOpen(false);
    setAccessToken("");
    setValidUntilMs(undefined);
  };

  return (
    <>
      <Button label="resources.users.action.login_as.label" onClick={handleOpen} disabled={loading}>
        <LoginIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{translate("resources.users.action.login_as.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {translate("resources.users.action.login_as.helper", { user: record.id })}
          </DialogContentText>
          <FormControlLabel
            control={<Switch checked={useExpiry} onChange={e => setUseExpiry(e.target.checked)} />}
            label={translate("resources.users.action.login_as.valid_until")}
          />
          {useExpiry && (
            <TextField
              type="datetime-local"
              fullWidth
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              sx={{ mt: 1 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleClose} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleConfirm}
            disabled={loading || (useExpiry && !expiryDate)}
            className="ra-confirm RaConfirm-confirmPrimary"
            autoFocus
            startIcon={<ActionCheck />}
          >
            {translate("ra.action.confirm")}
          </MuiButton>
        </DialogActions>
      </Dialog>
      <Dialog open={resultOpen} onClose={handleResultClose} maxWidth="sm" fullWidth>
        <DialogTitle>{translate("resources.users.action.login_as.result_title", { user: record.id })}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={translate("resources.users.action.login_as.access_token")}
            value={accessToken}
            slotProps={{ input: { readOnly: true } }}
            sx={{ mt: 1 }}
          />
          {validUntilMs && (
            <Typography sx={{ mt: 1 }}>
              {translate("resources.users.action.login_as.expires_at", {
                date: new Date(validUntilMs).toLocaleString(locale),
              })}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleResultClose} startIcon={<ActionCheck />}>
            {translate("ra.action.close")}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LoginAsUserButton;
