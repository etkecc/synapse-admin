import { CardHeader, CardContent, Container, Link, Stack, Typography, Paper } from "@mui/material";
import { useTranslate } from "ra-core";
import { ChangeEventHandler } from "react";

import { Progress } from "./types";

const UploadCard = ({
  importResults,
  onFileChange,
  progress,
}: {
  importResults: any;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  progress: Progress;
}) => {
  const translate = useTranslate();
  if (importResults) {
    return null;
  }

  return (
    <Container sx={{ mb: 3 }}>
      <Paper elevation={1}>
        <CardHeader
          title={translate("import_users.cards.upload.header")}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        />
        <CardContent>
          <Stack spacing={2}>
            <Typography>
              {translate("import_users.cards.upload.explanation")}
              <Link href="./data/example.csv" sx={{ ml: 1 }}>
                example.csv
              </Link>
            </Typography>
            <input type="file" onChange={onFileChange} disabled={progress !== null} />
          </Stack>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default UploadCard;
