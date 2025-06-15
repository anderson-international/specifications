'use client'

import { useCallback } from 'react'
import styles from './SpecificationFilters.module.css'

interface SpecificationFiltersProps {
  statusFilter: string
  searchQuery: string
  onStatusChange: (status: string) => void
  onSearchChange: (query: string) => void
  totalCount: number
  filteredCount: number
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Specifications' },
  { value: 'draft', label: 'Drafts' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'reviewed', label: 'Reviewed' }
]

export function SpecificationFilters({
  statusFilter,
  searchQuery,
  onStatusChange,
  onSearchChange,
  totalCount,
  filteredCount
}: SpecificationFiltersProps): JSX.Element {
  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    onStatusChange(e.target.value)
  }, [onStatusChange])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    onSearchChange(e.target.value)
  }, [onSearchChange])

  const handleClearSearch = useCallback((): void => {
    onSearchChange('')
  }, [onSearchChange])

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.searchGroup}>
          <div className={styles.searchContainer}>
            <input
              type="search"
              placeholder="Search by product or brand..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.searchInput}
              aria-label="Search specifications"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className={styles.clearButton}
                type="button"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className={styles.statusGroup}>
          <label htmlFor="status-filter" className={styles.label}>
            Filter by Status:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            className={styles.statusSelect}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.summary}>
        <span className={styles.count}>
          {filteredCount === totalCount 
            ? `${totalCount} specification${totalCount !== 1 ? 's' : ''}`
            : `${filteredCount} of ${totalCount} specification${totalCount !== 1 ? 's' : ''}`
          }
        </span>
      </div>
    </div>
  )
}
