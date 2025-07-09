// ProductSelector event handlers

import React from 'react'
import type { Product } from './product-selector-interfaces'

// Create product selection handler
export const createProductSelectHandler = (
  mode: 'single' | 'multi',
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>,
  onSelectionChange: (productIds: string[]) => void
) => {
  return (product: Product): void => {
    if (mode === 'single') {
      const newIds = [product.id]
      setSelectedProductIds(newIds)
      onSelectionChange(newIds)
    } else {
      setSelectedProductIds((prev) => {
        const isSelected = prev.includes(product.id)
        const newIds = isSelected ? prev.filter((id) => id !== product.id) : [...prev, product.id]
        // Note: onSelectionChange called in useEffect watching selectedProductIds state
        return newIds
      })
    }
  }
}

// Create remove product handler
export const createRemoveProductHandler = (
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return (productId: string): void => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId))
  }
}

// Create clear all handler
export const createClearAllHandler = (
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>
) => {
  return (): void => {
    setSelectedProductIds([])
  }
}

// Create confirm selection handler
export const createConfirmSelectionHandler = (
  selectedProductIds: string[],
  onSelectionChange: (productIds: string[]) => void
) => {
  return (): void => {
    onSelectionChange(selectedProductIds)
  }
}

// Create clear filters handler
export const createClearFiltersHandler = (
  setSearchTerm: (term: string) => void,
  setSelectedBrand: (brand: string) => void
) => {
  return (): void => {
    setSearchTerm('')
    setSelectedBrand('')
  }
}
