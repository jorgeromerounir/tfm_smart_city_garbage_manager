import { useEffect, useState } from 'react'
import { routeApi } from '../services/api.ts'
import { Customer, OptimizedRoute, SavedRoute, User, WasteLevel, ZoneDto } from '../types/index.ts'
import useCities from './useCities.ts'
import useSavedRoutes from './useSavedRoutes.ts'
import useNoti from './useNoti.tsx'

export default function useRoutes(
	customer?: Customer,
	user?: User,
	selectedWasteTypes: WasteLevel[] = [],
) {
	const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(
		null,
	)
	const [currentZone, setCurrentZone] = useState<ZoneDto | null>()
	
	//console.log('----> useRoutes user: ', user)
	const { cities, selectedCity } = useCities(customer)
	const { savedRoutes, setSavedRoutes } = useSavedRoutes()
	const [loading, setLoading] = useState(false)
	const [routeName, setRouteName] = useState('')
	const [tabValue, setTabValue] = useState(0)
	const { showNoti } = useNoti()

	useEffect(() => {
		if (selectedCity) {
			setCurrentZone(null)
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
		if (!customer) {
			showNoti('Please select customer', 'warning')
			return
		}
		if (!currentZone) {
			showNoti('Please select zone', 'warning')
			return
		}
		if (!selectedCity) {
			showNoti('Please select a city first', 'error')
			return
		}
		setLoading(true)
		try {
			const route = await routeApi.optimize(customer?.id ,{
				startLat: currentZone.startLat,
				startLng: currentZone.startLng,
				cityId: customer?.cityId,
				zoneId: currentZone.id,
				wasteTypes:
					selectedWasteTypes.length > 0 ? selectedWasteTypes : undefined,
			})
			// Handle both legacy single route and new VRP multi-route format
			setOptimizedRoute(route)
		} catch (error) {
			console.error('Failed to optimize route:', error)
			showNoti('Failed to optimize route', 'error')
		} finally {
			setLoading(false)
		}
	}

	const handleSaveRoute = () => {
		if (!routeName || !optimizedRoute) {
			showNoti('Please enter a route name and optimize a route first', 'warning')
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

			showNoti('Route replaced successfully!', 'success')
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

			showNoti('Route saved successfully!', 'success')
		}

		//setRouteName('')
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
		currentZone,
		optimizedRoute,
		loading,
		routeName,
		setRouteName,
		setCurrentZone,
		setTabValue,
		handleDeleteRoute,
		handleOptimizeRoute,
		handleSaveRoute,
		handleLoadRoute,
		savedRoutes,
	}
}
