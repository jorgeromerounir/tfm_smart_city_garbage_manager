import { useEffect, useState } from 'react'
import { containerApi } from '../services/api.ts'
import { Container } from '../types'
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
        const data = await containerApi.getAll(country)
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
