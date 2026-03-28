import ClearIcon from "@mui/icons-material/Clear";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Tooltip } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button, ButtonProps, useDataProvider, useNotify, useRecordContext, useTranslate } from "react-admin";

export const ProtectMediaButton = (props: ButtonProps) => {
  const record = useRecordContext();
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [isProtected, setIsProtected] = useState<boolean | null>(null);

  const { mutate: protect, isPending: isProtecting } = useMutation({
    mutationFn: () => dataProvider.create("protect_media", { data: record! }),
    onSuccess: () => {
      notify("resources.protect_media.action.send_success");
      setIsProtected(true);
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    onError: (error: any) => notify(error?.message || "resources.protect_media.action.send_failure", { type: "error" }),
  });

  const { mutate: unprotect, isPending: isUnprotecting } = useMutation({
    mutationFn: () => dataProvider.delete("protect_media", { id: record!.id, previousData: record }),
    onSuccess: () => {
      notify("resources.protect_media.action.send_success");
      setIsProtected(false);
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    onError: (error: any) => notify(error?.message || "resources.protect_media.action.send_failure", { type: "error" }),
  });

  if (!record) return null;

  const isLoading = isProtecting || isUnprotecting;
  const safeFromQuarantine = isProtected ?? record.safe_from_quarantine;

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
            <Button {...props} label="resources.protect_media.action.none" disabled={true}>
              <ClearIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {safeFromQuarantine && !record.quarantined_by && (
        <Tooltip
          title={translate("resources.protect_media.action.delete", {
            _: "resources.protect_media.action.delete",
          })}
          arrow
        >
          <div>
            <Button
              {...props}
              label="resources.protect_media.action.delete"
              onClick={() => unprotect()}
              disabled={isLoading}
            >
              <LockOpenIcon />
            </Button>
          </div>
        </Tooltip>
      )}
      {!safeFromQuarantine && !record.quarantined_by && (
        <Tooltip
          title={translate("resources.protect_media.action.create", {
            _: "resources.protect_media.action.create",
          })}
        >
          <div>
            <Button
              {...props}
              label="resources.protect_media.action.create"
              onClick={() => protect()}
              disabled={isLoading}
            >
              <LockIcon />
            </Button>
          </div>
        </Tooltip>
      )}
    </>
  );
};
