import { useState } from 'react'
import { zonesApi } from '../services/api.ts'

export default function useDeleteZone() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const deleteZone = async (customerId: number, zoneId: string) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      await zonesApi.deleteZone(customerId, zoneId)
      setSuccess(true)
    } catch (error) {
      console.error('Failed to delete zone:', error)
      setError('Failed to delete zone')
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteZone,
    loading,
    error,
    success
  }
}