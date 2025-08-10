'use client'

import React from 'react'
import styles from '@/app/specifications/specifications.module.css'

interface CountSummaryProps {
  count: number
  hintMobile?: string
  hintDesktop?: string
}

export default function CountSummary({
  count,
  hintMobile,
  hintDesktop,
}: CountSummaryProps): JSX.Element {
  const showHints = count > 0
  return (
    <div className={styles.countSummary}>
      {showHints && hintMobile ? (
        <span className={`${styles.hintText} ${styles.showOnMobile}`}>{hintMobile}</span>
      ) : null}
      {showHints && hintDesktop ? (
        <span className={`${styles.hintText} ${styles.showOnDesktop}`}>{hintDesktop}</span>
      ) : null}
      <span className={styles.countText}>
        {`${count} item${count !== 1 ? 's' : ''}`}
      </span>
    </div>
  )
}
