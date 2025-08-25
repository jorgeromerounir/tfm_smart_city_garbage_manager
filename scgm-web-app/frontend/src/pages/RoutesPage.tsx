import { Delete, Route as RouteIcon, Save, Update } from '@mui/icons-material'
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	Chip,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormGroup,
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
import React, { useEffect, useState } from 'react'
import MapView from '../components/MapView'
import { useAuth } from '../contexts/AuthContext'
import { citiesApi, containerApi, routeApi } from '../services/api'
import {
	City,
	Container,
	OptimizedRoute,
	RoutePoint,
	SavedRoute,
	WasteLevel,
} from '../types'

interface CityWithLocations extends City {
	center: [number, number]
	locations: Array<{ name: string; lat: number; lng: number }>
}

const defaultLocations = {
	'Bogotá D.C.': [
		{ name: 'Plaza Bolívar', lat: 4.5981, lng: -74.0758 },
		{ name: 'Zona Rosa', lat: 4.6698, lng: -74.0531 },
		{ name: 'Centro Andino', lat: 4.6736, lng: -74.0574 },
		{ name: 'Terminal de Transporte', lat: 4.6392, lng: -74.1069 },
		{ name: 'Aeropuerto El Dorado', lat: 4.7016, lng: -74.1469 },
		{ name: 'Universidad Nacional', lat: 4.6356, lng: -74.0834 },
	],
	Madrid: [
		{ name: 'Puerta del Sol', lat: 40.4168, lng: -3.7038 },
		{ name: 'Plaza Mayor', lat: 40.4155, lng: -3.7074 },
		{ name: 'Retiro Park', lat: 40.4153, lng: -3.6844 },
		{ name: 'Atocha Station', lat: 40.4063, lng: -3.6906 },
		{ name: 'Barajas Airport', lat: 40.4719, lng: -3.5626 },
		{ name: 'Santiago Bernabéu', lat: 40.453, lng: -3.6883 },
	],
}

