import { z } from 'zod'

// Development authentication schemas
export const DevUserSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  role_id: z.number().int().min(1, 'Invalid role ID'),
  role_name: z.string().min(1, 'Role name is required')
})

export const AuthUserSelectSchema = z.object({
  userId: z.string().uuid('Invalid user ID').optional()
})

// Session validation schema
export const SessionSchema = z.object({
  user: DevUserSchema,
  expires: z.string().datetime(),
  sessionToken: z.string().optional()
})

// Export types
export type DevUser = z.infer<typeof DevUserSchema>
export type AuthUserSelect = z.infer<typeof AuthUserSelectSchema>
export type Session = z.infer<typeof SessionSchema>
