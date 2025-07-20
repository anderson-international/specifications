import { DashboardSystemStatsService } from './dashboard-system-stats-service'
import { DashboardUserStatsService } from './dashboard-user-stats-service'
import { DashboardStats } from './types'

export class DashboardStatsService {
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    const [systemStats, userStats, leaderboard] = await Promise.all([
      DashboardSystemStatsService.getSystemStats(),
      DashboardUserStatsService.getUserStats(userId),
      DashboardUserStatsService.getLeaderboard()
    ])

    return {
      systemStats,
      userStats,
      leaderboard,
    }
  }
}
