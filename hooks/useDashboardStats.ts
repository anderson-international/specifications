'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  ProductInsight,
  BrandCoverageGap,
  RecentActivity,
  SystemStats as SystemStatsType
} from '@/app/api/dashboard/stats/types'

export interface SystemStats {
  total_products: number
  published_specifications: number
  coverage_percentage: number
  products_fully_covered: number
  products_needs_attention: number
  products_partial_coverage: number
  // Actionable product lists
  products_needing_attention: ProductInsight[]  // 0 specs
  products_needing_coverage: ProductInsight[]   // 1 spec
  // Phase 3: Brand and time-based insights
  brand_coverage_gaps: BrandCoverageGap[]       // Brands with lowest coverage
  recent_activity_weekly: RecentActivity[]      // Top reviewers this week
  recent_activity_monthly: RecentActivity[]     // Top reviewers this month
}

export interface ReviewerLeaderboard {
  user_id: string
  name: string | null
  email: string
  specification_count: number
  rank: number
}

export interface UserStats {
  total_specifications: number
  published_specifications: number
  needs_revision_specifications: number
  leaderboard_rank: number
}

export interface DashboardStats {
  systemStats: SystemStats
  userStats: UserStats
  leaderboard: ReviewerLeaderboard[]
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
