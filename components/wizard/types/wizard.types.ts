import React from 'react'
import { SpecificationFormData } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { Product } from '@/lib/types/product'
import { SpecificationEnumData } from '@/types/enum'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export type WizardFormData = Omit<SpecificationFormData, 'id'>

export interface UseSpecificationWizardProps {
  onSubmit: (data: SpecificationFormData) => void | Promise<void>
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
  clearDraft: () => void
  forceSave: () => void
  productHandle: string | null
  saveStatus: SaveStatus
  lastError: string | null
  hasSavedOnce: boolean
}

export interface UseSubmissionProps {
  onSubmit: (data: SpecificationFormData) => void | Promise<void>
  methods: UseFormReturn<WizardFormData>
  userId: string
}

export interface UseSpecificationSubmissionReturn {
  isSubmitting: boolean
  handleFormSubmit: (formData: WizardFormData) => Promise<void>
}
