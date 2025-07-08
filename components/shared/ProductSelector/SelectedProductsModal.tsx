'use client'

import React, { useCallback, useEffect } from 'react'
import type { SelectedProductsModalProps } from './product-selector-interfaces'
import styles from './SelectedProductsModal.module.css'

const SelectedProductsModal = ({
  isOpen,
  onClose,
  selectedProducts,
  onRemoveProduct,
  onClearAll,
  onConfirm,
}: SelectedProductsModalProps): JSX.Element | null => {
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      onRemoveProduct(productId)
    },
    [onRemoveProduct]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'hidden'
    }

    return (): void => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscapeKey])

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Selected Products ({selectedProducts.length})</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          {selectedProducts.length === 0 ? (
            <div className={styles.emptyState}>No products selected</div>
          ) : (
            <div className={styles.productList}>
              {selectedProducts.map((product) => (
                <div key={product.id} className={styles.productItem}>
                  <div className={styles.productItemInfo}>
                    <h3 className={styles.productItemTitle}>{product.title}</h3>
                    <p className={styles.productItemBrand}>{product.brand}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveProduct(product.id)}
                    aria-label={`Remove ${product.title}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.button} ${styles.clearButton}`}
            onClick={onClearAll}
            disabled={selectedProducts.length === 0}
          >
            Clear All
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
            disabled={selectedProducts.length === 0}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SelectedProductsModal)
