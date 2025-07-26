'use client'

import React, { useCallback } from 'react'
import { ItemList, useItemListFilters, type ItemListConfig } from '@/components/shared/ItemList'
import ProductRow from './ProductRow'
import { useProductDataSource } from './useProductDataSource'
import type { Product } from './product-selector-interfaces'

interface ProductSelectorAdapterProps {
  mode: 'single' | 'multi'
  searchPlaceholder?: string
  disabled?: boolean
  products?: Product[]
  selectedProductIds: string[]
  onProductSelect: (product: Product) => void
}

const ProductSelectorAdapter: React.FC<ProductSelectorAdapterProps> = ({
  searchPlaceholder = 'Search products...',
  products: externalProducts,
  selectedProductIds,
  onProductSelect,
  disabled = false,
  mode,
}) => {
  const { products, isLoading, error } = useProductDataSource({ externalProducts })

  const {
    searchQuery,
    setSearchQuery,
    filteredItems: filteredProducts,
    filterConfigs,
    setFilter,
    clearAll,
    hasActiveFilters,
  } = useItemListFilters({
    items: products || [],
    searchFields: useCallback((product: Product) => [product.title, product.brand], []),
    getFilterValue: useCallback((product: Product, filterId: string) => {
      if (filterId === 'brand') return product.brand
      return ''
    }, []),
    getAvailableFilterOptions: useCallback((products: Product[], filterId: string) => {
      if (filterId === 'brand') {
        const brands = Array.from(new Set(products.map(p => p.brand)))
        return [
          { value: '', label: 'All Brands' },
          ...brands.map(brand => ({ value: brand, label: brand }))
        ]
      }
      return []
    }, []),
    filterIds: ['brand'],
  })

  const config: ItemListConfig = {
    searchPlaceholder,
    emptyStateText: 'No products found matching your criteria.',
    showCreateButton: false,
  }

  const renderProduct = useCallback((product: Product): JSX.Element => {
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
      />
    )
  }, [selectedProductIds, onProductSelect, disabled, mode])

  const handleRetry = useCallback((): void => {
    window.location.reload()
  }, [])

  return (
    <ItemList
      config={config}
      items={filteredProducts}
      isLoading={isLoading}
      error={error}
      onRetry={handleRetry}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filters={filterConfigs}
      onFilterChange={setFilter}
      onClearAll={clearAll}
      showClearAll={hasActiveFilters}
      renderItem={renderProduct}
      getItemKey={(product: Product) => product.handle}
    />
  )
}

export default React.memo(ProductSelectorAdapter)
