'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import ErrorBoundary from '../common/ErrorBoundary'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps): JSX.Element => {
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false)
  const { stats, isLoading } = useDashboardStats()
  const { isAdmin } = useAuth()

  const toggleNav = useCallback((): void => {
    setIsNavCollapsed(!isNavCollapsed)
  }, [isNavCollapsed])

  return (
    <div className={styles.layout}>
      {/* Left Navigation Panel */}
      <nav className={`${styles.nav} ${isNavCollapsed ? styles.navCollapsed : ''}`}>
        <div className={styles.navHeader}>
          <button 
            className={styles.toggleButton}
            onClick={toggleNav}
            aria-label={isNavCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {isNavCollapsed ? '☰' : '✕'}
          </button>
          {!isNavCollapsed && (
            <h1 className={styles.appTitle}>Snuff Specs</h1>
          )}
        </div>

        <div className={styles.navContent}>
          {!isNavCollapsed && (
            <>
              {/* Progress Stats */}
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

              {/* Navigation Links */}
              <ul className={styles.navLinks}>
                <li>
                  <Link href="/dashboard" className={styles.navLink}>
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/products" className={styles.navLink}>
                    📦 Products
                  </Link>
                </li>
                <li>
                  <Link href="/specifications" className={styles.navLink}>
                    📝 My Specifications
                  </Link>
                </li>
                <li>
                  <Link href="/specifications/new" className={styles.navLink}>
                    ➕ New Specification
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/admin" className={styles.navLink}>
                      ⚙️ Admin
                    </Link>
                  </li>
                )}
              </ul>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`${styles.main} ${isNavCollapsed ? styles.mainExpanded : ''}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default React.memo(AppLayout)
