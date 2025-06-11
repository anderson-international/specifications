import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // TODO: Add EmailProvider back after resolving Edge Runtime compatibility
    // For Phase 1, we'll use development auth approach
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
    async jwt({ token, user }: { token: Record<string, unknown>; user?: { id?: string; email?: string } }) {
      if (user) {
        // Add user data to token
        const dbUser = await prisma.users.findUnique({
          where: { email: user.email! },
          include: { enum_roles: true }
        })
        
        if (dbUser) {
          token.userId = dbUser.id
          token.role_id = dbUser.role_id
          token.role_name = dbUser.enum_roles?.name || 'Unknown'
        }
      }
      return token
    },
    async session({ session, token }: { session: Record<string, unknown>; token: Record<string, unknown> }) {
      if (token) {
        session.user = {
          id: token.userId as string,
          role_id: token.role_id as number,
          role_name: token.role_name as string,
        }
      }
      return session
    },
    async signIn({ user }: { user: { email?: string } }) {
      // Only allow sign-in for users that exist in our database
      if (user.email) {
        const existingUser = await prisma.users.findUnique({
          where: { email: user.email }
        })
        
        if (!existingUser) {
          console.warn(`Sign-in attempt for non-registered user: ${user.email}`)
          return false
        }
        
        return true
      }
      
      return false
    },
  },
  events: {
    async signIn(message: { user: { email?: string }; isNewUser?: boolean }) {
      console.log(`User signed in: ${message.user.email} (new: ${message.isNewUser})`)
    },
    async signOut(message: { session?: { user?: { email?: string } }; token?: { email?: string } }) {
      const identifier = message.token?.email || message.session?.user?.email || 'unknown'
      console.log(`User signed out: ${identifier}`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

export { handlers, auth, signIn, signOut }
