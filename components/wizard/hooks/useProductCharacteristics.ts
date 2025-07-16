'use client'

import { useMemo, useCallback, ChangeEvent } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  ProductCharacteristicsFormData,
  UseProductCharacteristicsReturn,
} from '../types/product-characteristics.types'

export const useProductCharacteristics = (): UseProductCharacteristicsReturn => {
  const { watch, setValue } = useFormContext<ProductCharacteristicsFormData>()

  const {
    grind_id: grindId,
    experience_level_id: experienceLevelId,
    nicotine_level_id: nicotineLevelId,
    moisture_level_id: moistureLevelId,
    is_fermented: isFermented,
    is_oral_tobacco: isOralTobacco,
    is_artisan: isArtisan,
  } = watch()

  const isValid = useMemo<boolean>(
    () => !!(grindId && experienceLevelId && nicotineLevelId && moistureLevelId),
    [grindId, experienceLevelId, nicotineLevelId, moistureLevelId]
  )

  const handleGrindChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      setValue('grind_id', value ? Number(value) : null, { shouldValidate: true })
    },
    [setValue]
  )

  const handleExperienceChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      setValue('experience_level_id', value ? Number(value) : null, { shouldValidate: true })
    },
    [setValue]
  )

  const handleNicotineLevelChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      setValue('nicotine_level_id', value ? Number(value) : null, { shouldValidate: true })
    },
    [setValue]
  )

  const handleMoistureLevelChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      setValue('moisture_level_id', value ? Number(value) : null, { shouldValidate: true })
    },
    [setValue]
  )

  const handleFermentedChange = useCallback(
    (checked: boolean) => {
      setValue('is_fermented', checked, { shouldValidate: true })
    },
    [setValue]
  )

  const handleOralTobaccoChange = useCallback(
    (checked: boolean) => {
      setValue('is_oral_tobacco', checked, { shouldValidate: true })
    },
    [setValue]
  )

  const handleArtisanChange = useCallback(
    (checked: boolean) => {
      setValue('is_artisan', checked, { shouldValidate: true })
    },
    [setValue]
  )

  return useMemo<UseProductCharacteristicsReturn>(
    () => ({
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
      handleArtisanChange,
    }),
    [
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
      handleArtisanChange,
    ]
  )
}
