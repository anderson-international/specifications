'use client'

import React from 'react'
import { Product } from '@/lib/types/product'
import { SaveStatus } from '../types/wizard.types'
import SelectedProductSummary from '../steps/SelectedProductSummary'
import DraftSaveIndicator from './DraftSaveIndicator'

interface ProductWithDraftIndicatorProps {
  product: Product
  saveStatus: SaveStatus
  hasSavedOnce: boolean
  isEnabled: boolean
}

const ProductWithDraftIndicator = ({ 
  product, 
  saveStatus, 
  hasSavedOnce, 
  isEnabled 
}: ProductWithDraftIndicatorProps): JSX.Element => {
  return (
    <>
      <SelectedProductSummary product={product} />
      {isEnabled && (
        <DraftSaveIndicator 
          saveStatus={saveStatus} 
          hasSavedOnce={hasSavedOnce} 
        />
      )}
    </>
  )
}

export default ProductWithDraftIndicator
