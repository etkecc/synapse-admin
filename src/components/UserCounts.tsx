import { Box, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDataProvider, useRecordContext, useTranslate } from "react-admin";

import { SynapseDataProvider } from "../providers/types";

const tooltipSx = { tooltip: { sx: { fontSize: "0.875rem" } } };

const UserCounts = () => {
  const dataProvider = useDataProvider() as SynapseDataProvider;
  const record = useRecordContext();
  const translate = useTranslate();
  const [inviteCount, setInviteCount] = useState<number | null>(null);
  const [joinedRoomCount, setJoinedRoomCount] = useState<number | null>(null);

  if (!record) {
    return null;
  }

  useEffect(() => {
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
  }, [dataProvider, record.id]);

  if (inviteCount === null && joinedRoomCount === null) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", gap: 4, marginTop: "8px" }}>
      {inviteCount !== null && (
        <Tooltip title={translate("resources.users.helper.sent_invite_count")} arrow slotProps={tooltipSx}>
          <Typography variant="body1" sx={{ cursor: "help" }}>
            {translate("resources.users.fields.sent_invite_count")}: {inviteCount}
          </Typography>
        </Tooltip>
      )}
      {joinedRoomCount !== null && (
        <Tooltip title={translate("resources.users.helper.cumulative_joined_room_count")} arrow slotProps={tooltipSx}>
          <Typography variant="body1" sx={{ cursor: "help" }}>
            {translate("resources.users.fields.cumulative_joined_room_count")}: {joinedRoomCount}
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
};

export default UserCounts;
