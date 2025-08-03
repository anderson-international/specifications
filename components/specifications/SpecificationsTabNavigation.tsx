'use client'

import React, { useCallback } from 'react'
import styles from '../shared/TabNavigation/TabNavigation.module.css'

export type SpecTabId = 'my-specs' | 'to-do'

interface SpecTab {
  id: SpecTabId
  label: string
}

interface SpecificationsTabNavigationProps {
  tabs: SpecTab[]
  activeTab: SpecTabId
  onTabClick: (tabId: SpecTabId) => void
}

const SpecificationsTabNavigation: React.FC<SpecificationsTabNavigationProps> = React.memo(({
  tabs,
  activeTab,
  onTabClick
}): JSX.Element => {
  const handleTabClick = useCallback((tabId: SpecTabId): void => {
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

SpecificationsTabNavigation.displayName = 'SpecificationsTabNavigation'

export default SpecificationsTabNavigation
