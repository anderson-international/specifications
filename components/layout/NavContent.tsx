'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

import styles from './AppLayout.module.css'

const NavContent = (): JSX.Element => {
  const { isAdmin } = useAuth()

  return (
    <div className={styles.navContent}>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/" className={styles.navLink}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/products" className={styles.navLink}>
            Products
          </Link>
        </li>
        <li>
          <Link href="/specifications" className={styles.navLink}>
            My Specs
          </Link>
        </li>
        <li>
          <Link href="/ai-specifications" className={styles.navLink}>
            AI Specs
          </Link>
        </li>
        <li>
          <Link href="/specifications/new" className={styles.navLink}>
            New Spec
          </Link>
        </li>
        {isAdmin && (
          <li>
            <Link href="/admin" className={styles.navLink}>
              Admin
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default React.memo(NavContent)
