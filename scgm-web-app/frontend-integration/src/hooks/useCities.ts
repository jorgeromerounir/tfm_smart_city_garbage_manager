import { useEffect, useState } from 'react'
import { citiesApi } from '../services/api.ts'
import { City } from '../types/index.ts'

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

interface CityWithLocations extends City {
	center: [number, number]
	locations: Array<{ name: string; lat: number; lng: number }>
}

export default function useCities(country?: string) {
	const [cities, setCities] = useState<CityWithLocations[]>([])
	const [selectedCity, setSelectedCity] = useState<CityWithLocations | null>(
		null,
	)

	useEffect(() => {
		const fetchCities = async () => {
			try {
				//TODO: Logic to pass country
				const citiesData: City[] = await citiesApi.getByCountry('CO')

				const citiesWithLocations: CityWithLocations[] = citiesData
					.filter(city => city.active)
					.map(city => ({
						...city,
						center: [city.latitude, city.longitude] as [number, number],
						locations:
							defaultLocations[city.name as keyof typeof defaultLocations] ||
							[],
					}))

				setCities(citiesWithLocations)

				const defaultCity =
					citiesWithLocations.find(
						c =>
							(country === 'Colombia' && c.country === 'Colombia') ||
							(country === 'Spain' && c.country === 'Spain'),
					) || citiesWithLocations[0]

				setSelectedCity(defaultCity)
			} catch (error) {
				console.error('Failed to fetch cities:', error)
			}
		}

		void fetchCities()
	}, [country])

	return {
		cities,
		selectedCity,
		setSelectedCity,
	}
}
