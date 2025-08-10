'use client'

import React, { useState, useCallback } from 'react'
import ProductSelectorAdapter from './ProductSelectorAdapter'
import SelectedProductsModal from './SelectedProductsModal'
import { useProductSelector } from './useProductSelector'
import type { ProductSelectorProps } from './product-selector-interfaces'
import styles from './ProductSelector.module.css'

const ProductSelector = ({
  mode,
  onSelectionChange,
  initialSelection = [],
  disabled = false,
  products,
}: ProductSelectorProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    selectedProducts,
    selectedProductIds,
    handleProductSelect,
    handleRemoveProduct,
    handleClearAll,
    handleConfirmSelection,
  } = useProductSelector({ mode, initialSelection, onSelectionChange, products })

  const handleOpenModal = useCallback((): void => setIsModalOpen(true), [])
  const handleCloseModal = useCallback((): void => setIsModalOpen(false), [])

  const handleModalConfirm = useCallback((): void => {
    handleConfirmSelection()
    setIsModalOpen(false)
  }, [handleConfirmSelection])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
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

      <ProductSelectorAdapter
        mode={mode}
        disabled={disabled}
        products={products}
        selectedProductIds={selectedProductIds}
        onProductSelect={handleProductSelect}
      />

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
