'use client'

import Link from 'next/link'
import { SpecificationCard } from '@/components/specifications/SpecificationCard'
import { SpecificationFilters } from '@/components/specifications/SpecificationFilters'
import { CollapsibleGroup } from '@/components/specifications/CollapsibleGroup'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useSpecifications } from '@/hooks/useSpecifications'
import { useSpecificationFilters } from '@/hooks/useSpecificationFilters'
import { getStatusTitle } from '@/lib/utils/specificationPageUtils'
import styles from './specifications.module.css'

export default function SpecificationsPage(): JSX.Element {
  const {
    specifications,
    isLoading,
    error,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleRetry
  } = useSpecifications()

  const {
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    filteredSpecs,
    groupedSpecs
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
          <h1 className={styles.title}>My Specifications</h1>
          <Link href="/create-specification" className={styles.createButton}>
            + New Specification
          </Link>
        </div>

        <SpecificationFilters
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
          totalCount={specifications.length}
          filteredCount={filteredSpecs.length}
        />

        <div className={styles.content}>
          {filteredSpecs.length === 0 ? (
            <div className={styles.empty}>
              <p>No specifications found.</p>
              <Link href="/create-specification" className={styles.createButton}>
                Create Your First Specification
              </Link>
            </div>
          ) : (
            <div className={styles.groups}>
              {Object.entries(groupedSpecs).map(([status, specs]) => (
                <CollapsibleGroup
                  key={status}
                  title={getStatusTitle(status)}
                  count={specs.length}
                  isInitiallyExpanded={status === 'draft'}
                >
                  {specs.map(spec => (
                    <SpecificationCard
                      key={spec.id}
                      specification={spec}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </CollapsibleGroup>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}
