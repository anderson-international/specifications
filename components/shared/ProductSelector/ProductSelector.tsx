'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { FilterControls } from '@/components/shared/FilterControls'
import ProductRow from './ProductRow'
import SelectedProductsModal from './SelectedProductsModal'
import { useProductSelector } from './useProductSelector'
import { createFilterConfig, shouldShowClearAll } from './product-selector-ui-utils'
import type { ProductSelectorProps } from './product-selector-interfaces'
import styles from './ProductSelector.module.css'

const ProductSelector = ({
  mode,
  onSelectionChange,
  initialSelection = [],
  title = 'Select Products',
  searchPlaceholder = 'Search products...',
  disabled = false,
  products,
}: ProductSelectorProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    filteredProducts,
    selectedProducts,
    selectedProductIds,
    searchTerm,
    selectedBrand,
    isLoading,
    error,
    setSearchTerm,
    setSelectedBrand,
    handleProductSelect,
    handleClearFilters,
    handleRemoveProduct,
    handleClearAll,
    handleConfirmSelection,
    brandOptions,
  } = useProductSelector({ mode, initialSelection, onSelectionChange, products })

  const handleOpenModal = useCallback(() => setIsModalOpen(true), [])
  const handleCloseModal = useCallback(() => setIsModalOpen(false), [])

  const handleModalConfirm = useCallback(() => {
    handleConfirmSelection()
    setIsModalOpen(false)
  }, [handleConfirmSelection])

  // Wrap state setters in useCallback for performance
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value)
    },
    [setSearchTerm]
  )

  const handleBrandChange = useCallback(
    (value: string) => {
      setSelectedBrand(value)
    },
    [setSelectedBrand]
  )

  const handleFilterChange = useCallback(
    (id: string, value: string) => {
      if (id === 'brand') handleBrandChange(value)
    },
    [handleBrandChange]
  )

  // Memoize utility function calls
  const filterConfig = useMemo(
    () => createFilterConfig(selectedBrand, brandOptions),
    [selectedBrand, brandOptions]
  )

  const showClearAll = useMemo(
    () => shouldShowClearAll(searchTerm, selectedBrand),
    [searchTerm, selectedBrand]
  )

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error loading products: {error}</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {mode === 'multi' && selectedProducts.length > 0 && (
          <button
            type="button"
            className={styles.selectedBadge}
            onClick={handleOpenModal}
            aria-label={`View ${selectedProducts.length} selected products`}
          >
            {selectedProducts.length} selected
          </button>
        )}
      </div>

      <FilterControls
        searchQuery={searchTerm}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearFilters}
        showClearAll={showClearAll}
        disabled={disabled}
      />

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <div className={styles.loadingText}>Loading products...</div>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>No products found matching your criteria.</div>
      ) : (
        <div className={styles.productList}>
          {filteredProducts.map((product) => {
            // Fail fast: product.handle must exist (no fallback data)
            if (!product.handle) {
              throw new Error(`Product missing required handle: ${JSON.stringify(product)}`)
            }

            return (
              <ProductRow
                key={product.handle}
                product={product}
                isSelected={selectedProductIds.includes(product.id)}
                onSelect={handleProductSelect}
                disabled={disabled}
                mode={mode}
              />
            )
          })}
        </div>
      )}

      {mode === 'multi' && selectedProducts.length > 0 && (
        <button
          type="button"
          className={styles.nextButton}
          onClick={handleConfirmSelection}
          disabled={disabled}
        >
          Next ({selectedProducts.length} selected)
        </button>
      )}

      <SelectedProductsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedProducts={selectedProducts}
        onRemoveProduct={handleRemoveProduct}
        onClearAll={handleClearAll}
        onConfirm={handleModalConfirm}
      />
    </div>
  )
}

export default React.memo(ProductSelector)
