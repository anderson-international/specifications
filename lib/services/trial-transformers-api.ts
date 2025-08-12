import type { TrialReviewWithRelations } from '@/lib/repositories/types/trial-types'

export interface TrialApiResponse {
  id: number
  product_name: string
  trial_product_id: number
  brand_id: number
  rating: number
  review: string | null
  should_sell: boolean
  user_id: string | null
  brand: { id: number; name: string }
  user?: { id: string; name: string | null; email: string | null } | null
  tasting_note_ids: number[]
  enums: {
    tastingNotes: Array<{ id: number; name: string }>
  }
  created_at: string
  updated_at: string
}

export function transformTrialToApiResponse(a: TrialReviewWithRelations): TrialApiResponse {
  if (!a.trial_products) throw new Error('Missing trial_products on review include')
  if (!a.trial_products.trial_product_brands) throw new Error('Missing brand on trial_products include')
  if (!Array.isArray(a.trial_junction_tasting_notes)) throw new Error('Missing tasting notes include on review')
  return {
    id: Number(a.id),
    trial_product_id: Number(a.trial_products.id),
    product_name: a.trial_products.name,
    brand_id: Number(a.trial_products.brand_id),
    rating: a.rating,
    review: a.review ?? null,
    should_sell: a.should_sell,
    user_id: a.user_id ?? null,
    brand: {
      id: Number(a.trial_products.trial_product_brands.id),
      name: a.trial_products.trial_product_brands.name,
    },
    user: a.system_users
      ? {
          id: a.system_users.id,
          name: a.system_users.name ?? null,
          email: a.system_users.email ?? null,
        }
      : null,
    tasting_note_ids: a.trial_junction_tasting_notes.map((j) => j.spec_enum_tasting_notes.id),
    enums: {
      tastingNotes: a.trial_junction_tasting_notes.map((j) => ({
        id: j.spec_enum_tasting_notes.id,
        name: j.spec_enum_tasting_notes.name,
      })),
    },
    created_at: a.created_at.toISOString(),
    updated_at: a.updated_at.toISOString(),
  }
}
