import { useEffect, useState } from 'react'
import { routeApi } from '../services/api.ts'
import { OptimizedRoute, SavedRoute, User, WasteLevel } from '../types/index.ts'
import useCities from './useCities.ts'
import useSavedRoutes from './useSavedRoutes.ts'

export default function useRoutes(
	user?: User,
	selectedWasteTypes: WasteLevel[] = [],
) {
	const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(
		null,
	)
	const [startLocation, setStartLocation] = useState('')
	const [endLocation, setEndLocation] = useState('')

	const { cities, selectedCity, setSelectedCity } = useCities(user?.country)
	const { savedRoutes, setSavedRoutes } = useSavedRoutes()
	const [loading, setLoading] = useState(false)
	const [routeName, setRouteName] = useState('')
	const [tabValue, setTabValue] = useState(0)
	const [notification, setNotification] = useState<{
		open: boolean
		message: string
		severity: 'success' | 'error' | 'warning'
	}>({ open: false, message: '', severity: 'success' })

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
			loc => loc.name === startLocation,
		)
		const endLoc = selectedCity.locations.find(loc => loc.name === endLocation)

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
			// Handle both legacy single route and new VRP multi-route format
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

			// Remove the existing route
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

	return {
		tabValue,
		cities,
		selectedCity,
		startLocation,
		endLocation,
		optimizedRoute,
		loading,
		routeName,
		setRouteName,
		setStartLocation,
		setEndLocation,
		setTabValue,
		setSelectedCity,
		handleDeleteRoute,
		handleOptimizeRoute,
		handleSaveRoute,
		handleLoadRoute,
		notification,
		setNotification,
		savedRoutes,
	}
}
