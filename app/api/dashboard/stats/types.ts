// Dashboard stats types
// Extracted from route.ts to comply with file size limits

export interface ProductInsight {
  handle: string
  title: string
  brand?: string
  spec_count: number
  image_url: string | null
}

export interface BrandCoverageGap {
  brand: string
  total_products: number
  products_with_specs: number
  coverage_percentage: number
  sample_uncovered_products: ProductInsight[]
}

export interface RecentActivity {
  user_id: string
  name: string | null
  recent_specs: number
  rank: number
}

export interface SystemStats {
  total_products: number
  published_specifications: number
  coverage_percentage: number
  products_fully_covered: number
  products_needs_attention: number
  products_partial_coverage: number
  // Actionable product lists
  products_needing_attention: ProductInsight[]  // 0 specs
  products_needing_coverage: ProductInsight[]   // 1 spec
  // Phase 3: Brand and time-based insights
  brand_coverage_gaps: BrandCoverageGap[]       // Brands with lowest coverage
  recent_activity_weekly: RecentActivity[]      // Top reviewers this week
  recent_activity_monthly: RecentActivity[]     // Top reviewers this month
}

export interface ReviewerLeaderboard {
  user_id: string
  name: string | null
  email: string
  specification_count: number
  rank: number
}

export interface UserStats {
  total_specifications: number
  published_specifications: number
  needs_revision_specifications: number
  leaderboard_rank: number
}

export interface DashboardStats {
  systemStats: SystemStats
  userStats: UserStats
  leaderboard: ReviewerLeaderboard[]
}
