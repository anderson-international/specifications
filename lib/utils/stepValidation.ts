import { 
  productSelectionSchema, 
  characteristics1Schema, 
  characteristics2Schema, 
  sensoryProfileSchema, 
  reviewRatingSchema, 
  SpecificationFormData
} from '@/lib/schemas/specification'
import { ZodError } from 'zod'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateStep(stepNumber: number, data: Partial<SpecificationFormData>): ValidationResult {
  try {
    switch (stepNumber) {
      case 1:
        productSelectionSchema.parse(data)
        break
      case 2:
        characteristics1Schema.parse(data)
        break
      case 3:
        characteristics2Schema.parse(data)
        break
      case 4:
        sensoryProfileSchema.parse(data)
        break
      case 5:
        reviewRatingSchema.parse(data)
        break
      default:
        return { isValid: false, errors: ['Invalid step number'] }
    }
    
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(err => {
        const field = err.path.join('.')
        return `${field}: ${err.message}`
      })
      return { isValid: false, errors }
    }
    
    return { isValid: false, errors: ['Validation failed'] }
  }
}

export function getStepRequiredFields(stepNumber: number): string[] {
  switch (stepNumber) {
    case 1:
      return ['productId']
    case 2:
      return ['productType', 'experienceLevel', 'tobaccoTypes']
    case 3:
      return ['cures', 'grind']
    case 4:
      return ['tastingNotes', 'nicotineStrength', 'moistureLevel']
    case 5:
      return ['reviewText', 'overallRating']
    default:
      return []
  }
}

export function getStepProgress(stepNumber: number, data: Partial<SpecificationFormData>): number {
  const requiredFields = getStepRequiredFields(stepNumber)
  if (requiredFields.length === 0) return 100
  
  const completedFields = requiredFields.filter(field => {
    const value = (data as Record<string, unknown>)[field]
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  })
  
  return Math.round((completedFields.length / requiredFields.length) * 100)
}
