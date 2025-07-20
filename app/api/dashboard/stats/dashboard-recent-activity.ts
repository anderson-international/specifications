import { prisma } from '@/lib/prisma'
import { RecentActivity } from '@/app/api/dashboard/stats/types'

export class RecentActivityAnalyzer {
  static async getWeeklyTopReviewers(): Promise<RecentActivity[]> {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 30)

    const rawWeeklyActivity = await prisma.system_users.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            specifications: {
              where: {
                status_id: 1,
                created_at: {
                  gte: oneWeekAgo
                }
              }
            }
          }
        }
      },
      orderBy: {
        specifications: {
          _count: 'desc'
        }
      },
      take: 5
    })

    const weeklyActivity = rawWeeklyActivity
      .filter((user) => user._count.specifications > 0)
      .map((user) => ({
        user_id: user.id,
        name: user.name,
        recent_specs: user._count.specifications
      }))

    return weeklyActivity.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))
  }

  static async getMonthlyTopReviewers(): Promise<RecentActivity[]> {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 6)

    const rawMonthlyActivity = await prisma.system_users.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            specifications: {
              where: {
                status_id: 1,
                created_at: {
                  gte: oneMonthAgo
                }
              }
            }
          }
        }
      },
      orderBy: {
        specifications: {
          _count: 'desc'
        }
      },
      take: 5
    })

    const monthlyActivity = rawMonthlyActivity
      .filter((user) => user._count.specifications > 0)
      .map((user) => ({
        user_id: user.id,
        name: user.name,
        recent_specs: user._count.specifications
      }))

    return monthlyActivity.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))
  }

  static async getRecentActivityMetrics(): Promise<{
    weekly: RecentActivity[]
    monthly: RecentActivity[]
  }> {
    const [weekly, monthly] = await Promise.all([
      this.getWeeklyTopReviewers(),
      this.getMonthlyTopReviewers(),
    ])

    return { weekly, monthly }
  }
}
