import { Box } from '@mui/material'
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
import ZonesPage from './pages/ZonesPage'
import { Profile } from './types'
import ContentInit from './components/ContentInit'
import useNoti from './hooks/useNoti'
import TrucksPage from './pages/TrucksPage'
import ContainersPage from './pages/ContainersPage'

const AppContent: React.FC = () => {
	const { isAuthenticated } = useAuth()
	const { showNoti, NotificationComponent } = useNoti()

	useEffect(() => {
		if (isAuthenticated) {
			console.log('----> isAuthenticated: ', isAuthenticated);
			showNoti('Wellcome to your SCGM portal!', 'success')   
		}
	}, [isAuthenticated])

	return (
		<>
		<NotificationComponent />
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
								<ContentInit />
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
								<ContentInit />
								<RoutesPage />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/zones"
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
								<ContentInit />
								<ZonesPage />
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
								<ContentInit />
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
								<ContentInit />
								<CitiesPage />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/trucks"
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
								<ContentInit />
								<TrucksPage />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/containers"
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
								<ContentInit />
								<ContainersPage />
							</Box>
						</Box>
					</ProtectedRoute>
				}
			/>
		</Routes>
		</>
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
