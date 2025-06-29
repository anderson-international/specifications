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
  
  const createSelectHandler = useCallback(
    (fieldName: keyof ProductCharacteristicsFormData) =>
      (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const value = e.target.value
        setValue(fieldName, value ? Number(value) : null, { shouldValidate: true })
      },
    [setValue]
  )

  const createBooleanHandler = useCallback(
    (fieldName: keyof ProductCharacteristicsFormData) =>
      (checked: boolean): void => {
        setValue(fieldName, checked, { shouldValidate: true })
      },
    [setValue]
  )

  const handleGrindChange = createSelectHandler('grind_id')
  const handleExperienceChange = createSelectHandler('experience_level_id')
  const handleNicotineLevelChange = createSelectHandler('nicotine_level_id')
  const handleMoistureLevelChange = createSelectHandler('moisture_level_id')

  const handleFermentedChange = createBooleanHandler('is_fermented')
  const handleOralTobaccoChange = createBooleanHandler('is_oral_tobacco')
  const handleArtisanChange = createBooleanHandler('is_artisan')

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
