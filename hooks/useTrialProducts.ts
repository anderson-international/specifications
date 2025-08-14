import { useCallback, useEffect, useRef, useState } from 'react'
import type { TrialUserProduct } from '@/lib/types/trial'

interface Result {
  toDo: TrialUserProduct[]
  done: TrialUserProduct[]
  loading: boolean
  error: string | null
  refetch: () => void
}

function buildUrl(path: string, userId: string): string {
  const u = new URL(path, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
  u.searchParams.set('userId', userId)
  return u.toString()
}

export function useTrialProducts(userId: string | null): Result {
  const cacheRef = useRef<{ toDo: TrialUserProduct[]; done: TrialUserProduct[] }>({ toDo: [], done: [] })
  const [toDo, setToDo] = useState<TrialUserProduct[]>([])
  const [done, setDone] = useState<TrialUserProduct[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (): Promise<void> => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const [r1, r2] = await Promise.all([
        fetch(buildUrl('/api/trial-products/to-do', userId)),
        fetch(buildUrl('/api/trial-products/my-trials', userId)),
      ])
      if (!r1.ok) throw new Error(`to-do fetch failed: ${r1.status}`)
      if (!r2.ok) throw new Error(`my-trials fetch failed: ${r2.status}`)
      const d1 = (await r1.json()) as { data: { products: TrialUserProduct[] } }
      const d2 = (await r2.json()) as { data: { products: TrialUserProduct[] } }
      cacheRef.current = { toDo: d1.data.products, done: d2.data.products }
      setToDo(d1.data.products)
      setDone(d2.data.products)
    } catch (e) {
      setToDo(cacheRef.current.toDo)
      setDone(cacheRef.current.done)
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void load()
  }, [load])

  return {
    toDo,
    done,
    loading,
    error,
    refetch: () => {
      void load()
    },
  }
}
