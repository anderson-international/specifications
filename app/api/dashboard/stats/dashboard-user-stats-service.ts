import { prisma } from '@/lib/prisma'
import { ReviewerLeaderboard } from './types'

export interface UserStatsResult {
  total_specifications: number
  published_specifications: number
  needs_revision_specifications: number
  leaderboard_rank: number
}

export class DashboardUserStatsService {
  private static async getRawLeaderboardData() {
    return await prisma.system_users.findMany({
      where: { role_id: 2 },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            specifications: {
              where: { status_id: 1 }
            }
          }
        }
      },
      orderBy: [
        {
          specifications: {
            _count: 'desc'
          }
        },
        {
          name: 'asc'
        }
      ]
    })
  }

  static async getUserStats(userId: string): Promise<UserStatsResult> {
    const [userSpecCounts, rawLeaderboard] = await Promise.all([
      Promise.all([
        prisma.specifications.count({ where: { user_id: userId } }),
        prisma.specifications.count({ where: { user_id: userId, status_id: 1 } }),
        prisma.specifications.count({ where: { user_id: userId, status_id: 2 } })
      ]),
      this.getRawLeaderboardData()
    ])

    const [totalUserSpecifications, userPublishedSpecs, userNeedsRevisionSpecs] = userSpecCounts

    const leaderboard = rawLeaderboard.map((user, index) => ({
      user_id: user.id,
      name: user.name,
      email: user.email,
      specification_count: user._count.specifications,
      rank: index + 1,
    }))

    const currentUserRank =
      leaderboard.find((r) => r.user_id === userId)?.rank || leaderboard.length + 1

    return {
      total_specifications: totalUserSpecifications,
      published_specifications: userPublishedSpecs,
      needs_revision_specifications: userNeedsRevisionSpecs,
      leaderboard_rank: currentUserRank,
    }
  }

  static async getLeaderboard(): Promise<ReviewerLeaderboard[]> {
    const rawLeaderboard = await this.getRawLeaderboardData()
    
    return rawLeaderboard.map((user, index) => ({
      user_id: user.id,
      name: user.name,
      email: user.email,
      specification_count: user._count.specifications,
      rank: index + 1,
    }))
  }
}
