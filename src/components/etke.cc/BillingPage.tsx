import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Box,
  Typography,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
import { useDataProvider, useNotify } from "react-admin";

import { useAppContext } from "../../Context";
import { SynapseDataProvider, Payment } from "../../synapse/dataProvider";

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
  const [paymentsData, setPaymentsData] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!etkeccAdmin) return;

      try {
        setLoading(true);
        const response = await dataProvider.getPayments(etkeccAdmin);
        setPaymentsData(response.payments);
        setTotal(response.total);
      } catch (error) {
        console.error("Error fetching billing data:", error);
        setFailure(error instanceof Error ? error.message : error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [etkeccAdmin, dataProvider, notify]);

  const handleInvoiceDownload = async (transactionId: string) => {
    if (!etkeccAdmin || downloadingInvoice) return;

    try {
      setDownloadingInvoice(transactionId);
      await dataProvider.getInvoice(etkeccAdmin, transactionId);
      notify("Invoice download started", { type: "info" });
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
    <Box>
      <Typography variant="h4">
        <PaymentIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Billing
      </Typography>
      <Typography variant="body1">
        View payments and generate invoices from here. More details about billing can be found{" "}
        <Link href="https://etke.cc/help/extras/scheduler/#payments" target="_blank">
          here
        </Link>
        .
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Stack spacing={3} mt={3}>
        {header}
        <Box sx={{ mt: 3 }}>
          <Typography>Loading billing information...</Typography>
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
            There was a problem loading your billing information.
            <br />
            This might be a temporary issue - please try again in a few minutes.
            <br />
            If it persists, contact{" "}
            <Link href="https://etke.cc/contacts/" target="_blank">
              etke.cc support team
            </Link>{" "}
            with the following error message:
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {failure}
          </Typography>
        </Box>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} mt={3}>
      {header}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Payment Summary</Typography>
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">Total Payments:</Typography>
          <Chip label={total} color="primary" variant="outlined" />
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Payment History
        </Typography>
        {paymentsData.length === 0 ? (
          <Typography variant="body1">
            No payments found. If you believe that's an error, please{" "}
            <Link href="https://etke.cc/contacts/" target="_blank">
              contact etke.cc support
            </Link>
            .
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Paid At</TableCell>
                  <TableCell>Download Invoice</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsData.map(payment => (
                  <TableRow key={payment.transaction_id}>
                    <TableCell>
                      <TruncatedUUID uuid={payment.transaction_id} />
                    </TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>{payment.is_subscription ? "Subscription" : "One-time"}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(payment.paid_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleInvoiceDownload(payment.transaction_id)}
                        disabled={downloadingInvoice === payment.transaction_id}
                      >
                        {downloadingInvoice === payment.transaction_id ? "Downloading..." : "Invoice"}
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
