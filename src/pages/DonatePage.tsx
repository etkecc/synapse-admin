import FavoriteIcon from "@mui/icons-material/Favorite";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Button, Paper, Stack, Typography, keyframes } from "@mui/material";
import { Title, useTranslate } from "react-admin";

import MatrixWordmark from "../components/MatrixWordmark";
import { EtkeAttribution } from "../components/etke.cc/EtkeAttribution";
import { useDocTitle } from "../components/hooks/useDocTitle";

export const DONATE_URL = "https://github.com/sponsors/etkecc";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-10px) rotate(2deg) scale(1.03); }
  100% { transform: translateY(0) rotate(0deg) scale(1); }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.12); }
`;

const renderTextWithMatrixWordmark = (text: string) => {
  const [before, after] = text.split("Matrix");

  if (typeof after === "undefined") {
    return text;
  }

  return (
    <>
      {before}
      <MatrixWordmark
        sx={{
          width: "2.45em",
          mx: "0.14em",
          verticalAlign: "-0.04em",
        }}
      />
      {after}
    </>
  );
};

const DonatePage = () => {
  const translate = useTranslate();

  useDocTitle(translate("etkecc.donate.title"));

  return (
    <Stack
      spacing={4}
      sx={{
        width: "100%",
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 4, md: 6 },
        animation: `${fadeIn} 500ms ease-out`,
      }}
    >
      <Title title={translate("etkecc.donate.title")} />
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pt: { xs: 2, md: 3 },
        }}
      >
        <Box
          sx={theme => ({
            position: "absolute",
            top: { xs: "2%", md: "0%" },
            width: { xs: "92%", md: "78%" },
            height: { xs: "92%", md: "84%" },
            borderRadius: "50%",
            background:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle, rgba(244,147,0,0.10) 0%, rgba(244,147,0,0.05) 36%, transparent 68%)"
                : "radial-gradient(circle, rgba(24,88,213,0.08) 0%, rgba(220,38,38,0.05) 34%, transparent 66%)",
            filter: "blur(18px)",
            opacity: 0.9,
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 18%, black 32%, black 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 18%, black 32%, black 100%)",
            pointerEvents: "none",
            zIndex: 0,
          })}
        />
        <Stack
          spacing={3}
          sx={{
            position: "relative",
            width: { xs: "100%", md: "88%", lg: "78%" },
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <Box
              sx={theme => ({
                position: "absolute",
                inset: -12,
                borderRadius: "50%",
                background:
                  theme.palette.mode === "dark"
                    ? "radial-gradient(circle, rgba(244,147,0,0.18) 0%, rgba(244,147,0,0.08) 48%, transparent 72%)"
                    : "radial-gradient(circle, rgba(220,38,38,0.16) 0%, rgba(220,38,38,0.08) 46%, transparent 72%)",
                animation: `${glow} 4s ease-in-out infinite`,
                pointerEvents: "none",
                filter: "blur(8px)",
              })}
            />
            <Box
              sx={theme => ({
                width: { xs: 112, sm: 136 },
                height: { xs: 112, sm: 136 },
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background:
                  theme.palette.mode === "dark"
                    ? "radial-gradient(circle at 35% 30%, rgba(244,147,0,0.22) 0%, rgba(244,147,0,0.07) 60%, transparent 100%)"
                    : "radial-gradient(circle at 35% 30%, rgba(220,38,38,0.18) 0%, rgba(24,88,213,0.08) 58%, transparent 100%)",
                border:
                  theme.palette.mode === "dark" ? "1px solid rgba(244,147,0,0.18)" : "1px solid rgba(220,38,38,0.14)",
                animation: `${float} 5s ease-in-out infinite`,
              })}
            >
              <FavoriteIcon
                sx={theme => ({
                  fontSize: { xs: 52, sm: 60 },
                  color: theme.palette.mode === "dark" ? "rgba(244,147,0,0.7)" : "rgba(220,38,38,0.72)",
                })}
              />
            </Box>
          </Box>

          <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center", width: "100%" }}>
            <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.6rem" }, lineHeight: 1.1 }}>
              {translate("etkecc.donate.name")} <Box component="span">✨</Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                width: { xs: "100%", md: "84%", lg: "72%" },
                fontSize: { xs: "1rem", md: "1.05rem" },
              }}
            >
              {renderTextWithMatrixWordmark(translate("etkecc.donate.description_1"))}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Paper
        elevation={0}
        sx={theme => ({
          p: { xs: 2.5, sm: 3.5, md: 4 },
          width: { xs: "100%", md: "88%", lg: "78%" },
          borderRadius: 6,
          border: theme.palette.mode === "dark" ? "1px solid rgba(244,147,0,0.14)" : "1px solid rgba(24,88,213,0.08)",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(21,24,32,0.94) 0%, rgba(13,16,22,0.98) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(247,249,253,0.98) 100%)",
          boxShadow:
            theme.palette.mode === "dark" ? "0 24px 80px rgba(0,0,0,0.28)" : "0 24px 70px rgba(24,88,213,0.08)",
        })}
      >
        <Stack spacing={3} sx={{ alignItems: "center" }}>
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
              {translate("etkecc.donate.description_2")}
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "center", width: "100%" }}>
              {translate("etkecc.donate.description_3")}
            </Typography>
            <EtkeAttribution>
              <Typography variant="body1" sx={{ textAlign: "center", width: "100%", fontWeight: 500 }}>
                {translate("etkecc.donate.description_4")}
              </Typography>
            </EtkeAttribution>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              href={DONATE_URL}
              target="_blank"
              rel="noreferrer"
              endIcon={<OpenInNewIcon />}
              sx={{ px: 3, py: 1.2, width: { xs: "100%", sm: "auto" } }}
            >
              {translate("etkecc.donate.button")}
            </Button>
          </Box>
          <Box sx={{ pt: 1, textAlign: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {translate("etkecc.donate.signature_team")}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default DonatePage;
