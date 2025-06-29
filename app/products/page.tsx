'use client'

import React, { useCallback } from 'react'
import ProductSelector from '@/components/shared/ProductSelector'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import styles from './products.module.css'

// Stable empty array to prevent infinite re-renders
const EMPTY_SELECTION: string[] = []

export default function ProductsPage(): JSX.Element {
  const { stats } = useDashboardStats()

  const handleProductSelection = useCallback((productIds: string[]) => {
    // For testing multi-select: log the selected products
    console.log('Products selected:', productIds)
    alert(`Selected ${productIds.length} products: ${productIds.join(', ')}`)
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
      </header>

      <ProductSelector
        mode="multi"
        onSelectionChange={handleProductSelection}
        initialSelection={EMPTY_SELECTION}
        title="Select Multiple Products"
        searchPlaceholder="Search by product name or brand..."
      />
    </div>
  )
}

