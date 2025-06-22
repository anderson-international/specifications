// Simplified auth configuration for development mode
// NextAuth configuration disabled for development phase
// Use auth-context.tsx for development authentication

import { prisma } from '@/lib/prisma'

// Preserve type definitions for future NextAuth migration
export interface ExtendedToken {
  userId?: string
  role_id?: number
  role_name?: string
}

// Type definitions preserved for future NextAuth compatibility
export interface NextAuthUser {
  role_id?: number
  role_name?: string
}

export interface NextAuthSession {
  user: {
    id: string
    role_id?: number
    role_name?: string
    email?: string | null
    name?: string | null
    image?: string | null
  }
}

export interface ExtendedSession {
  user: {
    id: string
    name: string | null
    email: string
    role_id: number
    role_name: string
    created_at?: string
    slack_userid?: string | null
    jotform_name?: string | null
  }
}

// Utility function for future NextAuth integration
export const validateUserInDatabase = async (email: string): Promise<boolean> => {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { email }
    })
    return !!existingUser
  } catch (error) {
    console.error('Database validation error:', error)
    return false
  }
}

// Placeholder for future NextAuth configuration
// Uncomment and configure when ready for production magic link auth
/*
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // EmailProvider configuration will go here
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request', 
    error: '/auth/error',
  },
  callbacks: {
    // Callback implementations will go here
  },
  events: {
    // Event handlers will go here
  }
}

export default NextAuth(authOptions)
*/
