import AddIcon from "@mui/icons-material/Add";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Title, useDataProvider, useLocale, useNotify, useTranslate } from "react-admin";
import { useNavigate } from "react-router-dom";

import { EtkeAttribution } from "./EtkeAttribution";
import RichTextEditor from "./RichTextEditor";
import { useAppContext } from "../../Context";
import { SynapseDataProvider, SupportRequest } from "../../synapse/dataProvider";
import { useDocTitle } from "../hooks/useDocTitle";

const CreateRequestForm = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: (subject: string, message: string) => Promise<void>;
  onCancel: () => void;
}) => {
  const translate = useTranslate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedScope, setConfirmedScope] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(subject.trim(), message.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {translate("etkecc.support.create_title")}
      </Typography>
      <Stack spacing={2}>
        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "background.default" }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">{translate("etkecc.support.helper.before_contact_title")}</Typography>
            <Typography variant="body2" color="text.secondary">
              {translate("etkecc.support.helper.help_pages_prompt")}{" "}
              <Link href="https://etke.cc/help/" target="_blank" rel="noreferrer">
                etke.cc/help
              </Link>{" "}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {translate("etkecc.support.helper.services_prompt")}{" "}
              <Link href="https://etke.cc/services/" target="_blank" rel="noreferrer">
                etke.cc/services
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {translate("etkecc.support.helper.topics_prompt")}{" "}
              <Link href="https://etke.cc/services/support/#topics" target="_blank" rel="noreferrer">
                etke.cc/services/support/#topics
              </Link>
            </Typography>
            <FormControlLabel
              control={
                <Checkbox checked={confirmedScope} onChange={event => setConfirmedScope(event.target.checked)} />
              }
              label={translate("etkecc.support.helper.scope_confirm_label")}
            />
          </Stack>
        </Paper>
        <TextField
          label={translate("etkecc.support.fields.subject")}
          value={subject}
          onChange={e => setSubject(e.target.value)}
          fullWidth
          required
          disabled={submitting}
        />
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {translate("etkecc.support.fields.message")} *
          </Typography>
          <RichTextEditor
            value={message}
            onChange={setMessage}
            placeholder={translate("etkecc.support.helper.reply_placeholder")}
            disabled={submitting}
            minRows={4}
          />
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !subject.trim() || !message.trim() || !confirmedScope}
            startIcon={submitting ? <CircularProgress size={16} /> : undefined}
          >
            {translate("etkecc.support.buttons.submit")}
          </Button>
          <Button variant="text" onClick={onCancel} disabled={submitting}>
            {translate("etkecc.support.buttons.cancel")}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

const SupportPage = () => {
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const navigate = useNavigate();
  const notify = useNotify();
  const locale = useLocale();
  const translate = useTranslate();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useDocTitle(translate("etkecc.support.name"));

  const fetchRequests = async () => {
    if (!etkeccAdmin) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setFailure(null);
      const data = await dataProvider.getSupportRequests(etkeccAdmin, locale);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching support requests:", error);
      setFailure(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [etkeccAdmin, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (subject: string, message: string) => {
    try {
      const created = await dataProvider.createSupportRequest(etkeccAdmin as string, locale, subject, message);
      notify("etkecc.support.actions.create_success", { type: "success" });
      navigate(`/support/${created.id}`);
    } catch (error) {
      console.error("Error creating support request:", error);
      notify(error instanceof Error ? error.message : "etkecc.support.actions.create_failure", { type: "error" });
      throw error;
    }
  };

  const header = (
    <>
      <Title title={translate("etkecc.support.name")} />
      <Box>
        <Typography variant="h4">
          <SupportAgentIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          {translate("etkecc.support.name")}
        </Typography>
        <EtkeAttribution>
          <Typography variant="body1">{translate("etkecc.support.description")}</Typography>
        </EtkeAttribution>
      </Box>
    </>
  );

  if (loading) {
    return (
      <Stack spacing={3} mt={3}>
        {header}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          <CircularProgress size={20} />
          <Typography>{translate("etkecc.support.helper.loading")}</Typography>
        </Box>
      </Stack>
    );
  }

  if (failure) {
    return (
      <Stack spacing={3} mt={3}>
        {header}
        <Alert severity="error">{failure}</Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} mt={3}>
      {header}

      {showCreateForm ? (
        <CreateRequestForm onSubmit={handleCreate} onCancel={() => setShowCreateForm(false)} />
      ) : (
        <Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowCreateForm(true)} sx={{ mb: 2 }}>
            {translate("etkecc.support.buttons.new_request")}
          </Button>
        </Box>
      )}

      {requests.length === 0 ? (
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography>{translate("etkecc.support.no_requests")}</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{translate("etkecc.support.fields.subject")}</TableCell>
                <TableCell>{translate("etkecc.support.fields.status")}</TableCell>
                <TableCell>{translate("etkecc.support.fields.created_at")}</TableCell>
                <TableCell>{translate("etkecc.support.fields.updated_at")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map(req => (
                <TableRow key={req.id} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/support/${req.id}`)}>
                  <TableCell>{req.subject || req.id}</TableCell>
                  <TableCell>
                    {req.status && (
                      <Chip
                        label={translate(`etkecc.support.status.${req.status}`, { _: req.status })}
                        size="small"
                        color={
                          req.status === "active" || req.status === "open"
                            ? "success"
                            : req.status === "closed"
                              ? "default"
                              : "info"
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>{req.created_at ? new Date(req.created_at).toLocaleString(locale) : ""}</TableCell>
                  <TableCell>{req.updated_at ? new Date(req.updated_at).toLocaleString(locale) : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default SupportPage;
