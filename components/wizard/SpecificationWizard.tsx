'use client'

import React, { useCallback, useState, useMemo } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Specification } from '@/lib/schemas/specification'
import WizardProgress from './controls/WizardProgress'
import ProductSelection from './steps/ProductSelection'
import Characteristics1 from './steps/Characteristics1'
import Characteristics2 from './steps/Characteristics2'
import SensoryProfile from './steps/SensoryProfile'
import ReviewRating from './steps/ReviewRating'
import styles from './SpecificationWizard.module.css'

// Define initial form values
const defaultValues = {
  // Product selection
  product_id: null,
  shopify_handle: null,
  brand_id: null,
  
  // Characteristics 1
  type_id: null,
  category_id: null,
  has_nicotine: false,
  
  // Characteristics 2
  flavor_complexity_id: null,
  color_intensity_id: null,
  is_natural: false,
  is_custom: false,
  
  // Sensory profile
  nicotine_level_id: null,
  moisture_level_id: null,
  tasting_notes: [],
  
  // Review rating
  rating: 0,
  feedback: ''
}

// Create form validation schema
const wizardSchema = z.object({
  // Product selection
  product_id: z.number().nullable().refine(val => val !== null, {
    message: 'Please select a product'
  }),
  shopify_handle: z.string().nullable(),
  brand_id: z.number().nullable(),
  
  // Characteristics 1
  type_id: z.number().nullable().refine(val => val !== null, {
    message: 'Please select a product type'
  }),
  category_id: z.number().nullable().refine(val => val !== null, {
    message: 'Please select a product category'
  }),
  has_nicotine: z.boolean(),
  
  // Characteristics 2
  flavor_complexity_id: z.number().nullable().refine(val => val !== null, {
    message: 'Please select flavor complexity'
  }),
  color_intensity_id: z.number().nullable().refine(val => val !== null, {
    message: 'Please select color intensity'
  }),
  is_natural: z.boolean(),
  is_custom: z.boolean(),
  
  // Sensory profile
  nicotine_level_id: z.number().nullable().refine(val => val !== null, {
    message: 'Please select nicotine level'
  }),
  moisture_level_id: z.number().nullable().refine(val => val !== null, {
    message: 'Please select moisture level'
  }),
  tasting_notes: z.array(z.number()),
  
  // Review rating
  rating: z.number().min(1, { message: 'Please provide a rating' }),
  feedback: z.string().optional()
})

// Define wizard step interface
interface WizardStep {
  id: string
  title: string
  component: React.ReactNode
}

interface SpecificationWizardProps {
  onSubmit: (data: Specification) => void | Promise<void>
  initialData?: Record<string, unknown>
}

/**
 * Main wizard component for creating a specification
 */
