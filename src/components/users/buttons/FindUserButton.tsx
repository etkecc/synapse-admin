import ActionCheck from "@mui/icons-material/CheckCircle";
import AlertError from "@mui/icons-material/ErrorOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Button, useDataProvider, useNotify, useRedirect, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../../../providers/types";

type LookupType = "threepid" | "auth_provider";

export const FindUserButton = () => {
  const [open, setOpen] = useState(false);
  const [lookupType, setLookupType] = useState<LookupType>("threepid");
  const [medium, setMedium] = useState("email");
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [externalId, setExternalId] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const redirect = useRedirect();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => {
    setAddress("");
    setProvider("");
    setExternalId("");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const canSubmit =
    lookupType === "threepid" ? address.trim().length > 0 : provider.trim().length > 0 && externalId.trim().length > 0;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result =
        lookupType === "threepid"
          ? await dataProvider.findUserByThreepid(medium, address.trim())
          : await dataProvider.findUserByAuthProvider(provider.trim(), externalId.trim());

      if (result.success && result.user_id) {
        handleClose();
        redirect("edit", "users", result.user_id);
      } else {
        notify("resources.users.action.find_user.not_found", { type: "warning" });
      }
    } catch {
      notify("resources.users.action.find_user.failure", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.users.action.find_user.label" onClick={handleOpen} disabled={loading}>
        <PersonSearchIcon />
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.users.action.find_user.title")}</DialogTitle>
        <DialogContent>
          <FormControl sx={{ mb: 2, mt: 1 }}>
            <FormLabel>{translate("resources.users.action.find_user.lookup_type")}</FormLabel>
            <RadioGroup value={lookupType} onChange={e => setLookupType(e.target.value as LookupType)}>
              <FormControlLabel
                value="threepid"
                control={<Radio />}
                label={translate("resources.users.action.find_user.by_threepid")}
              />
              <FormControlLabel
                value="auth_provider"
                control={<Radio />}
                label={translate("resources.users.action.find_user.by_auth_provider")}
              />
            </RadioGroup>
          </FormControl>

          {lookupType === "threepid" ? (
            <>
              <TextField
                select
                fullWidth
                label={translate("resources.users.fields.medium")}
                value={medium}
                onChange={e => setMedium(e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="email">{translate("resources.users.email")}</MenuItem>
                <MenuItem value="msisdn">{translate("resources.users.msisdn")}</MenuItem>
              </TextField>
              <TextField
                autoFocus
                fullWidth
                label={translate("resources.users.fields.address")}
                value={address}
                onChange={e => setAddress(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && canSubmit) handleConfirm();
                }}
              />
            </>
          ) : (
            <>
              <TextField
                autoFocus
                fullWidth
                label={translate("resources.users.action.find_user.provider")}
                value={provider}
                onChange={e => setProvider(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={translate("resources.users.action.find_user.external_id")}
                value={externalId}
                onChange={e => setExternalId(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && canSubmit) handleConfirm();
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleClose} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleConfirm}
            disabled={!canSubmit || loading}
            className="ra-confirm RaConfirm-confirmPrimary"
            startIcon={<ActionCheck />}
          >
            {translate("resources.users.action.find_user.search")}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FindUserButton;
