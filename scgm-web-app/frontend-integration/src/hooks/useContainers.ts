import { useEffect, useState } from 'react'
import { containerApi } from '../services/api.ts'
import { Container } from '../types/index.ts'
import useWasteTypes from './useWasteTypes.ts'

export default function useContainers(country?: string) {
  const [containers, setContainers] = useState<Container[]>([])
  const { selectedWasteTypes, setSelectedWasteTypes } = useWasteTypes()

  const filteredContainers = containers.filter(container => {
    return (
      selectedWasteTypes.length === 0 ||
      selectedWasteTypes.includes(container.wasteLevel)
    )
  })

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        //TODO: pasar cityId desde el customer
        const data = await containerApi.getByCity(1);
        setContainers(data)
      } catch (error) {
        console.error('Failed to fetch containers:', error)
      }
    }

    void fetchContainers()
  }, [country])

  return {
    filteredContainers,
    selectedWasteTypes,
    setSelectedWasteTypes
  }
}
