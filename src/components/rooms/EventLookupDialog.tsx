import AlertError from "@mui/icons-material/ErrorOutline";
import ActionCheck from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button as MuiButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField as MuiTextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ReactNode, useEffect, useState } from "react";
import { useDataProvider, useNotify, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../../providers/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Renders a JSON string with Matrix event IDs ($...) as clickable elements.
 */
export const renderWithEventIds = (text: string, onEventIdClick?: (id: string) => void): ReactNode => {
  if (!onEventIdClick || !text.includes('"$')) return text; // fast path: no event IDs

  const pattern = /"(\$[A-Za-z0-9\-_]+)"/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const eventId = match[1];
    parts.push('"');
    parts.push(
      <Box
        key={`event-${eventId}`}
        component="button"
        onClick={() => onEventIdClick(eventId)}
        sx={{
          all: "unset",
          cursor: "pointer",
          color: "primary.main",
          textDecoration: "underline",
          fontFamily: "inherit",
          fontSize: "inherit",
        }}
      >
        {eventId}
      </Box>
    );
    parts.push('"');
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
};

export const EventFields = ({
  event,
  onEventIdClick,
}: {
  event: Record<string, any>;
  onEventIdClick?: (id: string) => void;
}) => (
  <Box
    component="pre"
    sx={{
      whiteSpace: "pre-wrap",
      wordBreak: "break-all",
      m: 0,
      p: 2,
      fontSize: { xs: "0.75rem", sm: "0.85rem" },
      bgcolor: "action.hover",
      borderRadius: 1,
      overflow: "auto",
      maxWidth: "100%",
    }}
  >
    {renderWithEventIds(JSON.stringify(event, null, 4), onEventIdClick)}
  </Box>
);

/**
 * Reusable "Look Up Event by ID" dialog.
 *
 * Two usage modes:
 * - Manual lookup (reports toolbar): omit `initialEventId`; renders a text field so the
 *   user can type an event ID, then click "Look Up".
 * - Auto-lookup (click an event_id in RoomMessages): pass `initialEventId`; the dialog
 *   shows the ID as a subtitle and fetches immediately on open, no input needed.
 */
export const EventLookupDialog = ({
  open,
  onClose,
  initialEventId,
}: {
  open: boolean;
  onClose: () => void;
  initialEventId?: string;
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [eventId, setEventId] = useState(initialEventId || "");
  const [displayEventId, setDisplayEventId] = useState(initialEventId || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotify();
  const translate = useTranslate();
  const dataProvider = useDataProvider() as SynapseDataProvider;

  const reset = () => {
    setResult(null);
    setError(null);
  };

  const handleClose = () => {
    reset();
    setEventId(initialEventId || "");
    setDisplayEventId(initialEventId || "");
    onClose();
  };

  const handleFetch = async (id?: string) => {
    const target = id ?? eventId;
    if (!target) return;
    setLoading(true);
    reset();
    try {
      const json = await dataProvider.fetchEvent(target);
      setResult(json);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      notify("resources.reports.action.fetch_event_error", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleNestedEventClick = (id: string) => {
    setDisplayEventId(id);
    handleFetch(id);
  };

  // When opened with a pre-known event ID, sync state and auto-fetch.
  useEffect(() => {
    if (open && initialEventId) {
      setEventId(initialEventId);
      setDisplayEventId(initialEventId);
      handleFetch(initialEventId);
    }
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialEventId]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="event-lookup-dialog-title"
    >
      <DialogTitle id="event-lookup-dialog-title">
        {translate("resources.reports.action.event_lookup.title")}
      </DialogTitle>
      <DialogContent>
        {initialEventId ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1.5, wordBreak: "break-all" }}
          >
            {displayEventId}
          </Typography>
        ) : (
          <MuiTextField
            autoFocus
            fullWidth
            label={translate("resources.reports.fields.event_id")}
            value={eventId}
            onChange={e => setEventId(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            onKeyDown={e => {
              if (e.key === "Enter") handleFetch();
            }}
          />
        )}
        {loading && <CircularProgress size={24} />}
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}
        {result && <EventFields event={result} onEventIdClick={handleNestedEventClick} />}
      </DialogContent>
      <DialogActions>
        <MuiButton onClick={handleClose} startIcon={<AlertError />}>
          {translate("ra.action.cancel")}
        </MuiButton>
        {!initialEventId && (
          <MuiButton
            onClick={() => handleFetch()}
            disabled={!eventId || loading}
            className="ra-confirm RaConfirm-confirmPrimary"
            startIcon={<ActionCheck />}
          >
            {translate("resources.reports.action.event_lookup.fetch")}
          </MuiButton>
        )}
      </DialogActions>
    </Dialog>
  );
};
