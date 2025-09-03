import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { assignmentApi, routeApi } from '../services/api'
import { AssignmentStatus, RouteAssignment, User } from '../types'

interface OperatorDashboardProps {
  user: User
}

export default function OperatorDashboard({ user }: OperatorDashboardProps) {
  const [assignments, setAssignments] = useState<RouteAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssignments()
  }, [user.id])

  const loadAssignments = async () => {
    try {
      const data = await assignmentApi.getAll(user.id.toString())
      setAssignments(data)
    } catch (error) {
      console.error('Failed to load assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: AssignmentStatus) => {
    try {
      await assignmentApi.updateStatus(id, status)
      loadAssignments()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const exportToGoogleMaps = (assignment: RouteAssignment) => {
    const routes = assignment.routeData.routes || []
    if (routes.length > 0) {
      const points = routes[0].points
      const url = routeApi.generateGoogleMapsUrl(points)
      window.open(url, '_blank')
    }
  }

  const exportToWaze = (assignment: RouteAssignment) => {
    const routes = assignment.routeData.routes || []
    if (routes.length > 0) {
      const points = routes[0].points
      const url = routeApi.generateWazeUrl(points)
      window.open(url, '_blank')
    }
  }

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case AssignmentStatus.PENDING: return 'warning'
      case AssignmentStatus.IN_PROGRESS: return 'info'
      case AssignmentStatus.COMPLETED: return 'success'
      default: return 'default'
    }
  }

  if (loading) return <Typography>Loading assignments...</Typography>

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          My Route Assignments
        </Typography>
      </Grid>
      
      {assignments.map((assignment) => (
        <Grid item xs={12} md={6} key={assignment.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {assignment.routeName}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                City: {assignment.city}
              </Typography>
              <Typography variant="body2">
                Distance: {assignment.routeData.totalDistance} km
              </Typography>
              <Typography variant="body2">
                Estimated Time: {assignment.routeData.estimatedTime} min
              </Typography>
              <Typography variant="body2">
                Containers: {assignment.routeData.containerCount}
              </Typography>
              <Chip 
                label={assignment.status.replace('_', ' ').toUpperCase()}
                color={getStatusColor(assignment.status)}
                sx={{ mt: 1 }}
              />
            </CardContent>
            <CardActions>
              {assignment.status === AssignmentStatus.PENDING && (
                <Button 
                  size="small" 
                  onClick={() => updateStatus(assignment.id, AssignmentStatus.IN_PROGRESS)}
                >
                  Start Route
                </Button>
              )}
              {assignment.status === AssignmentStatus.IN_PROGRESS && (
                <Button 
                  size="small" 
                  onClick={() => updateStatus(assignment.id, AssignmentStatus.COMPLETED)}
                >
                  Complete Route
                </Button>
              )}
              <Button 
                size="small" 
                onClick={() => exportToGoogleMaps(assignment)}
              >
                Google Maps
              </Button>
              <Button 
                size="small" 
                onClick={() => exportToWaze(assignment)}
              >
                Waze
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      
      {assignments.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            No route assignments found.
          </Typography>
        </Grid>
      )}
    </Grid>
  )
}