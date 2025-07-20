'use client'

import React from 'react'
import { SpecificationRow } from '@/components/specifications/SpecificationRow'
import { FilterControls } from '@/components/shared/FilterControls'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { useAISpecifications } from '@/hooks/useAISpecifications'
import { useAISpecificationFilters } from '@/hooks/useAISpecificationFilters'
import styles from '../specifications/specifications.module.css'

export default function AISpecificationsPage(): JSX.Element {
  const {
    specifications,
    isLoading,
    error,
    handleEdit,
    handleRetry,
  } = useAISpecifications()

  const {
    searchQuery,
    statusFilter,
    filteredSpecifications,
    setSearchQuery,
    setStatusFilter,
    clearAllFilters
  } = useAISpecificationFilters(specifications)

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading AI specifications...</div>
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
          <h1 className={styles.title}>AI Specifications</h1>
          <div className={styles.subtitle}>
            AI-generated specifications synthesized from user reviews
          </div>
        </div>

        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search AI specifications by product or brand..."
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
          onFilterChange={(id, value) => setStatusFilter(value as any)}
          onClearAll={clearAllFilters}
          showClearAll={searchQuery !== '' || statusFilter !== 'all'}
          summaryText={`${filteredSpecifications.length} of ${specifications.length} AI specification${specifications.length !== 1 ? 's' : ''}`}
        />

        <div className={styles.content}>
          {filteredSpecifications.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No AI specifications found.</p>
              <p className={styles.emptySubtext}>
                AI specifications are automatically generated when multiple users review the same product.
              </p>
            </div>
          ) : (
            <div className={styles.specificationsList}>
              {filteredSpecifications.map((spec: any) => (
                <div key={spec.id} className={styles.aiSpecWrapper}>
                  <SpecificationRow
                    specification={spec}
                    onEdit={handleEdit}
                  />
                  <div className={styles.aiIndicator}>
                    <span className={styles.aiTag}>AI Generated</span>
                    <span className={styles.aiModel}>AI Synthesized</span>
                    <span className={styles.aiConfidence}>
                      Generated Specification
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>
    </ErrorBoundary>
  )
}
