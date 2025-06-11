import { createContext, useContext } from 'react'
import { AuthUser, AuthContextType, USER_ROLES, UserRole } from '@/types'

export { type AuthUser, type AuthContextType, USER_ROLES, type UserRole }

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
