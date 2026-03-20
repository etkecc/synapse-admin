import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import {
  Box,
  Button as MuiButton,
  Chip,
  CircularProgress,
  Collapse,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useEffect, useState } from "react";
import { useDataProvider, useNotify, useRecordContext, useTranslate } from "react-admin";
import { useNavigate } from "react-router-dom";

import { HierarchyRoom, SynapseDataProvider } from "../providers/types";

interface TreeNode {
  key: string;
  room: HierarchyRoom;
  children: TreeNode[];
  suggested?: boolean;
  placeholder?: boolean;
}

let nodeKeyCounter = 0;

const collectChildIds = (rooms: HierarchyRoom[]): Set<string> => {
  const knownIds = new Set(rooms.map(r => r.room_id));
  const missing = new Set<string>();
  for (const room of rooms) {
    if (room.children_state) {
      for (const child of room.children_state) {
        if (!knownIds.has(child.state_key)) missing.add(child.state_key);
      }
    }
  }
  return missing;
};

const buildTree = (rooms: HierarchyRoom[]): TreeNode[] => {
  if (rooms.length === 0) return [];
  nodeKeyCounter = 0;

  const roomMap = new Map<string, HierarchyRoom>();
  for (const room of rooms) {
    if (!roomMap.has(room.room_id)) {
      roomMap.set(room.room_id, room);
    }
  }

  const createNode = (room: HierarchyRoom, visited: Set<string>, suggested?: boolean): TreeNode => {
    const key = `${room.room_id}-${nodeKeyCounter++}`;
    const children: TreeNode[] = [];
    if (room.children_state) {
      for (const child of room.children_state) {
        if (visited.has(child.state_key)) continue;
        visited.add(child.state_key);
        const knownRoom = roomMap.get(child.state_key);
        const childRoom = knownRoom ?? {
          room_id: child.state_key,
          num_joined_members: 0,
          guest_can_join: false,
          world_readable: false,
          children_state: [],
        };
        const childNode = createNode(childRoom, visited, !!child.content?.suggested);
        if (!knownRoom) childNode.placeholder = true;
        children.push(childNode);
      }
    }
    return { key, room, children, suggested };
  };

  const root = rooms[0];
  const visited = new Set<string>([root.room_id]);
  const rootNode = createNode(root, visited);

  const orphans: TreeNode[] = [];
  for (const room of rooms) {
    if (!visited.has(room.room_id)) {
      visited.add(room.room_id);
      orphans.push(createNode(room, visited));
    }
  }

  return [rootNode, ...orphans];
};

