import { useState, useEffect } from 'react'
import { zonesApi } from '../services/api'
import { ZoneDto } from '../types'

const useGetZones = (customerId?: number, cityId?: number) => {
  const [zones, setZones] = useState<ZoneDto[]>([])
  
  useEffect(() => {
    if (customerId && cityId) {
      zonesApi.getZonesByCustomerIdAndCityId(customerId, cityId)
        .then((zoneDtos: ZoneDto[]) => {
          if (!zoneDtos)
            return
          setZones(zoneDtos)
        })
        .catch(error => {
          console.error('Error fetching zones:', error)
        })
    }
  }, [customerId, cityId])
  
  return { zones }
}

export default useGetZones