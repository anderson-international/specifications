'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { AuthUser, USER_ROLES } from '@/types'
import styles from '@/styles/auth.module.css'

interface DevAuthProps {
  onUserSelect: (user: AuthUser | null) => void
  currentUser: AuthUser | null
}

export default function DevAuth({ onUserSelect, currentUser }: DevAuthProps) {
  const [users, setUsers] = useState<AuthUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/dev-users')
      if (response.ok) {
        const userData = await response.json()
        setUsers(userData)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value
    if (userId === '') {
      onUserSelect(null)
    } else {
      const selectedUser = users.find(user => user.id === userId)
      if (selectedUser) {
        onUserSelect(selectedUser)
        // Store in localStorage for persistence
        localStorage.setItem('dev-user', JSON.stringify(selectedUser))
      }
    }
  }

  const handleLogout = () => {
    onUserSelect(null)
    localStorage.removeItem('dev-user')
  }

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>
  }

  return (
    <div className={styles.devAuth}>
      <div className={styles.header}>
        <h3>Development Authentication</h3>
        <span className={styles.badge}>DEV ONLY</span>
      </div>
      
      {currentUser ? (
        <div className={styles.userInfo}>
          <div className={styles.currentUser}>
            <strong>{currentUser.name}</strong>
            <span className={styles.role}>
              {USER_ROLES[currentUser.role_id as keyof typeof USER_ROLES]}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            Switch User
          </button>
        </div>
      ) : (
        <div className={styles.userSelect}>
          <label htmlFor="user-select">Select Development User:</label>
          <select 
            id="user-select"
            onChange={handleUserChange}
            value=""
            className={styles.select}
          >
            <option value="">-- Select User --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({USER_ROLES[user.role_id as keyof typeof USER_ROLES]})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
