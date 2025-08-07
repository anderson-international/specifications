import React, { useState, useCallback } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'

interface UseWizardErrorHandlingProps {
  handleFormSubmit: (data: WizardFormData) => Promise<void>
  methods: UseFormReturn<WizardFormData>
}

interface UseWizardErrorHandlingReturn {
  submitError: string | null
  setSubmitError: (error: string | null) => void
  handleFormSubmitWithError: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function useWizardErrorHandling({ handleFormSubmit, methods }: UseWizardErrorHandlingProps): UseWizardErrorHandlingReturn {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleFormSubmitWithError = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault()
      try {
        setSubmitError(null)
        await methods.handleSubmit(handleFormSubmit)()
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Failed to submit specification')
      }
    },
    [handleFormSubmit, methods]
  )

  return {
    submitError,
    setSubmitError,
    handleFormSubmitWithError,
  }
}
