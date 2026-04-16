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
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useId, useState } from "react";
import {
  Button,
  useDataProvider,
  useListContext,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
  useUnselectAll,
} from "react-admin";

import { SynapseDataProvider } from "../../../providers/types";

/**
 * Single room block/unblock button for the room show page.
 * Fetches block status on mount, shows "Block" or "Unblock" accordingly.
 * Block requires confirmation modal, unblock is direct.
 */
export const BlockRoomButton = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const record = useRecordContext();
  const [open, setOpen] = useState(false);
  const [blocked, setBlocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const titleId = useId();

  useEffect(() => {
    if (!record?.id) return;
    dataProvider.getRoomBlockStatus(record.id as string).then(result => {
      if (result.success) {
        setBlocked(result.block);
      }
    });
  }, [record?.id, dataProvider]);

  if (!record || blocked === null) {
    return null;
  }

  const roomName = (record.name || record.canonical_alias || record.id) as string;

  const handleBlock = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.blockRoom(record.id as string, true);
      if (result.success) {
        notify("resources.rooms.action.block.success", { messageArgs: { smart_count: 1 } });
        setBlocked(true);
        setOpen(false);
        refresh();
      } else {
        notify(result.error || "resources.rooms.action.block.failure", {
          type: "error",
          messageArgs: { smart_count: 1 },
        });
      }
    } catch {
      notify("resources.rooms.action.block.failure", { type: "error", messageArgs: { smart_count: 1 } });
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.blockRoom(record.id as string, false);
      if (result.success) {
        notify("resources.rooms.action.unblock.success", { messageArgs: { smart_count: 1 } });
        setBlocked(false);
        refresh();
      } else {
        notify(result.error || "resources.rooms.action.unblock.failure", {
          type: "error",
          messageArgs: { smart_count: 1 },
        });
      }
    } catch {
      notify("resources.rooms.action.unblock.failure", { type: "error", messageArgs: { smart_count: 1 } });
    } finally {
      setLoading(false);
    }
  };

  if (blocked) {
    return (
      <Button label="resources.rooms.action.unblock.label" onClick={handleUnblock} disabled={loading}>
        <BlockIcon />
      </Button>
    );
  }

  return (
    <>
      <Button label="resources.rooms.action.block.label" onClick={() => setOpen(true)} disabled={loading}>
        <BlockIcon />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        aria-labelledby={titleId}
      >
        <DialogTitle id={titleId}>{translate("resources.rooms.action.block.title", { room: roomName })}</DialogTitle>
        <DialogContent>
          <DialogContentText>{translate("resources.rooms.action.block.content")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleBlock}
            disabled={loading}
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

/**
 * Bulk block/unblock buttons for room lists (main room list + joined_rooms).
 */
export const BlockRoomBulkButton = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { selectedIds } = useListContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const unselectAll = useUnselectAll("rooms");
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const titleId = useId();

  const handleBlock = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => dataProvider.blockRoom(id as string, true)));
      notify("resources.rooms.action.block.success", { messageArgs: { smart_count: selectedIds.length } });
      setOpen(false);
      unselectAll();
      refresh();
    } catch {
      notify("resources.rooms.action.block.failure", {
        type: "error",
        messageArgs: { smart_count: selectedIds.length },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.rooms.action.block.label" onClick={() => setOpen(true)} disabled={loading}>
        <BlockIcon />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        aria-labelledby={titleId}
      >
        <DialogTitle id={titleId}>
          {translate("resources.rooms.action.block.title_bulk", { smart_count: selectedIds.length })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {translate("resources.rooms.action.block.content_bulk", { smart_count: selectedIds.length })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleBlock}
            disabled={loading}
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

export const UnblockRoomBulkButton = () => {
  const { selectedIds } = useListContext();
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll("rooms");
  const dataProvider = useDataProvider() as SynapseDataProvider;

  const handleUnblock = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => dataProvider.blockRoom(id as string, false)));
      notify("resources.rooms.action.unblock.success", { messageArgs: { smart_count: selectedIds.length } });
      unselectAll();
      refresh();
    } catch {
      notify("resources.rooms.action.unblock.failure", {
        type: "error",
        messageArgs: { smart_count: selectedIds.length },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button label="resources.rooms.action.unblock.label" onClick={handleUnblock} disabled={loading}>
      <BlockIcon />
    </Button>
  );
};

/**
 * Toolbar button above the main room list to block a room by ID.
 */
export const BlockRoomByIdButton = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const titleId = useId();

  const handleBlock = async () => {
    if (!roomId) return;
    setLoading(true);
    try {
      const result = await dataProvider.blockRoom(roomId, true);
      if (result.success) {
        notify("resources.rooms.action.block.success", { messageArgs: { smart_count: 1 } });
        setOpen(false);
        setRoomId("");
      } else {
        notify(result.error || "resources.rooms.action.block.failure", {
          type: "error",
          messageArgs: { smart_count: 1 },
        });
      }
    } catch {
      notify("resources.rooms.action.block.failure", { type: "error", messageArgs: { smart_count: 1 } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button label="resources.rooms.action.block.label" onClick={() => setOpen(true)}>
        <BlockIcon />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        aria-labelledby={titleId}
      >
        <DialogTitle id={titleId}>{translate("resources.rooms.action.block.title_by_id")}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>{translate("resources.rooms.action.block.content")}</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label={translate("resources.rooms.fields.room_id")}
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} startIcon={<AlertError />}>
            {translate("ra.action.cancel")}
          </MuiButton>
          <MuiButton
            onClick={handleBlock}
            disabled={!roomId || loading}
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
