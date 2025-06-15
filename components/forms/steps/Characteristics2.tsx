'use client'

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Characteristics2 as Characteristics2Type, characteristics2Schema } from '@/lib/schemas/specification'
import { CureTypeSelector } from './CureTypeSelector'
import { GrindSelector } from './GrindSelector'
import { BooleanCharacteristics } from './BooleanCharacteristics'
import styles from './Characteristics2.module.css'

interface Characteristics2Props {
  initialData?: Partial<Characteristics2Type>
  onNext: (data: Characteristics2Type) => void
  onPrev: () => void
}

export function Characteristics2({
  initialData,
  onNext,
  onPrev
}: Characteristics2Props): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<Characteristics2Type>({
    resolver: zodResolver(characteristics2Schema),
    defaultValues: initialData
  })

  const watchedCures = watch('cures') || []

  const handleCureToggle = useCallback((cure: string): void => {
    const current = watchedCures
    const updated = current.includes(cure)
      ? current.filter(c => c !== cure)
      : [...current, cure]
    setValue('cures', updated)
  }, [watchedCures, setValue])

  const onSubmit = useCallback((data: Characteristics2Type): void => {
    onNext(data)
  }, [onNext])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <CureTypeSelector
        selectedCures={watchedCures}
        onCureToggle={handleCureToggle}
        error={errors.cures?.message}
      />

      <GrindSelector
        register={register}
        error={errors.grind?.message}
      />

      <BooleanCharacteristics
        register={register}
      />

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          type="button"
          onClick={onPrev}
          className={styles.prevButton}
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={styles.nextButton}
        >
          Continue
        </button>
      </div>
    </form>
  )
}
