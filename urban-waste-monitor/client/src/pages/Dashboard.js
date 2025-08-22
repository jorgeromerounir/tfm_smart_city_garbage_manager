import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Snackbar,
  Fade,
  Grow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  TextField
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import UpdateIcon from '@mui/icons-material/Update';
import WasteMap from '../components/WasteMap';
import { containerService } from '../services/api';

function Dashboard() {
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [changedContainers, setChangedContainers] = useState([]);
  const [refreshInterval, setRefreshInterval] = useState(60);
  const [wasteFilter, setWasteFilter] = useState(['light', 'medium', 'heavy']);
  const [searchFilter, setSearchFilter] = useState('');
  const containersRef = useRef([]);
  const intervalRef = useRef(null);

  const fetchContainers = async (isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) setLoading(true);
      setIsRefreshing(true);
      setError(null);
      
      const response = await containerService.getAll();
      const newContainers = response.data;
      
      // Detect changes
      if (containersRef.current.length > 0 && isAutoRefresh) {
        const changed = newContainers.filter(newContainer => {
          const oldContainer = containersRef.current.find(c => c.id === newContainer.id);
          return oldContainer && oldContainer.waste_level !== newContainer.waste_level;
        });
        
        console.log('Changed containers:', changed.length);
        
        if (changed.length > 0) {
          setChangedContainers(changed);
          setShowNotification(true);
        }
      }
      

      
      containersRef.current = newContainers;
      setContainers(newContainers);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Failed to fetch container data. Please check if the backend server is running.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContainers();
    
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set new interval
    intervalRef.current = setInterval(() => fetchContainers(true), refreshInterval * 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval]);

  const getFilteredContainers = () => {
    return containers.filter(container => {
      const matchesWasteLevel = wasteFilter.includes(container.waste_level);
      const matchesSearch = !searchFilter || 
        container.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (container.address && container.address.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesWasteLevel && matchesSearch;
    });
  };

  const getStats = () => {
    const filtered = getFilteredContainers();
    const total = filtered.length;
    const heavy = filtered.filter(c => c.waste_level === 'heavy').length;
    const medium = filtered.filter(c => c.waste_level === 'medium').length;
    const light = filtered.filter(c => c.waste_level === 'light').length;
    const lowBattery = filtered.filter(c => c.battery_level < 20).length;
    
    return { total, heavy, medium, light, lowBattery };
  };

  const stats = getStats();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Waste Container Dashboard
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Refresh</InputLabel>
            <Select
              value={refreshInterval}
              label="Refresh"
              onChange={(e) => setRefreshInterval(e.target.value)}
            >
              <MenuItem value={10}>10 seconds</MenuItem>
              <MenuItem value={30}>30 seconds</MenuItem>
              <MenuItem value={60}>1 minute</MenuItem>
              <MenuItem value={300}>5 minutes</MenuItem>
              <MenuItem value={600}>10 minutes</MenuItem>
            </Select>
          </FormControl>
          
          {lastUpdate && (
            <Typography variant="body2" color="text.secondary">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Typography>
          )}
          
          <Tooltip title="Refresh data">
            <span>
              <IconButton 
                onClick={() => fetchContainers(false)} 
                disabled={loading}
                aria-label="Refresh container data"
                sx={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Filter Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Search containers"
                placeholder="Search by ID or address..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Waste Level:
                </Typography>
                <ToggleButtonGroup
                  value={wasteFilter}
                  onChange={(e, newFilter) => newFilter.length > 0 && setWasteFilter(newFilter)}
                  size="small"
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
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Containers
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Heavy Load
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.heavy}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Medium Load
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.medium}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Light Load
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.light}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Low Battery
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.lowBattery}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Map */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Container Locations
          </Typography>
          <WasteMap containers={getFilteredContainers()} loading={loading} />
        </CardContent>
      </Card>

      {/* Container List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Container Status
          </Typography>
          
          <Grid container spacing={2}>
            {getFilteredContainers().map((container, index) => (
              <Grid item xs={12} sm={6} md={4} key={container.id}>
                <Grow in={true} timeout={300 + index * 50}>
                  <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="h6">
                        {container.id}
                      </Typography>
                      
                      <Chip
                        label={container.waste_level}
                        color={
                          container.waste_level === 'heavy' ? 'error' :
                          container.waste_level === 'medium' ? 'warning' : 'success'
                        }
                        size="small"
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {container.battery_level < 20 ? 
                        <BatteryAlertIcon color="error" /> : 
                        <BatteryFullIcon color="success" />
                      }
                      <Typography variant="body2">
                        {container.battery_level}%
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <ThermostatIcon />
                      <Typography variant="body2">
                        {container.temperature}°C
                      </Typography>
                    </Box>
                    
                    {container.address && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        📍 {container.address}
                      </Typography>
                    )}
                  </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      
      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowNotification(false)} 
          severity="info" 
          sx={{ width: '100%' }}
          icon={<UpdateIcon />}
        >
          {changedContainers.length} container(s) updated! 🔄
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Dashboard;