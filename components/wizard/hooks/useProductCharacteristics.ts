'use client'

import React, { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

interface ProductCharacteristicsFormData {
  grind_id: number | null
  experience_level_id: number | null
  nicotine_level_id: number | null
  moisture_level_id: number | null
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
}

/**
 * Custom hook for product characteristics form logic
 */
export const useProductCharacteristics = () => {
  const { watch, setValue, register } = useFormContext<ProductCharacteristicsFormData>()
  
  const formValues = watch()
  const {
    grind_id: grindId,
    experience_level_id: experienceLevelId,
    nicotine_level_id: nicotineLevelId,
    moisture_level_id: moistureLevelId,
    is_fermented: isFermented,
    is_oral_tobacco: isOralTobacco,
    is_artisan: isArtisan
  } = formValues
  
  const isValid = useMemo((): boolean => {
    return Boolean(
      grindId && grindId > 0 &&
      experienceLevelId && experienceLevelId > 0 &&
      nicotineLevelId && nicotineLevelId > 0 &&
      moistureLevelId && moistureLevelId > 0
    )
  }, [grindId, experienceLevelId, nicotineLevelId, moistureLevelId])
  
  const handleGrindChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value
    setValue('grind_id', value ? Number(value) : null, { shouldValidate: true })
  }, [setValue])
  
  const handleExperienceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value
    setValue('experience_level_id', value ? Number(value) : null, { shouldValidate: true })
  }, [setValue])
  
  const handleNicotineLevelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value
    setValue('nicotine_level_id', value ? Number(value) : null, { shouldValidate: true })
  }, [setValue])
  
  const handleMoistureLevelChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value
    setValue('moisture_level_id', value ? Number(value) : null, { shouldValidate: true })
  }, [setValue])
  
  const handleFermentedChange = useCallback((checked: boolean): void => {
    setValue('is_fermented', checked, { shouldValidate: true })
  }, [setValue])
  
  const handleOralTobaccoChange = useCallback((checked: boolean): void => {
    setValue('is_oral_tobacco', checked, { shouldValidate: true })
  }, [setValue])
  
  const handleArtisanChange = useCallback((checked: boolean): void => {
    setValue('is_artisan', checked, { shouldValidate: true })
  }, [setValue])

  return {
    register,
    grindId,
    experienceLevelId,
    nicotineLevelId,
    moistureLevelId,
    isFermented,
    isOralTobacco,
    isArtisan,
    isValid,
    handleGrindChange,
    handleExperienceChange,
    handleNicotineLevelChange,
    handleMoistureLevelChange,
    handleFermentedChange,
    handleOralTobaccoChange,
    handleArtisanChange
  }
}
