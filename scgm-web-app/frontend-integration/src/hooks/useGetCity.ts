import { useEffect, useState } from 'react'
import { citiesApi } from '../services/api.ts'
import { City } from '../types/index.ts'

export default function useGetCity(cityId?: number) {
  const [city, setCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCity = async () => {
      if (!cityId) {
        setLoading(false)
        setError('Invalid cityId')
        return
      }
      try {
        setLoading(true)
        setError(null)
        console.log('useGetCity: ', cityId);
        const data = await citiesApi.getById(cityId)
        setCity(data)
      } catch (error) {
        console.error('Failed to fetch city:', error)
        setError('Failed to fetch city')
      } finally {
        setLoading(false)
      }
    }
    void fetchCity()
  }, [cityId])

  return {
    city,
    loading,
    error
  }
}