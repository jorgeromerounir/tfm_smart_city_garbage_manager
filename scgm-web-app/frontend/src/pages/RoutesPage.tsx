import { Delete, Route as RouteIcon, Save, Update } from '@mui/icons-material'
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	Tab,
	Tabs,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import React from 'react'
import MapView from '../components/MapView'
import { useAuth } from '../contexts/AuthContext'
import useContainers from '../hooks/useContainers.ts'
import useRoutes from '../hooks/useRoutes.ts'

const RoutesPage: React.FC = () => {
	const { user } = useAuth()
	const { filteredContainers, selectedWasteTypes, setSelectedWasteTypes } =
		useContainers(user?.country)
	const {
		tabValue,
		cities,
		selectedCity,
		setRouteName,
		setSelectedCity,
		setTabValue,
		routeName,
		loading,
		optimizedRoute,
		setStartLocation,
		setEndLocation,
		startLocation,
		endLocation,
		handleDeleteRoute,
		notification,
		handleOptimizeRoute,
		handleLoadRoute,
		handleSaveRoute,
		setNotification,
		savedRoutes,
	} = useRoutes(user ?? undefined, selectedWasteTypes)

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Route Optimization
			</Typography>

			<Grid container spacing={3}>
				<Grid item xs={12} md={2}>
					<Card
						sx={{
							borderRadius: 3,
							boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
							bgcolor: 'surface.main',
						}}
					>
						<CardContent>
							<Tabs
								value={tabValue}
								onChange={(_, newValue) => setTabValue(newValue)}
								sx={{ mb: 2 }}
							>
								<Tab label="Route Configuration" />
								<Tab label="Saved Routes" />
							</Tabs>

							{tabValue === 0 && (
								<Box>
									<Autocomplete
										options={cities
											.filter(city => {
												if (user?.profile === 'ADMIN') return true
												return city.country === user?.country
											})
											.map(city => `${city.name}, ${city.country}`)}
										value={
											selectedCity
												? `${selectedCity.name}, ${selectedCity.country}`
												: ''
										}
										onChange={(_, newValue) => {
											if (newValue) {
												const city = cities.find(
													c => `${c.name}, ${c.country}` === newValue,
												)
												if (city) setSelectedCity(city)
											}
										}}
										disabled={user?.profile !== 'ADMIN'}
										renderInput={params => (
											<TextField
												{...params}
												label="City"
												margin="normal"
												fullWidth
											/>
										)}
									/>

									<FormControl fullWidth margin="normal">
										<InputLabel id="start-location-label">
											Start Location
										</InputLabel>
										<Select
											labelId="start-location-label"
											value={startLocation}
											label="Start Location"
											onChange={e => setStartLocation(e.target.value)}
										>
											{selectedCity?.locations.map(location => (
												<MenuItem key={location.name} value={location.name}>
													{location.name}
												</MenuItem>
											)) || []}
										</Select>
									</FormControl>

									<FormControl fullWidth margin="normal">
										<InputLabel id="end-location-label">
											End Location
										</InputLabel>
										<Select
											labelId="end-location-label"
											value={endLocation}
											label="End Location"
											onChange={e => setEndLocation(e.target.value)}
										>
											{selectedCity?.locations.map(location => (
												<MenuItem key={location.name} value={location.name}>
													{location.name}
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
												setSelectedWasteTypes(newTypes)
											}
										}}
										size="small"
										fullWidth
									>
										<ToggleButton
											value="light"
											color="success"
											sx={{ flex: 1 }}
										>
											Light
										</ToggleButton>
										<ToggleButton
											value="medium"
											color="warning"
											sx={{ flex: 1 }}
										>
											Medium
										</ToggleButton>
										<ToggleButton value="heavy" color="error" sx={{ flex: 1 }}>
											Heavy
										</ToggleButton>
									</ToggleButtonGroup>

									<Button
										variant="contained"
										fullWidth
										sx={{
											mt: 2,
											borderRadius: 2,
											textTransform: 'none',
											fontWeight: 600,
											py: 1.5,
											px: 3,
										}}
										onClick={handleOptimizeRoute}
										disabled={loading}
										startIcon={
											loading ? <CircularProgress size={20} /> : <RouteIcon />
										}
									>
										{loading ? 'Optimizing...' : 'Optimize Route'}
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
													bgcolor: 'primary.container',
													color: 'primary.onContainer',
												}}
											/>
											<Chip
												label={`${optimizedRoute.totalDistance} km`}
												size="small"
												sx={{
													mr: 1,
													borderRadius: 2,
													bgcolor: 'secondary.container',
													color: 'secondary.onContainer',
												}}
											/>
											<Chip
												label={`${optimizedRoute.estimatedTime} min`}
												size="small"
												sx={{
													borderRadius: 2,
													bgcolor: 'tertiary.container',
													color: 'tertiary.onContainer',
												}}
											/>

											<TextField
												label="Route Name"
												value={routeName}
												onChange={e => setRouteName(e.target.value)}
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
													textTransform: 'none',
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
								<Box sx={{ maxHeight: 400, overflow: 'auto' }}>
									{savedRoutes.length === 0 ? (
										<Typography
											variant="body2"
											color="text.secondary"
											textAlign="center"
										>
											No saved routes for {selectedCity?.name}
										</Typography>
									) : (
										savedRoutes.map(route => (
											<Card
												key={route.id}
												sx={{
													mb: 1,
													p: 1,
													borderRadius: 2,
													bgcolor: 'surfaceVariant.main',
													border: '1px solid',
													borderColor: 'outline.variant',
												}}
											>
												<Box
													display="flex"
													justifyContent="space-between"
													alignItems="center"
												>
													<Box>
														<Typography variant="subtitle2">
															{route.name}
														</Typography>
														<Typography
															variant="caption"
															color="text.secondary"
														>
															{route.containerCount} containers •{' '}
															{route.totalDistance}km • {route.estimatedTime}min
														</Typography>
													</Box>
													<Box>
														<Button
															size="small"
															onClick={() => handleLoadRoute(route)}
															startIcon={<Update />}
															sx={{
																textTransform: 'none',
																fontWeight: 600,
																borderRadius: 2,
															}}
														>
															Load
														</Button>
														<Button
															size="small"
															color="error"
															onClick={() => handleDeleteRoute(route.id)}
															startIcon={<Delete />}
															sx={{
																textTransform: 'none',
																fontWeight: 600,
																borderRadius: 2,
															}}
														>
															Delete
														</Button>
													</Box>
												</Box>
											</Card>
										))
									)}
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>

				<Grid item xs={12} md={10}>
					<Card
						sx={{
							borderRadius: 3,
							boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
							bgcolor: 'surface.main',
						}}
					>
						<CardContent>
							<Typography variant="h6" gutterBottom>
								Map View
							</Typography>
							<Box sx={{ width: '100%', minWidth: '100%' }}>
								<MapView
									containers={filteredContainers}
									route={optimizedRoute?.route}
									center={selectedCity?.center || [0, 0]}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			<Snackbar
				open={notification.open}
				autoHideDuration={4000}
				onClose={() => setNotification(prev => ({ ...prev, open: false }))}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert
					onClose={() => setNotification(prev => ({ ...prev, open: false }))}
					severity={notification.severity}
					sx={{ width: '100%', borderRadius: 2 }}
				>
					{notification.message}
				</Alert>
			</Snackbar>
		</Box>
	)
}

export default RoutesPage
