'use client'

import React, { useState, useCallback } from 'react'
import styles from './CollapsibleGroup.module.css'

interface CollapsibleGroupProps {
  title: string
  count: number
  isInitiallyExpanded?: boolean
  children: React.ReactNode
}

export function CollapsibleGroup({
  title,
  count,
  isInitiallyExpanded = true,
  children
}: CollapsibleGroupProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(isInitiallyExpanded)

  const toggleExpanded = useCallback((): void => {
    setIsExpanded(prev => !prev)
  }, [])

  return (
    <div className={styles.group}>
      <button 
        onClick={toggleExpanded}
        className={styles.header}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`group-content-${title.toLowerCase()}`}
      >
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>
            {title} ({count})
          </h2>
          <div className={`${styles.chevron} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            ▼
          </div>
        </div>
      </button>
      
      <div 
        id={`group-content-${title.toLowerCase()}`}
        className={`${styles.content} ${isExpanded ? styles.show : styles.hide}`}
        aria-hidden={!isExpanded}
      >
        <div className={styles.contentInner}>
          {children}
        </div>
      </div>
    </div>
  )
}
