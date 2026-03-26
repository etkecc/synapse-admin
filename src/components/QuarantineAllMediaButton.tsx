import ActionCheck from "@mui/icons-material/CheckCircle";
import AlertError from "@mui/icons-material/ErrorOutline";
import BlockIcon from "@mui/icons-material/Block";
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
import { Button, useDataProvider, useNotify, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../providers/types";

/**
 * Quarantine all media for a room.
 * Shows a confirmation dialog before proceeding.
 */
export const QuarantineRoomMediaButton = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;

  if (!record) return null;

  const roomName = (record.name || record.canonical_alias || record.id) as string;

  const handleQuarantine = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.quarantineRoomMedia(record.id as string);
      if (result.success) {
        notify("resources.rooms.action.quarantine_all.success", {
          type: "success",
          messageArgs: { smart_count: result.num_quarantined },
        });
        setOpen(false);
      } else {
        notify("resources.rooms.action.quarantine_all.failure", {
          type: "error",
          messageArgs: { errMsg: result.error || "" },
        });
      }
    } catch {
      notify("resources.rooms.action.quarantine_all.failure", {
        type: "error",
        messageArgs: { errMsg: "" },
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Button label="resources.rooms.action.quarantine_all.label" onClick={() => setOpen(true)}>
        <BlockIcon />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.rooms.action.quarantine_all.title", { roomName })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{translate("resources.rooms.action.quarantine_all.content")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} disabled={loading} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleQuarantine}
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

/**
 * Quarantine all media for a user.
 * Shows a confirmation dialog before proceeding.
 */
export const QuarantineUserMediaButton = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;

  if (!record) return null;

  const userName = (record.displayname || record.id) as string;

  const handleQuarantine = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.quarantineUserMedia(record.id as string);
      if (result.success) {
        notify("resources.users.action.quarantine_all.success", {
          type: "success",
          messageArgs: { smart_count: result.num_quarantined },
        });
        setOpen(false);
      } else {
        notify("resources.users.action.quarantine_all.failure", {
          type: "error",
          messageArgs: { errMsg: result.error || "" },
        });
      }
    } catch {
      notify("resources.users.action.quarantine_all.failure", {
        type: "error",
        messageArgs: { errMsg: "" },
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Button label="resources.users.action.quarantine_all.label" onClick={() => setOpen(true)}>
        <BlockIcon />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>{translate("resources.users.action.quarantine_all.title", { userName })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{translate("resources.users.action.quarantine_all.content")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} disabled={loading} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleQuarantine}
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
