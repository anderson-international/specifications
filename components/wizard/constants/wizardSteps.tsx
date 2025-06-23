'use client'

import React from 'react'
import ProductSelection from '../steps/ProductSelection'
import ProductCharacteristics from '../steps/ProductCharacteristics'
import TastingProfile from '../steps/TastingProfile'
import ReviewSubmission from '../steps/ReviewSubmission'

export interface WizardStep {
  id: string
  title: string
  component: (stepNumber: number, totalSteps: number, disabled: boolean) => React.ReactNode
}

export const createWizardSteps = (): WizardStep[] => [
  {
    id: 'product',
    title: 'Product',
    component: (stepNumber, totalSteps, disabled) => (
      <ProductSelection 
        stepNumber={stepNumber} 
        totalSteps={totalSteps} 
        disabled={disabled} 
      />
    )
  },
  {
    id: 'characteristics',
    title: 'Characteristics',
    component: (stepNumber, totalSteps, disabled) => (
      <ProductCharacteristics 
        stepNumber={stepNumber} 
        totalSteps={totalSteps} 
        disabled={disabled} 
      />
    )
  },
  {
    id: 'tasting',
    title: 'Tasting',
    component: (stepNumber, totalSteps, disabled) => (
      <TastingProfile 
        stepNumber={stepNumber} 
        totalSteps={totalSteps} 
        disabled={disabled} 
      />
    )
  },
  {
    id: 'review',
    title: 'Review',
    component: (stepNumber, totalSteps, disabled) => (
      <ReviewSubmission 
        stepNumber={stepNumber} 
        totalSteps={totalSteps} 
        disabled={disabled} 
      />
    )
  }
]
