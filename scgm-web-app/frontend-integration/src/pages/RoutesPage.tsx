import { Close, Delete, LocalShipping, Person, Route as RouteIcon, Save, Update } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import MapView from '../components/MapView.tsx'
import OperatorDashboard from '../components/OperatorDashboard.tsx'
import RouteAssignmentDialog from '../components/RouteAssignmentDialog.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import useContainers from '../hooks/useContainers.ts'
import useCustomer from '../hooks/useCustomer.ts'
import useRoutes from '../hooks/useRoutes.ts'
import { Profile, City } from '../types/index.ts'
import useGetZones from '../hooks/useGetZones.ts'
import { citiesApi } from '../services/api'

const RoutesPage: React.FC = () => {
  const { user } = useAuth()
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false)
  const [sidenavOpen, setSidenavOpen] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [cities, setCities] = useState<City[]>([])
  //console.log('---> user data: ', user);
  const { customer } = useCustomer(user?.customerId)
  const [selectedCityId, setSelectedCityId] = useState<number>(customer?.cityId || 1)

  React.useEffect(() => {
    if (customer?.cityId) {
      setSelectedCityId(customer.cityId)
    }
  }, [customer?.cityId])

  React.useEffect(() => {
    void fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const data = await citiesApi.getAll()
      setCities(data ? data : [])
    } catch (error) {
      console.error('Failed to fetch cities:', error)
    }
  }

  //console.log('---> customer data: ', customer);
  const { zones } = useGetZones(customer?.id, selectedCityId)
  
  // Show operator dashboard for operators
  if (user?.profile === Profile.OPERATOR) {
    return <OperatorDashboard user={user}/>
  }
  
  const { filteredContainers, selectedWasteTypes, setSelectedWasteTypes } =
    useContainers(customer?.id, selectedCityId, 500, 'true')
  //console.log('---> filteredContainers: ', filteredContainers);
  const {
    tabValue,
    selectedCity,
    setRouteName,
    setTabValue,
    routeName,
    loading,
    optimizedRoute,
    currentZone,
    setCurrentZone,
    handleDeleteRoute,
    handleOptimizeRoute,
    handleLoadRoute,
    handleSaveRoute,
    savedRoutes,
  } = useRoutes(customer ?? undefined, selectedWasteTypes)

  function handleAssignTruck(route: any) {
    setSelectedRoute(route)
    setAssignmentDialogOpen(true)
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4">Route Optimization</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedCityId}
              label="City"
              onChange={(e) => setSelectedCityId(e.target.value as number)}
            >
              {cities.map(city => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}, {city.country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            onClick={() => setSidenavOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            {loading ? 'Loading...' : 'Manage routes'}
          </Button>
        </Box>
      </Box>

      <Box sx={{ position: "relative" }}>
        <Drawer
          anchor="left"
          open={sidenavOpen}
          onClose={() => setSidenavOpen(false)}
          PaperProps={{
            sx: {
              width: 400,
              height: "100%",
              borderRadius: 4,
            },
          }}
        >
          <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Route Configuration</Typography>
              <IconButton onClick={() => setSidenavOpen(false)}>
                <Close />
              </IconButton>
            </Box>

            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
              <Tab label="Configuration" />
              <Tab label={"Saved Routes"} />
            </Tabs>

            {tabValue === 0 && (
              <Box>
                <Autocomplete
                  options={cities
                    .filter((city) => {
                      if (user?.profile === "ADMIN") return true;
                      return city.country === user?.country;
                    })
                    .map((city) => `${city.name}, ${city.country}`)}
                  value={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : ""}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      const city = cities.find((c) => `${c.name}, ${c.country}` === newValue);
                    }
                  }}
                  disabled={false}
                  renderInput={(params) => <TextField {...params} label="City" margin="normal" fullWidth />}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel id="zones-selector">Zones</InputLabel>
                  <Select
                    labelId="zones-selector"
                    value={currentZone?.id}
                    label="Zones"
                    onChange={(e) => setCurrentZone(zones.find((z) => z.id === e.target.value))}
                  >
                    {zones.map((zone) => (
                      <MenuItem key={zone.name} value={zone.id}>
                        {zone.name}
                      </MenuItem>
                    )) || []}
                  </Select>
                </FormControl>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Filter by Waste Type
                </Typography>
                <ToggleButtonGroup
                  value={selectedWasteTypes}
                  onChange={(_, newTypes) => {
                    if (newTypes.length > 0) {
                      setSelectedWasteTypes(newTypes);
                    }
                  }}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="LIGHT" color="success" sx={{ flex: 1 }}>
                    Light
                  </ToggleButton>
                  <ToggleButton value="MEDIUM" color="warning" sx={{ flex: 1 }}>
                    Medium
                  </ToggleButton>
                  <ToggleButton value="HEAVY" color="error" sx={{ flex: 1 }}>
                    Heavy
                  </ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5,
                    px: 3,
                  }}
                  onClick={() => (handleOptimizeRoute())}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <RouteIcon />}
                >
                  {loading ? "Optimizing..." : "Optimize Route"}
                </Button>

                {optimizedRoute && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Route Details
                    </Typography>
                    <Chip
                      label={`${optimizedRoute.containerCount} containers`}
                      size="small"
                      sx={{
                        mr: 1,
                        borderRadius: 2,
                        bgcolor: "primary.container",
                        color: "primary.onContainer",
                      }}
                    />
                    <Chip
                      label={`${optimizedRoute.totalDistance} km`}
                      size="small"
                      sx={{
                        mr: 1,
                        borderRadius: 2,
                        bgcolor: "secondary.container",
                        color: "secondary.onContainer",
                      }}
                    />
                    <Chip
                      label={`${optimizedRoute.estimatedTime} min`}
                      size="small"
                      sx={{
                        mr: 1,
                        borderRadius: 2,
                        bgcolor: "tertiary.container",
                        color: "tertiary.onContainer",
                      }}
                    />
                    {optimizedRoute.trucksUsed && (
                      <Chip
                        label={`${optimizedRoute.trucksUsed} trucks`}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          bgcolor: "success.container",
                          color: "success.onContainer",
                        }}
                      />
                    )}

                    <TextField
                      label="Route Name"
                      value={routeName}
                      onChange={(e) => setRouteName(e.target.value)}
                      fullWidth
                      margin="normal"
                      size="small"
                    />

                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                      }}
                      onClick={handleSaveRoute}
                      startIcon={<Save />}
                    >
                      Save Route
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {tabValue === 1 && (
              <Box sx={{ overflow: "auto" }}>
                {savedRoutes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    No saved routes for {selectedCity?.name}
                  </Typography>
                ) : (
                  savedRoutes.map((route) => (
                    <Card
                      key={route.id}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                        boxShadow: 2,
                      }}
                    >
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {route.name}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Button
                              size="small"
                              onClick={() => handleLoadRoute(route)}
                              startIcon={<Update />}
                              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                            >
                              Load
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteRoute(route.id)}
                              startIcon={<Delete />}
                              sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                          <Chip
                            size="small"
                            label={`${route.containerCount} containers`}
                            color="primary"
                            variant="outlined"
                          />
                          <Chip size="small" label={`${route.totalDistance}km`} color="secondary" variant="outlined" />
                          <Chip size="small" label={`${route.estimatedTime}min`} color="info" variant="outlined" />
                          {route.trucksUsed && (
                            <Chip
                              size="small"
                              label={`${route.trucksUsed} trucks`}
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                          Created: {new Date(route.createdAt).toLocaleDateString()}{" "}
                          {new Date(route.createdAt).toLocaleTimeString()}
                        </Typography>

                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Person fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {route.operatorName || "No operator assigned"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <LocalShipping fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {route.truckName || "No truck assigned"}
                              </Typography>
                            </Box>
                            {user?.profile === "SUPERVISOR" && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleAssignTruck(route)}
                                sx={{ textTransform: "none", fontSize: "0.75rem" }}
                              >
                                Assign
                              </Button>
                            )}
                          </Box>
                        </Box>

                        {route.status && (
                          <Chip
                            size="small"
                            label={route.status.replace("_", " ").toUpperCase()}
                            color={
                              route.status === "completed"
                                ? "success"
                                : route.status === "in_progress"
                                ? "warning"
                                : "default"
                            }
                            variant="filled"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </Card>
                  ))
                )}
              </Box>
            )}
          </Box>
        </Drawer>

        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                bgcolor: "surface.main",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Map View
                </Typography>
                <Box sx={{ width: "100%", minWidth: "100%" }}>
                  <MapView
                    containers={filteredContainers}
                    route={optimizedRoute?.route}
                    verpRoutes={optimizedRoute?.routes}
                    center={[selectedCity?.latitude || 0, selectedCity?.longitude || 0]}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <RouteAssignmentDialog
        open={assignmentDialogOpen}
        onClose={() => setAssignmentDialogOpen(false)}
        route={selectedRoute || optimizedRoute}
        city={selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : ""}
        supervisorId={user?.id.toString() || ""}
        onAssignmentComplete={() => window.location.reload()}
      />
    </Box>
  );

}

export default RoutesPage
