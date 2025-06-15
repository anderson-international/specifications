'use client'

import { useCallback } from 'react'
import { ProductSelection } from './steps/ProductSelection'
import { Characteristics1 } from './steps/Characteristics1'
import { Characteristics2 } from './steps/Characteristics2'
import { SensoryProfile } from './steps/SensoryProfile'
import { ReviewRating } from './steps/ReviewRating'
import { useSwipeNavigation } from './hooks/useSwipeNavigation'
import { SpecificationFormData } from '@/lib/schemas/specification'
import styles from './SpecificationWizard.module.css'

interface WizardStepRendererProps {
  currentStep: number
  formData: Partial<SpecificationFormData>
  onStepNext: (stepData: Record<string, any>) => void
  onStepPrev: () => void
  onComplete: (finalStepData: Record<string, any>) => void
  productId?: string
}

export function WizardStepRenderer({
  currentStep,
  formData,
  onStepNext,
  onStepPrev,
  onComplete,
  productId
}: WizardStepRendererProps): JSX.Element {
  const canSwipeLeft = currentStep > 1
  const canSwipeRight = currentStep < 5

  const handleSwipeLeft = useCallback((): void => {
    if (canSwipeRight) {
      // For swipe left (next step), we need to trigger validation through onStepNext
      // We'll pass the current form data to trigger step validation
      onStepNext({})
    }
  }, [canSwipeRight, onStepNext])

  const handleSwipeRight = useCallback((): void => {
    if (canSwipeLeft) {
      onStepPrev()
    }
  }, [canSwipeLeft, onStepPrev])

  const { swipeHandlers, swipeState } = useSwipeNavigation({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50,
    preventScroll: true
  })

  const containerStyle = {
    transform: `translateX(${swipeState.offset}px)`
  }

  const containerClasses = [
    styles.swipeContainer,
    swipeState.isDragging ? styles.dragging : ''
  ].filter(Boolean).join(' ')

  const renderStep = (): JSX.Element => {
    switch (currentStep) {
      case 1:
        return (
          <ProductSelection
            formData={formData}
            onNext={onStepNext}
            onPrev={onStepPrev}
            productId={productId}
          />
        )
      case 2:
        return (
          <Characteristics1
            formData={formData}
            onNext={onStepNext}
            onPrev={onStepPrev}
          />
        )
      case 3:
        return (
          <Characteristics2
            formData={formData}
            onNext={onStepNext}
            onPrev={onStepPrev}
          />
        )
      case 4:
        return (
          <SensoryProfile
            formData={formData}
            onNext={onStepNext}
            onPrev={onStepPrev}
          />
        )
      case 5:
        return (
          <ReviewRating
            formData={formData}
            onComplete={onComplete}
            onPrev={onStepPrev}
          />
        )
      default:
        return <div>Invalid step</div>
    }
  }

  return (
    <div {...swipeHandlers}>
      {/* Swipe hints */}
      <div className={`${styles.swipeHint} ${styles.left} ${canSwipeLeft && swipeState.isDragging ? styles.visible : ''}`}>
        ← Previous
      </div>
      <div className={`${styles.swipeHint} ${styles.right} ${canSwipeRight && swipeState.isDragging ? styles.visible : ''}`}>
        Next →
      </div>

      {/* Swipe indicators */}
      <div className={`${styles.swipeIndicator} ${styles.left} ${canSwipeLeft && swipeState.offset > 20 ? styles.active : ''}`} />
      <div className={`${styles.swipeIndicator} ${styles.right} ${canSwipeRight && swipeState.offset < -20 ? styles.active : ''}`} />

      {/* Step content with swipe animation */}
      <div className={containerClasses} style={containerStyle}>
        {renderStep()}
      </div>
    </div>
  )
}
