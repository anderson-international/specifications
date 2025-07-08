'use client'

import React, { useCallback } from 'react'
import { AuthUser, USER_ROLES } from '@/types'
import { useDevAuth } from '@/hooks/useDevAuth'
import styles from '@/styles/auth.module.css'

interface DevAuthProps {
  onUserSelect: (user: AuthUser | null) => void
  currentUser: AuthUser | null
}

const DevAuth = ({ onUserSelect, currentUser }: DevAuthProps): JSX.Element => {
  const { users, loading, error, retry } = useDevAuth()

  const handleUserChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>): void => {
      const userId = e.target.value
      if (userId === '') {
        onUserSelect(null)
        localStorage.removeItem('dev-user')
      } else {
        const selectedUser = users.find((user) => user.id === userId)
        if (selectedUser) {
          onUserSelect(selectedUser)
          localStorage.setItem('dev-user', JSON.stringify(selectedUser))
        }
      }
    },
    [users, onUserSelect]
  )

  const handleLogout = useCallback((): void => {
    onUserSelect(null)
    localStorage.removeItem('dev-user')
  }, [onUserSelect])

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Could not load users.</p>
        <button onClick={retry} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    )
  }

  return currentUser ? (
    <div className={styles.userInfo}>
      <div className={styles.currentUser}>
        <strong>{currentUser.name}</strong>
        <span className={styles.role}>
          {USER_ROLES[currentUser.role_id as keyof typeof USER_ROLES]}
        </span>
      </div>
      <button onClick={handleLogout} className={styles.logoutBtn}>
        Switch User
      </button>
    </div>
  ) : (
    <div className={styles.selectContainer}>
      <select id="user-select" onChange={handleUserChange} value="" className={styles.select}>
        <option value="">-- Select User --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({USER_ROLES[user.role_id as keyof typeof USER_ROLES]})
          </option>
        ))}
      </select>
    </div>
  )
}

export default React.memo(DevAuth)
