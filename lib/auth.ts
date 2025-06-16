import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { JWT } from 'next-auth/jwt'
import { Session, User } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Define proper types to replace any
interface ExtendedToken extends JWT {
  userId?: string
  role_id?: number
  role_name?: string
}

// Update the User interface from next-auth to include our custom fields
declare module "next-auth" {
  interface User {
    role_id?: number
    role_name?: string
  }
  
  interface Session {
    user: {
      id: string
      role_id?: number
      role_name?: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }
}

interface ExtendedSession extends Session {
  user: {
    id: string
    role_id: number
    role_name: string
    email?: string | null
    name?: string | null
    image?: string | null
  }
}

interface SignInCallbackParams {
  user: User
  account: unknown
  profile?: unknown
  email?: unknown
  credentials?: unknown
}

interface EventMessage {
  user: User
  isNewUser?: boolean
  token?: ExtendedToken
  session?: ExtendedSession
}

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
    async jwt({ token, user }: { token: ExtendedToken; user?: User }) {
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
    async session({ session, token }: { session: Session; token: ExtendedToken }): Promise<ExtendedSession> {
      if (token) {
        session.user = {
          id: token.userId as string,
          role_id: token.role_id as number,
          role_name: token.role_name as string,
        }
      }
      return session as ExtendedSession
    },
    async signIn({ user }: SignInCallbackParams): Promise<boolean> {
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
    async signIn(message: EventMessage): Promise<void> {
      console.log(`User signed in: ${message.user.email} (new: ${message.isNewUser})`)
    },
    async signOut(message: EventMessage): Promise<void> {
      const identifier = message.token?.email || message.session?.user?.email || 'unknown'
      console.log(`User signed out: ${identifier}`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
}

const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

export { handlers, auth, signIn, signOut }
