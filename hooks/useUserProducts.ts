'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { type Product } from '@/lib/types/product'

export type SpecTabId = 'my-specs' | 'to-do'

interface UserProduct extends Product {
  userHasSpec: boolean
  specCount: number
  specification_id?: string
}

interface UseUserProductsResult {
  products: UserProduct[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useUserProducts = (userId: string | null, tab: SpecTabId): UseUserProductsResult => {
  const [products, setProducts] = useState<UserProduct[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (): Promise<void> => {

    if (!userId) {

      setProducts([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = `/api/products/${tab}?userId=${encodeURIComponent(userId)}`

      const response = await fetch(url)
      
      if (!response.ok) {

        const errorData = await response.json()
        if (!errorData.error) {
          throw new Error(`API request failed with status ${response.status} and no error message`)
        }
        throw new Error(errorData.error)
      }

      const data = await response.json()

      if (!data.data?.products) {

        throw new Error('API response missing required products array in data field')
      }

      setProducts(data.data.products)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [userId, tab])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const result: UseUserProductsResult = useMemo(() => ({
    products,
    loading,
    error,
    refetch: fetchProducts
  }), [products, loading, error, fetchProducts])

  return result
}
