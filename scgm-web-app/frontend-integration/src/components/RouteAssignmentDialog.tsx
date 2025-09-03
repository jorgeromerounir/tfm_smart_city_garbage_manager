import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { assignmentApi, truckApi, userApi } from '../services/api'
import { OptimizedRoute, Profile, Truck, User, SavedRoute } from '../types'

interface RouteAssignmentDialogProps {
  open: boolean
  onClose: () => void
  route: OptimizedRoute | SavedRoute | null
  city: string
  supervisorId?: string
  onAssignmentComplete?: () => void
}

export default function RouteAssignmentDialog({
  open,
  onClose,
  route,
  city,
  supervisorId,
  onAssignmentComplete,
}: RouteAssignmentDialogProps) {
  const [routeName, setRouteName] = useState('')
  const [selectedTruck, setSelectedTruck] = useState('')
  const [selectedOperator, setSelectedOperator] = useState('')
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [operators, setOperators] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadTrucks()
      loadOperators()
      if ('name' in (route || {})) {
        const savedRoute = route as SavedRoute
        setRouteName(savedRoute.name || '')
        setSelectedTruck(savedRoute.truckId || '')
        setSelectedOperator(savedRoute.operatorId || '')
      }
    }
  }, [open, city, route])

  const loadTrucks = async () => {
    try {
      const data = await truckApi.getAll(city)
      setTrucks(data.filter(t => t.available))
    } catch (error) {
      console.error('Failed to load trucks:', error)
      const mockTrucks = city.includes('Bogotá') ? [
        { id: 'truck-1', name: 'Truck Bogotá 001', licensePlate: 'BOG-001', capacity: 5.0, city, available: true, createdAt: '', updatedAt: '' },
        { id: 'truck-2', name: 'Truck Bogotá 002', licensePlate: 'BOG-002', capacity: 7.5, city, available: true, createdAt: '', updatedAt: '' }
      ] : [
        { id: 'truck-3', name: 'Truck Madrid 001', licensePlate: 'MAD-001', capacity: 6.0, city, available: true, createdAt: '', updatedAt: '' },
        { id: 'truck-4', name: 'Truck Madrid 002', licensePlate: 'MAD-002', capacity: 8.0, city, available: true, createdAt: '', updatedAt: '' }
      ]
      setTrucks(mockTrucks)
    }
  }

  const loadOperators = async () => {
    try {
      const data = await userApi.getByProfile(Profile.OPERATOR)
      setOperators(data.filter(u => u.profile === Profile.OPERATOR))
    } catch (error) {
      console.error('Failed to load operators:', error)
      setOperators([
        { id: 1, name: 'John Operator', email: 'john.operator@uwm.com', profile: Profile.OPERATOR, createdAt: '', updatedAt: '' },
        { id: 2, name: 'Jane Operator', email: 'jane.operator@uwm.com', profile: Profile.OPERATOR, createdAt: '', updatedAt: '' },
        { id: 3, name: 'Mike Operator', email: 'mike.operator@uwm.com', profile: Profile.OPERATOR, createdAt: '', updatedAt: '' }
      ])
    }
  }

  const handleAssign = async () => {
    if (!route || !selectedTruck || !selectedOperator) return

    setLoading(true)
    try {
      if ('name' in route) {
        // Handle saved route assignment
        const savedRoute = route as SavedRoute
        const selectedTruckData = trucks.find(t => t.id === selectedTruck)
        const selectedOperatorData = operators.find(o => o.id.toString() === selectedOperator)
        
        const allRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]')
        const updatedRoutes = allRoutes.map((r: any) => {
          if (r.id === savedRoute.id) {
            return {
              ...r,
              truckId: selectedTruck,
              truckName: selectedTruckData ? `${selectedTruckData.name} (${selectedTruckData.licensePlate})` : null,
              operatorId: selectedOperator,
              operatorName: selectedOperatorData?.name || null,
              updatedAt: new Date().toISOString(),
              status: 'pending',
              assignedAt: new Date().toISOString()
            }
          }
          return r
        })
        localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes))
      } else if (supervisorId) {
        // Handle optimized route assignment
        await assignmentApi.assign({
          routeName: routeName || 'Untitled Route',
          routeData: route as OptimizedRoute,
          truckId: selectedTruck,
          operatorId: selectedOperator,
          supervisorId,
          city,
        })
      }
      
      onClose()
      setRouteName('')
      setSelectedTruck('')
      setSelectedOperator('')
      onAssignmentComplete?.()
    } catch (error) {
      console.error('Failed to assign route:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Assign Route to Operator</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {!('name' in (route || {})) && (
          <TextField
            fullWidth
            label="Route Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            margin="normal"
          />
        )}
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="truck-select-label">Select Truck</InputLabel>
          <Select
            labelId="truck-select-label"
            value={selectedTruck}
            label="Select Truck"
            onChange={(e) => setSelectedTruck(e.target.value)}
          >
            <MenuItem value="">No truck</MenuItem>
            {trucks.map((truck) => (
              <MenuItem key={truck.id} value={truck.id}>
                {truck.name} - {truck.licensePlate} (Capacity: {truck.capacity}t)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="operator-select-label">Select Operator</InputLabel>
          <Select
            labelId="operator-select-label"
            value={selectedOperator}
            label="Select Operator"
            onChange={(e) => setSelectedOperator(e.target.value)}
          >
            <MenuItem value="">No operator</MenuItem>
            {operators.map((operator) => (
              <MenuItem key={operator.id} value={operator.id.toString()}>
                {operator.name} - {operator.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleAssign} 
          variant="contained"
          disabled={loading || !selectedTruck || !selectedOperator}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Assigning...' : 'Assign Route'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
