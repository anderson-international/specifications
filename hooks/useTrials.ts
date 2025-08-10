'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { Trial } from '@/lib/types/trial'

interface UseTrialsResult {
  trials: Trial[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTrials(userId: string | null): UseTrialsResult {
  const [trials, setTrials] = useState<Trial[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrials = useCallback(async (): Promise<void> => {
    if (!userId) {
      setTrials([])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/trials', { headers: { Accept: 'application/json' } })

      if (!response.ok) {
        try {
          const errJson = await response.json()
          const msgFromApi = typeof errJson?.error === 'string' && errJson.error.trim()
            ? errJson.error
            : null
          throw new Error(msgFromApi ?? `API request failed with status ${response.status}`)
        } catch (parseErr) {
          const parseMsg = parseErr instanceof Error ? parseErr.message : 'unknown parse error'
          throw new Error(`API request failed with status ${response.status}; failed to parse error body: ${parseMsg}`)
        }
      }

      const json = await response.json()
      const list: unknown = json?.data?.trials
      if (!Array.isArray(list)) {
        throw new Error('API response missing required trials array in data field')
      }

      const all = list as Trial[]
      const mine = all.filter(t => t.user_id === userId)
      setTrials(mine)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(message)
      setTrials([])
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTrials()
  }, [fetchTrials])

  return useMemo(() => ({
    trials,
    loading,
    error,
    refetch: fetchTrials,
  }), [trials, loading, error, fetchTrials])
}
