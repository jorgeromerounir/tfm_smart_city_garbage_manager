import { useEffect, useState } from 'react'
import { containerApi } from '../services/api.ts'
import { Container } from '../types/index.ts'
import useWasteTypes from './useWasteTypes.ts'

export default function useContainers(customerId?: number, cityId?: number) {
  const [containers, setContainers] = useState<Container[]>([])
  const { selectedWasteTypes, setSelectedWasteTypes } = useWasteTypes()

  /*const filteredContainers = containers.filter(container => {
    return (
      selectedWasteTypes.length === 0 ||
      selectedWasteTypes.includes(container.wasteLevelStatus)
    )
  })*/
  const filteredContainers = containers

  useEffect(() => {
    const fetchContainers = async () => {
      if(!customerId || !cityId){
        setContainers([])
        return
      }
      try {
        //const data = await containerApi.getByCity(cityId);
        const data = await containerApi.getByCustomerAndCity(customerId, cityId);
        setContainers(data)
      } catch (error) {
        console.error('Failed to fetch containers:', error)
      }
    }

    void fetchContainers()
  }, [customerId, cityId])

  return {
    filteredContainers,
    selectedWasteTypes,
    setSelectedWasteTypes,
    setContainers
  }
}
