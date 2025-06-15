import { z } from 'zod'

// Step 1: Product Selection
export const productSelectionSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  productHandle: z.string().min(1, 'Product handle is required'),
  productTitle: z.string().min(1, 'Product title is required')
})

// Step 2: Characteristics 1
export const characteristics1Schema = z.object({
  productType: z.enum(['nasal_snuff', 'chewing_tobacco', 'snus', 'other'], {
    required_error: 'Product type is required'
  }),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Experience level is required'
  }),
  tobaccoTypes: z.array(z.string()).min(1, 'At least one tobacco type is required')
})

// Step 3: Characteristics 2  
export const characteristics2Schema = z.object({
  cures: z.array(z.string()).min(1, 'At least one cure type is required'),
  grind: z.enum(['very_fine', 'fine', 'medium', 'coarse'], {
    required_error: 'Grind is required'
  }),
  isScented: z.boolean(),
  isMenthol: z.boolean(),
  isToasted: z.boolean()
})

// Step 4: Sensory Profile
export const sensoryProfileSchema = z.object({
  tastingNotes: z.array(z.string()).min(1, 'At least one tasting note is required'),
  nicotineStrength: z.number().min(1).max(10),
  moistureLevel: z.number().min(1).max(10)
})

// Step 5: Review & Rating
export const reviewRatingSchema = z.object({
  reviewText: z.string().min(10, 'Review must be at least 10 characters'),
  overallRating: z.number().min(1).max(5),
  ratingBoost: z.number().min(-2).max(2).default(0)
})

// Complete specification schema
export const specificationSchema = z.object({
  ...productSelectionSchema.shape,
  ...characteristics1Schema.shape,
  ...characteristics2Schema.shape,
  ...sensoryProfileSchema.shape,
  ...reviewRatingSchema.shape
})

export type ProductSelection = z.infer<typeof productSelectionSchema>
export type Characteristics1 = z.infer<typeof characteristics1Schema>
export type Characteristics2 = z.infer<typeof characteristics2Schema>
export type SensoryProfile = z.infer<typeof sensoryProfileSchema>
export type ReviewRating = z.infer<typeof reviewRatingSchema>
export type SpecificationFormData = z.infer<typeof specificationSchema>
