import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Box, IconButton } from "@mui/material";
import { useRef } from "react";
import { useRecordContext } from "react-admin";
import { useFormContext } from "react-hook-form";

import AvatarField from "./AvatarField";

interface EditableAvatarFieldProps {
  source: string;
  size?: number;
}

const EditableAvatarField = ({ source, size = 120 }: EditableAvatarFieldProps) => {
  const { setValue, watch } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewFile = watch("avatar_file");
  const previewSrc = previewFile?.src;
  const avatarErased = watch("avatar_erase");
  const record = useRecordContext();
  const letter = (record?.displayname?.[0] || record?.name?.[0] || record?.id?.[0] || "").toUpperCase();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("avatar_erase", false);
    setValue("avatar_file", { rawFile: file, src: URL.createObjectURL(file), title: file.name }, { shouldDirty: true });
  };

  const handleDelete = () => {
    setValue("avatar_file", null);
    setValue("avatar_erase", true, { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const iconSize = Math.max(24, Math.round(size * 0.3));

  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        cursor: "pointer",
        "&:hover .avatar-overlay": { opacity: 1 },
      }}
    >
      {previewSrc ? (
        <Box
          component="img"
          src={previewSrc}
          sx={{
            width: size,
            height: size,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : avatarErased ? (
        <Avatar sx={{ width: size, height: size }}>{letter}</Avatar>
      ) : (
        <AvatarField source={source} sx={{ width: size, height: size }} />
      )}
      <Box
        className="avatar-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          bgcolor: "rgba(0,0,0,0.5)",
          opacity: 0,
          transition: "opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton onClick={() => fileInputRef.current?.click()} sx={{ color: "white", p: 0 }}>
          <CloudUploadIcon sx={{ fontSize: iconSize }} />
        </IconButton>
      </Box>
      <IconButton
        className="avatar-overlay"
        onClick={handleDelete}
        sx={{
          opacity: 0,
          transition: "opacity 0.2s",
          position: "absolute",
          bottom: 0,
          left: 0,
          p: 0.5,
          color: "white",
          bgcolor: "rgba(0,0,0,0.6)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
          borderRadius: "50%",
          zIndex: 1,
        }}
      >
        <DeleteIcon sx={{ fontSize: Math.round(iconSize * 0.7) }} />
      </IconButton>
      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" hidden onChange={handleUpload} />
    </Box>
  );
};

export default EditableAvatarField;
