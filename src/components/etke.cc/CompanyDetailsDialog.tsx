import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDataProvider, useLocale, useRedirect, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../../providers/types";
import createLogger from "../../utils/logger";

const log = createLogger("company-details");

const KEY = "etkecc.billing.company_details";

// FIELDS carries English labels too: the ticket body stays English since etke.cc support reads English.
const FIELDS = [
  { key: "vat_id", en: "VAT/Tax ID" },
  { key: "company_name", en: "Company name" },
  { key: "country", en: "Country" },
  { key: "address", en: "Address" },
  { key: "postal_code", en: "Postal Code" },
  { key: "city", en: "City" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

const blankValues = (): Record<FieldKey, string> =>
  Object.fromEntries(FIELDS.map(f => [f.key, ""])) as Record<FieldKey, string>;

export const CompanyDetailsDialog = ({
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
  const translate = useTranslate();
  const redirect = useRedirect();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = useState<Record<FieldKey, string>>(blankValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<number | null>(null);

  const allFilled = FIELDS.every(f => values[f.key].trim() !== "");
  const success = requestId !== null;

  // Reset fires on open: the dialog stays visible through the closing fade, so resetting then flashes blank fields.
  useEffect(() => {
    if (!open) return;
    setValues(blankValues());
    setError(null);
    setRequestId(null);
  }, [open]);

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleSend = async () => {
    if (!allFilled || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const rows = FIELDS.map(f => {
        // escape the customer's free text: a stray & or < would otherwise corrupt the ticket HTML.
        const safe = values[f.key].trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<li>${f.en}: ${safe}</li>`;
      }).join("");
      const message = `<p>Hello,</p><p>I would like to add the following company details to my invoices:</p><ul>${rows}</ul><p>Thank you.</p>`;
      const created = await dataProvider.createSupportRequest(
        etkeccAdmin,
        locale,
        "Add company details to invoices",
        message
      );
      setRequestId(created.id);
    } catch (err) {
      log.error("failed to create company details request", err);
      setError(translate(`${KEY}.error`));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={isSmall} fullWidth maxWidth="sm">
      <DialogTitle>{translate(`${KEY}.title`)}</DialogTitle>
      <DialogContent>
        {success ? (
          <DialogContentText sx={{ mt: 1 }}>{translate(`${KEY}.success`)}</DialogContentText>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <DialogContentText>{translate(`${KEY}.description`)}</DialogContentText>
            {error && <Alert severity="error">{error}</Alert>}
            {FIELDS.map(f => (
              <TextField
                key={f.key}
                label={translate(`${KEY}.fields.${f.key}`)}
                value={values[f.key]}
                onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                fullWidth
                required
                disabled={submitting}
              />
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {success ? (
          <>
            <Button onClick={handleClose}>{translate(`${KEY}.close`)}</Button>
            <Button
              variant="contained"
              onClick={() => {
                const id = requestId;
                handleClose();
                redirect(`/support/${id}`);
              }}
            >
              {translate(`${KEY}.view_request`)}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose} disabled={submitting}>
              {translate(`${KEY}.cancel`)}
            </Button>
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={!allFilled || submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : undefined}
            >
              {translate(submitting ? `${KEY}.sending` : `${KEY}.send`)}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
