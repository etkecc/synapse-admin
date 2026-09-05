import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useEffect, useRef, useState } from "react";
import { Confirm, useDataProvider, useLocale, useNotify, useTranslate } from "react-admin";

import { ChipInput } from "../ChipInput";
import { InvoiceEmails, SynapseDataProvider } from "../../providers/types";
import createLogger from "../../utils/logger";

const log = createLogger("invoice-emails");

// client-side caps, kept in sync with the server's limits, to block a save it would reject anyway.
const MAX_EMAILS = 5;
const MAX_EMAIL_LEN = 320;

// Loose check only (@ + dot + length cap); server is the strict authority, a tighter client could reject valid input.
const looksLikeEmail = (v: string): boolean => {
  const at = v.indexOf("@");
  return at > 0 && v.indexOf(".", at) > at + 1 && v.length <= MAX_EMAIL_LEN;
};

const sameSet = (a: string[], b: string[]): boolean => a.length === b.length && a.every(x => b.includes(x));

const KEY = "etkecc.billing.invoice_emails";

export const InvoiceEmailsDialog = ({
  etkeccAdmin,
  open,
  onClose,
}: {
  etkeccAdmin: string;
  open: boolean;
  onClose: () => void;
}) => {
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const locale = useLocale();
  const notify = useNotify();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [loaded, setLoaded] = useState<InvoiceEmails>({ enabled: false, emails: [] });
  const [enabled, setEnabled] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Set when a prior destructive save errored: a later canceled:0 is ambiguous, so the toast softens the claim.
  const [prevFailedDestructive, setPrevFailedDestructive] = useState(false);

  // Read locale via a ref: a language switch mid-edit must not refetch and clobber unsaved changes.
  const localeRef = useRef(locale);
  useEffect(() => {
    localeRef.current = locale;
  });

  // Fetch on open and every reopen: no network while closed, and a reopen always reflects server state.
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const raw = await dataProvider.getInvoiceEmails(etkeccAdmin, localeRef.current);
        if (!active) return;
        // Dedupe once here so `loaded`/`emails` share one array; duplicates would falsely flip sameSet()'s changed.
        const cfg = { ...raw, emails: [...new Set(raw.emails)] };
        setLoaded(cfg);
        setEnabled(cfg.enabled);
        setEmails(cfg.emails);
        setPrevFailedDestructive(false); // reopen is a fresh baseline, drop any softened-toast flag from a prior attempt.
      } catch (error) {
        log.error("getInvoiceEmails failed", { error });
        if (active) notify(translate(`${KEY}.error_load`), { type: "error" });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [open, etkeccAdmin, dataProvider, notify, translate]);

  const emailsValid = emails.length <= MAX_EMAILS && emails.every(looksLikeEmail);
  const changed = enabled !== loaded.enabled || !sameSet(emails, loaded.emails);
  // when enabled, at least one valid address is required; removing all recipients is done via the toggle.
  const canSave = !saving && changed && (enabled ? emails.length > 0 && emailsValid : true);

  // Strong warning only when save leaves zero active recipients; editing one of several gets the mild copy instead.
  const destructive = loaded.enabled && loaded.emails.length > 0 && !(enabled && emails.length > 0);

  const handleConfirm = async () => {
    const wasDestructive = destructive;
    setConfirmOpen(false);
    setSaving(true);
    const payload = enabled ? emails : [];
    try {
      const raw = await dataProvider.upsertInvoiceEmails(etkeccAdmin, locale, enabled, payload);
      // dedupe at the boundary, same as on load, so `loaded` and `emails` stay one canonical array.
      const result = { ...raw, emails: [...new Set(raw.emails)] };
      setLoaded(result);
      setEnabled(result.enabled);
      setEmails(result.emails);
      if (result.canceled && result.canceled > 0) {
        notify(translate(`${KEY}.saved_canceled`, { smart_count: result.canceled }), { type: "info" });
      } else if (prevFailedDestructive) {
        // A prior destructive attempt errored, so a 0 here doesn't prove nothing happened; soften the claim.
        notify(translate(`${KEY}.saved_canceled_retry`), { type: "info" });
      } else {
        notify(translate(`${KEY}.saved`), { type: "success" });
      }
      setPrevFailedDestructive(false);
    } catch (error) {
      log.error("upsertInvoiceEmails failed", { error });
      // Only a failed destructive save leaves canceled count ambiguous; an additive failure never sets this flag.
      setPrevFailedDestructive(prev => prev || wasDestructive);
      // etkecc.-prefixed is a translation key (network errors normalize to one); else it's server text, verbatim.
      const raw = error instanceof Error ? error.message : "";
      const display = raw && !raw.startsWith("etkecc.") ? raw : translate(raw || `${KEY}.error_save`);
      notify(display, { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // don't let a backdrop/Escape close yank the dialog out from under an in-flight save.
  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={isSmall} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ReceiptLongIcon fontSize="small" />
        {translate(`${KEY}.title`)}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {translate(`${KEY}.description`)}
            </Typography>
            <FormControlLabel
              control={<Switch checked={enabled} onChange={e => setEnabled(e.target.checked)} />}
              label={translate(`${KEY}.enabled_label`)}
            />
            {enabled && (
              <Stack spacing={1}>
                <ChipInput
                  label={translate(`${KEY}.emails_label`)}
                  placeholder={translate(`${KEY}.emails_placeholder`)}
                  values={emails}
                  onChange={setEmails}
                  isSmall={isSmall}
                  type="email"
                  autoComplete="email"
                />
                <Typography variant="body2" color="text.secondary">
                  {translate(`${KEY}.emails_helper`)}
                </Typography>
                {emails.length > MAX_EMAILS && (
                  <Typography variant="body2" color="error">
                    {translate(`${KEY}.too_many`, { smart_count: MAX_EMAILS })}
                  </Typography>
                )}
                {emails.some(e => !looksLikeEmail(e)) && (
                  <Typography variant="body2" color="error">
                    {translate(`${KEY}.invalid_email`)}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={saving}>
          {translate("etkecc.billing.company_details.close")}
        </Button>
        <Button
          variant="contained"
          onClick={() => setConfirmOpen(true)}
          disabled={!canSave}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{ minHeight: 44 }}
        >
          {translate(`${KEY}.save`)}
        </Button>
      </DialogActions>
      <Confirm
        isOpen={confirmOpen}
        fullScreen={isSmall}
        title={translate(`${KEY}.confirm_title`)}
        content={
          destructive
            ? translate(`${KEY}.confirm_destructive`, { emails: loaded.emails.join(", ") })
            : translate(`${KEY}.confirm_additive`)
        }
        onConfirm={handleConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </Dialog>
  );
};
