'use client'

import { useCallback, useState } from 'react'
import { WizardFormData, UseSubmissionProps, UseSpecificationSubmissionReturn } from '../types/wizard.types'
import { Specification } from '@/types'

export const useSpecificationSubmission = ({ onSubmit, methods, userId }: UseSubmissionProps): UseSpecificationSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false)

  const transformFormData = useCallback((formData: WizardFormData, statusId: number): Specification => ({
    shopify_handle: formData.shopify_handle || '',
    product_brand_id: formData.product_brand_id || 0,
    product_type_id: formData.product_type_id || 0,
    grind_id: formData.grind_id || 0,
    experience_level_id: formData.experience_level_id || 0,
    is_fermented: formData.is_fermented,
    is_oral_tobacco: formData.is_oral_tobacco,
    is_artisan: formData.is_artisan,
    nicotine_level_id: formData.nicotine_level_id || 0,
    moisture_level_id: formData.moisture_level_id || 0,
    tasting_note_ids: formData.tasting_notes,
    cure_type_ids: formData.cures,
    tobacco_type_ids: formData.tobacco_types,
    review_text: formData.review,
    star_rating: formData.star_rating,
    rating_boost: formData.rating_boost,
    status_id: statusId,
    user_id: userId
  }), [userId])

  const handleFormSubmit = useCallback(async (formData: WizardFormData) => {
    setIsSubmitting(true)
    const specificationData = transformFormData(formData, 2) // Published status
    
    try {
      await onSubmit(specificationData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit, transformFormData])

  const saveDraft = useCallback(async () => {
    setIsSavingDraft(true)
    const formData = methods.getValues()
    const draftData = transformFormData(formData, 1) // Draft status

    try {
      await onSubmit(draftData)
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsSavingDraft(false)
    }
  }, [methods, onSubmit, transformFormData])

  return {
    isSubmitting,
    isSavingDraft,
    handleFormSubmit,
    saveDraft
  }
}
