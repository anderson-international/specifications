'use client'

import React from 'react'
import { Product } from '@/lib/types/product'
import { SpecificationEnumData } from '@/types/enum'
import { SaveStatus } from '../types/wizard.types'
import ProductSelection from '../steps/ProductSelection'
import ProductCharacteristics from '../steps/ProductCharacteristics'
import TastingProfile from '../steps/TastingProfile'
import ReviewSubmission from '../steps/ReviewSubmission'

export interface WizardStep {
  id: string
  title: string
  component: (
    stepNumber: number,
    totalSteps: number,
    disabled: boolean,
    onNext: (e: React.MouseEvent<HTMLButtonElement>) => void,
    selectedProduct?: Product | null,
    enumData?: SpecificationEnumData,
    enumsLoading?: boolean,
    filteredProducts?: Product[],
    saveStatus?: SaveStatus,
    hasSavedOnce?: boolean
  ) => React.ReactNode
}

export const createWizardSteps = (): WizardStep[] => [
  {
    id: 'product',
    title: 'Product',
    component: (stepNumber, totalSteps, disabled, onNext, selectedProduct, enumData, enumsLoading, filteredProducts) => (
      <ProductSelection
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        disabled={disabled}
        onProductSelect={onNext}
        enumData={enumData}
        enumsLoading={enumsLoading}
        filteredProducts={filteredProducts}
      />
    ),
  },
  {
    id: 'characteristics',
    title: 'Characteristics',
    component: (stepNumber, totalSteps, disabled, onNext, selectedProduct, enumData, enumsLoading, filteredProducts, saveStatus, hasSavedOnce) => (
      <ProductCharacteristics
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        disabled={disabled}
        selectedProduct={selectedProduct}
        enumData={enumData}
        enumsLoading={enumsLoading}
        saveStatus={saveStatus}
        hasSavedOnce={hasSavedOnce}
      />
    ),
  },
  {
    id: 'tasting',
    title: 'Tasting',
    component: (stepNumber, totalSteps, disabled, onNext, selectedProduct, enumData, enumsLoading, filteredProducts, saveStatus, hasSavedOnce) => (
      <TastingProfile
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        disabled={disabled}
        selectedProduct={selectedProduct}
        enumData={enumData}
        enumsLoading={enumsLoading}
        saveStatus={saveStatus}
        hasSavedOnce={hasSavedOnce}
      />
    ),
  },
  {
    id: 'review',
    title: 'Review',
    component: (stepNumber, totalSteps, disabled, onNext, selectedProduct, enumData, enumsLoading, filteredProducts, saveStatus, hasSavedOnce) => (
      <ReviewSubmission
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        disabled={disabled}
        selectedProduct={selectedProduct}
        saveStatus={saveStatus}
        hasSavedOnce={hasSavedOnce}
        enumData={enumData}
        enumsLoading={enumsLoading}
      />
    ),
  },
]
