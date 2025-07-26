import React, { useCallback } from 'react'
import { DashboardStats } from './useDashboardStats'
import { useDashboardStatsLocal } from './useDashboardStatsLocal'
import { useDashboardLeaderboard } from './useDashboardLeaderboard'
import DashboardOverviewTab from '../components/dashboard/DashboardOverviewTab'
import DashboardStatsGrid from '../components/dashboard/DashboardStatsGrid'
import DashboardActionsTab from '../components/dashboard/DashboardActionsTab'
import styles from '../app/Dashboard.module.css'

export interface UseDashboardRenderersProps {
  stats: DashboardStats | null
  isLoading: boolean
  currentUserId: string | null
  activeOverviewSubTab: string
  activeNextSpecSubTab: string
  overviewSubTabs: Array<{ id: string; label: string }>
  nextSpecSubTabs: Array<{ id: string; label: string }>
  handleOverviewSubTabClick: (subTabId: string) => void
  handleNextSpecSubTabClick: (subTabId: string) => void
}

export interface UseDashboardRenderersReturn {
  renderOverviewTab: () => React.ReactElement
  renderActivityTab: () => React.ReactElement
  renderLeaderboardTab: () => React.ReactElement
  renderActionsTab: () => React.ReactElement
}

export const useDashboardRenderers = (props: UseDashboardRenderersProps): UseDashboardRenderersReturn => {
  const { systemOverviewStats, productCoverageStats, userStats } = useDashboardStatsLocal(props.stats)
  const { renderLeaderboardTab } = useDashboardLeaderboard({
    stats: props.stats,
    isLoading: props.isLoading,
    currentUserId: props.currentUserId
  })

  const renderOverviewTab = useCallback(
    () => React.createElement(DashboardOverviewTab, {
      overviewSubTabs: props.overviewSubTabs,
      activeOverviewSubTab: props.activeOverviewSubTab,
      onSubTabClick: props.handleOverviewSubTabClick,
      systemOverviewStats: systemOverviewStats,
      productCoverageStats: productCoverageStats,
      brandGaps: props.stats?.systemStats.brand_coverage_gaps || [],
      weeklyActivity: props.stats?.systemStats.recent_activity_weekly || [],
      monthlyActivity: props.stats?.systemStats.recent_activity_monthly || [],
      isLoading: props.isLoading
    }),
    [props, systemOverviewStats, productCoverageStats]
  )

  const renderActivityTab = useCallback(
    () => React.createElement('section', { className: styles.section },
      React.createElement(DashboardStatsGrid, { stats: userStats, isLoading: props.isLoading })
    ),
    [userStats, props.isLoading]
  )



  const renderActionsTab = useCallback(
    () => React.createElement(DashboardActionsTab, {
      nextSpecSubTabs: props.nextSpecSubTabs,
      activeNextSpecSubTab: props.activeNextSpecSubTab,
      onSubTabClick: props.handleNextSpecSubTabClick,
      priorityProducts: props.stats?.systemStats.products_needing_attention || [],
      attentionProducts: props.stats?.systemStats.products_needing_coverage || [],
      isLoading: props.isLoading
    }),
    [props]
  )

  return {
    renderOverviewTab,
    renderActivityTab,
    renderLeaderboardTab,
    renderActionsTab,
  }
}
