// Recent activity analysis utilities  
// Extracted from route.ts to comply with file size limits

import { prisma } from '@/lib/prisma'
import { RecentActivity } from '@/app/api/dashboard/stats/types'

export class RecentActivityAnalyzer {
  static async getWeeklyTopReviewers(): Promise<RecentActivity[]> {
    // DEBUG: Extended from 7 days to 30 days to capture more activity
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 30)
    console.log('🔍 DEBUG: Weekly cutoff date (extended to 30 days):', oneWeekAgo.toISOString())
    
    // Weekly top reviewers
    const weeklyActivity = await prisma.$queryRaw<Array<{ user_id: string; name: string | null; recent_specs: number }>>`
      SELECT 
        u.id as user_id,
        u.name,
        COUNT(s.id)::int as recent_specs
      FROM users u
      LEFT JOIN specifications s ON u.id = s.user_id 
        AND s.status_id = 1 
        AND s.created_at >= ${oneWeekAgo}
      GROUP BY u.id, u.name
      HAVING COUNT(s.id) > 0
      ORDER BY recent_specs DESC
      LIMIT 5
    `
    
    // Add ranks to recent activity
    return weeklyActivity.map((user, index) => ({
      ...user,
      rank: index + 1
    }))
  }

  static async getMonthlyTopReviewers(): Promise<RecentActivity[]> {
    // DEBUG: Extended from 1 month to 6 months to capture more activity
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 6)
    console.log('🔍 DEBUG: Monthly cutoff date (extended to 6 months):', oneMonthAgo.toISOString())
    
    // Monthly top reviewers  
    const monthlyActivity = await prisma.$queryRaw<Array<{ user_id: string; name: string | null; recent_specs: number }>>`
      SELECT 
        u.id as user_id,
        u.name,
        COUNT(s.id)::int as recent_specs
      FROM users u
      LEFT JOIN specifications s ON u.id = s.user_id 
        AND s.status_id = 1 
        AND s.created_at >= ${oneMonthAgo}
      GROUP BY u.id, u.name
      HAVING COUNT(s.id) > 0
      ORDER BY recent_specs DESC
      LIMIT 5
    `
    
    // Add ranks to recent activity
    return monthlyActivity.map((user, index) => ({
      ...user,
      rank: index + 1
    }))
  }

  static async getRecentActivityMetrics(): Promise<{
    weekly: RecentActivity[]
    monthly: RecentActivity[]
  }> {
    const [weekly, monthly] = await Promise.all([
      this.getWeeklyTopReviewers(),
      this.getMonthlyTopReviewers()
    ])

    return { weekly, monthly }
  }
}
