import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GavelIcon from "@mui/icons-material/Gavel";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { Box, Chip, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDataProvider, useLocale, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../providers/types";
import { DATE_FORMAT } from "../utils/date";

const tooltipSx = { tooltip: { sx: { fontSize: "0.875rem" } } };

const UserInfoChips = () => {
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const record = useRecordContext();
  const translate = useTranslate();
  const locale = useLocale();
  const [inviteCount, setInviteCount] = useState<number | null>(null);
  const [joinedRoomCount, setJoinedRoomCount] = useState<number | null>(null);

  useEffect(() => {
    if (!record) return;
    const fetchCounts = async () => {
      try {
        const [invites, rooms] = await Promise.all([
          dataProvider.getSentInviteCount(record.id),
          dataProvider.getCumulativeJoinedRoomCount(record.id),
        ]);
        setInviteCount(invites);
        setJoinedRoomCount(rooms);
      } catch (error) {
        console.error("Failed to fetch user counts for", record.id, error);
      }
    };
    fetchCounts();
  }, [dataProvider, record]);

  if (!record) {
    return null;
  }

  const createdDate = record.creation_ts_ms
    ? new Date(record.creation_ts_ms).toLocaleDateString(locale, DATE_FORMAT)
    : record.created_at
      ? new Date(String(record.created_at)).toLocaleDateString(locale, DATE_FORMAT)
      : null;

  return (
    <Box
      sx={{ display: "flex", gap: 1, flexWrap: "wrap", flexDirection: "column", width: "100%", color: "text.primary" }}
    >
      {createdDate && (
        <Chip
          icon={<CalendarTodayIcon />}
          label={`${translate("resources.users.fields.creation_ts_ms")}: ${createdDate}`}
          variant="outlined"
        />
      )}
      {record.consent_version && (
        <Chip
          icon={<GavelIcon />}
          label={`${translate("resources.users.fields.consent_version")}: ${record.consent_version}`}
          variant="outlined"
        />
      )}
      {inviteCount !== null && (
        <Tooltip title={translate("resources.users.helper.sent_invite_count")} arrow slotProps={tooltipSx}>
          <Chip
            icon={<MailOutlineIcon />}
            label={`${translate("resources.users.fields.sent_invite_count")}: ${inviteCount}`}
            variant="outlined"
            sx={{ cursor: "help" }}
          />
        </Tooltip>
      )}
      {joinedRoomCount !== null && (
        <Tooltip title={translate("resources.users.helper.cumulative_joined_room_count")} arrow slotProps={tooltipSx}>
          <Chip
            icon={<MeetingRoomIcon />}
            label={`${translate("resources.users.fields.cumulative_joined_room_count")}: ${joinedRoomCount}`}
            variant="outlined"
            sx={{ cursor: "help" }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default UserInfoChips;
