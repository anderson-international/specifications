export type TabId = 'to-do' | 'done'

export interface SelectedItemLite {
  name: string
  brand: { id: number }
  userReviewId?: number | null
}

export interface RouterLike {
  back: () => void
  push: (href: string) => void
  replace: (href: string) => void
}

export interface TrialFormData {
  product_name: string
  brand_id: number | string
  rating: number
  review: string
  should_sell: boolean
  tasting_note_ids: number[]
  user_id: string
}

export const TRIAL_MIN_REVIEW_CHARS = 150
