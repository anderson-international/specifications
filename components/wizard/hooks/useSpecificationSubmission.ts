'use client'

import { useCallback, useState, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { SpecificationFormData } from '@/types'
import { transformFormData, buildApiRequest } from './specification-submission-utils'

interface UseSpecificationSubmissionProps {
  methods: UseFormReturn<WizardFormData>
  userId: string
  initialData?: Record<string, unknown>
  onSubmit: (data: SpecificationFormData) => void
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
      const transformedData = transformFormData(formData)
      const { url: apiUrl, method, body: requestBody } = buildApiRequest(
        transformedData,
        userId,
        initialData?.id as string | number | undefined
      )
      
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const completeSpecification: SpecificationFormData = {
        ...transformedData.specification,
        tasting_note_ids: transformedData.junctionData.tasting_note_ids,
        cure_type_ids: transformedData.junctionData.cure_ids,
        tobacco_type_ids: transformedData.junctionData.tobacco_type_ids,
      }
      await onSubmit(completeSpecification)
    } catch (error) {
      throw new Error(`Failed to submit specification: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [methods, onSubmit, initialData?.id, userId])

  return useMemo(
    () => ({
      isSubmitting,
      handleFormSubmit,
    }),
    [isSubmitting, handleFormSubmit]
  )
}

export default useSpecificationSubmission
