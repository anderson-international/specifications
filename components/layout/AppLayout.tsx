'use client'

import React from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useNavState } from '@/hooks/useNavState'
import ErrorBoundary from '../common/ErrorBoundary'
import NavContent from './NavContent'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  const { user, signOut } = useAuth()
  const { isNavOpen, toggleNav, closeNav } = useNavState()

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.overlay} ${isNavOpen ? styles.overlayVisible : ''}`}
        onClick={closeNav}
        role="button"
        aria-label="Close navigation"
        tabIndex={-1}
      />
      <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
        <div className={styles.navHeader}>
          <div className={styles.navHeaderLeft} />
          <div className={styles.navHeaderCenter}>
            <Image src="/site-icon.png" alt="Site Icon" width={56} height={56} className={styles.siteIcon} />
          </div>
          <div className={styles.navHeaderRight}>
            <button
              className={styles.toggleButton}
              onClick={closeNav}
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>
        </div>
        <NavContent />
        <div className={styles.navFooter}>
          <button onClick={signOut} className={styles.signOutButton}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.toggleButton}
              onClick={toggleNav}
              aria-label="Open navigation"
            >
              ☰
            </button>
          </div>
          <div className={styles.headerCenter}>
            <Image src="/site-icon.png" alt="Site Icon" width={48} height={48} className={styles.siteIcon} />
            <div className={styles.titleContainer}>
              <span className={styles.headerTitle}>Spec</span>
              <span className={styles.headerSubtitle}>Builder</span>
            </div>
          </div>
          <div className={styles.headerRight}>
            {user && (
              <div className={styles.userInfo}>
                <span className={styles.headerUserName}>{user.name}</span>
                <span className={styles.headerUserRole}>{user.role_name}</span>
              </div>
            )}
          </div>
        </header>
        <main className={styles.main}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default React.memo(AppLayout)

