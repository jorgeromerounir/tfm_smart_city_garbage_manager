import { useEffect, useState } from 'react'
import { citiesApi } from '../services/api.ts'
import { City, Customer } from '../types/index.ts'

export default function useCities(customer?: Customer) {
	const [cities, setCities] = useState<City[]>([])
	const [selectedCity, setSelectedCity] = useState<City>()


	useEffect(() => {
		const fetchCities = async () => {
			try {
				if (!customer) {
					setCities([])
					setSelectedCity(undefined)
					return
				}
				console.log('useCities --> customer: ', customer)
				const citiesData: City[] = await citiesApi.getByCountry('CO')
				setCities(citiesData)
				const foundCity = citiesData.find(city => city.id === customer.cityId)
				setSelectedCity(foundCity)
			} catch (error) {
				console.error('Failed to fetch cities:', error)
			}
		}

		void fetchCities()
	}, [customer])

	return {
		cities,
		selectedCity
	}
}
