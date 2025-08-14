'use client'

import React from 'react'
import WizardStepCard from '@/components/wizard/controls/WizardStepCard'
import SelectedProductSummary from '@/components/wizard/steps/SelectedProductSummary'
import type { TrialUserProduct } from '@/lib/types/trial'
import type { Product } from '@/lib/types/product'

interface SelectedProductStepProps {
  item: TrialUserProduct | null
}

const SelectedProductStep = ({ item }: SelectedProductStepProps): JSX.Element => {
  const product: Product | null = item
    ? {
        id: String(item.id),
        handle: '',
        title: item.name,
        brand: item.brand?.name ?? '',
        image_url: '',
        spec_count_total: 0,
      }
    : null

  return (
    <WizardStepCard title="Selected Product" stepNumber={1} totalSteps={1}>
      {product ? <SelectedProductSummary product={product} /> : <div>Loading selected product...</div>}
    </WizardStepCard>
  )
}

export default React.memo(SelectedProductStep)
