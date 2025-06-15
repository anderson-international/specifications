'use client'

import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Characteristics1 as Characteristics1Type, characteristics1Schema } from '@/lib/schemas/specification'
import { ProductTypeSelector } from './ProductTypeSelector'
import { ExperienceLevelSelector } from './ExperienceLevelSelector'
import { TobaccoTypeSelector } from './TobaccoTypeSelector'
import styles from './Characteristics1.module.css'

interface Characteristics1Props {
  initialData?: Partial<Characteristics1Type>
  onNext: (data: Characteristics1Type) => void
  onPrev: () => void
}

export function Characteristics1({
  initialData,
  onNext,
  onPrev
}: Characteristics1Props): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<Characteristics1Type>({
    resolver: zodResolver(characteristics1Schema),
    defaultValues: initialData
  })

  const watchedTobaccoTypes = watch('tobaccoTypes') || []

  const handleTobaccoTypeToggle = useCallback((type: string): void => {
    const current = watchedTobaccoTypes
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type]
    setValue('tobaccoTypes', updated)
  }, [watchedTobaccoTypes, setValue])

  const onSubmit = useCallback((data: Characteristics1Type): void => {
    onNext(data)
  }, [onNext])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <ProductTypeSelector
        register={register}
        error={errors.productType?.message}
      />

      <ExperienceLevelSelector
        register={register}
        error={errors.experienceLevel?.message}
      />

      <TobaccoTypeSelector
        selectedTypes={watchedTobaccoTypes}
        onTypeToggle={handleTobaccoTypeToggle}
        error={errors.tobaccoTypes?.message}
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
