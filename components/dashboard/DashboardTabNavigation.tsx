import React, { useCallback } from 'react'
import styles from '../../app/Dashboard.module.css'

export type TabId = 'overview' | 'activity' | 'leaderboard' | 'actions'

interface Tab {
  id: TabId
  label: string
}

interface DashboardTabNavigationProps {
  tabs: Tab[]
  activeTab: TabId
  onTabClick: (tabId: TabId) => void
  currentUserRank?: number
}

const DashboardTabNavigation: React.FC<DashboardTabNavigationProps> = React.memo(({ 
  tabs, 
  activeTab, 
  onTabClick,
  currentUserRank
}): JSX.Element => {
  const handleTabClick = useCallback((tabId: TabId): void => {
    onTabClick(tabId)
  }, [onTabClick])

  return (
    <nav className={styles.tabNavigation}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''} ${index < tabs.length - 1 ? styles.tabButtonSeparator : ''}`}
          onClick={() => handleTabClick(tab.id)}
          type="button"
        >
          <span className={styles.tabLabel}>
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  )
})

DashboardTabNavigation.displayName = 'DashboardTabNavigation'

export default DashboardTabNavigation
