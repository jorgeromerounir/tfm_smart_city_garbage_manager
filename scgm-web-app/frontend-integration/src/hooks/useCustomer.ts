import { useEffect, useState } from 'react'
import { customersApi } from '../services/api.ts'
import { Customer } from '../types/index.ts'

export default function useCustomer(customerId?: number) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!customerId) {
        setLoading(false)
        setError('Invalid customerId')
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('useCustomer: ', customerId);
        const data = await customersApi.getById(customerId)
        setCustomer(data)
      } catch (error) {
        console.error('Failed to fetch customer:', error)
        setError('Failed to fetch customer')
      } finally {
        setLoading(false)
      }
    }

    void fetchCustomer()
  }, [customerId])

  return {
    customer,
    loading,
    error
  }
}