'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import WizardStepCard from '../controls/WizardStepCard'
import SegmentedControl from '../controls/SegmentedControl'
import MultiSelectChips from '../controls/MultiSelectChips'
import ValidationSummary, { ValidationError } from '../controls/ValidationSummary'
import styles from './SensoryProfile.module.css'

interface SensoryProfileProps {
  stepNumber: number
  totalSteps: number
  disabled?: boolean
}

interface SensoryProfileFormData {
  nicotine_level_id: number | null
  moisture_level_id: number | null
  tasting_notes: number[]
}

interface TastingNote {
  id: number
  name: string
}

/**
 * Fourth step of the specification wizard for sensory profile
 */
const SensoryProfile = ({
  stepNumber,
  totalSteps,
  disabled = false
}: SensoryProfileProps): JSX.Element => {
  // Form context
  const { 
    watch, 
    setValue, 
    formState: { errors } 
  } = useFormContext<SensoryProfileFormData>()
  
  // Watch for form value changes
  const nicotineLevelId = watch('nicotine_level_id')
  const moistureLevelId = watch('moisture_level_id')
  
  // Local state
  const [availableTastingNotes, setAvailableTastingNotes] = useState<TastingNote[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Nicotine level options
  const nicotineOptions = useMemo(() => [
    { id: 1, value: 1, label: 'None' },
    { id: 2, value: 2, label: 'Low' },
    { id: 3, value: 3, label: 'Medium' },
    { id: 4, value: 4, label: 'High' }
  ], [])
  
  // Moisture level options
  const moistureOptions = useMemo(() => [
    { id: 1, value: 1, label: 'Dry' },
    { id: 2, value: 2, label: 'Normal' },
    { id: 3, value: 3, label: 'Wet' }
  ], [])

  // This code was removed to fix lint warnings
  
  // Available tasting notes converted to option format for the MultiSelectChips component
  const tastingNoteOptions = useMemo(() => {
    return availableTastingNotes.map(note => ({
      id: note.id,
      value: note.id,
      label: note.name
    }))
  }, [availableTastingNotes])
  
  // Validation errors
  const validationErrors = useMemo((): ValidationError[] => {
    const errorList: ValidationError[] = []
    
    if (errors.nicotine_level_id) {
      errorList.push({
        fieldName: 'nicotine_level_id',
        message: errors.nicotine_level_id.message || 'Please select nicotine level'
      })
    }
    
    if (errors.moisture_level_id) {
      errorList.push({
        fieldName: 'moisture_level_id',
        message: errors.moisture_level_id.message || 'Please select moisture level'
      })
    }
    
    return errorList
  }, [errors])

  // Fetch tasting notes from API
  useEffect(() => {
    const fetchTastingNotes = async (): Promise<void> => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/enum/enum_tasting_notes')
        if (!response.ok) throw new Error('Failed to load tasting notes')
        const data = await response.json()
        setAvailableTastingNotes(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        console.error('Error fetching tasting notes:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTastingNotes()
  }, [])

  // Handle nicotine level change
  const handleNicotineChange = useCallback((value: string | number): void => {
    setValue('nicotine_level_id', Number(value), { shouldValidate: true })
  }, [setValue])
  
  // Handle moisture level change
  const handleMoistureChange = useCallback((value: string | number): void => {
    setValue('moisture_level_id', Number(value), { shouldValidate: true })
  }, [setValue])
  
  // Handle tasting notes change
  const handleTastingNotesChange = useCallback((values: (string | number)[]): void => {
    const selectedIds = values.map(value => typeof value === 'string' ? parseInt(value, 10) : value)
    setValue('tasting_notes', selectedIds, { shouldValidate: true })
  }, [setValue])

  // Check if the step is valid
  const isValid = useMemo((): boolean => {
    return !errors.nicotine_level_id && !errors.moisture_level_id
  }, [errors.nicotine_level_id, errors.moisture_level_id])

  return (
    <WizardStepCard
      title="Sensory Profile"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isValid={isValid}
    >
      <ValidationSummary errors={validationErrors} />
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Nicotine Level</label>
        <SegmentedControl
          options={nicotineOptions}
          value={nicotineLevelId || 0}
          onChange={handleNicotineChange}
          disabled={disabled}
          name="nicotine-level"
          fullWidth
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Moisture Level</label>
        <SegmentedControl
          options={moistureOptions}
          value={moistureLevelId || 0}
          onChange={handleMoistureChange}
          disabled={disabled}
          name="moisture-level"
          fullWidth
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>Tasting Notes</label>
        {error ? (
          <div className={styles.error} role="alert">
            {error}
          </div>
        ) : (
          <div className={styles.tastingNotes}>
            <MultiSelectChips
              options={tastingNoteOptions}
              selectedValues={watch('tasting_notes') || []}
              onChange={handleTastingNotesChange}
              name="tasting-notes"
              placeholder="Search and select tasting notes..."
              disabled={disabled || loading}
            />
            <p className={styles.helpText}>
              Select up to 10 tasting notes that best describe this product
            </p>
          </div>
        )}
      </div>
    </WizardStepCard>
  )
}

// Export with React.memo for performance optimization
export default React.memo(SensoryProfile)
