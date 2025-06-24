'use client'

import React from 'react'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import styles from './Dashboard.module.css'

const DashboardClient = (): JSX.Element => {
  const { stats, isLoading } = useDashboardStats()

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>System Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statValue}>{isLoading ? '--' : stats?.systemStats.total_products}</h3>
            <p className={styles.statLabel}>Total Products</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statValue}>{isLoading ? '--' : stats?.systemStats.reviewed_products}</h3>
            <p className={styles.statLabel}>Products Reviewed</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>User Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statValue}>{isLoading ? '--' : stats?.userStats.total_specifications}</h3>
            <p className={styles.statLabel}>My Specifications</p>
          </div>
          <div className={styles.statCard}>
            <h3 className={styles.statValue}>{isLoading ? '--' : stats?.userStats.draft_specifications}</h3>
            <p className={styles.statLabel}>Draft Specifications</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardClient
