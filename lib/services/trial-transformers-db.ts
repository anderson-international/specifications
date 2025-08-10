import type { CreateTrialReviewData, UpdateTrialReviewData } from '@/lib/repositories/types/trial-types'

export function transformTrialForCreate(trial: Record<string, unknown>): CreateTrialReviewData {
  return {
    product_name: trial.product_name as string,
    supplier_id: BigInt(trial.supplier_id as number | string),
    rating: trial.rating as number,
    review: (trial.review as string) ?? null,
    should_sell: Boolean(trial.should_sell),
    user_id: trial.user_id as string,
  }
}

export function transformTrialForUpdate(body: Record<string, unknown>): UpdateTrialReviewData {
  const update: UpdateTrialReviewData = {}

  if (body.rating !== undefined) update.rating = body.rating as number
  if (body.review !== undefined) update.review = (body.review as string) ?? null
  if (body.should_sell !== undefined) update.should_sell = Boolean(body.should_sell)

  return update
}
