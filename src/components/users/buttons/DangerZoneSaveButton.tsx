import { Confirm, SaveButton, setSubmissionErrors, useRecordContext, useSaveContext, useTranslate } from "react-admin";
import { useFormContext } from "react-hook-form";
import { useRef, useState } from "react";

import TypeToConfirmDialog from "./TypeToConfirmDialog";

type DangerDialog = "none" | "erase" | "escalate";

const preLineStyle = { whiteSpace: "pre-line" as const };

// Gates dangerous transitions at the SAVE boundary (diff vs loaded record); erase escalation wins, fires once.
const DangerZoneSaveButton = () => {
  const record = useRecordContext();
  const form = useFormContext();
  const saveContext = useSaveContext();
  const translate = useTranslate();
  const save = saveContext?.save;

  const [dialog, setDialog] = useState<DangerDialog>("none");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pending, setPending] = useState<Record<string, any> | null>(null);
  const [escalations, setEscalations] = useState<string[]>([]);
  // In-flight guard: save() fires at most once even on a double-click before the first await resolves.
  const saving = useRef(false);

  const mxid = String(record?.id ?? "");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runSave = async (values: Record<string, any>) => {
    if (!save || saving.current) return;
    saving.current = true;
    try {
      // Mirror react-admin's SaveButton: surface field-level submission errors on the form.
      const errors = await save(values);
      if (errors != null) setSubmissionErrors(errors, form.setError);
    } finally {
      saving.current = false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValid = async (values: Record<string, any>) => {
    // Strict-boolean escalation check (off -> on), mirroring lifecycle.ts to keep undefined/null cache noise quiet.
    const escalated = (field: string) => record?.[field] !== true && values[field] === true;
    const eraseEscalated = escalated("erased");
    const deactivateEscalated = escalated("deactivated");
    const adminEscalated = escalated("admin");

    if (eraseEscalated) {
      setPending(values);
      setDialog("erase");
      return;
    }

    if (deactivateEscalated || adminEscalated) {
      const list: string[] = [];
      if (deactivateEscalated) list.push(translate("resources.users.confirm.escalate_deactivate"));
      if (adminEscalated) list.push(translate("resources.users.confirm.escalate_admin"));
      setEscalations(list);
      setPending(values);
      setDialog("escalate");
      return;
    }

    await runSave(values);
  };

  // type="button" skips SaveButton's own submit; preventDefault lets us run validation and gate saving manually.
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    form.handleSubmit(onValid)();
  };

  const closeDialog = () => {
    setDialog("none");
    setPending(null);
    setEscalations([]);
  };

  const confirmSave = async () => {
    const values = pending;
    closeDialog();
    if (values) await runSave(values);
  };

  return (
    <>
      <SaveButton type="button" onClick={handleClick} />
      <TypeToConfirmDialog
        isOpen={dialog === "erase"}
        title={translate("resources.users.confirm.erase_title")}
        content={translate("resources.users.confirm.erase_body")}
        expectedValue={mxid}
        inputLabel={translate("resources.users.confirm.erase_type_prompt", { mxid })}
        onConfirm={confirmSave}
        onClose={closeDialog}
      />
      <Confirm
        isOpen={dialog === "escalate"}
        title={translate("resources.users.confirm.escalate_title")}
        content={<span style={preLineStyle}>{escalations.join("\n")}</span>}
        onConfirm={confirmSave}
        onClose={closeDialog}
      />
    </>
  );
};

export default DangerZoneSaveButton;
