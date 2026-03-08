import { Avatar, Box, Button, Card, CardActions, CssBaseline, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { I18nContextProvider } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { resolveBrowserLocale, useTranslate } from "react-admin";
import { Root } from "react-dom/client";
import React from "react";
import { merge } from "lodash";

import LoginFormBox from "./components/LoginFormBox";
import Footer from "./components/Footer";
import { EtkeAttribution } from "./components/etke.cc/EtkeAttribution";
import { useInstanceConfig } from "./components/etke.cc/InstanceConfig";
import germanMessages from "./i18n/de";
import englishMessages from "./i18n/en";
import persianMessages from "./i18n/fa";
import frenchMessages from "./i18n/fr";
import italianMessages from "./i18n/it";
import japaneseMessages from "./i18n/ja";
import russianMessages from "./i18n/ru";
import ukrainianMessages from "./i18n/uk";
import chineseMessages from "./i18n/zh";

const messages = {
  de: germanMessages,
  en: englishMessages,
  fa: persianMessages,
  fr: frenchMessages,
  it: italianMessages,
  ja: japaneseMessages,
  ru: russianMessages,
  uk: ukrainianMessages,
  zh: chineseMessages,
};

const i18nProvider = polyglotI18nProvider(
  locale => (messages[locale] ? merge({}, messages.en, messages[locale]) : messages.en),
  resolveBrowserLocale(),
  [
    { locale: "en", name: "English" },
    { locale: "de", name: "Deutsch" },
    { locale: "fr", name: "Français" },
    { locale: "it", name: "Italiano" },
    { locale: "ja", name: "Japanese (日本語)" },
    { locale: "fa", name: "Persian (فارسی)" },
    { locale: "ru", name: "Russian (Русский)" },
    { locale: "uk", name: "Ukrainian (Українська)" },
    { locale: "zh", name: "Chinese (简体中文)" },
  ]
);

const AuthCallbackErrorView = ({ message, onBack }: { message: string; onBack: () => void }): React.ReactElement => {
  const icfg = useInstanceConfig();
  const translate = useTranslate();
  let welcomeTo = "Synapse Admin";
  let logoUrl = "./images/logo.webp";
  let footerLogoUrl = "./images/logo.webp";
  let backgroundUrl = "./images/floating-cogs.svg";
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
      <Card className="card">
        <Box className="avatar">
          <Avatar sx={{ width: "120px", height: "120px" }} src={logoUrl} />
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
          <Button size="small" variant="contained" type="button" color="primary" onClick={onBack} fullWidth>
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

export const renderAuthCallbackError = (root: Root, { message, onBack }: { message: string; onBack: () => void }) => {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
  const theme = createTheme({
    palette: {
      mode: prefersDark ? "dark" : "light",
    },
  });

  root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nContextProvider value={i18nProvider}>
        <AuthCallbackErrorView message={message} onBack={onBack} />
      </I18nContextProvider>
    </ThemeProvider>
  );
};
