import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import {
  Button,
  Confirm,
  DeleteWithConfirmButton,
  DeleteWithConfirmButtonProps,
  useDataProvider,
  useListContext,
  useNotify,
  useRecordContext,
  useRefresh,
  useTranslate,
  useUnselectAll,
} from "react-admin";

import { SynapseDataProvider } from "../providers/types";
import { isASManaged } from "../utils/mxid";

export const DeviceRemoveButton = (props: DeleteWithConfirmButtonProps) => {
  const record = useRecordContext();
  if (!record) return null;

  let isASManagedUser = false;
  if (record.user_id) {
    isASManagedUser = isASManaged(record.user_id);
  }

  return (
    <DeleteWithConfirmButton
      {...props}
      label="ra.action.remove"
      confirmTitle="resources.devices.action.erase.title"
      confirmContent="resources.devices.action.erase.content"
      mutationMode="pessimistic"
      redirect={false}
      disabled={isASManagedUser}
      titleTranslateOptions={{
        id: record.id,
        name: record.display_name ? record.display_name : record.id,
      }}
    />
  );
};

export const DeviceBulkRemoveButton = () => {
  const { data, selectedIds } = useListContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const unselectAll = useUnselectAll("devices");
  const dataProvider = useDataProvider() as SynapseDataProvider;

  if (!data || data.length === 0) return null;

  const userId = data[0]?.user_id;
  if (!userId || isASManaged(userId)) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await dataProvider.deleteDevices(userId, selectedIds as string[]);
      if (result.success) {
        notify("resources.devices.action.erase.success", { type: "success" });
        unselectAll();
        refresh();
      } else {
        notify(result.error || "resources.devices.action.erase.failure", { type: "error" });
      }
    } catch {
      notify("resources.devices.action.erase.failure", { type: "error" });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button label="ra.action.delete" onClick={() => setOpen(true)} disabled={loading}>
        <DeleteIcon />
      </Button>
      <Confirm
        isOpen={open}
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
        title={translate("resources.devices.action.erase.title_bulk", { smart_count: selectedIds.length })}
        content={translate("resources.devices.action.erase.content_bulk", { smart_count: selectedIds.length })}
        confirm="ra.action.confirm"
        cancel="ra.action.cancel"
      />
    </>
  );
};

export default DeviceRemoveButton;
