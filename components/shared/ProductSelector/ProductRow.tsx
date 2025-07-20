'use client'

import React, { useCallback } from 'react'
import type { ProductRowProps } from './product-selector-interfaces'
import styles from './ProductRow.module.css'

const ProductRow = ({
  product,
  isSelected,
  onSelect,
  disabled = false,
  mode,
}: ProductRowProps): JSX.Element => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onSelect(product)
    }
  }, [disabled, onSelect, product])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleClick()
      }
    },
    [handleClick]
  )

  return (
    <div
      className={`${styles.productRow} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role={mode === 'multi' ? 'checkbox' : 'button'}
      aria-checked={mode === 'multi' ? isSelected : undefined}
      aria-disabled={disabled}
    >
      <div className={styles.productInfo}>
        <h3 className={styles.title}>{product.title}</h3>
      </div>

      {mode === 'multi' && (
        <div className={styles.checkbox}>
          {/* AI_CONTEXT: Intentional no-op onChange for controlled checkbox component */}
          {/* React requires onChange with checked prop, but parent div handles all interaction */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            onClick={() => undefined} // Handled by parent click
            className={styles.checkboxInput}
            tabIndex={-1} // Parent handles keyboard interaction
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(ProductRow)