const SpecificationWizard = ({
  onSubmit,
  initialData = {}
}: SpecificationWizardProps): JSX.Element => {
  // Set state variables
  const [activeStep, setActiveStep] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false)

  // Initialize form with react-hook-form
  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      ...initialData
    },
    resolver: zodResolver(wizardSchema)
  })

  // Define wizard steps
  const steps: WizardStep[] = useMemo(() => [
    {
      id: 'product',
      title: 'Product',
      component: <ProductSelection stepNumber={1} totalSteps={5} disabled={isSubmitting} />
    },
    {
      id: 'characteristics1',
      title: 'Features',
      component: <Characteristics1 stepNumber={2} totalSteps={5} disabled={isSubmitting} />
    },
    {
      id: 'characteristics2',
      title: 'Attributes',
      component: <Characteristics2 stepNumber={3} totalSteps={5} disabled={isSubmitting} />
    },
    {
      id: 'sensory',
      title: 'Sensory Profile',
      component: <SensoryProfile stepNumber={4} totalSteps={5} disabled={isSubmitting} />
    },
    {
      id: 'review',
      title: 'Review',
      component: <ReviewRating stepNumber={5} totalSteps={5} disabled={isSubmitting} />
    }
  ], [isSubmitting])

  // Current step
  const currentStep = useMemo(() => steps[activeStep], [steps, activeStep])

  // Define step validation
  const stepValidation = useMemo(() => {
    const { formState: { errors } } = methods

    return {
      product: !errors.product_id && !errors.shopify_handle && !errors.brand_id,
      characteristics1: !errors.type_id && !errors.category_id,
      characteristics2: !errors.flavor_complexity_id && !errors.color_intensity_id,
      sensory: !errors.nicotine_level_id && !errors.moisture_level_id && Array.isArray(methods.getValues('tasting_notes')) && methods.getValues('tasting_notes').length > 0,
      review: !errors.rating
    }
  }, [methods])

  // Check if current step is valid
  const isCurrentStepValid = useMemo(() => {
    const stepId = currentStep.id as keyof typeof stepValidation
    return stepValidation[stepId]
  }, [currentStep, stepValidation])

  // Handle form navigation
  const handleStepClick = useCallback((stepIndex: number): void => {
    setActiveStep(stepIndex)
  }, [])

  // Handle next step
  const handleNext = useCallback((): void => {
    if (activeStep < steps.length - 1) {
      const currentStepId = steps[activeStep].id as keyof typeof stepValidation
      
      if (stepValidation[currentStepId]) {
        setActiveStep((prev) => prev + 1)
      } else {
        // Validate all fields instead of trying to trigger by ID
        methods.trigger()
      }
    }
  }, [activeStep, methods, stepValidation, steps])

  // Handle previous step
  const handlePrevious = useCallback((): void => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1)
    }
  }, [activeStep])

  // Handle form submission
  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const isValid = await methods.trigger() // Trigger form validation
    if (!isValid) {
      setIsSubmitting(false)
      return
    }
    
    const formData = methods.getValues()
    
    // Transform form data to match Specification type
    const specificationData: Specification = {
      // Required fields from the Specification type
      shopify_handle: formData.shopify_handle || '',
      product_brand_id: formData.brand_id || 0,
      product_type_id: formData.type_id || 0,
      experience_level_id: formData.category_id || 0,
      tobacco_type_ids: formData.tasting_notes || [],
      cure_type_ids: [1], // Default to air cured
      grind_id: formData.flavor_complexity_id || 0, // Mapping flavor complexity to grind
      is_fermented: formData.is_natural || false,
      is_oral_tobacco: formData.has_nicotine || false,
      is_artisan: formData.is_custom || false,
      tasting_note_ids: formData.tasting_notes || [],
      nicotine_level_id: formData.nicotine_level_id || 0,
      moisture_level_id: formData.moisture_level_id || 0,
      review_text: formData.feedback || '',
      star_rating: formData.rating || 0,
      status_id: 1, // Default to draft status
      user_id: '00000000-0000-0000-0000-000000000000' // Default user id for development
    }

    try {
      await onSubmit(specificationData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [methods, onSubmit])

  // Handle saving draft
  const saveDraft = useCallback(async (): Promise<void> => {
    setIsSavingDraft(true)
    const formData = methods.getValues()

    // Transform form data to match Specification type, setting status_id to 1 (draft)
    const draftData: Specification = {
      // Required fields from the Specification type
      shopify_handle: formData.shopify_handle || '',
      product_brand_id: formData.brand_id || 0,
      product_type_id: formData.type_id || 0,
      experience_level_id: formData.category_id || 0,
      tobacco_type_ids: formData.tasting_notes || [],
      cure_type_ids: [1],
      grind_id: formData.flavor_complexity_id || 0,
      is_fermented: formData.is_natural || false,
      is_oral_tobacco: formData.has_nicotine || false,
      is_artisan: formData.is_custom || false,
      tasting_note_ids: formData.tasting_notes || [],
      nicotine_level_id: formData.nicotine_level_id || 0,
      moisture_level_id: formData.moisture_level_id || 0,
      review_text: formData.feedback || '',
      star_rating: formData.rating || 0,
      status_id: 1, // Draft status
      user_id: '00000000-0000-0000-0000-000000000000'
    }

    try {
      await onSubmit(draftData)
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setIsSavingDraft(false)
    }
  }, [methods, onSubmit])

  return (
    <FormProvider {...methods}>
      <div className={styles.wizardContainer}>
        <div className={styles.progress}>
          <WizardProgress
            steps={steps.map((s, index) => ({ 
              id: index, // Use index as numerical ID
              title: s.title,
              isValid: stepValidation[s.id as keyof typeof stepValidation] 
            }))}
            currentStepId={activeStep}
            onStepClick={handleStepClick}
            allowNavigation={true}
          />
        </div>
        
        <form onSubmit={handleFormSubmit} className={styles.form}>
          <div className={styles.stepContent}>
            {currentStep.component}
          </div>
          
          <div className={styles.wizardFooter}>
            <div className={styles.wizardButtons}>
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={styles.backButton}
                  disabled={isSubmitting || isSavingDraft}
                >
                  Back
                </button>
              )}
              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.nextButton}
                  disabled={isSubmitting || isSavingDraft || !isCurrentStepValid}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting || isSavingDraft || !isCurrentStepValid}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={saveDraft}
              className={styles.draftButton}
              disabled={isSubmitting || isSavingDraft}
            >
              {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

// Export with React.memo for performance optimization
export default React.memo(SpecificationWizard)
