import { useState, useEffect } from 'react'
import { zonesApi } from '../services/api'
import { ZoneDto } from '../types'

export interface Zone {
  id: string
  name: string
  center: [number, number]
  bounds: [[number, number], [number, number]]
  color: string
}

const useZones = (customerId?: number, cityId?: number, refreshKey?: number) => {
  const [zones, setZones] = useState<Zone[]>([])
  
  useEffect(() => {
    if (customerId && cityId) {
      zonesApi.getZonesByCustomerIdAndCityId(customerId, cityId)
        .then((zoneDtos: ZoneDto[]) => {
          if (!zoneDtos)
            return
          const mappedZones: Zone[] = zoneDtos.map(dto => ({
            id: dto.id,
            name: dto.name,
            center: [dto.centerLatitude, dto.centerLongitude],
            bounds: [[dto.startLat, dto.startLng], [dto.endLat, dto.endLng]],
            color: dto.color
          }))
          setZones(mappedZones)
        })
        .catch(error => {
          console.error('Error fetching zones:', error)
        })
    }
  }, [customerId, cityId, refreshKey])
  
  return { zones, setZones }
}

export default useZones