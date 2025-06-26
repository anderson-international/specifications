'use client'

import { useState, useEffect, useCallback } from 'react'

// Duplicating interfaces here to avoid circular dependency with the route
// A better solution would be a central types file (e.g., @/types/index.ts)
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
        setIsLoading(false)
        return
      }

      const user = JSON.parse(storedUser)
      if (!user?.id) {
        setError('Invalid user data in local storage.')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data: DashboardStats = await response.json()
      setStats(data)
    } catch (e: any) {
      setError(e.message)
      console.error('Failed to fetch dashboard stats:', e)
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
