import {
  Alert,
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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthProvider, useDataProvider } from "react-admin";

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

      // Get allowed roles
      const token = await authProvider.getAccessToken();
      const rolesResponse = await dataProvider.customMethod(`/_matrix/custom/role_manager/allowed_roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setAllowedRoles(rolesResponse.data?.allowed_roles || []);

      // Get users
      const usersResponse = await dataProvider.getList('users', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {},
      });

      // Get roles for each user
      const usersWithRoles = await Promise.all(
        usersResponse.data.map(async (user: any) => {
          try {
            const roleResponse = await dataProvider.customMethod(`/_matrix/custom/role_manager/roles`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ user_id: user.id }),
            });
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
      const token = await authProvider.getAccessToken();
      await dataProvider.customMethod(`/_matrix/custom/role_manager/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

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

export default UserRolesPage;
