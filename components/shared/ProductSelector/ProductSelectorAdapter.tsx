'use client'

import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { ItemList, useItemListFilters, type ItemListConfig } from '@/components/shared/ItemList'
import ProductRow from './ProductRow'
import { useProductDataSource } from './useProductDataSource'
import type { Product } from './product-selector-interfaces'
import { useUserSpecHandles } from './useUserSpecHandles'

interface ProductSelectorAdapterProps {
  mode: 'single' | 'multi'
  disabled?: boolean
  products?: Product[]
  selectedProductIds: string[]
  onProductSelect: (product: Product) => void
}

type ExtendedProduct = Product & { userHasSpec?: boolean }

const ProductSelectorAdapter: React.FC<ProductSelectorAdapterProps> = ({
  products: externalProducts,
  selectedProductIds,
  onProductSelect,
  disabled = false,
  mode,
}) => {
  const { products, isLoading, error } = useProductDataSource({ externalProducts })
  const { doneHandles, statusReady, statusError } = useUserSpecHandles()

  if (!products) {
    throw new Error('Product list is required for ProductSelectorAdapter')
  }

  const annotatedProducts: ExtendedProduct[] = useMemo(() => {
    if (!statusReady) return products as ExtendedProduct[]
    return products.map(p => ({ ...p, userHasSpec: doneHandles.has(p.handle) }))
  }, [products, statusReady, doneHandles])

  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredProducts,
    filterConfigs,
    setFilter,
    clearAll,
    hasActiveFilters,
  } = useItemListFilters<ExtendedProduct>({
    items: annotatedProducts,
    searchFields: useCallback((product: ExtendedProduct) => [product.title, product.brand], []),
    getFilterValue: useCallback((product: ExtendedProduct, filterId: string) => {
      if (filterId === 'brand') return product.brand
      if (filterId === 'status') return product.userHasSpec ? 'done' : 'todo'
      return ''
    }, []),
    getAvailableFilterOptions: useCallback((items: ExtendedProduct[], filterId: string) => {
      if (filterId === 'brand') {
        const brands = Array.from(new Set(items.map(p => p.brand)))
        return [
          { value: '', label: 'Brands' },
          ...brands.map(brand => ({ value: brand, label: brand }))
        ]
      }
      if (filterId === 'status') {
        return [
          { value: 'todo', label: 'To Do' },
          { value: 'done', label: 'Done' },
        ]
      }
      return []
    }, []),
    filterIds: useMemo(() => (statusReady ? ['brand', 'status'] : ['brand']), [statusReady]),
  })

  const defaultStatusApplied = useRef(false)
  useEffect(() => {
    if (!statusReady || defaultStatusApplied.current) return
    const statusEntry = filterConfigs.find(f => f.id === 'status')
    if (!statusEntry) return
    if (!statusEntry.value) {
      setFilter('status', 'todo')
    }
    defaultStatusApplied.current = true
  }, [statusReady, filterConfigs, setFilter])

  const config: ItemListConfig = {
    searchPlaceholder: 'Search by product...',
    emptyStateText: 'No products found matching your criteria.',
    showCreateButton: false,
  }

  const renderProduct = useCallback((product: ExtendedProduct): JSX.Element => {
    if (!product.handle) {
      throw new Error(`Product missing required handle: ${JSON.stringify(product)}`)
    }

    return (
      <ProductRow
        key={product.handle}
        product={product}
        isSelected={selectedProductIds.includes(product.id)}
        onSelect={onProductSelect}
        disabled={disabled}
        mode={mode}
        specCount={product.spec_count_total}
        userHasSpec={product.userHasSpec}
      />
    )
  }, [selectedProductIds, onProductSelect, disabled, mode])

  const handleRetry = useCallback((): void => {
    window.location.reload()
  }, [])

  const handleClearAll = useCallback((): void => {
    clearAll()
    setFilter('status', 'todo')
    defaultStatusApplied.current = true
  }, [clearAll, setFilter])

  return (
    <ItemList
      config={config}
      items={filteredProducts}
      isLoading={isLoading}
      error={error ?? statusError}
      onRetry={handleRetry}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={filterConfigs}
      onFilterChange={setFilter}
      onClearAll={handleClearAll}
      showClearAll={hasActiveFilters}
      renderItem={renderProduct}
      getItemKey={(product: ExtendedProduct) => product.handle}
    />
  )
}

export default React.memo(ProductSelectorAdapter)
