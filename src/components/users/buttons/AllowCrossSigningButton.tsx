import ActionCheck from "@mui/icons-material/CheckCircle";
import AlertError from "@mui/icons-material/ErrorOutline";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import { Button, useDataProvider, useLocale, useNotify, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../../../providers/types";

export const AllowCrossSigningButton = () => {
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const locale = useLocale();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!record) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.allowCrossSigningReplacement(record.id as string);
      if (result.success && result.updatable_without_uia_before_ms) {
        const deadline = new Date(result.updatable_without_uia_before_ms).toLocaleString(locale);
        notify(translate("resources.users.action.allow_cross_signing.success", { deadline }), { type: "success" });
        setOpen(false);
      } else if (result.errcode === "M_NOT_FOUND") {
        notify("resources.users.action.allow_cross_signing.no_key", { type: "warning" });
      } else {
        notify(result.error || "resources.users.action.allow_cross_signing.failure", { type: "error" });
      }
    } catch {
      notify("resources.users.action.allow_cross_signing.failure", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.users.action.allow_cross_signing.label" onClick={() => setOpen(true)} disabled={loading}>
        <VpnKeyIcon />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.users.action.allow_cross_signing.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {translate("resources.users.action.allow_cross_signing.content", { user: record.id })}
          </DialogContentText>
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

export default AllowCrossSigningButton;
