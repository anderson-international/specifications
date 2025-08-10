'use client'

import { FilterControls, type FilterConfig } from '@/components/shared/FilterControls'
import ProductRow from '@/components/shared/ProductSelector/ProductRow'
import type { Product } from '@/lib/types/product'
import type { SpecTabId } from './SpecificationsTabNavigation'
import AsyncStateContainer from '@/components/shared/AsyncStateContainer'
import ProductList from '@/components/shared/ProductList'
import CountSummary from '@/components/shared/CountSummary'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'

interface UserProduct extends Product {
  userHasSpec: boolean
  specCount: number
  specification_id?: string
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
  const { user } = useAuth()
  const [localDraftHandles, setLocalDraftHandles] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (activeTab !== 'to-do' || !user?.id) {
      setLocalDraftHandles(new Set())
      return
    }
    const handles = new Set<string>()
    try {
      for (const p of filteredProducts) {
        const handle = (p as { handle?: string }).handle
        if (!handle) continue
        const key = `wizard-draft-${user.id}-${handle}`
        if (typeof window !== 'undefined' && window.localStorage.getItem(key)) {
          handles.add(handle)
        }
      }
    } catch {
      void 0
    }
    setLocalDraftHandles(handles)
  }, [activeTab, filteredProducts, user?.id])
  const loadingMessage = activeTab === 'my-specs' ? 'Loading specifications...' : 'Loading products...'
  const errorMessage = activeTab === 'my-specs' ? 'Error loading specifications:' : 'Error loading products:'
  const emptyMessage: string = activeTab === 'my-specs' ? 'No specifications found.' : 'No products to review yet.'

  return (
    <>
      <FilterControls 
        searchQuery={searchValue}
        onSearchChange={onSearchChange}
        filters={filters}
        onFilterChange={onFilterChange}
        onClearAll={onClearAll}
        showClearAll={showClearAll}
      />
      
      <CountSummary
        count={filteredProducts.length}
        hintMobile={activeTab === 'my-specs' ? 'Tap to edit' : 'Tap to create'}
        hintDesktop={activeTab === 'my-specs' ? 'Click to edit' : 'Click to create'}
      />
      
      <div className={styles.main}>
        <AsyncStateContainer
          loading={loading}
          error={error}
          empty={!loading && filteredProducts.length === 0}
          loadingMessage={loadingMessage}
          errorMessage={errorMessage}
          emptyMessage={emptyMessage}
        >
          <ProductList
            items={filteredProducts}
            getKey={(p: UserProduct) => (activeTab === 'my-specs' ? p.specification_id! : p.id)}
            renderItem={(product: UserProduct) => {
              const specId: string | undefined = product.specification_id
              return (
                <ProductRow
                  product={product}
                  mode="single"
                  userHasSpec={product.userHasSpec}
                  specCount={product.specCount}
                  hasLocalDraft={activeTab === 'to-do' ? localDraftHandles.has((product as { handle?: string }).handle ?? '') : false}
                  onCreateClick={activeTab === 'to-do' ? () => onCreateClick(product.handle) : undefined}
                  onEditClick={specId ? () => onEditClick(specId) : undefined}
                />
              )
            }}
            containerStyle={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
          />
        </AsyncStateContainer>
      </div>
    </>
  )
}
