import React from 'react'
import styles from '../../app/Dashboard.module.css'
import type { BrandCoverageGap, RecentActivity } from '@/app/api/dashboard/stats/types'

interface DashboardInsightsTabProps {
  brandGaps: BrandCoverageGap[]
  weeklyActivity: RecentActivity[]
  monthlyActivity: RecentActivity[]
}

const DashboardInsightsTab: React.FC<DashboardInsightsTabProps> = React.memo(
  ({ brandGaps, weeklyActivity, monthlyActivity }): JSX.Element => {
    return (
      <section className={styles.section}>
        <div className={styles.insightsContainer}>
          {/* Brand Coverage Gaps */}
          <div className={styles.insightCard}>
            <h3 className={styles.insightTitle}>Brand Coverage Gaps</h3>
            <p className={styles.insightDescription}>Brands with the least reviewed products</p>
            {brandGaps.length > 0 ? (
              <div className={styles.brandGapsList}>
                {brandGaps.slice(0, 5).map((brand: BrandCoverageGap, _index: number) => (
                  <div key={brand.brand} className={styles.brandGapItem}>
                    <div className={styles.brandGapInfo}>
                      <div className={styles.brandName}>{brand.brand}</div>
                      <div className={styles.brandGapStats}>
                        {brand.coverage_percentage}% covered •{' '}
                        {brand.sample_uncovered_products.length} products need specs
                      </div>
                    </div>
                    <div className={styles.brandGapBadge}>
                      {brand.products_with_specs}/{brand.total_products}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>No brand coverage gaps found</div>
            )}
          </div>

          {/* Recent Activity - Weekly */}
          <div className={styles.insightCard}>
            <h3 className={styles.insightTitle}>This Week&apos;s Top Reviewers</h3>
            <p className={styles.insightDescription}>Most active reviewers in the past 7 days</p>
            {weeklyActivity.length > 0 ? (
              <div className={styles.activityList}>
                {weeklyActivity.slice(0, 5).map((reviewer: RecentActivity, index: number) => (
                  <div key={reviewer.user_id} className={styles.activityItem}>
                    <div className={styles.activityRank}>#{index + 1}</div>
                    <div className={styles.activityInfo}>
                      <div className={styles.activityName}>
                        {reviewer.name || 'Anonymous Reviewer'}
                      </div>
                    </div>
                    <div className={styles.activityCount}>{reviewer.recent_specs} specs</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>No activity this week</div>
            )}
          </div>

          {/* Recent Activity - Monthly */}
          <div className={styles.insightCard}>
            <h3 className={styles.insightTitle}>This Month&apos;s Top Reviewers</h3>
            <p className={styles.insightDescription}>Most active reviewers in the past 30 days</p>
            {monthlyActivity.length > 0 ? (
              <div className={styles.activityList}>
                {monthlyActivity.slice(0, 5).map((reviewer: RecentActivity, index: number) => (
                  <div key={reviewer.user_id} className={styles.activityItem}>
                    <div className={styles.activityRank}>#{index + 1}</div>
                    <div className={styles.activityInfo}>
                      <div className={styles.activityName}>
                        {reviewer.name || 'Anonymous Reviewer'}
                      </div>
                    </div>
                    <div className={styles.activityCount}>{reviewer.recent_specs} specs</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>No activity this month</div>
            )}
          </div>
        </div>
      </section>
    )
  }
)

DashboardInsightsTab.displayName = 'DashboardInsightsTab'

export default DashboardInsightsTab
