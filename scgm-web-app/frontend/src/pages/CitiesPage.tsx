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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { Add, Edit, Delete, LocationCity } from '@mui/icons-material';
import { City } from '../types';
import { citiesApi } from '../services/api';
import { AVAILABLE_CITIES, CityOption } from '../data/cities';

const CitiesPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    latitude: 0,
    longitude: 0,
    active: true,
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await citiesApi.getAll();
      console.log('Fetched cities:', data);
      setCities(data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setError('Failed to load cities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCity) {
        await citiesApi.update(editingCity.id, formData);
      } else {
        await citiesApi.create(formData);
      }
      
      fetchCities();
      handleClose();
    } catch (error) {
      console.error('Failed to save city:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      try {
        await citiesApi.delete(id);
        fetchCities();
      } catch (error) {
        console.error('Failed to delete city:', error);
      }
    }
  };

  const handleCitySelect = (cityKey: string) => {
    const cityOption = AVAILABLE_CITIES.find(c => `${c.name}, ${c.country}` === cityKey);
    if (cityOption) {
      setFormData({
        name: cityOption.name,
        country: cityOption.country,
        latitude: cityOption.latitude,
        longitude: cityOption.longitude,
        active: true,
      });
    }
  };

  const handleOpen = (city?: City) => {
    if (city) {
      setEditingCity(city);
      setSelectedCityOption(`${city.name}, ${city.country}`);
      setFormData({
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        active: city.active,
      });
    } else {
      setEditingCity(null);
      setSelectedCityOption('');
      setFormData({
        name: '',
        country: '',
        latitude: 0,
        longitude: 0,
        active: true,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCity(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationCity color="primary" />
          <Typography variant="h4">Cities & Countries</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
          }}
        >
          Add City
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Coordinates</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      No cities found. Click "Add City" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cities.map((city) => (
                  <TableRow key={city.id}>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{city.country}</TableCell>
                    <TableCell>
                      {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      {city.active ? 'Active' : 'Inactive'}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(city)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(city.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCity ? 'Edit City' : 'Add New City'}
        </DialogTitle>
        <DialogContent>
          {!editingCity && (
            <Autocomplete
              options={AVAILABLE_CITIES.map(city => `${city.name}, ${city.country}`)}
              value={selectedCityOption}
              onChange={(_, newValue) => {
                setSelectedCityOption(newValue || '');
                if (newValue) handleCitySelect(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select City"
                  margin="normal"
                  fullWidth
                />
              )}
            />
          )}
          
          <TextField
            fullWidth
            label="City Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            disabled={!editingCity}
          />
          <TextField
            fullWidth
            label="Country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            margin="normal"
            disabled={!editingCity}
          />
          <TextField
            fullWidth
            label="Latitude"
            type="number"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            margin="normal"
            disabled={!editingCity}
          />
          <TextField
            fullWidth
            label="Longitude"
            type="number"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            margin="normal"
            disabled={!editingCity}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
            }
            label="Active"
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              fullWidth
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
              }}
            >
              {editingCity ? 'Update' : 'Create'}
            </Button>
            <Button 
              onClick={handleClose}
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
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CitiesPage;