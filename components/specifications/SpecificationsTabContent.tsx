'use client'

import { FilterControls, type FilterConfig } from '@/components/shared/FilterControls'
import ProductRow from '@/components/shared/ProductSelector/ProductRow'
import type { Product } from '@/lib/types/product'
import type { SpecTabId } from './SpecificationsTabNavigation'

interface UserProduct extends Product {
  userHasSpec: boolean
  specCount: number
}
import styles from '../../app/specifications/specifications.module.css'

interface SpecificationsTabContentProps {
  activeTab: SpecTabId
  searchValue: string
  onSearchChange: (value: string) => void
  filteredProducts: UserProduct[]
  filters: FilterConfig[]
  onFilterChange: (id: string, value: string) => void
  onClearAll: () => void
  showClearAll: boolean
  loading: boolean
  error: string | null
  onCreateClick: (productId: string) => void
  onEditClick: (productId: string) => void
}

export default function SpecificationsTabContent({
  activeTab,
  searchValue,
  onSearchChange,
  filteredProducts,
  filters,
  onFilterChange,
  onClearAll,
  showClearAll,
  loading,
  error,
  onCreateClick,
  onEditClick
}: SpecificationsTabContentProps): JSX.Element {
  const searchPlaceholder = "Search by product or brand..."
  const loadingMessage = activeTab === 'my-specs' ? 'Loading specifications...' : 'Loading products...'
  const errorMessage = activeTab === 'my-specs' ? 'Error loading specifications:' : 'Error loading products:'
  const emptyMessage = activeTab === 'my-specs' ? 'No specifications found.' : 'No products to review yet.'

  return (
    <>
      <FilterControls 
        searchQuery={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearAll={onClearAll}
        showClearAll={showClearAll}
      />
      
      <div className={styles.countSummary}>
        <span className={styles.countText}>
          {`${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''}`}
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
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <p>{emptyMessage}</p>
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
                onCreateClick={activeTab === 'to-do' ? () => onCreateClick(product.id) : undefined}
                onEditClick={() => onEditClick(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
