import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { Title, useDataProvider, useLocale, useNotify, useStore, useTranslate } from "react-admin";
import { useNavigate, useParams } from "react-router-dom";

import { useAppContext } from "../../Context";
import { SynapseDataProvider, SupportMessage, SupportRequestDetail } from "../../synapse/dataProvider";
import { fetchAuthenticatedMedia } from "../../utils/fetchMedia";
import { useDocTitle } from "../hooks/useDocTitle";
import RichTextEditor from "./RichTextEditor";

interface ResolvedProfile {
  displayName: string;
  avatarSrc?: string;
}

const MXID_REGEX = /^@[^:]+:[^:]+$/;

const isMXID = (value: string) => MXID_REGEX.test(value);

const MessageRow = ({
  msg,
  locale,
  resolvedProfile,
  mxid,
}: {
  msg: SupportMessage;
  locale: string;
  resolvedProfile?: ResolvedProfile;
  mxid?: string;
}) => {
  const navigate = useNavigate();
  const isCustomer = msg.type === "customer";
  const author = resolvedProfile?.displayName ?? msg.created_by?.firstName ?? msg.type;
  const avatarUrl = resolvedProfile?.avatarSrc ?? msg.created_by?.avatarUrl;
  const safeHtml = DOMPurify.sanitize(msg.text, { USE_PROFILES: { html: true } });

  return (
    <Paper
      elevation={2}
      sx={{
        overflow: "hidden",
        border: "1px solid",
        borderColor: "action.selected",
        borderLeft: !isCustomer ? "4px solid" : undefined,
        borderLeftColor: !isCustomer ? "primary.main" : undefined,
      }}
    >
      <Stack direction="row">
        <Box
          onClick={mxid ? () => navigate(`/users/${encodeURIComponent(mxid)}`) : undefined}
          sx={{
            width: 150,
            flexShrink: 0,
            p: 1.5,
            borderRight: "1px solid",
            borderColor: "action.selected",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            cursor: mxid ? "pointer" : undefined,
            "&:hover": mxid ? { bgcolor: "action.hover" } : undefined,
          }}
        >
          <Avatar src={avatarUrl} sx={{ width: 40, height: 40 }}>
            {author?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="subtitle2" textAlign="center" sx={{ wordBreak: "break-all", fontSize: "0.8rem" }}>
            {author}
          </Typography>
          {msg.created_at && (
            <Typography variant="caption" color="text.secondary" textAlign="center">
              {new Date(msg.created_at).toLocaleString(locale)}
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
          <Typography variant="body2" component="div" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        </Box>
      </Stack>
    </Paper>
  );
};

const SupportRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const navigate = useNavigate();
  const notify = useNotify();
  const locale = useLocale();
  const translate = useTranslate();
  const [request, setRequest] = useState<SupportRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState<string | null>(null);
  const draftKey = id ? `supportRequests.${id}.draft` : "supportRequests.unknown.draft";
  const [newMessage, setNewMessage] = useStore<string>(draftKey, "");
  const [sending, setSending] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, ResolvedProfile>>({});
  const fetchedMxids = useRef<Set<string>>(new Set());
  const blobUrlsRef = useRef<string[]>([]);

  useDocTitle(translate("etkecc.support.name"));

  const fetchRequest = async () => {
    if (!etkeccAdmin || !id) return;
    try {
      setFailure(null);
      const data = await dataProvider.getSupportRequest(etkeccAdmin, locale, id);
      setRequest(data);
    } catch (error) {
      console.error("Error fetching support request:", error);
      setFailure(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setRequest(null);
    setFailure(null);
    setProfiles({});
    fetchedMxids.current = new Set();
    for (const url of blobUrlsRef.current) {
      URL.revokeObjectURL(url);
    }
    blobUrlsRef.current = [];
    fetchRequest();
  }, [id, etkeccAdmin, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      for (const url of blobUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  useEffect(() => {
    if (!request) return;
    const baseUrl = localStorage.getItem("base_url");
    const token = localStorage.getItem("access_token");
    if (!baseUrl || !token) return;

    const mxids = [
      ...new Set(
        request.messages
          .filter(m => m.type === "customer" && m.created_by?.firstName && isMXID(m.created_by.firstName))
          .map(m => m.created_by!.firstName)
      ),
    ].filter(mxid => !fetchedMxids.current.has(mxid));
    if (mxids.length === 0) return;

    for (const mxid of mxids) {
      fetchedMxids.current.add(mxid);
    }

    Promise.all(
      mxids.map(async mxid => {
        try {
          const resp = await fetch(`${baseUrl}/_matrix/client/v3/profile/${encodeURIComponent(mxid)}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!resp.ok) return null;
          const json = await resp.json();
          let avatarSrc: string | undefined;
          if (json.avatar_url) {
            try {
              const mediaResp = await fetchAuthenticatedMedia(json.avatar_url as string, "thumbnail");
              if (mediaResp.ok) {
                const blob = await mediaResp.blob();
                avatarSrc = URL.createObjectURL(blob);
                blobUrlsRef.current.push(avatarSrc);
              }
            } catch {
              // avatar fetch failed, skip
            }
          }
          return {
            mxid,
            displayName: (json.displayname as string | undefined) ?? mxid,
            avatarSrc,
          };
        } catch {
          return null;
        }
      })
    ).then(results => {
      const resolved: Record<string, ResolvedProfile> = {};
      for (const r of results) {
        if (r) resolved[r.mxid] = { displayName: r.displayName, avatarSrc: r.avatarSrc };
      }
      setProfiles(prev => ({ ...prev, ...resolved }));
    });
  }, [request]);

  const handleSend = async () => {
    if (!newMessage.trim() || !etkeccAdmin || !id) return;
    setSending(true);
    const messageText = newMessage.trim();
    try {
      await dataProvider.postSupportMessage(etkeccAdmin, locale, id, messageText);
      setNewMessage("");
      const optimisticMsg: SupportMessage = {
        text: messageText,
        type: "operator",
        created_at: new Date().toISOString(),
      };
      setRequest(prev => (prev ? { ...prev, messages: [...prev.messages, optimisticMsg] } : prev));
      fetchRequest();
    } catch (error) {
      console.error("Error sending message:", error);
      notify(error instanceof Error ? error.message : "etkecc.support.actions.send_failure", { type: "error" });
    } finally {
      setSending(false);
    }
  };

  const statusChip = request?.status ? (
    <Chip
      label={translate(`etkecc.support.status.${request.status}`, { _: request.status })}
      size="small"
      color={
        request.status === "active" || request.status === "open"
          ? "success"
          : request.status === "closed"
            ? "default"
            : "info"
      }
    />
  ) : null;

  const header = (
    <>
      <Title title={translate("etkecc.support.name")} />
      <Stack direction="row" alignItems="flex-start" spacing={1}>
        <IconButton onClick={() => navigate("/support")} size="small" sx={{ mt: 0.5 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">{request?.subject || translate("etkecc.support.name")}</Typography>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" mt={0.5}>
            {request?.updated_at && (
              <Typography variant="caption" color="text.secondary">
                {translate("etkecc.support.fields.updated_at")}: {new Date(request.updated_at).toLocaleString(locale)}
              </Typography>
            )}
            {statusChip}
          </Stack>
        </Box>
      </Stack>
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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/support")} sx={{ alignSelf: "flex-start" }}>
          {translate("etkecc.support.buttons.back")}
        </Button>
      </Stack>
    );
  }

  const messages = request?.messages ?? [];

  const getResolvedProfile = (msg: SupportMessage): ResolvedProfile | undefined => {
    const firstName = msg.created_by?.firstName;
    if (msg.type === "customer" && firstName && isMXID(firstName)) {
      return profiles[firstName];
    }
    return undefined;
  };

  return (
    <Stack spacing={2} mt={3}>
      {header}
      <Divider />

      {messages.length === 0 ? (
        <Typography color="text.secondary">{translate("etkecc.support.no_messages")}</Typography>
      ) : (
        <Stack spacing={2}>
          {messages.map((msg, index) => (
            <MessageRow
              key={msg.id ?? index}
              msg={msg}
              locale={locale}
              resolvedProfile={getResolvedProfile(msg)}
              mxid={
                msg.type === "customer" && msg.created_by?.firstName && isMXID(msg.created_by.firstName)
                  ? msg.created_by.firstName
                  : undefined
              }
            />
          ))}
        </Stack>
      )}

      {request?.status === "closed" ? (
        <Alert severity="info">{translate("etkecc.support.closed_message")}</Alert>
      ) : (
        request?.status !== "spam" && (
          <Paper elevation={1} sx={{ p: 2, border: "1px solid", borderColor: "action.selected" }}>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Alert severity="info">{translate("etkecc.support.helper.english_only_notice")}</Alert>
              <Typography variant="caption" color="text.secondary">
                {translate("etkecc.support.helper.response_time_prompt")}{" "}
                <Link href="https://etke.cc/services/support/" target="_blank" rel="noreferrer">
                  etke.cc/services/support
                </Link>
              </Typography>
            </Stack>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {translate("etkecc.support.fields.reply")}
            </Typography>
            <Stack spacing={1}>
              <RichTextEditor
                value={newMessage}
                onChange={setNewMessage}
                placeholder={translate("etkecc.support.helper.reply_placeholder")}
                disabled={sending}
                minRows={6}
              />
              <Box>
                <Button
                  variant="contained"
                  endIcon={sending ? <CircularProgress size={16} /> : <SendIcon />}
                  onClick={handleSend}
                  disabled={sending || !newMessage.trim()}
                >
                  {translate("etkecc.support.buttons.send")}
                </Button>
              </Box>
            </Stack>
          </Paper>
        )
      )}
    </Stack>
  );
};

export default SupportRequestPage;
