import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { merge } from "lodash";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { useEffect, useState } from "react";
import { Admin, CustomRoutes, Loading, Resource, resolveBrowserLocale } from "react-admin";
import { Route } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import BillingPage from "./components/etke.cc/BillingPage";
import ServerActionsPage from "./components/etke.cc/ServerActionsPage";
import ServerNotificationsPage from "./components/etke.cc/ServerNotificationsPage";
import ServerStatusPage from "./components/etke.cc/ServerStatusPage";
import RecurringCommandEdit from "./components/etke.cc/schedules/components/recurring/RecurringCommandEdit";
import ScheduledCommandEdit from "./components/etke.cc/schedules/components/scheduled/ScheduledCommandEdit";
import ScheduledCommandShow from "./components/etke.cc/schedules/components/scheduled/ScheduledCommandShow";
import UserImport from "./components/user-import/UserImport";
import germanMessages from "./i18n/de";
import englishMessages from "./i18n/en";
import frenchMessages from "./i18n/fr";
import italianMessages from "./i18n/it";
import japaneseMessages from "./i18n/ja";
import russianMessages from "./i18n/ru";
import ukrainianMessages from "./i18n/uk";
import chineseMessages from "./i18n/zh";
import LoginPage from "./pages/LoginPage";
import destinations from "./resources/destinations";
import registrationToken from "./resources/registration_tokens";
import reports from "./resources/reports";
import roomDirectory from "./resources/room_directory";
import rooms from "./resources/rooms";
import userMediaStats from "./resources/user_media_statistics";
import users from "./resources/users";
import authProvider from "./synapse/authProvider";
import dataProvider from "./synapse/dataProvider";

// TODO: Can we use lazy loading together with browser locale?
const messages = {
  de: germanMessages,
  en: englishMessages,
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

const queryClient = new QueryClient();

export const App = () => {
  const [isHandlingCallback, setIsHandlingCallback] = useState(false);

  useEffect(() => {
    // Check if we're on the OAuth callback path
    const isCallbackPath = window.location.pathname === "/auth-callback";
    const hasAuthCode = new URLSearchParams(window.location.search).has("code");

    if (isCallbackPath && hasAuthCode) {
      setIsHandlingCallback(true);

      // Handle the OAuth callback
      authProvider
        .handleCallback?.()
        .then(result => {
          // Redirect to the appropriate page after successful auth
          const redirectTo = result?.redirectTo || "/";
          window.location.href = `${window.location.origin}/#${redirectTo}`;
        })
        .catch(error => {
          console.error("OAuth callback error:", error);
          // Redirect to login on error
          window.location.href = `${window.location.origin}/#/login`;
        });
    }
  }, []);

  // Show loading state while handling callback
  if (isHandlingCallback) {
    return (
      <Loading loadingPrimary="Authenticating..." loadingSecondary="Please wait while we complete your login..." />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Admin
        disableTelemetry
        requireAuth
        title="Synapse Admin"
        layout={AdminLayout}
        loginPage={LoginPage}
        authProvider={authProvider}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
      >
        <CustomRoutes>
          <Route path="/import_users" element={<UserImport />} />
          <Route path="/server_status" element={<ServerStatusPage />} />
          <Route path="/server_actions" element={<ServerActionsPage />} />
          <Route path="/server_actions/scheduled/:id/show" element={<ScheduledCommandShow />} />
          <Route path="/server_actions/scheduled/:id" element={<ScheduledCommandEdit />} />
          <Route path="/server_actions/scheduled/create" element={<ScheduledCommandEdit />} />
          <Route path="/server_actions/recurring/:id" element={<RecurringCommandEdit />} />
          <Route path="/server_actions/recurring/create" element={<RecurringCommandEdit />} />
          <Route path="/server_notifications" element={<ServerNotificationsPage />} />
          <Route path="/billing" element={<BillingPage />} />
        </CustomRoutes>
        <Resource {...users} />
        <Resource {...rooms} />
        <Resource {...userMediaStats} />
        <Resource {...reports} />
        <Resource {...roomDirectory} />
        <Resource {...destinations} />
        <Resource {...registrationToken} />
        <Resource name="connections" />
        <Resource name="devices" />
        <Resource name="room_members" />
        <Resource name="users_media" />
        <Resource name="joined_rooms" />
        <Resource name="pushers" />
        <Resource name="servernotices" />
        <Resource name="forward_extremities" />
        <Resource name="room_state" />
        <Resource name="destination_rooms" />
      </Admin>
    </QueryClientProvider>
  );
};

export default App;
