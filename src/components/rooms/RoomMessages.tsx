import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button as MuiButton,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDataProvider, useNotify, useRecordContext, useTranslate } from "react-admin";

import { RoomEvent, SynapseDataProvider } from "../../providers/types";

const COMMON_EVENT_TYPES = [
  "m.room.message",
  "m.room.member",
  "m.room.name",
  "m.room.topic",
  "m.room.avatar",
  "m.room.power_levels",
  "m.room.join_rules",
  "m.room.history_visibility",
  "m.room.canonical_alias",
  "m.room.encryption",
  "m.room.redaction",
  "m.room.third_party_invite",
  "m.room.pinned_events",
  "m.sticker",
  "m.reaction",
];

const EventCard = ({ event, isTarget, locale }: { event: RoomEvent; isTarget: boolean; locale: string }) => {
  const theme = useTheme();
  const body =
    event.content?.body || event.content?.membership || event.content?.displayname || event.content?.name || null;
  const contentStr = body !== null ? String(body) : JSON.stringify(event.content, null, 2);
  const isSimple = body !== null;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 0.5,
        borderColor: isTarget ? theme.palette.primary.main : undefined,
        borderWidth: isTarget ? 2 : 1,
        backgroundColor: isTarget ? theme.palette.action.selected : undefined,
      }}
    >
      <CardContent sx={{ py: 0.75, "&:last-child": { pb: 0.75 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 0.5 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {event.sender}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {new Date(event.origin_server_ts).toLocaleString(locale)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
          {event.type}
          {!isSimple && <> &middot; {event.event_id}</>}
        </Typography>
        <Typography
          variant="body2"
          component={isSimple ? "span" : "pre"}
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            ...(isSimple ? {} : { fontFamily: "monospace", fontSize: "0.8rem" }),
            m: 0,
            maxHeight: 200,
            overflow: "auto",
          }}
        >
          {contentStr}
        </Typography>
      </CardContent>
    </Card>
  );
};

const PAGE_SIZE = 20;

interface RoomEventFilter {
  types?: string[];
  not_types?: string[];
  senders?: string[];
  not_senders?: string[];
  contains_url?: boolean;
}

const buildFilter = (filter: RoomEventFilter): string | undefined => {
  const obj: Record<string, unknown> = {};
  if (filter.types && filter.types.length > 0) obj.types = filter.types;
  if (filter.not_types && filter.not_types.length > 0) obj.not_types = filter.not_types;
  if (filter.senders && filter.senders.length > 0) obj.senders = filter.senders;
  if (filter.not_senders && filter.not_senders.length > 0) obj.not_senders = filter.not_senders;
  if (filter.contains_url !== undefined) obj.contains_url = filter.contains_url;
  return Object.keys(obj).length > 0 ? JSON.stringify(obj) : undefined;
};

