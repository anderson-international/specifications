import { useMemo } from 'react'
import { DashboardStats } from './useDashboardStats'

export interface UseDashboardStatsLocalReturn {
  systemOverviewStats: Array<{ number: string | number; label: string }>
  productCoverageStats: Array<{ number: string | number; label: string }>
  userStats: Array<{ number: string | number; label: string }>
}

export const useDashboardStatsLocal = (stats: DashboardStats | null): UseDashboardStatsLocalReturn => {
  const systemOverviewStats = useMemo(
    () => [
      { number: stats?.systemStats.total_products.toLocaleString() || 0, label: 'Total Products' },
      {
        number: stats?.systemStats.published_specifications.toLocaleString() || 0,
        label: 'Published Specifications',
      },
      { number: `${stats?.systemStats.coverage_percentage || 0}%`, label: 'Coverage (5+ specs)' },
    ],
    [stats]
  )

  const productCoverageStats = useMemo(
    () => [
      { number: stats?.systemStats.products_fully_covered || 0, label: 'Fully Covered (5+ specs)' },
      {
        number: stats?.systemStats.products_partial_coverage || 0,
        label: 'Partial Coverage (1-4 specs)',
      },
      {
        number: stats?.systemStats.products_needing_attention.length || 0,
        label: 'Needs Attention (0 specs)',
      },
    ],
    [stats]
  )

  const userStats = useMemo(
    () => [
      { number: stats?.userStats.total_specifications || 0, label: 'Total Specifications' },
      { number: stats?.userStats.published_specifications || 0, label: 'Published' },
      { number: stats?.userStats.needs_revision_specifications || 0, label: 'Needs Revision' },
      {
        number: stats?.userStats.leaderboard_rank ? `#${stats.userStats.leaderboard_rank}` : 'N/A',
        label: 'Leaderboard Position',
      },
    ],
    [stats]
  )

  return {
    systemOverviewStats,
    productCoverageStats,
    userStats,
  }
}
