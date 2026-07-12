import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
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

// permissive shape check only: an @ with a dot after it, within the length cap. the server is the
// strict authority and returns a localized error, so a stricter client would falsely reject an
// address the server would accept.
const looksLikeEmail = (v: string): boolean => {
  const at = v.indexOf("@");
  return at > 0 && v.indexOf(".", at) > at + 1 && v.length <= MAX_EMAIL_LEN;
};

const sameSet = (a: string[], b: string[]): boolean => a.length === b.length && a.every(x => b.includes(x));

const KEY = "etkecc.billing.invoice_emails";

export const InvoiceEmailsSection = ({ etkeccAdmin }: { etkeccAdmin: string }) => {
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const locale = useLocale();
  const notify = useNotify();
  const translate = useTranslate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [loaded, setLoaded] = useState<InvoiceEmails>({ enabled: false, emails: [] });
  const [enabled, setEnabled] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // set when a prior DESTRUCTIVE save errored: a later success returning canceled:0 is then ambiguous
  // (the failed attempt may have canceled), so the toast softens rather than claiming a clean zero.
  const [prevFailedDestructive, setPrevFailedDestructive] = useState(false);

  // read locale via a ref so a mid-edit language switch doesn't refetch and clobber unsaved changes;
  // the baseline only depends on which server we're configuring, not on the UI language.
  const localeRef = useRef(locale);
  useEffect(() => {
    localeRef.current = locale;
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await dataProvider.getInvoiceEmails(etkeccAdmin, localeRef.current);
        if (!active) return;
        // dedupe once at the boundary so `loaded` and `emails` share one canonical array; a
        // duplicate-bearing response would otherwise make sameSet() flip `changed` on an untouched page.
        const cfg = { ...raw, emails: [...new Set(raw.emails)] };
        setLoaded(cfg);
        setEnabled(cfg.enabled);
        setEmails(cfg.emails);
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
  }, [etkeccAdmin, dataProvider, notify, translate]);

  const emailsValid = emails.length <= MAX_EMAILS && emails.every(looksLikeEmail);
  const changed = enabled !== loaded.enabled || !sameSet(emails, loaded.emails);
  // when enabled, at least one valid address is required; removing all recipients is done via the toggle.
  const canSave = !saving && changed && (enabled ? emails.length > 0 && emailsValid : true);

  // strong warning only when the save leaves the server with zero active recipients (toggle off, or an
  // empty list); adding, editing, or dropping one of several cancels nothing and gets the mild copy.
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
        // a prior destructive attempt errored, so a 0 here doesn't prove nothing happened; soften
        // instead of claiming a clean zero.
        notify(translate(`${KEY}.saved_canceled_retry`), { type: "info" });
      } else {
        notify(translate(`${KEY}.saved`), { type: "success" });
      }
      setPrevFailedDestructive(false);
    } catch (error) {
      log.error("upsertInvoiceEmails failed", { error });
      // only a failed DESTRUCTIVE save leaves the canceled count ambiguous; an additive failure
      // cancels nothing, so it must not later trigger the softened "may already have been canceled" copy.
      setPrevFailedDestructive(prev => prev || wasDestructive);
      // an etkecc.-prefixed message is a translation key (rate-limit, fallback); anything else is a
      // server-localized message shown verbatim (the transport normalizes network errors to a key).
      const raw = error instanceof Error ? error.message : "";
      const display = raw && !raw.startsWith("etkecc.") ? raw : translate(raw || `${KEY}.error_save`);
      notify(display, { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // same card the rest of BillingPage speaks in, so this section stops looking homeless next to it.
  const cardSx = (t: typeof theme) => ({
    p: { xs: 2, sm: 3 },
    borderRadius: 3,
    border: t.palette.mode === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
  });

  if (loading) {
    return (
      <Paper elevation={0} sx={cardSx}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={cardSx}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptLongIcon fontSize="small" />
            {translate(`${KEY}.title`)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {translate(`${KEY}.description`)}
          </Typography>
        </Box>
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
        <Box>
          <Button
            variant="contained"
            onClick={() => setConfirmOpen(true)}
            disabled={!canSave}
            fullWidth={isSmall}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
            sx={{ minHeight: 44 }}
          >
            {translate(`${KEY}.save`)}
          </Button>
        </Box>
      </Stack>
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
    </Paper>
  );
};
