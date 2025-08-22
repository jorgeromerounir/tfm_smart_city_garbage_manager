import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

} from '@mui/material';
import RouteIcon from '@mui/icons-material/Route';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import TimerIcon from '@mui/icons-material/Timer';
import SpeedIcon from '@mui/icons-material/Speed';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import WasteMap from '../components/WasteMap';
import { routeService, containerService } from '../services/api';

function RouteOptimization() {
  const [selectedCity, setSelectedCity] = useState('Madrid, Spain');
  const [startLocation, setStartLocation] = useState({
    latitude: '40.4168',
    longitude: '-3.7038',
    address: 'Plaza Mayor, Madrid'
  });
  
  const cities = {
    'Madrid, Spain': {
      center: [40.4168, -3.7038],
      locations: [
        { label: 'Plaza Mayor', lat: 40.4168, lng: -3.7038 },
        { label: 'Puerta del Sol', lat: 40.4169, lng: -3.7033 },
        { label: 'Retiro Park', lat: 40.4152, lng: -3.6844 },
        { label: 'Atocha Station', lat: 40.4067, lng: -3.6919 }
      ]
    },
    'Bogotá, Colombia': {
      center: [4.5981, -74.0758],
      locations: [
        { label: 'Plaza Bolívar', lat: 4.5981, lng: -74.0758 },
        { label: 'Zona Rosa', lat: 4.6698, lng: -74.0440 },
        { label: 'Centro Histórico', lat: 4.5964, lng: -74.0742 },
        { label: 'Aeropuerto El Dorado', lat: 4.7016, lng: -74.1469 }
      ]
    }
  };
  
  const getCurrentCityLocations = () => {
    return cities[selectedCity]?.locations || [];
  };
  const [route, setRoute] = useState(null);
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wasteFilter, setWasteFilter] = useState(['medium', 'heavy']);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [routeName, setRouteName] = useState('');
  
  const handleCityChange = (event, newValue) => {
    if (newValue) {
      setSelectedCity(newValue);
      const cityData = cities[newValue];
      if (cityData) {
        setStartLocation({
          latitude: cityData.center[0].toString(),
          longitude: cityData.center[1].toString(),
          address: cityData.locations[0].label
        });
      }
    }
  };


  useEffect(() => {
    fetchContainers();
    
    // Load saved routes from localStorage
    const saved = localStorage.getItem('savedRoutes');
    if (saved) {
      setSavedRoutes(JSON.parse(saved));
    }
  }, []);
  
  useEffect(() => {
    // Update map center when city changes
    const cityData = cities[selectedCity];
    if (cityData) {
      setStartLocation({
        latitude: cityData.center[0].toString(),
        longitude: cityData.center[1].toString(),
        address: cityData.locations[0].label
      });
    }
  }, [selectedCity]);

  const fetchContainers = async () => {
    try {
      const response = await containerService.getAll();
      setContainers(response.data);
    } catch (err) {
      console.error('Failed to fetch containers:', err);
    }
  };

  const optimizeRoute = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await routeService.optimize(
        parseFloat(startLocation.latitude),
        parseFloat(startLocation.longitude),
        'heavy',
        wasteFilter.join(',')
      );
      
      setRoute(response.data);
    } catch (err) {
      setError('Failed to optimize route. Please check your inputs and try again.');
      console.error('Route optimization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (field) => (event) => {
    setStartLocation(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };
  
  const handleMapClick = (lat, lng) => {
    setStartLocation(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      address: `Selected location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    }));
  };

  const getRoutePoints = () => {
    if (!route || !route.route) return [];
    return route.route;
  };

  const saveRoute = () => {
    if (!route || !routeName.trim()) return;
    
    const savedRoute = {
      id: Date.now(),
      name: routeName.trim(),
      route: route,
      startLocation: startLocation,
      wasteFilter: wasteFilter,
      city: selectedCity,
      createdAt: new Date().toISOString()
    };
    
    const updatedRoutes = savedRoutes.filter(r => r.name !== routeName.trim());
    updatedRoutes.push(savedRoute);
    setSavedRoutes(updatedRoutes);
    localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes));
    
    setShowSaveDialog(false);
    setRouteName('');
  };

  const loadRoute = (savedRoute) => {
    setRoute(savedRoute.route);
    setStartLocation(savedRoute.startLocation);
    setWasteFilter(savedRoute.wasteFilter);
  };

  const deleteRoute = (routeId) => {
    const updatedRoutes = savedRoutes.filter(r => r.id !== routeId);
    setSavedRoutes(updatedRoutes);
    localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes));
  };

  const getFilteredContainers = () => {
    return containers.filter(container => {
      return wasteFilter.includes(container.waste_level);
    });
  };
  
  const getCityFilteredRoutes = () => {
    return savedRoutes.filter(route => route.city === selectedCity);
  };

  const needsCollection = getFilteredContainers();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Route Optimization
      </Typography>
      
      <Grid container spacing={3}>
          {/* Configuration Panel */}
          <Grid item xs={12} md={2.5}>
            <Card>
              <CardContent>
                  <Autocomplete
                  fullWidth
                  options={Object.keys(cities)}
                  value={selectedCity}
                  onChange={handleCityChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      margin="normal"
                      helperText="Select city for route optimization"
                    />
                  )}
                />
                
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Starting Location
                </Typography>
                
                <Autocomplete
                  fullWidth
                  options={getCurrentCityLocations()}
                  value={getCurrentCityLocations().find(opt => opt.label === startLocation.address) || null}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setStartLocation({
                        latitude: newValue.lat.toString(),
                        longitude: newValue.lng.toString(),
                        address: newValue.label
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Starting Address"
                      margin="normal"
                      placeholder="Select or type depot address..."
                      helperText="Select from list or click on map"
                    />
                  )}
                  freeSolo
                  onInputChange={(event, newInputValue) => {
                    setStartLocation(prev => ({
                      ...prev,
                      address: newInputValue
                    }));
                  }}
                />
                
                <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                  Include waste levels:
                </Typography>
                <ToggleButtonGroup
                  value={wasteFilter}
                  onChange={(e, newFilter) => newFilter.length > 0 && setWasteFilter(newFilter)}
                  size="small"
                  orientation="vertical"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="light" color="success">
                    Light
                  </ToggleButton>
                  <ToggleButton value="medium" color="warning">
                    Medium
                  </ToggleButton>
                  <ToggleButton value="heavy" color="error">
                    Heavy
                  </ToggleButton>
                </ToggleButtonGroup>
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={optimizeRoute}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <RouteIcon />}
                  sx={{ mt: 2 }}
                  aria-label="Calculate optimized collection route"
                >
                  {loading ? 'Optimizing...' : 'Optimize Route'}
                </Button>
              </CardContent>
            </Card>

          {/* Statistics */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Collection Summary
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Containers needing collection:</Typography>
                <Chip label={needsCollection.length} color="primary" size="small" />
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Heavy load:</Typography>
                <Chip 
                  label={containers.filter(c => c.waste_level === 'heavy').length} 
                  color="error" 
                  size="small" 
                />
              </Box>
              
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Medium load:</Typography>
                <Chip 
                  label={containers.filter(c => c.waste_level === 'medium').length} 
                  color="warning" 
                  size="small" 
                />
              </Box>
            </CardContent>
          </Card>

          {/* Route Results */}
          {route && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Route Details
                </Typography>
                
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <SpeedIcon fontSize="small" />
                  <Typography variant="body2">
                    Total Distance: {route.totalDistance} km
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TimerIcon fontSize="small" />
                  <Typography variant="body2">
                    Estimated Time: {route.estimatedTime} minutes
                  </Typography>
                </Box>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={() => setShowSaveDialog(true)}
                  sx={{ mb: 2 }}
                >
                  Save Route
                </Button>
                
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Route Sequence:
                </Typography>
                
                <List dense>
                  {route.route.map((point, index) => (
                    <ListItem key={`${point.id}-${index}`} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {point.type === 'depot' ? 
                          <LocationOnIcon color="primary" fontSize="small" /> :
                          <DeleteIcon 
                            color={point.wasteLevel === 'heavy' ? 'error' : 'warning'} 
                            fontSize="small" 
                          />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          point.type === 'depot' ? 
                            'Depot (Start)' : 
                            `Container ${point.id}`
                        }
                        secondary={
                          point.type === 'container' ? 
                            `${point.wasteLevel} load` : 
                            'Starting point'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Map */}
        <Grid item xs={12} md={6.5}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optimized Collection Route
              </Typography>
              
              <WasteMap
                containers={getFilteredContainers()}
                route={getRoutePoints()}
                loading={loading}
                highlightCollection={true}
                onMapClick={handleMapClick}
                center={cities[selectedCity]?.center || [40.4168, -3.7038]}
              />
            </CardContent>
            </Card>
          </Grid>
          
          {/* Saved Routes Sidebar */}
          <Grid item xs={12} md={3}>
            <Card sx={{ height: 'fit-content', position: 'sticky', top: 16 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Saved Routes
                </Typography>
                
                {getCityFilteredRoutes().length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    No saved routes yet.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
                    {getCityFilteredRoutes().map((savedRoute) => (
                      <Card key={savedRoute.id} variant="outlined" sx={{ mb: 2, p: 1.5 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                          {savedRoute.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                          {savedRoute.route.containersToCollect} containers
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                          {savedRoute.route.totalDistance} km
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 1.5 }}>
                          {new Date(savedRoute.createdAt).toLocaleDateString()}
                        </Typography>
                        <Box display="flex" gap={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => loadRoute(savedRoute)}
                            sx={{ fontSize: '0.75rem', flex: 1 }}
                          >
                            Load
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => deleteRoute(savedRoute.id)}
                            sx={{ fontSize: '0.75rem', minWidth: 'auto', px: 1 }}
                          >
                            ×
                          </Button>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      
      {/* Save Route Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Route</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Route Name"
            fullWidth
            variant="outlined"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Enter a name for this route..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button onClick={saveRoute} variant="contained" disabled={!routeName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default RouteOptimization;