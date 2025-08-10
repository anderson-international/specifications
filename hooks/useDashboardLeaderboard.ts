import React, { useCallback } from 'react'
import { ReviewerLeaderboard } from '../app/api/dashboard/stats/types'
import type { DashboardStats } from '@/types/dashboard'
import styles from '../app/Dashboard.module.css'

export interface UseDashboardLeaderboardProps {
  stats: DashboardStats | null
  isLoading: boolean
  currentUserId: string | null
}

export interface UseDashboardLeaderboardReturn {
  renderLeaderboardTab: () => React.ReactElement
}

export const useDashboardLeaderboard = (props: UseDashboardLeaderboardProps): UseDashboardLeaderboardReturn => {
  const renderReviewer = useCallback(
    (r: ReviewerLeaderboard) => React.createElement(
      'div',
      { 
        key: r.user_id, 
        className: `${styles.leaderboardItem} ${r.user_id === props.currentUserId ? styles.currentUser : ''}` 
      },
      React.createElement('div', { className: styles.rank },
        React.createElement('span', { className: styles.rankSymbol }, '#'),
        React.createElement('span', { className: styles.rankNumber }, r.rank)
      ),
      React.createElement('div', { className: styles.reviewerInfo },
        React.createElement('div', { className: styles.reviewerName },
          r.name || 'Anonymous Reviewer',
          r.user_id === props.currentUserId && React.createElement('span', { className: styles.youLabel }, ' (You)')
        )
      ),
      React.createElement('div', { className: styles.specCount }, r.specification_count)
    ),
    [props.currentUserId]
  )

  const renderLeaderboardTab = useCallback(
    () => React.createElement('section', { className: styles.section },
      props.stats?.userStats.leaderboard_rank && React.createElement('div', 
        { className: styles.currentRankHeader }, 
        `You are ranked ${props.stats.userStats.leaderboard_rank}`
      ),
      React.createElement('div', { className: styles.leaderboard },
        props.isLoading 
          ? React.createElement('div', { className: styles.loadingState }, 'Loading leaderboard...')
          : props.stats?.leaderboard.map(renderReviewer)
      )
    ),
    [props.isLoading, props.stats, renderReviewer]
  )

  return {
    renderLeaderboardTab,
  }
}
