'use client'

import { useCallback, useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WizardFormData } from '../types/wizard.types'
import { transformFormData, buildApiRequest, type TransformedFormData, type ApiRequestConfig } from './specification-transform-utils'

interface UseSpecificationTransformProps {
  methods: UseFormReturn<WizardFormData>
  userId: string
  initialData?: Record<string, unknown>
}

interface UseSpecificationTransformReturn {
  getTransformedData: () => TransformedFormData
  getApiConfig: (transformedData: TransformedFormData) => ApiRequestConfig
  isFormValid: boolean
}

const useSpecificationTransform = ({
  methods,
  userId,
  initialData,
}: UseSpecificationTransformProps): UseSpecificationTransformReturn => {
  const getTransformedData = useCallback((): TransformedFormData => {
    const formData = methods.getValues()
    return transformFormData(formData)
  }, [methods])

  const getApiConfig = useCallback((transformedData: TransformedFormData): ApiRequestConfig => {
    return buildApiRequest(
      transformedData,
      userId,
      initialData?.id as string | number | undefined
    )
  }, [userId, initialData?.id])

  const isFormValid = useMemo((): boolean => {
    return methods.formState.isValid
  }, [methods.formState.isValid])

  return useMemo(
    () => ({
      getTransformedData,
      getApiConfig,
      isFormValid,
    }),
    [getTransformedData, getApiConfig, isFormValid]
  )
}

export default useSpecificationTransform
