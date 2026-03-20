import ActionCheck from "@mui/icons-material/CheckCircle";
import ActionDelete from "@mui/icons-material/Delete";
import AlertError from "@mui/icons-material/ErrorOutline";
import {
  Button as MuiButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  SimpleForm,
  BooleanInput,
  useTranslate,
  useNotify,
  useRedirect,
  NotificationType,
  useDataProvider,
  Identifier,
  useUnselectAll,
  useRecordContext,
  useResourceContext,
} from "react-admin";

import { SynapseDataProvider } from "../providers/types";

interface DeleteRoomButtonProps {
  selectedIds: Identifier[];
  confirmTitle: string;
  confirmContent: string;
}

const resourceName = "rooms";

const DeleteRoomButton: React.FC<DeleteRoomButtonProps> = props => {
  const translate = useTranslate();
  const [open, setOpen] = useState(false);
  const [block, setBlock] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<null | "active" | "done">(null);

  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider() as SynapseDataProvider;

  const unselectAll = useUnselectAll(resourceName);
  const recordIds = props.selectedIds;
  const record = useRecordContext();
  const resource = useResourceContext();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  let redirectTo = "/rooms";
  if (resource === "joined_rooms" && record?.id) {
    redirectTo = `/users/${encodeURIComponent(record.id)}/rooms`;
  }

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    return stopPolling;
  }, [stopPolling]);

  const handleDialogOpen = () => setOpen(true);

  const handleDialogClose = () => {
    if (deleteStatus === "active") {
      // Deletion continues server-side; just close the dialog
      stopPolling();
      setDeleteStatus(null);
      setOpen(false);
      notify("resources.rooms.action.erase.background_note", { type: "info" as NotificationType });
      return;
    }
    setOpen(false);
    setDeleteStatus(null);
  };

  const handleConfirm = async () => {
    setDeleteStatus("active");

    try {
      const results = await Promise.all(recordIds.map(id => dataProvider.deleteRoom(id as string, block)));

      const deleteIds = results.filter(r => r.success && r.delete_id).map(r => r.delete_id!);
      const failedImmediately = results.filter(r => !r.success);

      if (failedImmediately.length > 0) {
        notify("resources.rooms.action.erase.failure", { type: "error" as NotificationType });
      }

      if (deleteIds.length === 0) {
        setDeleteStatus(null);
        if (failedImmediately.length === 0) {
          // All succeeded without delete_ids (shouldn't happen, but handle gracefully)
          notify("resources.rooms.action.erase.success");
          setOpen(false);
          unselectAll();
          redirect(redirectTo);
        }
        return;
      }

      const pending = new Set(deleteIds);

      pollRef.current = setInterval(async () => {
        const statuses = await Promise.all(
          [...pending].map(async deleteId => {
            const status = await dataProvider.getRoomDeleteStatus(deleteId);
            return { deleteId, ...status };
          })
        );

        for (const s of statuses) {
          if (s.status === "complete") {
            pending.delete(s.deleteId);
          } else if (s.status === "failed") {
            pending.delete(s.deleteId);
          }
        }

        if (pending.size === 0) {
          stopPolling();
          setDeleteStatus("done");
          setOpen(false);

          const failed = statuses.filter(s => s.status === "failed");
          if (failed.length > 0) {
            notify("resources.rooms.action.erase.failure", { type: "error" as NotificationType });
          } else {
            notify("resources.rooms.action.erase.success");
          }

          unselectAll();
          redirect(redirectTo);
        }
      }, 3000);
    } catch {
      stopPolling();
      setDeleteStatus(null);
      notify("resources.rooms.action.erase.failure", { type: "error" as NotificationType });
    }
  };

  const loading = deleteStatus === "active";

  return (
    <Fragment>
      <Button
        label="ra.action.delete"
        onClick={handleDialogOpen}
        disabled={loading}
        className={"ra-delete-button"}
        key="button"
        color={"error"}
      >
        <ActionDelete />
      </Button>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>{translate(props.confirmTitle)}</DialogTitle>
        <DialogContent>
          <DialogContentText>{translate(props.confirmContent)}</DialogContentText>
          <SimpleForm toolbar={false}>
            <BooleanInput
              source="block"
              value={block}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBlock(event.target.checked)}
              label="resources.rooms.action.erase.fields.block"
              defaultValue={false}
              disabled={loading}
            />
          </SimpleForm>
          {deleteStatus === "active" && (
            <>
              <DialogContentText sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                {translate("resources.rooms.action.erase.in_progress")}
              </DialogContentText>
              <DialogContentText sx={{ mt: 1 }}>
                {translate("resources.rooms.action.erase.background_note")}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDialogClose} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            disabled={loading}
            onClick={handleConfirm}
            className={"ra-confirm RaConfirm-confirmPrimary"}
            autoFocus
            startIcon={loading ? <CircularProgress size={16} /> : <ActionCheck />}
          >
            {translate("ra.action.confirm")}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default DeleteRoomButton;
