import React from 'react'
import DashboardSubTabNavigation from './DashboardSubTabNavigation'
import DashboardStatsGrid from './DashboardStatsGrid'
import DashboardInsightsTab from './DashboardInsightsTab'
import type { BrandCoverageGap, RecentActivity } from '@/app/api/dashboard/stats/types'
import styles from '../../app/Dashboard.module.css'

interface OverviewStats {
  number: string | number
  label: string
}

interface DashboardOverviewTabProps {
  overviewSubTabs: Array<{ id: string; label: string }>
  activeOverviewSubTab: string
  onSubTabClick: (subTabId: string) => void
  systemOverviewStats: OverviewStats[]
  productCoverageStats: OverviewStats[]
  brandGaps: BrandCoverageGap[]
  weeklyActivity: RecentActivity[]
  monthlyActivity: RecentActivity[]
  isLoading: boolean
}

const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = React.memo(({
  overviewSubTabs,
  activeOverviewSubTab,
  onSubTabClick,
  systemOverviewStats,
  productCoverageStats,
  brandGaps,
  weeklyActivity,
  monthlyActivity,
  isLoading
}): JSX.Element => {
  return (
    <section className={styles.section}>
      <DashboardSubTabNavigation 
        subTabs={overviewSubTabs}
        activeSubTab={activeOverviewSubTab}
        onSubTabClick={onSubTabClick}
      />
      <div className={styles.subTabContent}>
        {activeOverviewSubTab === 'insights' ? (
          <DashboardInsightsTab
            brandGaps={brandGaps}
            weeklyActivity={weeklyActivity}
            monthlyActivity={monthlyActivity}
          />
        ) : (
          <DashboardStatsGrid 
            stats={activeOverviewSubTab === 'system' ? systemOverviewStats : productCoverageStats}
            isLoading={isLoading}
          />
        )}
      </div>
    </section>
  )
})

DashboardOverviewTab.displayName = 'DashboardOverviewTab'

export default DashboardOverviewTab
