import { Container, Paper } from "@mui/material";
import { CardHeader } from "@mui/material";
import { CardContent } from "@mui/material";
import { Stack } from "@mui/material";
import { Typography } from "@mui/material";
import { useTranslate } from "ra-core";

const ErrorsCard = ({ errors }: { errors: string[] }) => {
  const translate = useTranslate();

  if (errors.length === 0) {
    return null;
  }

  return (
    <Container sx={{ mb: 3 }}>
      <Paper elevation={1}>
        <CardHeader
          title={translate("import_users.error.error")}
          sx={{
            borderBottom: 1,
            borderColor: "error.main",
            color: "error.main"
          }}
      />
      <CardContent>
        <Stack spacing={1}>
          {errors.map((e, idx) => (
            <Typography key={idx} color="error">
              {e}
            </Typography>
          ))}
          </Stack>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default ErrorsCard;