const TreeItem = ({
  node,
  depth,
  indent,
  translate,
  navigate,
}: {
  node: TreeNode;
  depth: number;
  indent: number;
  translate: ReturnType<typeof useTranslate>;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const isSpace = node.room.room_type === "m.space";
  const displayName = node.room.name || node.room.room_id;
  const isClickable = hasChildren || !node.placeholder;

  return (
    <>
      <ListItemButton
        sx={{ pl: depth * indent + 1 }}
        disabled={!isClickable}
        onClick={() => {
          if (hasChildren) {
            setOpen(v => !v);
          } else if (!node.placeholder) {
            navigate(`/rooms/${encodeURIComponent(node.room.room_id)}/show`);
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          {isSpace ? <AccountTreeIcon fontSize="small" color="primary" /> : <MeetingRoomIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography
                variant="body2"
                sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}
              >
                {displayName}
              </Typography>
              <Chip
                label={translate(
                  isSpace ? "resources.rooms.action.hierarchy.space" : "resources.rooms.action.hierarchy.room"
                )}
                size="small"
                variant="outlined"
                color={isSpace ? "primary" : "default"}
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
              {node.room.num_joined_members > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {translate("resources.rooms.action.hierarchy.members", { count: node.room.num_joined_members })}
                </Typography>
              )}
              {node.suggested && (
                <Chip
                  label={translate("resources.rooms.action.hierarchy.suggested")}
                  size="small"
                  color="success"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
              {node.room.join_rule && (
                <Chip
                  label={node.room.join_rule}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
            </Box>
          }
          secondary={node.room.topic}
          slotProps={{ secondary: { noWrap: true } }}
        />
        {hasChildren && (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding>
            {node.children.map(child => (
              <TreeItem
                key={child.key}
                node={child}
                depth={depth + 1}
                indent={indent}
                translate={translate}
                navigate={navigate}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export const RoomHierarchy = () => {
  const record = useRecordContext();
  const translate = useTranslate();
  const notify = useNotify();
  const navigate = useNavigate();
  const dataProvider = useDataProvider<SynapseDataProvider>();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [tree, setTree] = useState<TreeNode[]>([]);
  const [allRooms, setAllRooms] = useState<HierarchyRoom[]>([]);
  const [nextBatch, setNextBatch] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [maxDepth, setMaxDepth] = useState<number | "">("");

  const roomId = record?.room_id || record?.id;
  const indent = isSmall ? 2 : 3;

  const fetchHierarchy = useCallback(
    async (from?: string) => {
      if (!roomId) return;
      setLoading(true);
      try {
        const params: { from?: string; limit?: number; max_depth?: number } = {};
        if (from) params.from = from;
        if (maxDepth !== "") params.max_depth = maxDepth;
        const result = await dataProvider.getRoomHierarchy(roomId as string, params);
        if (result.success && result.data) {
          const newRooms = from ? [...allRooms, ...result.data.rooms] : result.data.rooms;
          const missingIds = collectChildIds(newRooms);
          if (missingIds.size > 0) {
            try {
              const { data: fetched } = await dataProvider.getMany("rooms", { ids: [...missingIds] });
              for (const room of fetched) {
                newRooms.push({
                  room_id: room.room_id ?? (room.id as string),
                  name: room.name,
                  topic: room.topic,
                  canonical_alias: room.canonical_alias,
                  avatar_url: room.avatar_url,
                  room_type: room.room_type,
                  num_joined_members: room.joined_members ?? room.members ?? 0,
                  join_rule: room.join_rules,
                  guest_can_join: room.guest_can_join ?? false,
                  world_readable: room.world_readable ?? false,
                  children_state: [],
                });
              }
            } catch {
              // silently fall back to room_id-only placeholders
            }
          }
          setAllRooms(newRooms);
          setTree(buildTree(newRooms));
          setNextBatch(result.data.next_batch);
        } else {
          notify(result.error || translate("resources.rooms.action.hierarchy.failure"), { type: "error" });
        }
      } catch {
        notify(translate("resources.rooms.action.hierarchy.failure"), { type: "error" });
      }
      setLoading(false);
    },
    [roomId, maxDepth, allRooms, dataProvider, notify, translate]
  );

  useEffect(() => {
    if (roomId) {
      setAllRooms([]);
      setNextBatch(undefined);
      fetchHierarchy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const handleRefresh = () => {
    setAllRooms([]);
    setNextBatch(undefined);
    fetchHierarchy();
  };

  if (!record) return null;

  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          gap: 1.5,
          alignItems: isSmall ? "stretch" : "flex-start",
          mb: 2,
        }}
      >
        <FormControl size="small" sx={{ width: isSmall ? undefined : 160 }}>
          <InputLabel>{translate("resources.rooms.action.hierarchy.max_depth")}</InputLabel>
          <Select
            value={maxDepth}
            onChange={e => setMaxDepth(e.target.value as number | "")}
            label={translate("resources.rooms.action.hierarchy.max_depth")}
          >
            <MenuItem value="">{translate("resources.rooms.action.hierarchy.unlimited")}</MenuItem>
            {[1, 2, 3, 5, 10].map(d => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <MuiButton
          variant="contained"
          onClick={handleRefresh}
          disabled={loading}
          sx={{ alignSelf: isSmall ? "stretch" : "center", height: 40 }}
        >
          {translate("resources.rooms.action.hierarchy.refresh")}
        </MuiButton>
      </Box>

      {loading && tree.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && tree.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          {translate("resources.rooms.action.hierarchy.no_children")}
        </Typography>
      )}

      {tree.length > 0 && (
        <List disablePadding>
          {tree.map(node => (
            <TreeItem key={node.key} node={node} depth={0} indent={indent} translate={translate} navigate={navigate} />
          ))}
        </List>
      )}

      {nextBatch && (
        <MuiButton fullWidth onClick={() => fetchHierarchy(nextBatch)} disabled={loading} sx={{ mt: 1 }}>
          {translate("resources.rooms.action.hierarchy.load_more")}
        </MuiButton>
      )}
    </Box>
  );
};
