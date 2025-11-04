import { Close, Info } from '@mui/icons-material'
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Tab,
  Tabs,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import React, { useState } from 'react'
import MapViewZones from '../components/MapViewZones.tsx'
import OperatorDashboard from '../components/OperatorDashboard.tsx'
import { useAuth } from '../contexts/AuthContext.tsx'
import useContainers from '../hooks/useContainers.ts'
import useCustomer from '../hooks/useCustomer.ts'
import { Profile, ZoneAddDto, City } from '../types/index.ts'
import useGetCity from '../hooks/useGetCity.ts'
import useZones, { Zone } from '../hooks/useZones.ts'
import useAddMultipleZones from '../hooks/useAddMultipleZones.ts'
import useNoti from '../hooks/useNoti.tsx'
import { citiesApi } from '../services/api'

const ZonesPage: React.FC = () => {
  const { user } = useAuth()
  const { addMultipleZones, loading, error } = useAddMultipleZones()
  const [zonesDrawerOpen, setZonesDrawerOpen] = useState(false)
  const [zonesTabValue, setZonesTabValue] = useState(0)
  const [editableZones, setEditableZones] = useState<{[key: string]: {name: string, description: string}}>({})
  const [infoPopupOpen, setInfoPopupOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [cities, setCities] = useState<City[]>([])
  const { showNoti, NotificationComponent } = useNoti()
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
  const { filteredContainers } = useContainers(customer?.id, selectedCityId, 1000, 'false', refreshKey)
  const zonesHook = useZones(customer?.id, selectedCityId, refreshKey)

  // Show operator dashboard for operators
  if (user?.profile === Profile.OPERATOR) {
    return <OperatorDashboard user={user}/>
  }
  
  const { city } = useGetCity(selectedCityId)

  if (!city) {
    console.error('Error: City could not be loaded')
    //TODO: Cargar componente por defecto de error
    return
  }
  if (!customer) {
    console.error('Error: Customer could not be loaded')
    //TODO: Cargar componente por defecto de error
    return
  }
  
  const centerFromCity: [number, number] = city? [city?.latitude, city?.longitude]: [0, 0]

  const zonesMapper = (finalzones: Zone[]): ZoneAddDto[] => {
    return finalzones.map(zone => ({
      centerLatitude: zone.center[0],
      centerLongitude: zone.center[1],
      name: zone.name,
      cityId: selectedCityId,
      customerId: customer.id,
      startLat: zone.bounds[0][0],
      startLng: zone.bounds[0][1],
      endLat: zone.bounds[1][0],
      endLng: zone.bounds[1][1],
      description: editableZones[zone.id]?.description || '',
      color: zone.color
    }))
  }

  const saveZonesConfig = async () => {
    const finalZones = zonesHook.zones.map(zone => ({
      ...zone,
      name: editableZones[zone.id]?.name ?? zone.name,
      description: editableZones[zone.id]?.description ?? ''
    }))
    
    if (finalZones && finalZones.length > 0 && customer?.id) {
      const zonesToSave = zonesMapper(finalZones)
      console.log('Saving zones configuration:', zonesToSave)
      try {
        const result = await addMultipleZones(customer.id, zonesToSave)
        console.log('Zones saved successfully:', result)
        setZonesDrawerOpen(false)
      } catch (error) {
        console.error('Error saving zones:', error)
      }
    }
  }

  return (
    <>
    <NotificationComponent />
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
          <Typography variant="h4">Zones Management</Typography>
          <IconButton 
            color="warning"
            onClick={() => setInfoPopupOpen(true)}
            sx={{ ml: 1 }}
          >
            <Info />
          </IconButton>
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
            variant="contained"
            onClick={() => {
              setRefreshKey(prev => prev + 1)
              setZonesDrawerOpen(false)
              setInfoPopupOpen(false)
            }}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => { 
              setZonesDrawerOpen(true)
              console.log('---> zones: ', zonesHook.zones)
            }}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
            }}
          >
            Manage Zones
          </Button>
        </Box>
      </Box>
      
      <MapViewZones
        containers={filteredContainers}
        center={centerFromCity}
        customerId={customer.id}
        city={city}
        zonesHook={zonesHook}
      />

      {/* Zones Drawer */}
      <Drawer
        anchor="left"
        open={zonesDrawerOpen}
        onClose={() => setZonesDrawerOpen(false)}
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
            <Typography variant="h6">Zones Management</Typography>
            <IconButton onClick={() => setZonesDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Tabs value={zonesTabValue} onChange={(_, newValue) => setZonesTabValue(newValue)} sx={{ mb: 2 }}>
            <Tab label="Configuration" />
            <Tab label="Search and manage" />
          </Tabs>

          {zonesTabValue === 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Your zone settings:</Typography>
              {zonesHook.zones.map((zone) => (
                <Box key={zone.id} sx={{ mb: 3, p: 2, border: `3px solid ${zone.color}`, borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>Zone ID: {zone.id}</Typography>
                  
                  <TextField
                    label="Name"
                    value={editableZones[zone.id]?.name ?? zone.name}
                    onChange={(e) => {
                      const value = e.target.value.slice(0, 50)
                      setEditableZones(prev => ({
                        ...prev,
                        [zone.id]: {
                          ...prev[zone.id],
                          name: value,
                          description: prev[zone.id]?.description ?? ''
                        }
                      }))
                    }}
                    fullWidth
                    margin="normal"
                    required
                    error={!(editableZones[zone.id]?.name ?? zone.name).trim()}
                    inputProps={{ maxLength: 50 }}
                    helperText={!(editableZones[zone.id]?.name ?? zone.name).trim() ? 'Name is required' : `${(editableZones[zone.id]?.name ?? zone.name).length}/50`}
                  />
                  
                  <TextField
                    label="Description (Optional)"
                    value={editableZones[zone.id]?.description ?? ''}
                    onChange={(e) => {
                      setEditableZones(prev => ({
                        ...prev,
                        [zone.id]: {
                          ...prev[zone.id],
                          name: prev[zone.id]?.name ?? zone.name,
                          description: e.target.value
                        }
                      }))
                    }}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Box>
              ))}
              
              {zonesHook.zones.length > 0 && (
                <>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loading || zonesHook.zones.some(zone => !(editableZones[zone.id]?.name ?? zone.name).trim())}
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.5,
                      px: 3,
                    }}
                    onClick={saveZonesConfig}
                  >
                    {loading ? 'Saving...' : 'Save Zones Configuration'}
                  </Button>
                  
                  {error && (
                    <Typography variant="body2" sx={{ color: 'error.main', mt: 1 }}>
                      {error}
                    </Typography>
                  )}
                </>
              )}
              
              {zonesHook.zones.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  No zones created yet. Create zones on the map to configure them here.
                </Typography>
              )}
            </Box>
          )}

          {zonesTabValue === 1 && (
            <Box>
              <Typography>Hola mundo 1</Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Info Popup */}
      <Dialog open={infoPopupOpen} onClose={() => setInfoPopupOpen(false)} maxWidth="md">
        <DialogTitle>Zone Management Information</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            En el siguiente mapa se gestionan las zonas en las que se devide el trabajo para recoger basuras
          </Typography>
          <Typography paragraph>
            La idea final es asignar los contenedores a determinada zona de trabajo para que pueda ser procesado por las rutas
          </Typography>
          <Typography paragraph>
            Si existen contenedores previamente creados se visualizan con un punto rojo, secargan con un límite de hasta 100 contenedores aleatoriamente para tener facilidad de gestión
          </Typography>
          <Typography paragraph>
            Los contenedores faltantes o pendientes de asignar a zona se van a ir cargando o visualizando cada vez que vayas asignando a zona
          </Typography>
          <Typography paragraph>
            Para moverte en el mapa usa las flechas de tú teclado
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoPopupOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  )
}

export default ZonesPage