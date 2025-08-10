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
  products_needing_attention: ProductInsight[]
  products_needing_coverage: ProductInsight[]
  brand_coverage_gaps: BrandCoverageGap[]
  recent_activity_weekly: RecentActivity[]
  recent_activity_monthly: RecentActivity[]
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
