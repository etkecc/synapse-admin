import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Box, Divider, IconButton, Paper, Tooltip } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
}

const RichTextEditor = ({ value, onChange, placeholder, disabled, minRows = 6 }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: placeholder ?? "" })],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value === "" && !editor.isEmpty) {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [disabled, editor]);

  const minHeight = `${minRows * 1.6}em`;

  return (
    <Paper
      elevation={4}
      sx={{
        border: "1px solid",
        borderColor: "action.selected",
        "&:focus-within": { borderColor: "primary.main", borderWidth: "2px" },
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 0.5,
          px: 0.5,
          py: 0.25,
          borderBottom: "1px solid",
          borderColor: "action.selected",
        }}
      >
        <Tooltip title="Bold">
          <span>
            <IconButton
              size="small"
              onMouseDown={e => {
                e.preventDefault();
                editor?.chain().focus().toggleBold().run();
              }}
              disabled={disabled}
              color={editor?.isActive("bold") ? "primary" : "default"}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Italic">
          <span>
            <IconButton
              size="small"
              onMouseDown={e => {
                e.preventDefault();
                editor?.chain().focus().toggleItalic().run();
              }}
              disabled={disabled}
              color={editor?.isActive("italic") ? "primary" : "default"}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
        <Tooltip title="Bullet list">
          <span>
            <IconButton
              size="small"
              onMouseDown={e => {
                e.preventDefault();
                editor?.chain().focus().toggleBulletList().run();
              }}
              disabled={disabled}
              color={editor?.isActive("bulletList") ? "primary" : "default"}
            >
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Numbered list">
          <span>
            <IconButton
              size="small"
              onMouseDown={e => {
                e.preventDefault();
                editor?.chain().focus().toggleOrderedList().run();
              }}
              disabled={disabled}
              color={editor?.isActive("orderedList") ? "primary" : "default"}
            >
              <FormatListNumberedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={{
          cursor: disabled ? "not-allowed" : "text",
          "& .tiptap": {
            outline: "none",
            minHeight,
            px: 1.5,
            py: 1,
            "& > * + *": { marginTop: "0.5em" },
            "& ul, & ol": { paddingLeft: "1.5em" },
            "& p.is-editor-empty:first-child::before": {
              color: "text.disabled",
              content: "attr(data-placeholder)",
              float: "left",
              height: 0,
              pointerEvents: "none",
            },
          },
        }}
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </Box>
    </Paper>
  );
};

export default RichTextEditor;
