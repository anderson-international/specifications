'use client'

import { FilterControls, type FilterConfig } from '@/components/shared/FilterControls'
import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'
import { useState } from 'react'
import styles from '../specifications/specifications.module.css'
import type { Specification } from '@/types/specification'
import AsyncStateContainer from '@/components/shared/AsyncStateContainer'
import ProductList from '@/components/shared/ProductList'
import CountSummary from '@/components/shared/CountSummary'

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

  const showClearAll: boolean = searchValue.length > 0

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
      
      <CountSummary count={aiSpecs.length} />
      
      <div className={styles.main}>
        <AsyncStateContainer
          loading={loading}
          error={error}
          empty={!loading && aiSpecs.length === 0}
          loadingMessage={loadingMessage}
          errorMessage={errorMessage}
          emptyMessage={emptyMessage}
        >
          <ProductList
            items={aiSpecs}
            getKey={(spec: Specification) => spec.id}
            renderItem={(spec: Specification) => (
              <div>
                {spec.product?.title}
              </div>
            )}
            containerStyle={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          />
        </AsyncStateContainer>
      </div>
    </div>
  )
}
