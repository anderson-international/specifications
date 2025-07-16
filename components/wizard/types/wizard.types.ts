import React from 'react'
import { Specification } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { Product } from '@/lib/types/product'
import { SpecificationEnumData } from '@/types/enum'

export type WizardFormData = Omit<Specification, 'id'>

export interface UseSpecificationWizardProps {
  onSubmit: (data: Specification) => void | Promise<void>
  initialData?: Record<string, unknown>
  userId: string
}

export interface UseSpecificationWizardReturn {
  methods: UseFormReturn<WizardFormData>
  activeStep: number
  completedSteps: Set<number>
  isSubmitting: boolean
  selectedProduct: Product | null
  enumData: SpecificationEnumData | undefined
  enumsLoading: boolean
  filteredProducts: Product[]
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => void
  handlePrevious: () => void
  handleStepClick: (stepIndex: number) => void
  handleFormSubmit: (data: WizardFormData) => Promise<void>
  canNavigateToStep: (stepIndex: number) => boolean
  isEditMode: boolean
}

export interface UseSubmissionProps {
  onSubmit: (data: Specification) => void | Promise<void>
  methods: UseFormReturn<WizardFormData>
  userId: string
}

export interface UseSpecificationSubmissionReturn {
  isSubmitting: boolean
  handleFormSubmit: (formData: WizardFormData) => Promise<void>
}
