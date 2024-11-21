import { get } from "lodash";
import { Avatar, AvatarProps, Badge, Tooltip } from "@mui/material";
import { FieldProps, useRecordContext, useTranslate } from "react-admin";
import { useState, useEffect, useCallback } from "react";
import { fetchAuthenticatedMedia } from "../utils/fetchMedia";
import { isMXID, isASManaged } from "./mxid";
import storage from "../storage";

const AvatarField = ({ source, ...rest }: AvatarProps & FieldProps) => {
  const { alt, classes, sizes, sx, variant } = rest;
  const record = useRecordContext(rest);
  const mxcURL = get(record, source)?.toString();

  const [src, setSrc] = useState<string>("");

  const fetchAvatar = useCallback(async (mxcURL: string) => {
    const response = await fetchAuthenticatedMedia(mxcURL, "thumbnail");
    const blob = await response.blob();
    const blobURL = URL.createObjectURL(blob);
    setSrc(blobURL);
  }, []);

  useEffect(() => {
    if (mxcURL) {
      fetchAvatar(mxcURL);
    }

    // Cleanup function to revoke the object URL
    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [mxcURL, fetchAvatar]);

  // a hacky way to handle both users and rooms,
  // where users have an ID, may have a name, and may have a displayname
  // and rooms have an ID and may have a name
  let letter = "";
  if (record?.id) {
    letter = record.id[0].toUpperCase();
  }
  if (record?.name) {
    letter = record.name[0].toUpperCase();
  }
  if (record?.displayname) {
    letter = record.displayname[0].toUpperCase();
  }

  // hacky way to determine the user type
  let badge = "";
  let tooltip = "";
  if (isMXID(record?.id)) {
    const translate = useTranslate();
    switch (record?.user_type) {
      case "bot":
        badge = "🤖";
        tooltip = translate("resources.users.badge.bot");
        break;
      case "support":
        badge = "📞";
        tooltip = translate("resources.users.badge.support");
        break;
      default:
        badge = "👤";
        tooltip = translate("resources.users.badge.regular");
        break;
    }
    if (record?.admin) {
      badge = "👑";
      tooltip = translate("resources.users.badge.admin");
    }
    if (isASManaged(record?.name)) {
      badge = "🛡️";
      tooltip = `${translate("resources.users.badge.system_managed")} (${tooltip})`;
    }
    if (storage.getItem("user_id") === record?.id) {
      badge = "🧙‍";
      tooltip = `${translate("resources.users.badge.you")} (${tooltip})`;
    }
  }

  // if there is a badge, wrap the Avatar in a Badge and a Tooltip
  if (badge) {
    return (
      <Tooltip title={tooltip}>
        <Badge
          badgeContent={badge}
          overlap="circular"
          sx={{ "& .MuiBadge-badge": { width: "10px" } }} // we deliberately set a very small width here, to make the badge actually circular
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Avatar alt={alt} classes={classes} sizes={sizes} src={src} sx={sx} variant={variant}>
            {letter}
          </Avatar>
        </Badge>
      </Tooltip>);
  }

  return (<Avatar alt={alt} classes={classes} sizes={sizes} src={src} sx={sx} variant={variant}>
          {letter}
          </Avatar>);
};

export default AvatarField;
