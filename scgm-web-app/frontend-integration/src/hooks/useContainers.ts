import { useEffect, useState } from 'react'
import { containerApi } from '../services/api.ts'
import { Container } from '../types/index.ts'
import useWasteTypes from './useWasteTypes.ts'

export default function useContainers(customerId?: number, cityId?: number, limit: number = 500, hasZoneId?: string, refreshKey?:number) {
  const [containers, setContainers] = useState<Container[]>([])
  const { selectedWasteTypes, setSelectedWasteTypes } = useWasteTypes()
  const filteredContainers = containers

  useEffect(() => {
    const fetchContainers = async () => {
      if(!customerId || !cityId){
        setContainers([])
        return
      }
      try {
        const data = await containerApi.getByCustomerAndCity(customerId, cityId, limit, hasZoneId);
        setContainers(data ? data : [])
      } catch (error) {
        console.error('Failed to fetch containers:', error)
      }
    }

    void fetchContainers()
  }, [customerId, cityId, hasZoneId, refreshKey])

  return {
    filteredContainers,
    selectedWasteTypes,
    setSelectedWasteTypes,
    setContainers
  }
}
