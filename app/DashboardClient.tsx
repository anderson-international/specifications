'use client'

import React, { useCallback, useEffect, useState } from 'react'
import DashboardTabNavigation from '../components/dashboard/DashboardTabNavigation'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useDashboardTabs } from '../hooks/useDashboardTabs'
import { useDashboardRenderers } from '../hooks/useDashboardRenderers'
import styles from './Dashboard.module.css'

const DashboardClient: React.FC = (): JSX.Element => {
  const { stats, isLoading } = useDashboardStats()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  
  const {
    activeTab,
    activeOverviewSubTab,
    activeNextSpecSubTab,
    tabs,
    overviewSubTabs,
    nextSpecSubTabs,
    handleTabClick,
    handleOverviewSubTabClick,
    handleNextSpecSubTabClick,
  } = useDashboardTabs()

  const {
    renderOverviewTab,
    renderActivityTab,
    renderLeaderboardTab,
    renderActionsTab,
  } = useDashboardRenderers({
    stats,
    isLoading,
    currentUserId,
    activeOverviewSubTab,
    activeNextSpecSubTab,
    overviewSubTabs,
    nextSpecSubTabs,
    handleOverviewSubTabClick,
    handleNextSpecSubTabClick,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('dev-user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUserId(user?.id || null)
    }
  }, [])

  const renderActiveTabContent = useCallback(() => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab()
      case 'activity':
        return renderActivityTab()
      case 'leaderboard':
        return renderLeaderboardTab()
      case 'actions':
        return renderActionsTab()
      default:
        return renderOverviewTab()
    }
  }, [activeTab, renderOverviewTab, renderActivityTab, renderLeaderboardTab, renderActionsTab])

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <DashboardTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      <div className={styles.tabContent}>{renderActiveTabContent()}</div>
    </div>
  )
}

export default React.memo(DashboardClient)
DashboardClient.displayName = 'DashboardClient'
