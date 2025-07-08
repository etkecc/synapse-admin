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
} from "@mui/material";
import { Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { useDataProvider, useNotify } from "react-admin";

import { useAppContext } from "../../Context";
import { SynapseDataProvider, Payment } from "../../synapse/dataProvider";

const BillingPage = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const notify = useNotify();
  const [paymentsData, setPaymentsData] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
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
        notify("Error fetching billing data", { type: "error" });
        console.error("Error fetching billing data:", error);
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

  if (loading) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography>Loading billing information...</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3} mt={3}>
      <Box>
        <Typography variant="h4">
          <PaymentIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Billing
        </Typography>
        <Typography variant="body1">
          View payments and generate invoices from here. More details about billing can be found{" "}
          <Link href="https://etke.cc/help/extras/scheduler/#billing" target="_blank">
            here
          </Link>
          .
        </Typography>
      </Box>

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
          <Typography variant="body1">No payments found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Paid At</TableCell>
                  <TableCell>Invoice</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsData.map(payment => (
                  <TableRow key={payment.transaction_id}>
                    <TableCell>{payment.transaction_id}</TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>{payment.is_subscription ? "Yes" : "No"}</TableCell>
                    <TableCell>{new Date(payment.paid_at).toLocaleString()}</TableCell>
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
