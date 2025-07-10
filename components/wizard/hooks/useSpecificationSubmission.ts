'use client'

import { useCallback, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { Specification } from '@/lib/schemas/specification'

interface UseSpecificationSubmissionProps {
  onSubmit: (data: Specification) => void
  methods: UseFormReturn<WizardFormData>
  userId: string
}

interface UseSpecificationSubmissionReturn {
  isSubmitting: boolean
  handleFormSubmit: () => Promise<void>
}

const useSpecificationSubmission = ({
  onSubmit,
  methods,
  userId,
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

      // Submit to database via API in expected format
      const response = await fetch('/api/specifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specification, junctionData }),
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
  }, [methods, onSubmit])

  return {
    isSubmitting,
    handleFormSubmit,
  }
}

export default useSpecificationSubmission
