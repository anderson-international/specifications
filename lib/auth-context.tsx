'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { AuthUser } from '@/types'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  signIn: (user: AuthUser) => void
  signOut: () => void
  isAdmin: boolean
  isReviewer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = (): void => {
      try {
        const storedUser = localStorage.getItem('dev-user')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as AuthUser
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Failed to load stored user:', error)
        localStorage.removeItem('dev-user')
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredUser()
  }, [])

  const signIn = useCallback((selectedUser: AuthUser): void => {
    setUser(selectedUser)
    localStorage.setItem('dev-user', JSON.stringify(selectedUser))
  }, [])

  const signOut = useCallback((): void => {
    setUser(null)
    localStorage.removeItem('dev-user')
  }, [])

  // Computed role booleans
  const isAdmin = useMemo(() => user?.role_id === 1, [user?.role_id])
  const isReviewer = useMemo(() => user?.role_id === 2, [user?.role_id])

  const contextValue = useMemo(() => ({
    user,
    isLoading,
    signIn,
    signOut,
    isAdmin,
    isReviewer
  }), [user, isLoading, signIn, signOut, isAdmin, isReviewer])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
