'use client'

import { useState, useEffect, useCallback } from 'react'
import { AuthUser } from '@/types'

interface UseDevAuthReturn {
  users: AuthUser[]
  loading: boolean
  error: string | null
  retry: () => void
}

export function useDevAuth(): UseDevAuthReturn {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔍 Fetching dev users...')
      const response = await fetch('/api/auth/dev-users')
      console.log('🔍 Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ API Error:', errorData)
        throw new Error(`API Error ${response.status}: ${errorData.error || 'Failed to fetch development users'}`)
      }
      
      const userData = await response.json()
      console.log('✅ Users fetched successfully:', userData.length, 'users')
      setUsers(userData)
    } catch (err) {
      console.error('❌ useDevAuth error:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, loading, error, retry: fetchUsers }
}
