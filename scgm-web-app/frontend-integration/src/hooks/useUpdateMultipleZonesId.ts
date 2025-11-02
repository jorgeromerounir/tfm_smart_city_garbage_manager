import { useState } from 'react'
import { containerApi } from '../services/api'
import { ContainerZoneUpdateDto } from '../types'

const useUpdateMultipleZonesId = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMultipleZonesId = async (customerId: number, containerZoneUpdates: ContainerZoneUpdateDto[]): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await containerApi.updateMultipleZonesId(customerId, containerZoneUpdates)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error updating multiple zones'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    updateMultipleZonesId,
    loading,
    error,
    clearError: () => setError(null)
  }
}

export default useUpdateMultipleZonesId