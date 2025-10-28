import { Tooltip } from "@mui/material";
import { DeleteWithConfirmButton, DeleteWithConfirmButtonProps, useRecordContext } from "react-admin";
import { useTranslate } from "react-admin";

import { isASManaged } from "../utils/mxid";

export const DeviceRemoveButton = (props: DeleteWithConfirmButtonProps) => {
  const translate = useTranslate();
  const record = useRecordContext();
  if (!record) return null;

  let isASManagedUser = false;
  if (record.user_id) {
    isASManagedUser = isASManaged(record.user_id);
  }

  return (
    <Tooltip
      title={isASManagedUser ? translate("resources.devices.action.erase.disabled") : translate("ra.action.delete")}
    >
      <DeleteWithConfirmButton
        {...props}
        label="ra.action.remove"
        confirmTitle="resources.devices.action.erase.title"
        confirmContent="resources.devices.action.erase.content"
        mutationMode="pessimistic"
        redirect={false}
        disabled={isASManagedUser}
        translateOptions={{
          id: record.id,
          name: record.display_name ? record.display_name : record.id,
        }}
      />
    </Tooltip>
  );
};

export default DeviceRemoveButton;
