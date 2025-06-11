import { z } from 'zod'

// Specification creation/update schema
export const CreateSpecificationSchema = z.object({
  shopify_handle: z.string().min(1, 'Product selection is required'),
  product_type_id: z.number().int().min(1, 'Product type is required'),
  experience_level_id: z.number().int().min(1, 'Experience level is required'),
  grind_id: z.number().int().min(1, 'Grind selection is required'),
  nicotine_level_id: z.number().int().min(1, 'Nicotine level is required'),
  moisture_level_id: z.number().int().min(1, 'Moisture level is required'),
  product_brand_id: z.number().int().min(1, 'Product brand is required'),
  star_rating: z.number().int().min(1, 'Star rating must be between 1-5').max(5, 'Star rating must be between 1-5'),
  review_text: z.string().min(10, 'Review text must be at least 10 characters'),
  
  // Optional fields
  rating_boost: z.number().int().min(0).max(2).optional().default(0),
  is_fermented: z.boolean().optional().default(false),
  is_oral_tobacco: z.boolean().optional().default(false),
  is_artisan: z.boolean().optional().default(false),
  
  // Multi-select arrays (handled via junction tables)
  tasting_notes: z.array(z.number().int().min(1)).min(1, 'At least one tasting note is required'),
  cures: z.array(z.number().int().min(1)).min(1, 'At least one cure is required'),
  tobacco_types: z.array(z.number().int().min(1)).optional().default([])
})

export const UpdateSpecificationSchema = CreateSpecificationSchema.partial().extend({
  id: z.number().int().min(1, 'Specification ID is required')
})

// Query parameters for specification listing
export const SpecificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  userId: z.string().uuid().optional(),
  status: z.string().optional(),
  brand: z.string().optional(),
  search: z.string().optional()
})

// Specification response schema
export const SpecificationResponseSchema = z.object({
  id: z.number().int(),
  shopify_handle: z.string(),
  star_rating: z.number().int(),
  rating_boost: z.number().int(),
  review_text: z.string(),
  is_fermented: z.boolean(),
  is_oral_tobacco: z.boolean(),
  is_artisan: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  
  // Relations
  users: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable()
  }).optional(),
  
  enum_specification_statuses: z.object({
    id: z.number(),
    name: z.string()
  }).optional(),
  
  enum_product_brands: z.object({
    id: z.number(),
    name: z.string()
  }).optional()
})

// Export types
export type CreateSpecification = z.infer<typeof CreateSpecificationSchema>
export type UpdateSpecification = z.infer<typeof UpdateSpecificationSchema>
export type SpecificationQuery = z.infer<typeof SpecificationQuerySchema>
export type SpecificationResponse = z.infer<typeof SpecificationResponseSchema>
