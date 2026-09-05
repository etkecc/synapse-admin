import { Box, Chip, TextField } from "@mui/material";
import { useState } from "react";

// Enter commits a trimmed value, chip's x drops it. Dedupes on insert; no domain validation here.
export const ChipInput = ({
  label,
  placeholder,
  values,
  onChange,
  isSmall,
  type,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (v: string[]) => void;
  isSmall: boolean;
  type?: string;
  autoComplete?: string;
}) => {
  const [input, setInput] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) {
        onChange([...values, input.trim()]);
      }
      setInput("");
    }
  };
  return (
    <Box sx={{ flex: 1, minWidth: isSmall ? undefined : 250 }}>
      <TextField
        size="small"
        fullWidth
        type={type}
        autoComplete={autoComplete}
        label={label}
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        slotProps={{ inputLabel: { shrink: true } }}
        // 16px on mobile: below it, iOS Safari yanks a zoom on focus. desktop keeps small's 14px.
        sx={{ "& .MuiInputBase-input": { fontSize: { xs: 16, sm: "inherit" } } }}
      />
      {values.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
          {values.map(v => (
            <Chip key={v} label={v} size="small" onDelete={() => onChange(values.filter(x => x !== v))} />
          ))}
        </Box>
      )}
    </Box>
  );
};
