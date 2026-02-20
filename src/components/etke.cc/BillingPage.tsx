import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Box,
  Alert,
  Typography,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import { Title, useDataProvider, useLocale, useNotify, useTranslate } from "react-admin";

import { EtkeAttribution } from "./EtkeAttribution";
import { useAppContext } from "../../Context";
import { SynapseDataProvider, Payment } from "../../synapse/dataProvider";
import { useDocTitle } from "../hooks/useDocTitle";

const TruncatedUUID = ({ uuid }): React.ReactElement => {
  const short = `${uuid.slice(0, 8)}...${uuid.slice(-6)}`;
  const copyToClipboard = () => navigator.clipboard.writeText(uuid);

  return (
    <Tooltip title={uuid}>
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        {short}
        <IconButton size="small" onClick={copyToClipboard}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

const BillingPage = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const notify = useNotify();
  const locale = useLocale();
  const translate = useTranslate();
  const [paymentsData, setPaymentsData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useDocTitle(translate("etkecc.billing.name"));
  useEffect(() => {
    const fetchBillingData = async () => {
      if (!etkeccAdmin) return;

      try {
        setLoading(true);
        const response = await dataProvider.getPayments(etkeccAdmin, locale);
        setPaymentsData(response.payments);
        setMaintenance(response.maintenance);
      } catch (error) {
        console.error("Error fetching billing data:", error);
        setFailure(error instanceof Error ? error.message : (error as string));
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [etkeccAdmin, dataProvider, notify, locale]);

  const handleInvoiceDownload = async (transactionId: string) => {
    if (!etkeccAdmin || downloadingInvoice) return;

    try {
      setDownloadingInvoice(transactionId);
      await dataProvider.getInvoice(etkeccAdmin, locale, transactionId);
      notify("etkecc.billing.helper.download_started", { type: "info" });
    } catch (error) {
      // Use the specific error message from the dataProvider
      const errorMessage = error instanceof Error ? error.message : "Error downloading invoice";
      notify(errorMessage, { type: "error" });
      console.error("Error downloading invoice:", error);
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const header = (
    <>
      <Title title={translate("etkecc.billing.name")} />
      <Box>
        <Typography variant="h4">
          <PaymentIcon sx={{ verticalAlign: "middle", mr: 1 }} /> {translate("etkecc.billing.name")}
        </Typography>
        <EtkeAttribution>
          <Typography variant="body1">
            {translate("etkecc.billing.description1")}{" "}
            <Link href="https://etke.cc/help/payments/" target="_blank">
              etke.cc/help/payments
            </Link>
            .
            <br />
            {translate("etkecc.billing.description2")}{" "}
            <Link href="https://etke.cc/contacts/" target="_blank">
              etke.cc/contacts
            </Link>
            .
          </Typography>
        </EtkeAttribution>
      </Box>
    </>
  );

  if (loading) {
    return (
      <Stack spacing={3} mt={3}>
        {header}
        <Box sx={{ mt: 3 }}>
          <Typography>{translate("etkecc.billing.helper.loading")}</Typography>
        </Box>
      </Stack>
    );
  }

  if (failure) {
    return (
      <Stack spacing={3} mt={3}>
        {header}
        <Box sx={{ mt: 3 }}>
          <Typography>
            {translate("etkecc.billing.helper.loading_failed1")}
            <br />
            {translate("etkecc.billing.helper.loading_failed2")}
            <br />
          </Typography>
          <EtkeAttribution>
            <Typography>
              {translate("etkecc.billing.helper.loading_failed3")}{" "}
              <Link href="https://etke.cc/contacts/" target="_blank">
                etke.cc/contacts
              </Link>{" "}
              {translate("etkecc.billing.helper.loading_failed4")}
            </Typography>
          </EtkeAttribution>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {failure}
          </Typography>
        </Box>
      </Stack>
    );
  }

  if (maintenance) {
    return (
      <Stack spacing={3} mt={3}>
        {header}
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            {translate("etkecc.maintenance.title")}
            <br />
            {translate("etkecc.maintenance.try_again")}
            <br />
            {translate("etkecc.maintenance.note")}
          </Alert>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} mt={3}>
      {header}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {translate("etkecc.billing.title")}
        </Typography>
        {paymentsData.length === 0 ? (
          <Typography variant="body1">
            {translate("etkecc.billing.no_payments")}
            <EtkeAttribution>
              <Typography>
                {translate("etkecc.billing.no_payments_helper")}{" "}
                <Link href="https://etke.cc/contacts/" target="_blank">
                  etke.cc/contacts
                </Link>
                .
              </Typography>
            </EtkeAttribution>
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{translate("etkecc.billing.fields.transaction_id")}</TableCell>
                  <TableCell>{translate("etkecc.billing.fields.email")}</TableCell>
                  <TableCell>{translate("etkecc.billing.fields.type")}</TableCell>
                  <TableCell>{translate("etkecc.billing.fields.amount")}</TableCell>
                  <TableCell>{translate("etkecc.billing.fields.paid_at")}</TableCell>
                  <TableCell>{translate("etkecc.billing.helper.download_invoice")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsData.map(payment => (
                  <TableRow key={payment.transaction_id}>
                    <TableCell>
                      <TruncatedUUID uuid={payment.transaction_id} />
                    </TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>
                      {translate(`etkecc.billing.enums.type.${payment.is_subscription ? "subscription" : "one_time"}`)}
                    </TableCell>
                    <TableCell>
                      {payment.amount.toFixed(2)} {payment.currency}
                    </TableCell>
                    <TableCell>{new Date(payment.paid_at).toLocaleDateString(locale)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleInvoiceDownload(payment.transaction_id)}
                        disabled={downloadingInvoice === payment.transaction_id}
                      >
                        {translate(
                          downloadingInvoice === payment.transaction_id
                            ? "etkecc.billing.helper.downloading"
                            : "etkecc.billing.fields.invoice"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Stack>
  );
};

export default BillingPage;
