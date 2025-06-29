'use client'

import { useState, useEffect, useCallback } from 'react'
import { AuthUser } from '@/types'

export function useDevAuth() {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/auth/dev-users')
      if (!response.ok) {
        throw new Error('Failed to fetch development users.')
      }
      const userData = await response.json()
      setUsers(userData)
    } catch (err) {
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
