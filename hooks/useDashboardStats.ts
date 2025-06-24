'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SystemStats {
  total_products: number
  reviewed_products: number
}

export interface UserStats {
  total_specifications: number
  draft_specifications: number
}

export interface DashboardStats {
  systemStats: SystemStats
  userStats: UserStats
}

interface UseDashboardStatsReturn {
  stats: DashboardStats | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: DashboardStats = await response.json()
      setStats(data)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard stats'
      setError(errorMessage)
      console.error('Error fetching dashboard stats:', err)
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

  return {
    stats,
    isLoading,
    error,
    refetch
  }
}
