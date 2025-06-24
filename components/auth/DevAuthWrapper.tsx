'use client'

import DevAuth from '@/components/common/DevAuth'
import { useAuth } from '@/lib/auth-context'
import { AuthUser } from '@/types'
import React, { useCallback } from 'react'
import styles from './DevAuthWrapper.module.css'

interface DevAuthWrapperProps {
  children: React.ReactNode
}

const DevAuthWrapper = ({ children }: DevAuthWrapperProps): JSX.Element => {
  const { user, isLoading, signIn, signOut } = useAuth()

  const handleUserSelect = useCallback((selectedUser: AuthUser | null): void => {
    if (selectedUser) {
      signIn(selectedUser)
    } else {
      signOut()
    }
  }, [signIn, signOut])

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading authentication...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1 className={styles.title}>Specification Builder</h1>
          <p className={styles.subtitle}>Development Authentication</p>
          <DevAuth 
            onUserSelect={handleUserSelect} 
            currentUser={user} 
          />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default React.memo(DevAuthWrapper)
