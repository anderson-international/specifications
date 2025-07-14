'use client'

import { useCallback, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { Specification } from '@/lib/schemas/specification'

interface UseSpecificationSubmissionProps {
  methods: UseFormReturn<WizardFormData>
  userId: string
  initialData?: Record<string, unknown>
  onSubmit: (data: Specification) => void
}

interface UseSpecificationSubmissionReturn {
  isSubmitting: boolean
  handleFormSubmit: () => Promise<void>
}

const useSpecificationSubmission = ({
  onSubmit,
  methods,
  userId,
  initialData,
}: UseSpecificationSubmissionProps): UseSpecificationSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)



  const handleFormSubmit = useCallback(async (): Promise<void> => {
    setIsSubmitting(true)

    try {
      const formData = methods.getValues()
      
      // Transform form data to match API's expected format
      const { tasting_note_ids, cure_type_ids, tobacco_type_ids, ...coreData } = formData
      
      const specification = {
        ...coreData,
        // Ensure all required fields are present
        created_at: new Date(),
        updated_at: new Date(),
      }
      
      const junctionData = {
        tasting_note_ids: tasting_note_ids || [],
        cure_ids: cure_type_ids || [],
        tobacco_type_ids: tobacco_type_ids || [],
      }

      // Determine if this is edit mode (has existing ID) or create mode
      const specificationId = initialData?.id
      const isEditMode = Boolean(specificationId)
      
      // Submit to appropriate API endpoint based on mode
      const apiUrl = isEditMode 
        ? `/api/specifications/${specificationId}?userId=${userId}`
        : '/api/specifications'
      
      const requestBody = isEditMode
        ? specification  // Edit mode: send specification data directly
        : { specification, junctionData }  // Create mode: send wrapped format
      
      const response = await fetch(apiUrl, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      // Call success callback with complete specification data
      const completeSpecification: Specification = {
        ...specification,
        tasting_note_ids,
        cure_type_ids,
        tobacco_type_ids,
      }
      await onSubmit(completeSpecification)
    } catch (error) {
      throw new Error(`Failed to submit specification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [methods, onSubmit, initialData?.id, userId])

  return {
    isSubmitting,
    handleFormSubmit,
  }
}

export default useSpecificationSubmission
