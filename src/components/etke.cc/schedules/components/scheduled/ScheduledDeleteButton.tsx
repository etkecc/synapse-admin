import { useNotify, useDataProvider, useRecordContext } from "react-admin";
import { useTheme } from "@mui/material/styles";

import { ScheduledCommand } from "../../../../../synapse/dataProvider";
import { useAppContext } from "../../../../../Context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Confirm } from "react-admin";
import DeleteIcon from "@mui/icons-material/Delete";


const ScheduledDeleteButton = () => {
  const record = useRecordContext() as ScheduledCommand;
  const { etkeccAdmin } = useAppContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await dataProvider.deleteScheduledCommand(etkeccAdmin, record.id);
      notify("scheduled_commands.action.delete_success", { type: "success" });
      navigate("/server_schedules");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      notify(`Error: ${errorMessage}`, { type: "error" });
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
        label="Delete"
        onClick={handleClick}
        disabled={isDeleting}
        startIcon={<DeleteIcon />}
      />
      <Confirm
        isOpen={open}
        title="Delete Scheduled Command"
        content={`Are you sure you want to delete the command: ${record?.command || ''}?`}
        onConfirm={handleConfirm}
        onClose={handleCancel}
      />
    </>
  );
};

export default ScheduledDeleteButton;