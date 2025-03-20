import { Button, Checkbox, Paper, Container } from "@mui/material";

import { CardActions, FormControlLabel } from "@mui/material";
import { Progress, ImportLine, ImportResult } from "./types";
import { ChangeEventHandler } from "react";
import { useTranslate } from "ra-core";

const StartImportCard = (
  { csvData, importResults, progress, dryRun, onDryRunModeChanged, runImport }:
  { csvData: ImportLine[], importResults: ImportResult | null, progress: Progress, dryRun: boolean, onDryRunModeChanged: ChangeEventHandler<HTMLInputElement>, runImport: () => void }
) => {
  const translate = useTranslate();
  if (!csvData || csvData.length === 0 || importResults) {
    return null;
  }

  return (
    <Container>
      <Paper>
        <CardActions>
          <FormControlLabel
            control={<Checkbox checked={dryRun} onChange={onDryRunModeChanged} disabled={progress !== null} />}
            label={translate("import_users.cards.startImport.simulate_only")}
          />
          <Button variant="contained" size="large" onClick={runImport} disabled={progress !== null}>
            {translate("import_users.cards.startImport.run_import")}
          </Button>
          {progress !== null ? (
            <div>
              {progress.done} of {progress.limit} done
            </div>
          ) : null}
        </CardActions>
      </Paper>
    </Container>
  );
}

export default StartImportCard;