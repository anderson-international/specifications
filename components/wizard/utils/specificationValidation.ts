import { DatabaseSpecificationData, JunctionTableData } from '../types/DatabaseTypes'

export const validateRequiredFields = (
  specification: DatabaseSpecificationData,
  junctionData: JunctionTableData
): void => {
  const requiredFields = [
    'shopify_handle',
    'product_type_id',
    'grind_id',
    'nicotine_level_id',
    'experience_level_id',
    'moisture_level_id',
    'product_brand_id',
    'star_rating',
  ]

  for (const field of requiredFields) {
    if (!specification[field as keyof DatabaseSpecificationData]) {
      throw new Error(`Required field missing: ${field}`)
    }
  }

  if (junctionData.tasting_note_ids.length === 0) {
    throw new Error('At least one tasting note is required')
  }

  if (specification.star_rating < 1 || specification.star_rating > 5) {
    throw new Error('Star rating must be between 1 and 5')
  }
}
