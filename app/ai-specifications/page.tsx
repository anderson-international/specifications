'use client'

import { FilterControls, type FilterConfig } from '@/components/shared/FilterControls'
import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'
import { useState } from 'react'
import styles from '../specifications/specifications.module.css'
import type { Specification } from '@/types/specification'

export default function AISpecificationsPage(): JSX.Element {
  const [searchValue, setSearchValue] = useState('')
  const [filters] = useState<FilterConfig[]>([])
  const aiSpecs: Specification[] = []
  const loading = false
  const error: string | null = null
  
  const searchPlaceholder = "Search AI specifications..."
  const emptyMessage = 'No AI specifications found.'
  const loadingMessage = 'Loading AI specifications...'
  const errorMessage = 'Error loading AI specifications:'

  const handleFilterChange = (_id: string, _value: string): void => {
    void _id
    void _value
  }

  const handleClearAll = (): void => {
    setSearchValue('')
  }

  const showClearAll = searchValue.length > 0

  return (
    <div className={containerStyles.pageContainer}>
      <div className={pageTitleStyles.pageHeader}>
        <h1 className={pageTitleStyles.pageTitle}>AI Specs</h1>
      </div>

      <FilterControls 
        searchQuery={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        showClearAll={showClearAll}
      />
      
      <div className={styles.countSummary}>
        <span className={styles.countText}>
          {`${aiSpecs.length} item${aiSpecs.length !== 1 ? 's' : ''}`}
        </span>
      </div>
      
      <div className={styles.main}>
        {error && (
          <div style={{ color: 'var(--color-error)', padding: '1rem', textAlign: 'center' }}>
            <p>{errorMessage} {error}</p>
          </div>
        )}
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <p>{loadingMessage}</p>
          </div>
        ) : aiSpecs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {aiSpecs.map((spec) => (
              <div key={spec.id}>
                {}
                {spec.product?.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
