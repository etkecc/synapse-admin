import { Avatar, Box, Button, Card, CardActions, CssBaseline, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { I18nContextProvider } from "ra-core";
import { useTranslate } from "react-admin";
import { Root } from "react-dom/client";
import React from "react";

import LoginFormBox from "../components/LoginFormBox";
import Footer from "../components/Footer";
import { EtkeAttribution } from "../components/etke.cc/EtkeAttribution";
import { useInstanceConfig } from "../components/etke.cc/InstanceConfig";
import { createI18nProvider } from "../i18n";

const AuthCallbackErrorView = ({ message, onBack }: { message: string; onBack: () => void }): React.ReactElement => {
  const icfg = useInstanceConfig();
  const translate = useTranslate();
  let welcomeTo = "Synapse Admin";
  let logoUrl = "./images/logo.webp";
  let footerLogoUrl = "./images/logo.webp";
  let backgroundUrl = "";
  if (icfg.name) {
    welcomeTo = icfg.name;
  }
  if (icfg.logo_url) {
    logoUrl = icfg.logo_url;
    footerLogoUrl = icfg.logo_url;
  }
  if (icfg.background_url) {
    backgroundUrl = icfg.background_url;
  }

  return (
    <LoginFormBox backgroundUrl={backgroundUrl}>
      {!backgroundUrl && (
        <>
          <div className="login-orb login-orb-1" />
          <div className="login-orb login-orb-2" />
          <div className="login-orb login-orb-3" />
        </>
      )}
      <Card className="card">
        <Box className="avatar">
          <Avatar sx={{ width: { xs: "80px", sm: "120px" }, height: { xs: "80px", sm: "120px" } }} src={logoUrl} />
        </Box>
        <Box className="hint">{translate("synapseadmin.auth.welcome", { name: welcomeTo })}</Box>
        <Box className="form">
          <Typography variant="h6" sx={{ marginBottom: "0.5rem" }}>
            {translate("ra.page.authentication_error")}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {message}
          </Typography>
        </Box>
        <CardActions className="actions">
          <Button variant="contained" type="button" color="primary" onClick={onBack} fullWidth>
            {translate("ra.action.back")}
          </Button>
        </CardActions>
      </Card>
      <EtkeAttribution>
        <Footer logoSrc={footerLogoUrl} />
      </EtkeAttribution>
    </LoginFormBox>
  );
};

export const renderAuthCallbackError = async (
  root: Root,
  { message, onBack }: { message: string; onBack: () => void }
) => {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  const theme = createTheme({
    palette: {
      mode: prefersDark ? "dark" : "light",
    },
  });

  const i18nProvider = await createI18nProvider();

  root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nContextProvider value={i18nProvider}>
        <AuthCallbackErrorView message={message} onBack={onBack} />
      </I18nContextProvider>
    </ThemeProvider>
  );
};
