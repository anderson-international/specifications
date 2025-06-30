import React from 'react'
import styles from '../../app/Dashboard.module.css'

interface StatCard {
  number: string | number
  label: string
}

interface DashboardStatsGridProps {
  stats: StatCard[]
  isLoading: boolean
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = React.memo(({ 
  stats, 
  isLoading 
}): JSX.Element => {
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={`${stat.label}-${index}`} className={styles.statCard}>
          <div className={styles.statNumber}>
            {isLoading ? '...' : stat.number}
          </div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
})

DashboardStatsGrid.displayName = 'DashboardStatsGrid'

export default DashboardStatsGrid
