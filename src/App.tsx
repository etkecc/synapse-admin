import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { merge } from "lodash";
import polyglotI18nProvider from "ra-i18n-polyglot";
import {
  Admin,
  CustomRoutes,
  Resource,
  resolveBrowserLocale,
  useAuthProvider,
  useDataProvider
} from "react-admin";
import { Route } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People'; // Добавляем иконку

import AdminLayout from "./components/AdminLayout";
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
import russianMessages from "./i18n/ru";
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
import { useEffect, useState } from "react"; // Добавляем хуки
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material"; // Добавляем компоненты Material UI

// TODO: Can we use lazy loading together with browser locale?
const messages = {
  de: germanMessages,
  en: englishMessages,
  fr: frenchMessages,
  it: italianMessages,
  ru: russianMessages,
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
    { locale: "fa", name: "Persian(فارسی)" },
    { locale: "ru", name: "Russian(Русский)" },
    { locale: "zh", name: "简体中文" },
  ]
);

const queryClient = new QueryClient();

// Новый компонент для управления ролями
const UserRolesPage = () => {
  const authProvider = useAuthProvider();
  const dataProvider = useDataProvider();
  const [users, setUsers] = useState<any[]>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Получаем список разрешенных ролей
      const rolesResponse = await authProvider.getAccessToken().then(token =>
        dataProvider.customMethod(`/_matrix/custom/role_manager/allowed_roles`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );
      setAllowedRoles(rolesResponse.data?.allowed_roles || []);

      // Получаем список пользователей
      const usersResponse = await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      });

      // Для каждого пользователя получаем его роль
      const usersWithRoles = await Promise.all(
        usersResponse.data.map(async (user: any) => {
          try {
            const roleResponse = await authProvider.getAccessToken().then(token =>
              dataProvider.customMethod(`/_matrix/custom/role_manager/roles`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.id })
              })
            );
            return {
              ...user,
              role: roleResponse.data?.role || 'subscriber',
              permissions: roleResponse.data?.permissions || {}
            };
          } catch (e) {
            console.error(`Failed to get role for ${user.id}:`, e);
            return {
              ...user,
              role: 'subscriber',
              permissions: {}
            };
          }
        })
      );

      setUsers(usersWithRoles);
    } catch (err: any) {
      setError('Failed to load data: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await authProvider.getAccessToken().then(token =>
        dataProvider.customMethod(`/_matrix/custom/role_manager/roles`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId, role: newRole })
        })
      );

      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      showNotification(`Role updated for ${userId}`, 'success');
    } catch (err: any) {
      showNotification(`Failed to update role: ${err.message}`, 'error');
      console.error(err);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Current Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.displayname || 'N/A'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Change Role</InputLabel>
                    <Select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value as string)}
                      label="Change Role"
                    >
                      {allowedRoles.map(role => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <Admin
      disableTelemetry
      requireAuth
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

        {/* Добавляем новый маршрут для управления ролями */}
        <Route path="/user_roles" element={<UserRolesPage />} />
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

export default App;
