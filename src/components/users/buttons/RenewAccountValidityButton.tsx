import ActionCheck from "@mui/icons-material/CheckCircle";
import AlertError from "@mui/icons-material/ErrorOutline";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Button, useDataProvider, useLocale, useNotify, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../../../providers/types";
import { dateParser } from "../../../utils/date";

export const RenewAccountValidityButton = () => {
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [expirationInput, setExpirationInput] = useState("");
  const [enableRenewalEmails, setEnableRenewalEmails] = useState(true);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const locale = useLocale();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!record) return null;

  const handleOpen = () => {
    setExpirationInput("");
    setEnableRenewalEmails(true);
    setOpen(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const expirationTs = expirationInput ? dateParser(expirationInput) : undefined;
      const result = await dataProvider.renewAccountValidity(record.id as string, expirationTs, enableRenewalEmails);
      if (result.success && result.expiration_ts) {
        const expDate = new Date(result.expiration_ts).toLocaleString(locale);
        notify(translate("resources.users.action.renew_account.success", { date: expDate }), { type: "success" });
        setOpen(false);
      } else {
        notify(result.error || "resources.users.action.renew_account.failure", { type: "error" });
      }
    } catch {
      notify("resources.users.action.renew_account.failure", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.users.action.renew_account.label" onClick={handleOpen} disabled={loading}>
        <EventRepeatIcon />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.users.action.renew_account.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {translate("resources.users.action.renew_account.content", { user: record.id })}
          </DialogContentText>
          <TextField
            fullWidth
            type="datetime-local"
            label={translate("resources.users.action.renew_account.expiration")}
            value={expirationInput}
            onChange={e => setExpirationInput(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            helperText={translate("resources.users.action.renew_account.expiration_helper")}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={<Switch checked={enableRenewalEmails} onChange={e => setEnableRenewalEmails(e.target.checked)} />}
            label={translate("resources.users.action.renew_account.renewal_emails")}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleConfirm}
            disabled={loading}
            className="ra-confirm RaConfirm-confirmPrimary"
            startIcon={<ActionCheck />}
          >
            {translate("ra.action.confirm")}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RenewAccountValidityButton;
