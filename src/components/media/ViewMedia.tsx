import DownloadIcon from "@mui/icons-material/Download";
import DownloadingIcon from "@mui/icons-material/Downloading";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { Box, Tooltip } from "@mui/material";
import { get } from "lodash";
import { useState } from "react";
import { Button, useNotify, useRecordContext, useTranslate } from "react-admin";

import { decodeURLComponent } from "../../utils/safety";
import { fetchAuthenticatedMedia } from "../../utils/fetchMedia";
import createLogger from "../../utils/logger";

const log = createLogger("media");

export const ViewMediaButton = ({ mxcURL, label, uploadName, mimetype, preview = false }) => {
  const translate = useTranslate();
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const isImage = mimetype && mimetype.startsWith("image/") && preview;

  const openFileInNewTab = (blobURL: string) => {
    const anchorElement = document.createElement("a");
    anchorElement.href = blobURL;
    anchorElement.target = "_blank";
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    setTimeout(() => URL.revokeObjectURL(blobURL), 10);
  };

  const downloadFile = async (blobURL: string) => {
    log.debug("download triggered", { uploadName });
    const anchorElement = document.createElement("a");
    anchorElement.href = blobURL;
    anchorElement.download = uploadName;
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    setTimeout(() => URL.revokeObjectURL(blobURL), 10);
  };

  const handleFile = async (preview: boolean) => {
    setLoading(true);
    const response = await fetchAuthenticatedMedia(mxcURL, "original");

    if (response.ok) {
      const blob = await response.blob();
      const blobURL = URL.createObjectURL(blob);
      if (preview) {
        openFileInNewTab(blobURL);
      } else {
        downloadFile(blobURL);
      }
    } else {
      const body = await response.json();
      notify("resources.room_media.action.error", {
        messageArgs: {
          errcode: body.errcode,
          errstatus: response.status,
          error: body.error,
        },
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <Tooltip title={translate("resources.users_media.action.open")}>
          <span>
            {isImage && (
              <Button
                disabled={loading}
                onClick={() => handleFile(true)}
                style={{ minWidth: 0, padding: 0, marginRight: 8 }}
              >
                {loading ? <DownloadingIcon /> : <FileOpenIcon />}
              </Button>
            )}
          </span>
        </Tooltip>
        <Button
          disabled={loading}
          onClick={() => handleFile(false)}
          style={{ minWidth: 0, padding: 0, marginRight: 8 }}
        >
          {loading ? <DownloadingIcon /> : <DownloadIcon />}
        </Button>
        <span>{label}</span>
      </Box>
    </>
  );
};

export const MediaIDField = ({ source }) => {
  const record = useRecordContext();
  if (!record) {
    return null;
  }
  const homeserver = localStorage.getItem("home_server");

  const mediaID = get(record, source)?.toString();
  if (!mediaID) {
    return null;
  }

  let uploadName = mediaID;
  if (get(record, "upload_name")) {
    uploadName = decodeURLComponent(get(record, "upload_name")?.toString());
  }

  let mxcURL = mediaID;
  if (!mediaID.startsWith(`mxc://${homeserver}`)) {
    // this is user's media, where mediaID doesn't have the mxc://home_server/ prefix as it has in the rooms
    mxcURL = `mxc://${homeserver}/${mediaID}`;
  }

  let preview = true;
  if (get(record, "quarantined_by")) {
    preview = false;
  }

  return (
    <ViewMediaButton
      mxcURL={mxcURL}
      label={mediaID}
      uploadName={uploadName}
      mimetype={record.media_type}
      preview={preview}
    />
  );
};

export const ReportMediaContent = ({ source }) => {
  const record = useRecordContext();
  if (!record) {
    return null;
  }

  const mxcURL = get(record, source)?.toString();
  if (!mxcURL) {
    return null;
  }

  let uploadName = "";
  if (get(record, "event_json.content.body")) {
    uploadName = decodeURLComponent(get(record, "event_json.content.body")?.toString());
  }

  return <ViewMediaButton mxcURL={mxcURL} label={mxcURL} uploadName={uploadName} mimetype={record.media_type} />;
};