const ChipInput = ({
  label,
  placeholder,
  values,
  onChange,
  isSmall,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (v: string[]) => void;
  isSmall: boolean;
}) => {
  const [input, setInput] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) {
        onChange([...values, input.trim()]);
      }
      setInput("");
    }
  };
  return (
    <Box sx={{ flex: 1, minWidth: isSmall ? undefined : 250 }}>
      <TextField
        size="small"
        fullWidth
        label={label}
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      {values.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
          {values.map(v => (
            <Chip key={v} label={v} size="small" onDelete={() => onChange(values.filter(x => x !== v))} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export const RoomMessages = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider<SynapseDataProvider>();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [messages, setMessages] = useState<RoomEvent[]>([]);
  const [startToken, setStartToken] = useState<string | null>(null);
  const [endToken, setEndToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [targetEventId, setTargetEventId] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState("");
  const [direction, setDirection] = useState<"f" | "b">("b");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [filterNotTypes, setFilterNotTypes] = useState<string[]>([]);
  const [filterSenders, setFilterSenders] = useState<string[]>([]);
  const [filterNotSenders, setFilterNotSenders] = useState<string[]>([]);
  const [filterContainsUrl, setFilterContainsUrl] = useState<boolean | undefined>(undefined);
  const targetRef = useRef<HTMLDivElement>(null);

  const locale = navigator.language || "en";
  const roomId = record?.room_id || record?.id;

  const getFilterObj = useCallback(
    (): RoomEventFilter => ({
      types: filterTypes,
      not_types: filterNotTypes,
      senders: filterSenders,
      not_senders: filterNotSenders,
      contains_url: filterContainsUrl,
    }),
    [filterTypes, filterNotTypes, filterSenders, filterNotSenders, filterContainsUrl]
  );

  const activeFilterCount =
    (filterTypes.length > 0 ? 1 : 0) +
    (filterNotTypes.length > 0 ? 1 : 0) +
    (filterSenders.length > 0 ? 1 : 0) +
    (filterNotSenders.length > 0 ? 1 : 0) +
    (filterContainsUrl !== undefined ? 1 : 0);

  const bootstrap = useCallback(
    async (filter?: string) => {
      if (!roomId) return;
      setInitialLoading(true);
      setMessages([]);
      setTargetEventId(null);
      try {
        const tsResult = await dataProvider.getEventByTimestamp(roomId as string, Date.now(), "b");
        if (!tsResult.success || !tsResult.event_id) {
          setInitialLoading(false);
          return;
        }
        const ctxResult = await dataProvider.getEventContext(roomId as string, tsResult.event_id, 0);
        if (!ctxResult.success || !ctxResult.data) {
          setInitialLoading(false);
          return;
        }
        const msgResult = await dataProvider.getRoomMessages(roomId as string, {
          from: ctxResult.data.end,
          dir: "b",
          limit: PAGE_SIZE,
          filter,
        });
        if (msgResult.success && msgResult.data) {
          setMessages(msgResult.data.chunk);
          setStartToken(msgResult.data.start);
          setEndToken(msgResult.data.end || null);
        }
      } catch {
        notify(translate("resources.rooms.action.messages.failure"), { type: "error" });
      }
      setInitialLoading(false);
    },
    [roomId, dataProvider, notify, translate]
  );

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const currentFilter = buildFilter(getFilterObj());

  const loadMore = async (dir: "b" | "f") => {
    const token = dir === "b" ? endToken : startToken;
    if (!token || !roomId) return;
    setLoading(true);
    try {
      const result = await dataProvider.getRoomMessages(roomId as string, {
        from: token,
        dir,
        limit: PAGE_SIZE,
        filter: currentFilter,
      });
      if (result.success && result.data) {
        if (dir === "b") {
          setMessages(prev => [...prev, ...result.data!.chunk]);
          setEndToken(result.data.end || null);
        } else {
          setMessages(prev => [...result.data!.chunk.reverse(), ...prev]);
          setStartToken(result.data.end || null);
        }
      }
    } catch {
      notify(translate("resources.rooms.action.messages.failure"), { type: "error" });
    }
    setLoading(false);
  };

  const handleJumpToDate = async () => {
    if (!dateInput || !roomId) return;
    setLoading(true);
    setMessages([]);
    setTargetEventId(null);
    try {
      const ts = new Date(dateInput).getTime();
      const tsResult = await dataProvider.getEventByTimestamp(roomId as string, ts, direction);
      if (!tsResult.success || !tsResult.event_id) {
        notify(tsResult.error || translate("resources.rooms.action.event_context.not_found"), { type: "warning" });
        setLoading(false);
        return;
      }
      const ctxResult = await dataProvider.getEventContext(roomId as string, tsResult.event_id);
      if (!ctxResult.success || !ctxResult.data) {
        notify(ctxResult.error || translate("resources.rooms.action.event_context.failure"), { type: "error" });
        setLoading(false);
        return;
      }
      const ctx = ctxResult.data;
      const allEvents = [...ctx.events_before, ctx.event, ...ctx.events_after];
      setMessages(allEvents);
      setStartToken(ctx.start);
      setEndToken(ctx.end || null);
      setTargetEventId(ctx.event.event_id);
      setTimeout(() => targetRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } catch {
      notify(translate("resources.rooms.action.event_context.failure"), { type: "error" });
    }
    setLoading(false);
  };

  const handleApplyFilters = () => {
    bootstrap(buildFilter(getFilterObj()));
  };

  const handleClearFilters = () => {
    setFilterTypes([]);
    setFilterNotTypes([]);
    setFilterSenders([]);
    setFilterNotSenders([]);
    setFilterContainsUrl(undefined);
    bootstrap();
  };

  if (!record) return null;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
        <MuiButton
          variant={showFilters ? "contained" : "outlined"}
          onClick={() => setShowFilters(v => !v)}
          startIcon={<FilterListIcon />}
          size="small"
          color={activeFilterCount > 0 ? "primary" : "inherit"}
        >
          {translate("resources.rooms.action.messages.filter")}
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </MuiButton>
      </Box>

      <Collapse in={showFilters}>
        <Box
          sx={{
            mb: 1,
            p: 1.5,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmall ? "column" : "row",
              gap: 1.5,
              alignItems: isSmall ? "stretch" : "flex-start",
              mb: 1.5,
            }}
          >
            <TextField
              type="datetime-local"
              label={translate("resources.rooms.action.event_context.jump_to_date")}
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth={isSmall}
              sx={{ flex: 1, minWidth: isSmall ? undefined : 250 }}
              size="small"
            />
            <FormControl size="small" sx={{ flex: 1, minWidth: isSmall ? undefined : 130 }}>
              <InputLabel>{translate("resources.rooms.action.event_context.direction")}</InputLabel>
              <Select
                value={direction}
                onChange={e => setDirection(e.target.value as "f" | "b")}
                label={translate("resources.rooms.action.event_context.direction")}
              >
                <MenuItem value="b">{translate("resources.rooms.action.event_context.backward")}</MenuItem>
                <MenuItem value="f">{translate("resources.rooms.action.event_context.forward")}</MenuItem>
              </Select>
            </FormControl>
            <MuiButton
              variant="contained"
              onClick={handleJumpToDate}
              disabled={!dateInput || loading}
              startIcon={loading ? <CircularProgress size={18} /> : <SearchIcon />}
              sx={{ alignSelf: isSmall ? "stretch" : "center", height: 40 }}
            >
              {translate("resources.rooms.action.event_context.jump_to_date")}
            </MuiButton>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: isSmall ? "column" : "row",
              gap: 1.5,
              alignItems: isSmall ? "stretch" : "flex-start",
              mb: 1.5,
            }}
          >
            <Autocomplete
              multiple
              freeSolo
              size="small"
              options={COMMON_EVENT_TYPES}
              value={filterTypes}
              onChange={(_, v) => setFilterTypes(v)}
              renderInput={params => (
                <TextField
                  {...params}
                  label={translate("resources.rooms.action.messages.filter_type")}
                  placeholder="m.room.message"
                />
              )}
              sx={{ flex: 1, minWidth: isSmall ? undefined : 300 }}
            />
            <ChipInput
              label={translate("resources.rooms.action.messages.filter_sender")}
              placeholder="@user:example.com"
              values={filterSenders}
              onChange={setFilterSenders}
              isSmall={isSmall}
            />
          </Box>

          <MuiButton
            size="small"
            onClick={() => setShowAdvancedFilters(v => !v)}
            endIcon={
              <ExpandMoreIcon
                sx={{ transform: showAdvancedFilters ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }}
              />
            }
            sx={{ mb: showAdvancedFilters ? 1.5 : 0, textTransform: "none" }}
          >
            {translate("resources.rooms.action.messages.advanced_filters")}
          </MuiButton>

          <Collapse in={showAdvancedFilters}>
            <Box
              sx={{
                display: "flex",
                flexDirection: isSmall ? "column" : "row",
                gap: 1.5,
                alignItems: isSmall ? "stretch" : "flex-start",
                mb: 1.5,
              }}
            >
              <Autocomplete
                multiple
                freeSolo
                size="small"
                options={COMMON_EVENT_TYPES}
                value={filterNotTypes}
                onChange={(_, v) => setFilterNotTypes(v)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label={translate("resources.rooms.action.messages.filter_not_type")}
                    placeholder="m.room.member"
                  />
                )}
                sx={{ flex: 1, minWidth: isSmall ? undefined : 300 }}
              />
              <ChipInput
                label={translate("resources.rooms.action.messages.filter_not_sender")}
                placeholder="@bot:example.com"
                values={filterNotSenders}
                onChange={setFilterNotSenders}
                isSmall={isSmall}
              />
            </Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>{translate("resources.rooms.action.messages.contains_url")}</InputLabel>
              <Select
                value={filterContainsUrl === undefined ? "" : String(filterContainsUrl)}
                onChange={e => {
                  const v = e.target.value;
                  setFilterContainsUrl(v === "" ? undefined : v === "true");
                }}
                label={translate("resources.rooms.action.messages.contains_url")}
              >
                <MenuItem value="">{translate("resources.rooms.action.messages.any")}</MenuItem>
                <MenuItem value="true">{translate("resources.rooms.action.messages.with_url")}</MenuItem>
                <MenuItem value="false">{translate("resources.rooms.action.messages.without_url")}</MenuItem>
              </Select>
            </FormControl>
          </Collapse>

          <Box sx={{ display: "flex", gap: 1, mt: 1.5, justifyContent: "flex-end" }}>
            {activeFilterCount > 0 && (
              <MuiButton size="small" onClick={handleClearFilters}>
                {translate("resources.rooms.action.messages.clear_filters")}
              </MuiButton>
            )}
            <MuiButton variant="contained" onClick={handleApplyFilters} disabled={loading} size="small">
              {translate("resources.rooms.action.messages.apply_filter")}
            </MuiButton>
          </Box>
        </Box>
      </Collapse>

      <Divider sx={{ mb: 1 }} />

      {initialLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!initialLoading && messages.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          {translate("resources.rooms.action.messages.no_messages")}
        </Typography>
      )}

      {!initialLoading && messages.length > 0 && (
        <>
          {startToken && (
            <MuiButton fullWidth onClick={() => loadMore("f")} disabled={loading} sx={{ mb: 1 }}>
              {translate("resources.rooms.action.messages.load_newer")}
            </MuiButton>
          )}

          {messages.map(evt => (
            <Box key={evt.event_id} ref={evt.event_id === targetEventId ? targetRef : undefined}>
              <EventCard event={evt} isTarget={evt.event_id === targetEventId} locale={locale} />
            </Box>
          ))}

          {endToken && (
            <MuiButton fullWidth onClick={() => loadMore("b")} disabled={loading} sx={{ mt: 1 }}>
              {translate("resources.rooms.action.messages.load_older")}
            </MuiButton>
          )}
        </>
      )}
    </Box>
  );
};
