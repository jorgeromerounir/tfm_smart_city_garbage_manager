import { useEffect, useState } from 'react'
import { SavedRoute } from '../types'

export default function useSavedRoutes() {
	const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([])

	useEffect(() => {
		const routes = JSON.parse(localStorage.getItem('savedRoutes') || '[]')
		setSavedRoutes(routes)
	}, [])

	return { savedRoutes, setSavedRoutes }
}
