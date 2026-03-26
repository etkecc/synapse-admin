import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Admin, CustomRoutes, Resource, reactRouterProvider } from "react-admin";
import type { I18nProvider } from "ra-core";

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
import LoginPage from "./pages/LoginPage";
import { DatabaseRoomStatsList } from "./resources/database_room_statistics";
import destinations from "./resources/destinations";
import registrationToken from "./resources/registration_tokens";
import reports from "./resources/reports";
import scheduledTasks from "./resources/scheduled_tasks";
import roomDirectory from "./resources/room_directory";
import rooms from "./resources/rooms";
import userMediaStats from "./resources/user_media_statistics";
import users from "./resources/users";
import authProvider from "./providers/authProvider";
import dataProvider from "./providers/dataProvider";
import { lightTheme, darkTheme } from "./assets/theme";

const Route = reactRouterProvider.Route;
const queryClient = new QueryClient();

export const App = ({ i18nProvider }: { i18nProvider: I18nProvider }) => {
  const icfg = useInstanceConfig();
  let title = "Ketesa";
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
        theme={lightTheme}
        darkTheme={darkTheme}
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
        <Resource {...scheduledTasks} />
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
