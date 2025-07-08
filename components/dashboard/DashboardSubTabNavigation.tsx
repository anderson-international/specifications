import React, { useCallback } from 'react'
import styles from '../../app/Dashboard.module.css'

interface SubTab {
  id: string
  label: string
}

interface DashboardSubTabNavigationProps {
  subTabs: SubTab[]
  activeSubTab: string
  onSubTabClick: (subTabId: string) => void
}

const DashboardSubTabNavigation: React.FC<DashboardSubTabNavigationProps> = React.memo(
  ({ subTabs, activeSubTab, onSubTabClick }): JSX.Element => {
    const handleSubTabClick = useCallback(
      (subTabId: string): void => {
        onSubTabClick(subTabId)
      },
      [onSubTabClick]
    )

    return (
      <nav className={styles.subTabNavigation}>
        {subTabs.map((subTab) => (
          <button
            key={subTab.id}
            className={`${styles.subTabButton} ${activeSubTab === subTab.id ? styles.subTabButtonActive : ''}`}
            onClick={() => handleSubTabClick(subTab.id)}
            type="button"
          >
            <span className={styles.subTabLabel}>{subTab.label}</span>
          </button>
        ))}
      </nav>
    )
  }
)

DashboardSubTabNavigation.displayName = 'DashboardSubTabNavigation'

export default DashboardSubTabNavigation
