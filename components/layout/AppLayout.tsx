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
      <ul className={styles.navLinks}>
        <li><Link href="/" className={styles.navLink}>Dashboard</Link></li>
        <li><Link href="/products" className={styles.navLink}>Products</Link></li>
        <li><Link href="/specifications" className={styles.navLink}>My Specifications</Link></li>
        <li><Link href="/specifications/new" className={styles.navLink}>New Specification</Link></li>
        {isAdmin && (
          <li><Link href="/admin" className={styles.navLink}>Admin</Link></li>
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
        <NavContent user={user} signOut={signOut} />
        <div className={styles.navFooter}>
          <button onClick={(): void => signOut()} className={styles.signOutButton}>
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
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

export default React.memo(AppLayout)
