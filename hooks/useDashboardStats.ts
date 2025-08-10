'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DashboardStats } from '@/types/dashboard'


export interface UseDashboardStatsReturn {
  stats: DashboardStats | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const storedUser = localStorage.getItem('dev-user')
      if (!storedUser) {
        throw new Error('Missing required dev-user in local storage')
      }

      const user = JSON.parse(storedUser)
      if (!user?.id) {
        throw new Error('Invalid user data in local storage (missing id)')
      }

      const response = await fetch('/api/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        const serverMsg =
          errorData && typeof errorData.error === 'string' && errorData.error.trim() !== ''
            ? errorData.error
            : `HTTP error status: ${response.status}; missing error message payload`
        throw new Error(serverMsg)
      }

      const data: DashboardStats = await response.json()
      setStats(data)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : `NonErrorThrown: ${String(e)}`
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refetch = useCallback((): void => {
    fetchStats()
  }, [fetchStats])

  return { stats, isLoading, error, refetch }
}
