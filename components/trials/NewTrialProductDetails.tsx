'use client'

import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import WizardStepCard from '@/components/wizard/controls/WizardStepCard'

interface NewTrialProductDetailsProps {
  productNameRegister: UseFormRegisterReturn
  brandIdRegister: UseFormRegisterReturn
  brands: Array<{ id: number; name: string }>
}

const NewTrialProductDetails = ({ productNameRegister, brandIdRegister, brands }: NewTrialProductDetailsProps): JSX.Element => {
  return (
    <WizardStepCard title="Product Details" stepNumber={1} totalSteps={1}>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          <div style={{ marginBottom: 4 }}>Product Name</div>
          <input type="text" {...productNameRegister} />
        </label>
        <label>
          <div style={{ marginBottom: 4 }}>Brand</div>
          <select {...brandIdRegister}>
            <option value={0}>Select brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </WizardStepCard>
  )
}

export default React.memo(NewTrialProductDetails)
