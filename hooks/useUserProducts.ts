'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { UserProduct } from '@/lib/services/user-products-service'

export type SpecTabId = 'my-specs' | 'to-do'

interface UseUserProductsResult {
  products: UserProduct[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useUserProducts = (userId: string | null, tab: SpecTabId): UseUserProductsResult => {
  const [cache, setCache] = useState<Record<SpecTabId, UserProduct[]>>({ 'my-specs': [], 'to-do': [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      if (!userId) {
        throw new Error('User ID is required')
      }
      const mySpecsUrl = `/api/products/my-specs?userId=${encodeURIComponent(userId)}`
      const toDoUrl = `/api/products/to-do?userId=${encodeURIComponent(userId)}`

      const [mySpecsRes, toDoRes] = await Promise.all([
        fetch(mySpecsUrl),
        fetch(toDoUrl)
      ])

      if (!mySpecsRes.ok || !toDoRes.ok) {
        let message = ''
        if (!mySpecsRes.ok) {
          try {
            const errData = await mySpecsRes.json() as { error?: string }
            const errMsg = (typeof errData?.error === 'string' && errData.error.trim().length > 0)
              ? errData.error
              : `API request failed (my-specs) with status ${mySpecsRes.status}`
            message = errMsg
          } catch {
            message = `API request failed (my-specs) with status ${mySpecsRes.status}`
          }
        }
        if (!toDoRes.ok) {
          try {
            const errData = await toDoRes.json() as { error?: string }
            const part = (typeof errData?.error === 'string' && errData.error.trim().length > 0)
              ? errData.error
              : `API request failed (to-do) with status ${toDoRes.status}`
            message = message ? `${message}; ${part}` : part
          } catch {
            message = message
              ? `${message}; API request failed (to-do) with status ${toDoRes.status}`
              : `API request failed (to-do) with status ${toDoRes.status}`
          }
        }
        throw new Error(message)
      }

      const [mySpecsData, toDoData] = await Promise.all([mySpecsRes.json(), toDoRes.json()])

      const mySpecsProducts = mySpecsData?.data?.products
      const toDoProducts = toDoData?.data?.products

      if (!Array.isArray(mySpecsProducts) || !Array.isArray(toDoProducts)) {
        throw new Error('API response missing required products array in data field')
      }

      setCache({ 'my-specs': mySpecsProducts, 'to-do': toDoProducts })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `NonErrorThrown: ${String(err)}`
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const products: UserProduct[] = useMemo(() => cache[tab], [cache, tab])
  return useMemo<UseUserProductsResult>(() => ({ products, loading, error, refetch: fetchAll }), [products, loading, error, fetchAll])
}
