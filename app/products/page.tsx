'use client'

import React, { useCallback } from 'react'
import ProductSelector from '@/components/shared/ProductSelector'
import pageTitleStyles from '@/components/shared/PageTitle/PageTitle.module.css'
import containerStyles from '@/components/shared/PageContainer/PageContainer.module.css'

const EMPTY_SELECTION: string[] = []

export default function ProductsPage(): JSX.Element {
  const handleProductSelection = useCallback((productIds: string[]): void => {
    alert(`Selected ${productIds.length} products: ${productIds.join(', ')}`)
  }, [])

  return (
    <div className={containerStyles.pageContainer}>
      <div className={pageTitleStyles.pageHeader}>
        <h1 className={pageTitleStyles.pageTitle}>Products</h1>
      </div>

      <ProductSelector
        mode="multi"
        onSelectionChange={handleProductSelection}
        initialSelection={EMPTY_SELECTION}
      />
    </div>
  )
}
