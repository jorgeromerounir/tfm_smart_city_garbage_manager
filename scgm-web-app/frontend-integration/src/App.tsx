import { Box } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import CitiesPage from './pages/CitiesPage'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RoutesPage from './pages/RoutesPage'
import UsersPage from './pages/UsersPage'
import { socketService } from './services/socket'
import { Container, Profile } from './types'

const AppContent: React.FC = () => {
	const { enqueueSnackbar } = useSnackbar()
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		
		if (isAuthenticated) {
			console.log('----> isAuthenticated: ', isAuthenticated);
			/*socketService.connect()
			socketService.onContainerUpdate((container: Container) => {
				enqueueSnackbar(
					`Container ${container.id.slice(0, 8)} status changed to ${container.wasteLevel}`,
					{
						variant: container.wasteLevelStatus === 'heavy' ? 'warning' : 'info',
						autoHideDuration: 3000,
					},
				)
			})
			return () => {
				socketService.disconnect()
			}*/
		}
	}, [enqueueSnackbar, isAuthenticated])

	return (
		<Routes>
			<Route path="/" element={<LandingPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								minHeight: '100vh',
							}}
						>
							<Navbar />
							<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
								<Dashboard />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/routes"
				element={
					<ProtectedRoute>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								minHeight: '100vh',
							}}
						>
							<Navbar />
							<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
								<RoutesPage />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/users"
				element={
					<ProtectedRoute>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								minHeight: '100vh',
							}}
						>
							<Navbar />
							<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
								<UsersPage />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/cities"
				element={
					<ProtectedRoute requiredRole={Profile.ADMIN}>
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								minHeight: '100vh',
							}}
						>
							<Navbar />
							<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
								<CitiesPage />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
		</Routes>
	)
}

function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	)
}

export default App
