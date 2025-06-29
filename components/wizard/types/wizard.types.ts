/**
 * Shared type definitions for the specification wizard
 * Centralizes form data interfaces to prevent duplication
 */

import { Specification } from '@/types'
import { UseFormReturn } from 'react-hook-form'

export interface WizardFormData {
  shopify_handle: string | null
  product_brand_id: number | null
  product_type_id: number | null
  grind_id: number | null
  experience_level_id: number | null
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
  nicotine_level_id: number | null
  moisture_level_id: number | null
  tasting_notes: number[]
  cures: number[]
  tobacco_types: number[]
  review: string
  star_rating: number
  rating_boost: number
}

export interface UseSpecificationWizardProps {
  onSubmit: (data: Specification) => void | Promise<void>
  initialData?: Record<string, unknown>
  userId: string
}

export interface UseSpecificationWizardReturn {
  methods: UseFormReturn<WizardFormData>
  activeStep: number
  isSubmitting: boolean
  isSavingDraft: boolean
  handleNext: () => void
  handlePrevious: () => void
  handleStepClick: (stepIndex: number) => void
  handleFormSubmit: (data: WizardFormData) => Promise<void>
  saveDraft: () => Promise<void>
}

export interface UseSubmissionProps {
  onSubmit: (data: Specification) => void | Promise<void>
  methods: UseFormReturn<WizardFormData>
  userId: string
}

export interface UseSpecificationSubmissionReturn {
  isSubmitting: boolean
  isSavingDraft: boolean
  handleFormSubmit: (formData: WizardFormData) => Promise<void>
  saveDraft: () => Promise<void>
}
