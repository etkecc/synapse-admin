import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { merge } from "lodash";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { Admin, CustomRoutes, Resource, resolveBrowserLocale, reactRouterProvider } from "react-admin";

import AdminLayout from "./components/AdminLayout";
import BillingPage from "./components/etke.cc/BillingPage";
import { useInstanceConfig } from "./components/etke.cc/InstanceConfig";
import ServerActionsPage from "./components/etke.cc/ServerActionsPage";
import SupportPage from "./components/etke.cc/SupportPage";
import SupportRequestPage from "./components/etke.cc/SupportRequestPage";
import ServerNotificationsPage from "./components/etke.cc/ServerNotificationsPage";
import ServerStatusPage from "./components/etke.cc/ServerStatusPage";
import RecurringCommandEdit from "./components/etke.cc/schedules/components/recurring/RecurringCommandEdit";
import ScheduledCommandEdit from "./components/etke.cc/schedules/components/scheduled/ScheduledCommandEdit";
import ScheduledCommandShow from "./components/etke.cc/schedules/components/scheduled/ScheduledCommandShow";
import UserImport from "./components/user-import/UserImport";
import germanMessages from "./i18n/de";
import englishMessages from "./i18n/en";
import persianMessages from "./i18n/fa";
import frenchMessages from "./i18n/fr";
import italianMessages from "./i18n/it";
import japaneseMessages from "./i18n/ja";
import russianMessages from "./i18n/ru";
import ukrainianMessages from "./i18n/uk";
import chineseMessages from "./i18n/zh";
import LoginPage from "./pages/LoginPage";
import { DatabaseRoomStatsList } from "./resources/database_room_statistics";
import destinations from "./resources/destinations";
import registrationToken from "./resources/registration_tokens";
import reports from "./resources/reports";
import roomDirectory from "./resources/room_directory";
import rooms from "./resources/rooms";
import userMediaStats from "./resources/user_media_statistics";
import users from "./resources/users";
import authProvider from "./providers/authProvider";
import dataProvider from "./providers/dataProvider";

// TODO: Can we use lazy loading together with browser locale?
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

const Route = reactRouterProvider.Route;
const queryClient = new QueryClient();

export const App = () => {
  const icfg = useInstanceConfig();
  let title = "Synapse Admin";
  if (icfg.name) {
    title = icfg.name;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Admin
        disableTelemetry
        requireAuth
        title={title}
        layout={AdminLayout}
        loginPage={LoginPage}
        authProvider={authProvider}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
      >
        <CustomRoutes>
          <Route path="/import_users" element={<UserImport />} />
          {!icfg.disabled.monitoring && <Route path="/server_status" element={<ServerStatusPage />} />}
          {!icfg.disabled.actions && <Route path="/server_actions" element={<ServerActionsPage />} />}
          {!icfg.disabled.actions && (
            <Route path="/server_actions/scheduled/:id/show" element={<ScheduledCommandShow />} />
          )}
          {!icfg.disabled.actions && <Route path="/server_actions/scheduled/:id" element={<ScheduledCommandEdit />} />}
          {!icfg.disabled.actions && (
            <Route path="/server_actions/scheduled/create" element={<ScheduledCommandEdit />} />
          )}
          {!icfg.disabled.actions && <Route path="/server_actions/recurring/:id" element={<RecurringCommandEdit />} />}
          {!icfg.disabled.actions && (
            <Route path="/server_actions/recurring/create" element={<RecurringCommandEdit />} />
          )}
          {!icfg.disabled.actions && <Route path="/server_notifications" element={<ServerNotificationsPage />} />}
          {!icfg.disabled.payments && <Route path="/billing" element={<BillingPage />} />}
          {!icfg.disabled.support && <Route path="/support" element={<SupportPage />} />}
          {!icfg.disabled.support && <Route path="/support/:id" element={<SupportRequestPage />} />}
          <Route path="/database_room_statistics" element={<DatabaseRoomStatsList />} />
        </CustomRoutes>
        <Resource {...users} />
        <Resource {...rooms} />
        <Resource {...userMediaStats} />
        <Resource name="database_room_statistics" />
        <Resource {...reports} />
        <Resource {...roomDirectory} />
        {!icfg.disabled.federation && <Resource {...destinations} />}
        {!icfg.disabled.registration_tokens && <Resource {...registrationToken} />}
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
