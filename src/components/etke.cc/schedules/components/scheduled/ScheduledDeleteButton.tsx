import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNotify, useDataProvider, useRecordContext, useTranslate } from "react-admin";
import { Button, Confirm } from "react-admin";
import { useNavigate } from "react-router-dom";

import { useAppContext } from "../../../../../Context";
import { ScheduledCommand } from "../../../../../synapse/dataProvider";

const ScheduledDeleteButton = () => {
  const record = useRecordContext() as ScheduledCommand;
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = e => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await dataProvider.deleteScheduledCommand(etkeccAdmin, record.id);
      notify("etkecc.actions.scheduled.action.delete_success", { type: "success" });
      navigate("/server_actions");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : translate("etkecc.actions.errors.unknown");
      notify(translate("etkecc.actions.errors.delete_failed", { error: errorMessage }), { type: "error" });
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        sx={{ color: theme.palette.error.main }}
        label={translate("etkecc.actions.buttons.delete")}
        onClick={handleClick}
        disabled={isDeleting}
        startIcon={<DeleteIcon />}
      />
      <Confirm
        isOpen={open}
        title={translate("etkecc.actions.delete_scheduled_title")}
        content={translate("etkecc.actions.delete_confirm", { command: record?.command || "" })}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
    </>
  );
};

export default ScheduledDeleteButton;
