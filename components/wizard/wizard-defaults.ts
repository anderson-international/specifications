import type { WizardFormData } from './types/wizard.types'

export const WIZARD_DEFAULT_VALUES: Partial<WizardFormData> = {
  user_id: '',
  status_id: 1,
  shopify_handle: '',
  product_brand_id: 0,
  product_type_id: 0,
  grind_id: 0,
  experience_level_id: 0,
  is_fermented: false,
  is_oral_tobacco: false,
  is_artisan: false,
  nicotine_level_id: 0,
  moisture_level_id: 0,
  tasting_note_ids: [],
  cure_type_ids: [],
  tobacco_type_ids: [],
  review: '',
  star_rating: 1,
  rating_boost: 0,
}
