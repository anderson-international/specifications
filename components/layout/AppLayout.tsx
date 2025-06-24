'use client'

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import ErrorBoundary from '../common/ErrorBoundary'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: React.ReactNode
}

interface NavContentProps {
  user: { name?: string | null } | null
  signOut: () => void
}

const NavContent = React.memo(({ user, signOut }: NavContentProps) => {
  const { stats, isLoading } = useDashboardStats()
  const { isAdmin } = useAuth()

  return (
    <div className={styles.navContent}>
      <div className={styles.progressCard}>
        <div className={styles.progressStats}>
          {isLoading ? (
            <>
              <span className={styles.progressNumber}>--</span>
              <span className={styles.progressTotal}>/--</span>
            </>
          ) : (
            <>
              <span className={styles.progressNumber}>{stats?.reviewed_products || 0}</span>
              <span className={styles.progressTotal}>/{stats?.total_products || 0}</span>
            </>
          )}
        </div>
        <p className={styles.progressLabel}>products reviewed</p>
      </div>

      <ul className={styles.navLinks}>
        <li><Link href="/dashboard" className={styles.navLink}>📊 Dashboard</Link></li>
        <li><Link href="/products" className={styles.navLink}>📦 Products</Link></li>
        <li><Link href="/specifications" className={styles.navLink}>📝 My Specifications</Link></li>
        <li><Link href="/specifications/new" className={styles.navLink}>➕ New Specification</Link></li>
        {isAdmin && (
          <li><Link href="/admin" className={styles.navLink}>⚙️ Admin</Link></li>
        )}
      </ul>
    </div>
  )
})
NavContent.displayName = 'NavContent'

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { user, signOut } = useAuth()

  const toggleNav = useCallback(() => setIsNavOpen(prev => !prev), [])
  const closeNav = useCallback(() => setIsNavOpen(false), [])

  const pathname = usePathname()
  useEffect(() => {
    closeNav()
  }, [pathname, closeNav])

  useEffect(() => {
    if (isNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isNavOpen])

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.overlay} ${isNavOpen ? styles.overlayVisible : ''}`}
        onClick={closeNav}
      />
      <nav className={`${styles.nav} ${isNavOpen ? styles.navOpen : ''}`}>
        <div className={styles.navHeader}>
          <h1 className={styles.appTitle}>Snuff Specs</h1>
          <button
            className={styles.toggleButton}
            onClick={closeNav}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>
        <NavContent user={user} signOut={signOut} />
        <div className={styles.navFooter}>
          {user && <span className={styles.userName}>{user.name}</span>}
          <button onClick={() => signOut()} className={styles.signOutButton}>
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
            <Image src="/site-icon.png" alt="Site Icon" width={32} height={32} className={styles.siteIcon} />
            <h1 className={styles.headerTitle}>Specification Builder</h1>
          </div>
          <div className={styles.headerRight}>
            {/* Spacer for centering */}
          </div>
        </header>
        <main className={styles.main}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default React.memo(AppLayout)
