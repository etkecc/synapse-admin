import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import { Alert, Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useTranslate } from "react-admin";

import type { SupportAttachment } from "../../providers/types";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB

interface Props {
  onChange: (files: SupportAttachment[]) => void;
  disabled?: boolean;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const readAsBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip "data:...;base64," prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

interface AttachmentMeta extends SupportAttachment {
  size: number; // bytes, for display
}

const SupportAttachments = ({ onChange, disabled }: Props) => {
  const translate = useTranslate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [warning, setWarning] = useState<string | null>(null);
  // Keep size metadata alongside attachments for display
  const [meta, setMeta] = useState<AttachmentMeta[]>([]);

  const handleFiles = async (files: FileList) => {
    setWarning(null);
    const incoming = Array.from(files);

    if (meta.length + incoming.length > MAX_FILES) {
      setWarning(translate("etkecc.support.actions.too_many_attachments"));
      return;
    }

    for (const file of incoming) {
      if (file.size > MAX_FILE_BYTES) {
        setWarning(translate("etkecc.support.actions.attachment_too_large", { name: file.name }));
        return;
      }
    }

    const currentTotal = meta.reduce((sum, m) => sum + m.size, 0);
    const incomingTotal = incoming.reduce((sum, f) => sum + f.size, 0);
    if (currentTotal + incomingTotal > MAX_TOTAL_BYTES) {
      setWarning(translate("etkecc.support.actions.total_size_exceeded"));
      return;
    }

    const newItems: AttachmentMeta[] = await Promise.all(
      incoming.map(async file => ({
        fileName: file.name,
        data: await readAsBase64(file),
        size: file.size,
      }))
    );

    const updated = [...meta, ...newItems];
    setMeta(updated);
    onChange(updated.map(({ fileName, data }) => ({ fileName, data })));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const updated = meta.filter((_, i) => i !== index);
    setMeta(updated);
    onChange(updated.map(({ fileName, data }) => ({ fileName, data })));
    setWarning(null);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          startIcon={<AttachFileIcon />}
          disabled={disabled || meta.length >= MAX_FILES}
          onClick={() => inputRef.current?.click()}
        >
          {translate("etkecc.support.buttons.attach_files")}
        </Button>
        <Typography variant="caption" color="text.secondary">
          {translate("etkecc.support.helper.attachments_limit")}
        </Typography>
      </Stack>

      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        disabled={disabled}
        onChange={e => e.target.files && handleFiles(e.target.files)}
      />

      {warning && (
        <Alert severity="warning" onClose={() => setWarning(null)} sx={{ mt: 1 }}>
          {warning}
        </Alert>
      )}

      {meta.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
          {meta.map((item, index) => (
            <Chip
              key={index}
              label={`${item.fileName} (${formatBytes(item.size)})`}
              size="small"
              onDelete={() => handleRemove(index)}
              deleteIcon={<CloseIcon />}
              variant="outlined"
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default SupportAttachments;
