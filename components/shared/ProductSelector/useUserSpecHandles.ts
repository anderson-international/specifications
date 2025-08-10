'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface UseUserSpecHandlesReturn {
  doneHandles: Set<string>
  statusReady: boolean
  statusError: string | null
}

export function useUserSpecHandles(): UseUserSpecHandlesReturn {
  const { user } = useAuth()
  const [handles, setHandles] = useState<Set<string>>(new Set())
  const [statusReady, setStatusReady] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async (): Promise<void> => {
      try {
        if (!user?.id) {
          throw new Error('User authentication required for product status filtering')
        }

        const res = await fetch(`/api/products/my-specs?userId=${encodeURIComponent(user.id)}`)
        if (!res.ok) {
          const body = await res.text().catch((): string => '')
          throw new Error(`Failed to load user specs: HTTP ${res.status}${body ? ` - ${body}` : ''}`)
        }

        const json = await res.json()
        const products = json?.data?.products
        if (!Array.isArray(products)) {
          throw new Error('API response missing required products array in data field')
        }

        const next = new Set<string>()
        for (const p of products) {
          if (!p || typeof p.handle !== 'string' || !p.handle) {
            throw new Error('API response contained an item without a valid handle')
          }
          next.add(p.handle)
        }

        if (!cancelled) {
          setHandles(next)
          setStatusError(null)
          setStatusReady(true)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred while fetching user specs'
        if (!cancelled) {
          setStatusError(message)
          setHandles(new Set())
          setStatusReady(true)
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [user?.id])

  return useMemo(() => ({ doneHandles: handles, statusReady, statusError }), [handles, statusReady, statusError])
}
