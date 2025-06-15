'use client'

import React from 'react'
import { useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { SensoryProfile as SensoryProfileType, sensoryProfileSchema } from '@/lib/schemas/specification'
import TastingNoteSelector from './TastingNoteSelector'
import SliderControl from './SliderControl'
import styles from './SensoryProfile.module.css'

interface SensoryProfileProps {
  initialData?: Partial<SensoryProfileType>
  onNext: (data: SensoryProfileType) => void
  onPrev: () => void
}

export function SensoryProfile({
  initialData,
  onNext,
  onPrev
}: SensoryProfileProps): JSX.Element {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<SensoryProfileType>({
    resolver: zodResolver(sensoryProfileSchema),
    mode: 'onChange',
    defaultValues: {
      tastingNotes: [],
      nicotineStrength: 5,
      moistureLevel: 5,
      ...initialData
    }
  })

  const watchedTastingNotes = watch('tastingNotes')
  const watchedNicotineStrength = watch('nicotineStrength')
  const watchedMoistureLevel = watch('moistureLevel')

  // Memoize the current tasting notes array to prevent unnecessary re-renders
  const currentTastingNotes = useMemo(() => {
    return watchedTastingNotes || []
  }, [watchedTastingNotes])

  const handleTastingNoteToggle = useCallback((note: string): void => {
    if (currentTastingNotes.includes(note)) {
      setValue('tastingNotes', currentTastingNotes.filter(n => n !== note))
    } else {
      setValue('tastingNotes', [...currentTastingNotes, note])
    }
  }, [currentTastingNotes, setValue])

  const handleAddCustomNote = useCallback((note: string): void => {
    if (!currentTastingNotes.includes(note)) {
      setValue('tastingNotes', [...currentTastingNotes, note])
    }
  }, [currentTastingNotes, setValue])

  const handleRemoveNote = useCallback((note: string): void => {
    setValue('tastingNotes', currentTastingNotes.filter(n => n !== note))
  }, [currentTastingNotes, setValue])

  const onSubmit = useCallback((data: SensoryProfileType): void => {
    onNext(data)
  }, [onNext])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <TastingNoteSelector
        selectedNotes={currentTastingNotes}
        onToggleNote={handleTastingNoteToggle}
        onAddCustomNote={handleAddCustomNote}
        onRemoveNote={handleRemoveNote}
        error={errors.tastingNotes?.message}
      />

      <SliderControl
        field="nicotineStrength"
        title="Nicotine Strength"
        description="Rate from 1 (very mild) to 10 (very strong)"
        value={watchedNicotineStrength}
        register={register}
        error={errors.nicotineStrength?.message}
      />

      <SliderControl
        field="moistureLevel"
        title="Moisture Level"
        description="Rate from 1 (very dry) to 10 (very moist)"
        value={watchedMoistureLevel}
        register={register}
        error={errors.moistureLevel?.message}
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
