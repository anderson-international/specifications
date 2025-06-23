import { z } from 'zod'

// Step 1: Product Selection
export const productSelectionSchema = z.object({
  shopify_handle: z.string().min(1, 'Product handle is required'),
  product_brand_id: z.number().int().positive('Product brand is required')
})

// Step 2: Characteristics 1
export const characteristics1Schema = z.object({
  product_type_id: z.number().int().positive('Product type is required'),
  experience_level_id: z.number().int().positive('Experience level is required'),
  tobacco_type_ids: z.array(z.number().int().positive()).min(1, 'At least one tobacco type is required')
})

// Step 3: Characteristics 2  
export const characteristics2Schema = z.object({
  cure_type_ids: z.array(z.number().int().positive()).min(1, 'At least one cure type is required'),
  grind_id: z.number().int().positive('Grind is required'),
  is_fermented: z.boolean().default(false),
  is_oral_tobacco: z.boolean().default(false),
  is_artisan: z.boolean().default(false)
})

// Step 4: Sensory Profile
export const sensoryProfileSchema = z.object({
  tasting_note_ids: z.array(z.number().int().positive()).min(1, 'At least one tasting note is required'),
  nicotine_level_id: z.number().int().positive('Nicotine level is required'),
  moisture_level_id: z.number().int().positive('Moisture level is required')
})

// Step 5: Review & Rating
export const reviewRatingSchema = z.object({
  review_text: z.string().min(1, 'Review is required').optional(),
  star_rating: z.number().int().min(0).max(5).default(0),
  rating_boost: z.number().int().default(0).optional()
})

// Complete specification schema
export const specificationSchema = z.object({
  ...productSelectionSchema.shape,
  ...characteristics1Schema.shape,
  ...characteristics2Schema.shape,
  ...sensoryProfileSchema.shape,
  ...reviewRatingSchema.shape,
  status_id: z.number().int().positive().default(1), // Default to draft status
  user_id: z.string().uuid('Valid user ID is required')
})

// Type definitions
export type ProductSelection = z.infer<typeof productSelectionSchema>
export type Characteristics1 = z.infer<typeof characteristics1Schema>
export type Characteristics2 = z.infer<typeof characteristics2Schema>
export type SensoryProfile = z.infer<typeof sensoryProfileSchema>
export type ReviewRating = z.infer<typeof reviewRatingSchema>
export type Specification = z.infer<typeof specificationSchema>

// Complete form data type for the wizard
export type SpecificationFormData = z.infer<typeof specificationSchema>
