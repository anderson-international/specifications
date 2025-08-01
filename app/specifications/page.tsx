'use client'

import React, { useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import SpecificationsList from '@/components/specifications/SpecificationsList'
import SpecificationsTabNavigation, { type SpecTabId } from '@/components/specifications/SpecificationsTabNavigation'
import { FilterControls } from '@/components/shared/FilterControls'
import { useUserProducts } from '@/hooks/useUserProducts'
import { useToDoFilters } from '@/hooks/useToDoFilters'
import ProductRow from '@/components/shared/ProductSelector/ProductRow'
import { useRouter } from 'next/navigation'
import styles from './specifications.module.css'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'
import buttonStyles from '@/components/shared/Button/Button.module.css'
import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'

export default function SpecificationsPage(): JSX.Element {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<SpecTabId>('my-specs')
  
  if (!user?.id) {
    throw new Error('User authentication required for specifications page')
  }
  
  const { products, loading, error } = useUserProducts(user.id, activeTab)
  
  const {
    searchValue,
    setSearchValue,
    filteredProducts,
    filters,
    handleFilterChange,
    handleClearAll,
    showClearAll
  } = useToDoFilters(products, activeTab)

  const handleTabClick = useCallback((tab: SpecTabId): void => {
    setActiveTab(tab)
  }, [])

  const handleCreateClick = useCallback((productId: string): void => {
    router.push(`/create-specification?productId=${encodeURIComponent(productId)}`)
  }, [router])

  const handleEditClick = useCallback((productId: string): void => {
    router.push(`/create-specification?productId=${encodeURIComponent(productId)}`)
  }, [router])

  const tabs = [
    { id: 'my-specs' as const, label: 'My Specs' },
    { id: 'to-do' as const, label: 'To Do' }
  ]

  return (
    <div className={containerStyles.pageContainer}>
      <div className={pageTitleStyles.pageHeader}>
        <h1 className={pageTitleStyles.pageTitle}>My Specs</h1>
        <button
          className={buttonStyles.createButton}
          onClick={() => router.push('/create-specification')}
          type="button"
        >
          New Spec
        </button>
      </div>

      <SpecificationsTabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      
      <div className={styles.tabContent}>
        {activeTab === 'my-specs' ? (
          <SpecificationsList
            config={{
              searchPlaceholder: 'Search by product or brand...',
              emptyStateText: 'No specifications found.',
              navigateTo: 'edit'
            }}
          />
      ) : (
        <>
          <FilterControls 
            searchQuery={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search by product or brand..."
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            showClearAll={showClearAll}
          />
          <div className={styles.main}>
            {error && (
              <div style={{ color: 'var(--color-error)', padding: '1rem', textAlign: 'center' }}>
                <p>Error loading products: {error}</p>
              </div>
            )}
            
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                <p>No products to review yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    mode="single"
                    userHasSpec={product.userHasSpec}
                    specCount={product.specCount}
                    onCreateClick={() => handleCreateClick(product.id)}
                    onEditClick={() => handleEditClick(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      </div>
    </div>
  )
}
