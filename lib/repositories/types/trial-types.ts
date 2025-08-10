import { Prisma } from '@prisma/client'
import { TRIAL_INCLUDE } from '../includes/trial-include'

export type TrialReviewWithRelations = Prisma.trial_product_reviewsGetPayload<{
  include: typeof TRIAL_INCLUDE
}>

export interface CreateTrialReviewData {
  product_name: string
  supplier_id: bigint
  rating: number
  review?: string | null
  should_sell: boolean
  user_id: string
}

export interface UpdateTrialReviewData {
  rating?: number
  review?: string | null
  should_sell?: boolean
}

export interface TrialTastingNotesData {
  tasting_note_ids: number[]
}
