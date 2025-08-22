import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { User, Profile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';
import CreateUserForm from '../components/CreateUserForm';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, canManage } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const allUsers = await userApi.getAll();
      // Filter users based on role permissions
      const filteredUsers = allUsers.filter(u => {
        if (user?.profile === Profile.ADMIN) {
          return u.profile === Profile.SUPERVISOR;
        }
        if (user?.profile === Profile.SUPERVISOR) {
          return u.profile === Profile.OPERATOR;
        }
        return false;
      });
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userProfile: Profile) => {
    if (!canManage(userProfile)) {
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.delete(userId);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getProfileColor = (profile: Profile) => {
    switch (profile) {
      case Profile.ADMIN: return 'error';
      case Profile.SUPERVISOR: return 'warning';
      case Profile.OPERATOR: return 'info';
      default: return 'default';
    }
  };

  const canCreateUsers = user?.profile === Profile.ADMIN || user?.profile === Profile.SUPERVISOR;

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        {canCreateUsers && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateFormOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            Create User
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Profile</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={u.profile} 
                    color={getProfileColor(u.profile)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {canManage(u.profile) && (
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteUser(u.id, u.profile)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CreateUserForm
        open={createFormOpen}
        onClose={() => setCreateFormOpen(false)}
        onSuccess={fetchUsers}
      />
    </Box>
  );
};

export default UsersPage;