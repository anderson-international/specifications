'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useDashboardStats } from '../hooks/useDashboardStats'
import DashboardTabNavigation, { TabId } from '../components/dashboard/DashboardTabNavigation'
import DashboardSubTabNavigation from '../components/dashboard/DashboardSubTabNavigation'
import DashboardStatsGrid from '../components/dashboard/DashboardStatsGrid'
import DashboardProductCard from '../components/dashboard/DashboardProductCard'
import DashboardInsightsTab from '../components/dashboard/DashboardInsightsTab'
import DashboardOverviewTab from '../components/dashboard/DashboardOverviewTab'
import DashboardActionsTab from '../components/dashboard/DashboardActionsTab'
import styles from './Dashboard.module.css'

type OverviewSubTabId = 'system' | 'coverage' | 'insights'
type NextSpecSubTabId = 'priority' | 'attention'

const DashboardClient: React.FC = (): JSX.Element => {
  const { stats, isLoading } = useDashboardStats()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [activeOverviewSubTab, setActiveOverviewSubTab] = useState<OverviewSubTabId>('system')
  const [activeNextSpecSubTab, setActiveNextSpecSubTab] = useState<NextSpecSubTabId>('priority')

  useEffect(() => {
    const storedUser = localStorage.getItem('dev-user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUserId(user?.id || null)
    }
  }, [])

  const handleTabClick = useCallback((tabId: TabId) => {
    setActiveTab(tabId)
  }, [])

  const handleOverviewSubTabClick = useCallback((subTabId: string) => {
    setActiveOverviewSubTab(subTabId as OverviewSubTabId)
  }, [])

  const handleNextSpecSubTabClick = useCallback((subTabId: string) => {
    setActiveNextSpecSubTab(subTabId as NextSpecSubTabId)
  }, [])

  const renderReviewer = useCallback((reviewer: any) => {
    const isCurrentUser = reviewer.user_id === currentUserId
    return (
      <div 
        key={reviewer.user_id} 
        className={`${styles.leaderboardItem} ${isCurrentUser ? styles.currentUser : ''}`}
      >
        <div className={styles.rank}>
          <span className={styles.rankSymbol}>#</span>
          <span className={styles.rankNumber}>{reviewer.rank}</span>
        </div>
        <div className={styles.reviewerInfo}>
          <div className={styles.reviewerName}>
            {reviewer.name || 'Anonymous Reviewer'}
            {isCurrentUser && <span className={styles.youLabel}> (You)</span>}
          </div>
        </div>
        <div className={styles.specCount}>{reviewer.specification_count}</div>
      </div>
    )
  }, [currentUserId])

  const tabs = useMemo(() => [
    { id: 'overview' as TabId, label: 'Overview' },
    { id: 'activity' as TabId, label: 'Me' },
    { id: 'leaderboard' as TabId, label: 'Ranking' },
    { id: 'actions' as TabId, label: 'Next Spec' }
  ], [])

  const overviewSubTabs = useMemo(() => [
    { id: 'system' as OverviewSubTabId, label: 'System' },
    { id: 'coverage' as OverviewSubTabId, label: 'Coverage' },
    { id: 'insights' as OverviewSubTabId, label: 'Insights' }
  ], [])

  const systemOverviewStats = useMemo(() => [
    { number: stats?.systemStats.total_products.toLocaleString() || 0, label: 'Total Products' },
    { number: stats?.systemStats.published_specifications.toLocaleString() || 0, label: 'Published Specifications' },
    { number: `${stats?.systemStats.coverage_percentage || 0}%`, label: 'Coverage (5+ specs)' }
  ], [stats])

  const productCoverageStats = useMemo(() => [
    { number: stats?.systemStats.products_fully_covered || 0, label: 'Fully Covered (5+ specs)' },
    { number: stats?.systemStats.products_partial_coverage || 0, label: 'Partial Coverage (1-4 specs)' },
    { number: stats?.systemStats.products_needing_attention.length || 0, label: 'Needs Attention (0 specs)' }
  ], [stats])

  const renderOverviewTab = useCallback((): JSX.Element => (
    <DashboardOverviewTab
      overviewSubTabs={overviewSubTabs}
      activeOverviewSubTab={activeOverviewSubTab}
      onSubTabClick={handleOverviewSubTabClick}
      systemOverviewStats={systemOverviewStats}
      productCoverageStats={productCoverageStats}
      brandGaps={stats?.systemStats.brand_coverage_gaps || []}
      weeklyActivity={stats?.systemStats.recent_activity_weekly || []}
      monthlyActivity={stats?.systemStats.recent_activity_monthly || []}
      isLoading={isLoading}
    />
  ), [overviewSubTabs, activeOverviewSubTab, handleOverviewSubTabClick, systemOverviewStats, productCoverageStats, isLoading, stats])

  const userStats = useMemo(() => [
    { number: stats?.userStats.total_specifications || 0, label: 'Total Specifications' },
    { number: stats?.userStats.published_specifications || 0, label: 'Published' },
    { number: stats?.userStats.needs_revision_specifications || 0, label: 'Needs Revision' },
    { number: stats?.userStats.leaderboard_rank ? `#${stats.userStats.leaderboard_rank}` : 'N/A', label: 'Leaderboard Position' }
  ], [stats])

  const renderActivityTab = useCallback((): JSX.Element => (
    <section className={styles.section}>
      <DashboardStatsGrid stats={userStats} isLoading={isLoading} />
    </section>
  ), [userStats, isLoading])

  const renderLeaderboardTab = useCallback(() => (
    <section className={styles.section}>
      {stats?.userStats.leaderboard_rank && (
        <div className={styles.currentRankHeader}>You are ranked {stats.userStats.leaderboard_rank}</div>
      )}
      <div className={styles.leaderboard}>
        {isLoading ? (
          <div className={styles.loadingState}>Loading leaderboard...</div>
        ) : (
          stats?.leaderboard.map(renderReviewer)
        )}
      </div>
    </section>
  ), [isLoading, stats, renderReviewer])

  const nextSpecSubTabs = useMemo(() => [
    { id: 'priority', label: 'Priority Products' },
    { id: 'attention', label: 'Needs Attention' }
  ], [])

  const renderActionsTab = useCallback((): JSX.Element => (
    <DashboardActionsTab
      nextSpecSubTabs={nextSpecSubTabs}
      activeNextSpecSubTab={activeNextSpecSubTab}
      onSubTabClick={handleNextSpecSubTabClick}
      priorityProducts={stats?.systemStats.products_needing_attention || []}
      attentionProducts={stats?.systemStats.products_needing_coverage || []}
      isLoading={isLoading}
    />
  ), [nextSpecSubTabs, activeNextSpecSubTab, handleNextSpecSubTabClick, stats, isLoading])

  const renderInsightsTab = useCallback((): JSX.Element => {
    return (
      <DashboardInsightsTab
        brandGaps={stats?.systemStats.brand_coverage_gaps || []}
        weeklyActivity={stats?.systemStats.recent_activity_weekly || []}
        monthlyActivity={stats?.systemStats.recent_activity_monthly || []}
      />
    )
  }, [stats])

  const renderActiveTabContent = useCallback(() => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab()
      case 'activity': return renderActivityTab()
      case 'leaderboard': return renderLeaderboardTab()
      case 'actions': return renderActionsTab()
      default: return renderOverviewTab()
    }
  }, [activeTab, renderOverviewTab, renderActivityTab, renderLeaderboardTab, renderActionsTab])

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      
      <DashboardTabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
        currentUserRank={stats?.userStats.leaderboard_rank}
      />

      <div className={styles.tabContent}>
        {renderActiveTabContent()}
      </div>
    </div>
  )
}

export default React.memo(DashboardClient)
DashboardClient.displayName = 'DashboardClient'
