import { NativeSelect, Paper } from "@mui/material";
import { CardContent, CardHeader, Container } from "@mui/material";
import { useTranslate } from "ra-core";
import { ChangeEventHandler } from "react";

import { ParsedStats, Progress } from "./types";

const TranslatableOption = ({ value, text }: { value: string; text: string }) => {
  const translate = useTranslate();
  return <option value={value}>{translate(text)}</option>;
};

const ConflictModeCard = ({
  stats,
  importResults,
  onConflictModeChanged,
  conflictMode,
  progress,
}: {
  stats: ParsedStats | null;
  importResults: any;
  onConflictModeChanged: ChangeEventHandler<HTMLSelectElement>;
  conflictMode: string;
  progress: Progress;
}) => {
  const translate = useTranslate();

  if (!stats || importResults) {
    return null;
  }

  return (
    <Container sx={{ mb: 3 }}>
      <Paper elevation={1}>
        <CardHeader
          title={translate("import_users.cards.conflicts.header")}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        />
        <CardContent>
          <NativeSelect onChange={onConflictModeChanged} value={conflictMode} disabled={progress !== null}>
            <TranslatableOption value="stop" text="import_users.cards.conflicts.mode.stop" />
            <TranslatableOption value="skip" text="import_users.cards.conflicts.mode.skip" />
          </NativeSelect>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default ConflictModeCard;