const RoutesPage: React.FC = () => {
	const { user } = useAuth()
	const [containers, setContainers] = useState<Container[]>([])
	const [cities, setCities] = useState<CityWithLocations[]>([])
	const [selectedCity, setSelectedCity] = useState<CityWithLocations | null>(
		null,
	)
	const [startLocation, setStartLocation] = useState('')
	const [endLocation, setEndLocation] = useState('')
	const [selectedWasteTypes, setSelectedWasteTypes] = useState<WasteLevel[]>([
		WasteLevel.HEAVY,
		WasteLevel.MEDIUM,
	])
	const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(
		null,
	)
	const [loading, setLoading] = useState(false)
	const [routeName, setRouteName] = useState('')
	const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([])
	const [tabValue, setTabValue] = useState(0)
	const [notification, setNotification] = useState<{
		open: boolean
		message: string
		severity: 'success' | 'error' | 'warning'
	}>({ open: false, message: '', severity: 'success' })

	useEffect(() => {
		const fetchCities = async () => {
			try {
				const citiesData: City[] = await citiesApi.getAll()

				const citiesWithLocations: CityWithLocations[] = citiesData
					.filter((city) => city.active)
					.map((city) => ({
						...city,
						center: [city.latitude, city.longitude] as [number, number],
						locations:
							defaultLocations[city.name as keyof typeof defaultLocations] ||
							[],
					}))

				setCities(citiesWithLocations)

				const defaultCity =
					citiesWithLocations.find(
						(c) =>
							(user?.country === 'Colombia' && c.country === 'Colombia') ||
							(user?.country === 'Spain' && c.country === 'Spain'),
					) || citiesWithLocations[0]

				setSelectedCity(defaultCity)
			} catch (error) {
				console.error('Failed to fetch cities:', error)
			}
		}

		fetchCities()

		const loadSavedRoutes = () => {
			const routes = JSON.parse(localStorage.getItem('savedRoutes') || '[]')
			setSavedRoutes(routes)
		}
		loadSavedRoutes()
	}, [user?.country])

	useEffect(() => {
		const fetchContainers = async () => {
			try {
				const data = await containerApi.getAll(user?.country)
				setContainers(data)
			} catch (error) {
				console.error('Failed to fetch containers:', error)
			}
		}

		fetchContainers()
	}, [user?.country])

	useEffect(() => {
		if (selectedCity) {
			setStartLocation('')
			setEndLocation('')
			setOptimizedRoute(null)
			const loadSavedRoutes = () => {
				const routes = JSON.parse(localStorage.getItem('savedRoutes') || '[]')
				setSavedRoutes(
					routes.filter(
						(r: SavedRoute) =>
							r.city === `${selectedCity.name}, ${selectedCity.country}`,
					),
				)
			}
			loadSavedRoutes()
		}
	}, [selectedCity])

	const handleWasteTypeChange = (wasteType: WasteLevel) => {
		setSelectedWasteTypes((prev) =>
			prev.includes(wasteType)
				? prev.filter((type) => type !== wasteType)
				: [...prev, wasteType],
		)
	}

	const handleOptimizeRoute = async () => {
		if (!startLocation || !endLocation) {
			setNotification({
				open: true,
				message: 'Please select start and end locations',
				severity: 'warning',
			})
			return
		}

		if (!selectedCity) {
			setNotification({
				open: true,
				message: 'Please select a city first',
				severity: 'error',
			})
			return
		}

		const startLoc = selectedCity.locations.find(
			(loc) => loc.name === startLocation,
		)
		const endLoc = selectedCity.locations.find(
			(loc) => loc.name === endLocation,
		)

		if (!startLoc || !endLoc) {
			setNotification({
				open: true,
				message: 'Invalid location selection',
				severity: 'error',
			})
			return
		}

		setLoading(true)
		try {
			const route = await routeApi.optimize({
				startLat: startLoc.lat,
				startLng: startLoc.lng,
				endLat: endLoc.lat,
				endLng: endLoc.lng,
				city: `${selectedCity.name}, ${selectedCity.country}`,
				wasteTypes:
					selectedWasteTypes.length > 0 ? selectedWasteTypes : undefined,
			})
			setOptimizedRoute(route)
		} catch (error) {
			console.error('Failed to optimize route:', error)
			setNotification({
				open: true,
				message: 'Failed to optimize route',
				severity: 'error',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleSaveRoute = () => {
		if (!routeName || !optimizedRoute) {
			setNotification({
				open: true,
				message: 'Please enter a route name and optimize a route first',
				severity: 'warning',
			})
			return
		}

		if (!selectedCity) return

		const allRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]')
		const cityName = `${selectedCity.name}, ${selectedCity.country}`
		const existingRoute = allRoutes.find(
			(r: SavedRoute) => r.name === routeName && r.city === cityName,
		)

		if (existingRoute) {
			const confirmed = window.confirm(
				`A route named "${routeName}" already exists for ${selectedCity.name}. Do you want to replace it?`,
			)
			if (!confirmed) return

			// Remove existing route
			const updatedRoutes = allRoutes.filter(
				(r: SavedRoute) => !(r.name === routeName && r.city === cityName),
			)

			const newRoute: SavedRoute = {
				id: Date.now().toString(),
				name: routeName,
				city: cityName,
				...optimizedRoute,
				createdAt: new Date().toISOString(),
			}

			updatedRoutes.push(newRoute)
			localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes))

			const cityRoutes = updatedRoutes.filter(
				(r: SavedRoute) => r.city === cityName,
			)
			setSavedRoutes(cityRoutes)

			setNotification({
				open: true,
				message: 'Route replaced successfully!',
				severity: 'success',
			})
		} else {
			const newRoute: SavedRoute = {
				id: Date.now().toString(),
				name: routeName,
				city: cityName,
				...optimizedRoute,
				createdAt: new Date().toISOString(),
			}

			allRoutes.push(newRoute)
			localStorage.setItem('savedRoutes', JSON.stringify(allRoutes))

			const cityRoutes = allRoutes.filter(
				(r: SavedRoute) => r.city === cityName,
			)
			setSavedRoutes(cityRoutes)

			setNotification({
				open: true,
				message: 'Route saved successfully!',
				severity: 'success',
			})
		}

		setRouteName('')
	}

	const handleLoadRoute = (route: SavedRoute) => {
		setOptimizedRoute({
			route: route.route,
			totalDistance: route.totalDistance,
			containerCount: route.containerCount,
			estimatedTime: route.estimatedTime,
		})
		setTabValue(0)
	}

	const handleDeleteRoute = (routeId: string) => {
		const allRoutes = JSON.parse(localStorage.getItem('savedRoutes') || '[]')
		const updatedRoutes = allRoutes.filter((r: SavedRoute) => r.id !== routeId)
		localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes))

		if (!selectedCity) return
		const cityRoutes = updatedRoutes.filter(
			(r: SavedRoute) =>
				r.city === `${selectedCity.name}, ${selectedCity.country}`,
		)
		setSavedRoutes(cityRoutes)
	}

	const filteredContainers = containers.filter((container) => {
		const matchesFilter =
			selectedWasteTypes.length === 0 ||
			selectedWasteTypes.includes(container.wasteLevel)

		return matchesFilter
	})

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
											.filter((city) => {
												if (user?.profile === 'ADMIN') return true
												return city.country === user?.country
											})
											.map((city) => `${city.name}, ${city.country}`)}
										value={
											selectedCity
												? `${selectedCity.name}, ${selectedCity.country}`
												: ''
										}
										onChange={(_, newValue) => {
											if (newValue) {
												const city = cities.find(
													(c) => `${c.name}, ${c.country}` === newValue,
												)
												if (city) setSelectedCity(city)
											}
										}}
										disabled={user?.profile !== 'ADMIN'}
										renderInput={(params) => (
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
											onChange={(e) => setStartLocation(e.target.value)}
										>
											{selectedCity?.locations.map((location) => (
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
											onChange={(e) => setEndLocation(e.target.value)}
										>
											{selectedCity?.locations.map((location) => (
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
										savedRoutes.map((route) => (
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
				onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert
					onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
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
