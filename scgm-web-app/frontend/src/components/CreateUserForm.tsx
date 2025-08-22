import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Profile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';

interface CreateUserFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<Profile>(Profile.OPERATOR);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, canManage } = useAuth();

  const availableProfiles = () => {
    if (user?.profile === Profile.ADMIN) {
      return [Profile.SUPERVISOR];
    }
    if (user?.profile === Profile.SUPERVISOR) {
      return [Profile.OPERATOR];
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canManage(profile)) {
      setError('You do not have permission to create this role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userApi.create({ name, email, password, profile });
      onSuccess();
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setProfile(Profile.OPERATOR);
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Profile</InputLabel>
            <Select
              value={profile}
              onChange={(e) => setProfile(e.target.value as Profile)}
              label="Profile"
            >
              {availableProfiles().map((prof) => (
                <MenuItem key={prof} value={prof}>
                  {prof}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
              }}
            >
              {loading ? 'Creating...' : 'Create User'}
            </Button>
            <Button 
              onClick={onClose} 
              variant="outlined" 
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;