import React from 'react'
import styles from '../../app/Dashboard.module.css'
import type { BrandCoverageGap, RecentActivity } from '@/app/api/dashboard/stats/types'
import { DashboardInsightsTabComponent, type RenderItem } from '../shared/DashboardInsightsTabComponent'

interface DashboardInsightsTabProps {
  brandGaps: BrandCoverageGap[]
  weeklyActivity: RecentActivity[]
  monthlyActivity: RecentActivity[]
}

const DashboardInsightsTab: React.FC<DashboardInsightsTabProps> = React.memo(
  ({ brandGaps, weeklyActivity, monthlyActivity }): JSX.Element => {
    const renderReviewerItem: RenderItem<RecentActivity> = (
      reviewer: RecentActivity,
      index: number
    ): JSX.Element => {
      if (!reviewer.name || reviewer.name.trim() === '') {
        throw new Error(`Missing reviewer.name for user_id=${reviewer.user_id}`)
      }
      return (
        <div key={reviewer.user_id} className={styles.activityItem}>
          <div className={styles.activityRank}>#{index + 1}</div>
          <div className={styles.activityInfo}>
            <div className={styles.activityName}>{reviewer.name}</div>
          </div>
          <div className={styles.activityCount}>{reviewer.recent_specs} specs</div>
        </div>
      )
    }
    return (
      <section className={styles.section}>
        <div className={styles.insightsContainer}>
          <DashboardInsightsTabComponent<BrandCoverageGap>
            title="Brand Coverage Gaps"
            description="Brands with the least reviewed products"
            items={brandGaps}
            emptyText="No brand coverage gaps found"
            listClassName={styles.brandGapsList}
            renderItem={(brand: BrandCoverageGap): JSX.Element => (
              <div key={brand.brand} className={styles.brandGapItem}>
                <div className={styles.brandGapInfo}>
                  <div className={styles.brandName}>{brand.brand}</div>
                  <div className={styles.brandGapStats}>
                    {brand.coverage_percentage}% covered • {brand.sample_uncovered_products.length} products need specs
                  </div>
                </div>
                <div className={styles.brandGapBadge}>
                  {brand.products_with_specs}/{brand.total_products}
                </div>
              </div>
            )}
          />

          <DashboardInsightsTabComponent<RecentActivity>
            title="This Week's Top Reviewers"
            description="Most active reviewers in the past 7 days"
            items={weeklyActivity}
            emptyText="No activity this week"
            listClassName={styles.activityList}
            renderItem={renderReviewerItem}
          />

          <DashboardInsightsTabComponent<RecentActivity>
            title="This Month's Top Reviewers"
            description="Most active reviewers in the past 30 days"
            items={monthlyActivity}
            emptyText="No activity this month"
            listClassName={styles.activityList}
            renderItem={renderReviewerItem}
          />
        </div>
      </section>
    )
  }
)

DashboardInsightsTab.displayName = 'DashboardInsightsTab'

export default DashboardInsightsTab
