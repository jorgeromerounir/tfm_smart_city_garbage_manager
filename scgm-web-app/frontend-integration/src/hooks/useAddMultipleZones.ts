import { useState } from 'react'
import { zonesApi } from '../services/api'
import { ZoneAddDto, ZoneDto } from '../types'

const useAddMultipleZones = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMultipleZones = async (customerId: number, zones: ZoneAddDto[]): Promise<ZoneDto[]> => {
    setLoading(true)
    setError(null)
    try {
      const result = await zonesApi.addMultipleZones(customerId, zones)
      return result
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error adding multiple zones'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    addMultipleZones,
    loading,
    error,
    clearError: () => setError(null)
  }
}

export default useAddMultipleZones