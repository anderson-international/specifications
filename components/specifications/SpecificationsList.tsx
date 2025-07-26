'use client'

import React from 'react'
import Link from 'next/link'
import AISpecificationItem from '@/components/specifications/AISpecificationItem'
import { FilterControls } from '@/components/shared/FilterControls'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { useSpecificationsList } from '@/hooks/useSpecificationsList'
import { useSpecificationFilters } from '@/hooks/useSpecificationFilters'
import { Specification } from '@/types/specification'
import styles from '../../app/specifications/specifications.module.css'

interface SpecificationsListConfig {
  title: string
  subtitle?: string
  searchPlaceholder: string
  emptyStateText: string
  emptySubtext?: string
  showCreateButton?: boolean
  createButtonText?: string
  createButtonHref?: string
  aiGenerated?: boolean
  userId?: string
  navigateTo: 'edit' | 'markdown'
  showAIIndicators?: boolean
}

interface SpecificationsListProps {
  config: SpecificationsListConfig
}

export default function SpecificationsList({ config }: SpecificationsListProps): JSX.Element {
  const {
    specifications,
    isLoading,
    error,
    handleClick,
    handleRetry,
  } = useSpecificationsList({
    aiGenerated: config.aiGenerated,
    userId: config.userId,
    navigateTo: config.navigateTo
  })

  const {
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    filteredSpecs,
  } = useSpecificationFilters(specifications)

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading specifications...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={handleRetry} className={styles.retryButton} type="button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{config.title}</h1>
          {config.subtitle && (
            <div className={styles.subtitle}>
              {config.subtitle}
            </div>
          )}
          {config.showCreateButton && config.createButtonHref && (
            <Link href={config.createButtonHref} className={styles.createButton}>
              {config.createButtonText || '+ New Specification'}
            </Link>
          )}
        </div>

        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={config.searchPlaceholder}
          filters={[
            {
              id: 'status',
              label: 'Filter by Status:',
              value: statusFilter,
              options: [
                { value: 'all', label: 'All Specifications' },
                { value: 'published', label: 'Published' },
                { value: 'needs_revision', label: 'Needs Revision' },
              ],
            },
          ]}
          onFilterChange={(id, value) => setStatusFilter(value)}
          onClearAll={() => {
            setSearchQuery('')
            setStatusFilter('all')
          }}
          showClearAll={searchQuery !== '' || statusFilter !== 'all'}
          summaryText={`${filteredSpecs.length} of ${specifications.length} specification${specifications.length !== 1 ? 's' : ''}`}
        />

        <div className={styles.content}>
          {filteredSpecs.length === 0 ? (
            <div className={styles.empty}>
              <p>{config.emptyStateText}</p>
              {config.emptySubtext && (
                <p className={styles.emptySubtext}>
                  {config.emptySubtext}
                </p>
              )}
              {config.showCreateButton && config.createButtonHref && (
                <Link href={config.createButtonHref} className={styles.createButton}>
                  {config.createButtonText || 'Create Your First Specification'}
                </Link>
              )}
            </div>
          ) : (
            <div className={styles.specificationsList}>
              {filteredSpecs.map((spec: Specification) => (
                <AISpecificationItem
                  key={spec.id}
                  specification={spec}
                  onClick={handleClick}
                  showAIIndicators={config.showAIIndicators}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
