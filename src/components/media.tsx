import BlockIcon from "@mui/icons-material/Block";
import IconCancel from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DownloadIcon from "@mui/icons-material/Download";
import DownloadingIcon from "@mui/icons-material/Downloading";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Box, Dialog, DialogContent, DialogContentText, DialogTitle, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import { get } from "lodash";
import { useState } from "react";
import {
  BooleanInput,
  Button,
  ButtonProps,
  DateTimeInput,
  NumberInput,
  SaveButton,
  SimpleForm,
  Toolbar,
  ToolbarProps,
  useCreate,
  useDataProvider,
  useDelete,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
} from "react-admin";

import { DeleteMediaParams, SynapseDataProvider } from "../synapse/dataProvider";
import { dateParser } from "../utils/date";
import decodeURLComponent from "../utils/decodeURLComponent";
import { fetchAuthenticatedMedia } from "../utils/fetchMedia";

const DeleteMediaDialog = ({ open, onClose, onSubmit }) => {
  const translate = useTranslate();

  const DeleteMediaToolbar = (props: ToolbarProps) => (
    <Toolbar {...props}>
      <SaveButton label="delete_media.action.send" icon={<DeleteSweepIcon />} />
      <Button label="ra.action.cancel" onClick={onClose}>
        <IconCancel />
      </Button>
    </Toolbar>
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{translate("delete_media.action.send")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{translate("delete_media.helper.send")}</DialogContentText>
        <SimpleForm toolbar={<DeleteMediaToolbar />} onSubmit={onSubmit}>
          <DateTimeInput source="before_ts" label="delete_media.fields.before_ts" defaultValue={0} parse={dateParser} />
          <NumberInput source="size_gt" label="delete_media.fields.size_gt" defaultValue={0} min={0} step={1024} />
          <BooleanInput source="keep_profiles" label="delete_media.fields.keep_profiles" defaultValue={true} />
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteMediaButton = (props: ButtonProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const dataProvider = useDataProvider<SynapseDataProvider>();
  const { mutate: deleteMedia, isPending } = useMutation({
    mutationFn: (values: DeleteMediaParams) => dataProvider.deleteMedia(values),
    onSuccess: () => {
      notify("delete_media.action.send_success");
      closeDialog();
    },
    onError: () => {
      notify("delete_media.action.send_failure", {
        type: "error",
      });
    },
  });

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <Button
        {...props}
        label="delete_media.action.send"
        onClick={openDialog}
        disabled={isPending}
        sx={{
          color: theme.palette.error.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            "@media (hover: none)": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <DeleteSweepIcon />
      </Button>
      <DeleteMediaDialog open={open} onClose={closeDialog} onSubmit={deleteMedia} />
    </>
  );
};

const PurgeRemoteMediaDialog = ({ open, onClose, onSubmit }) => {
  const translate = useTranslate();

  const PurgeRemoteMediaToolbar = (props: ToolbarProps) => (
    <Toolbar {...props}>
      <SaveButton label="purge_remote_media.action.send" icon={<DeleteSweepIcon />} />
      <Button label="ra.action.cancel" onClick={onClose}>
        <IconCancel />
      </Button>
    </Toolbar>
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{translate("purge_remote_media.action.send")}</DialogTitle>
      <DialogContent>
        <DialogContentText>{translate("purge_remote_media.helper.send")}</DialogContentText>
        <SimpleForm toolbar={<PurgeRemoteMediaToolbar />} onSubmit={onSubmit}>
          <DateTimeInput
            source="before_ts"
            label="purge_remote_media.fields.before_ts"
            defaultValue={0}
            parse={dateParser}
          />
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};

export const PurgeRemoteMediaButton = (props: ButtonProps) => {
  const [open, setOpen] = useState(false);
  const notify = useNotify();
  const dataProvider = useDataProvider<SynapseDataProvider>();
  const { mutate: purgeRemoteMedia, isPending } = useMutation({
    mutationFn: (values: DeleteMediaParams) => dataProvider.purgeRemoteMedia(values),
    onSuccess: () => {
      notify("purge_remote_media.action.send_success");
      closeDialog();
    },
    onError: () => {
      notify("purge_remote_media.action.send_failure", {
        type: "error",
      });
    },
  });

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <Button
        {...props}
        label="purge_remote_media.action.send"
        onClick={openDialog}
        disabled={isPending}
        sx={{
          "&:hover": {
            // Reset on mouse devices
            "@media (hover: none)": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <DeleteSweepIcon />
      </Button>
      <PurgeRemoteMediaDialog open={open} onClose={closeDialog} onSubmit={purgeRemoteMedia} />
    </>
  );
};

export const ProtectMediaButton = (props: ButtonProps) => {
  const record = useRecordContext();
  const translate = useTranslate();
  const refresh = useRefresh();
  const notify = useNotify();
  const [create, { isLoading }] = useCreate();
  const [deleteOne] = useDelete();

  if (!record) return null;

  const handleProtect = () => {
    create(
      "protect_media",
      { data: record },
      {
        onSuccess: () => {
          notify("resources.protect_media.action.send_success");
          refresh();
        },
        onError: () =>
          notify("resources.protect_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  const handleUnprotect = () => {
    deleteOne(
      "protect_media",
      { id: record.id },
      {
        onSuccess: () => {
          notify("resources.protect_media.action.send_success");
          refresh();
        },
        onError: () =>
          notify("resources.protect_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  return (
    /*
    Wrapping Tooltip with <div>
    https://github.com/marmelab/react-admin/issues/4349#issuecomment-578594735
    */
    <>
      {record.quarantined_by && (
        <Tooltip
          title={translate("resources.protect_media.action.none", {
            _: "resources.protect_media.action.none",
          })}
        >
          <div>
            {/*
            Button instead BooleanField for
            consistent appearance and position in the column
            */}
            <Button {...props} disabled={true}>
              <ClearIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {record.safe_from_quarantine && (
        <Tooltip
          title={translate("resources.protect_media.action.delete", {
            _: "resources.protect_media.action.delete",
          })}
          arrow
        >
          <div>
            <Button {...props} onClick={handleUnprotect} disabled={isLoading}>
              <LockIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {!record.safe_from_quarantine && !record.quarantined_by && (
        <Tooltip
          title={translate("resources.protect_media.action.create", {
            _: "resources.protect_media.action.create",
          })}
        >
          <div>
            <Button {...props} onClick={handleProtect} disabled={isLoading}>
              <LockOpenIcon />
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
};

export const QuarantineMediaButton = (props: ButtonProps) => {
  const record = useRecordContext();
  const translate = useTranslate();
  const refresh = useRefresh();
  const notify = useNotify();
  const [create, { isLoading }] = useCreate();
  const [deleteOne] = useDelete();

  if (!record) return null;

  const handleQuarantaine = () => {
    create(
      "quarantine_media",
      { data: record },
      {
        onSuccess: () => {
          notify("resources.quarantine_media.action.send_success");
          refresh();
        },
        onError: error => {
          notify("resources.quarantine_media.action.send_failure", {
            type: "error",
            messageArgs: { error: error },
          });
        },
      }
    );
  };

  const handleRemoveQuarantaine = () => {
    deleteOne(
      "quarantine_media",
      { id: record.id, previousData: record },
      {
        onSuccess: () => {
          notify("resources.quarantine_media.action.send_success");
          refresh();
        },
        onError: () =>
          notify("resources.quarantine_media.action.send_failure", {
            type: "error",
          }),
      }
    );
  };

  return (
    <>
      {record.safe_from_quarantine && (
        <Tooltip
          title={translate("resources.quarantine_media.action.none", {
            _: "resources.quarantine_media.action.none",
          })}
        >
          <div>
            <Button {...props} disabled={true}>
              <ClearIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {record.quarantined_by && (
        <Tooltip
          title={translate("resources.quarantine_media.action.delete", {
            _: "resources.quarantine_media.action.delete",
          })}
        >
          <div>
            <Button {...props} onClick={handleRemoveQuarantaine} disabled={isLoading}>
              <BlockIcon color="error" />
            </Button>
          </div>
        </Tooltip>
      )}
      {!record.safe_from_quarantine && !record.quarantined_by && (
        <Tooltip
          title={translate("resources.quarantine_media.action.create", {
            _: "resources.quarantine_media.action.create",
          })}
        >
          <div>
            <Button {...props} onClick={handleQuarantaine} disabled={isLoading}>
              <BlockIcon />
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
};

export const ViewMediaButton = ({ mxcURL, label, uploadName, mimetype, preview }) => {
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
    console.log("downloadFile", blobURL, uploadName);
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
