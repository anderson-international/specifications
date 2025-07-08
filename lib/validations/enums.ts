import { z } from 'zod'
import { EnumTableName } from '@/types/enum'

// Valid enum table names (matches database schema)
const ENUM_TABLE_NAMES: EnumTableName[] = [
  'enum_product_types',
  'enum_product_brands',
  'enum_grinds',
  'enum_experience_levels',
  'enum_nicotine_levels',
  'enum_moisture_levels',
  'enum_cures',
  'enum_tasting_notes',
  'enum_tobacco_types',
  'enum_specification_statuses',
  'enum_statuses',
  'enum_roles',
  'enum_snuff_types',
]

// Schema for validating enum table names
export const EnumTableNameSchema = z
  .string()
  .refine((value): value is EnumTableName => ENUM_TABLE_NAMES.includes(value as EnumTableName), {
    message: `Invalid enum table name. Must be one of: ${ENUM_TABLE_NAMES.join(', ')}`,
  })
  .transform((value) => value as EnumTableName)

// Generic enum table schema
export const EnumTableSchema = z.object({
  id: z.number().int().min(1),
  name: z.string().min(1, 'Name is required'),
  created_at: z.date(),
  updated_at: z.date(),
})

// Schema for creating new enum values
export const CreateEnumValueSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .refine((name) => name.length > 0, 'Name cannot be empty after trimming'),
})

// Schema for updating enum values
export const UpdateEnumValueSchema = z.object({
  id: z.number().int('ID must be an integer').positive('ID must be positive'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .refine((name) => name.length > 0, 'Name cannot be empty after trimming'),
})

// Schema for deleting enum values
export const DeleteEnumValueSchema = z.object({
  id: z.number().int('ID must be an integer').positive('ID must be positive'),
  confirmDeletion: z.boolean().refine((val) => val === true, {
    message: 'Deletion must be confirmed',
  }),
})

// Schema for enum query parameters
export const EnumQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
})

// Admin-only enum operations schema
export const AdminEnumOperationSchema = z.object({
  operation: z.enum(['create', 'update', 'delete']),
  table: EnumTableNameSchema,
  data: z.union([CreateEnumValueSchema, UpdateEnumValueSchema, DeleteEnumValueSchema]),
})

// Types for the validation schemas
export type EnumTable = z.infer<typeof EnumTableSchema>
export type CreateEnumValueInput = z.infer<typeof CreateEnumValueSchema>
export type UpdateEnumValueInput = z.infer<typeof UpdateEnumValueSchema>
export type DeleteEnumValueInput = z.infer<typeof DeleteEnumValueSchema>
export type EnumQueryInput = z.infer<typeof EnumQuerySchema>
export type ValidatedEnumTableName = z.infer<typeof EnumTableNameSchema>
export type AdminEnumOperation = z.infer<typeof AdminEnumOperationSchema>
