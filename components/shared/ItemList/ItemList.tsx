'use client'

import React from 'react'
import Link from 'next/link'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { FilterControls, FilterConfig } from '@/components/shared/FilterControls'
import styles from './ItemList.module.css'

export interface ItemListConfig {
  searchPlaceholder: string
  emptyStateText: string
  emptySubtext?: string
  showCreateButton?: boolean
  createButtonText?: string
  createButtonHref?: string
}

export interface ItemListProps<T> {
  config: ItemListConfig
  items: T[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: FilterConfig[]
  onFilterChange: (id: string, value: string) => void
  onClearAll: () => void
  showClearAll: boolean
  renderItem: (item: T) => React.ReactNode
  getItemKey: (item: T) => string
}

export default function ItemList<T>({
  config,
  items,
  isLoading,
  error,
  onRetry,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  onClearAll,
  showClearAll,
  renderItem,
  getItemKey,
}: ItemListProps<T>): JSX.Element {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={onRetry} className={styles.retryButton} type="button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={config.searchPlaceholder}
          filters={filters}
          onFilterChange={onFilterChange}
          onClearAll={onClearAll}
          showClearAll={showClearAll}
        />

        <div className={styles.countSummary}>
          <span className={styles.countText}>
            {`${items.length} item${items.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>{config.emptyStateText}</p>
              {config.emptySubtext && (
                <p className={styles.emptySubtext}>
                  {config.emptySubtext}
                </p>
              )}
              {config.showCreateButton && config.createButtonHref && (
                <Link href={config.createButtonHref} className={styles.createButton}>
                  {config.createButtonText || (() => { throw new Error('createButtonText is required when showCreateButton is true') })()}
                </Link>
              )}
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item: T) => (
                <div key={getItemKey(item)}>
                  {renderItem(item)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
