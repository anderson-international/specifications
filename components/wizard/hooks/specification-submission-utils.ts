import { WizardFormData } from '../types/wizard.types'
import { Specification } from '@/types/specification'

export interface TransformedFormData {
  specification: Omit<Specification, 'tasting_note_ids' | 'cure_type_ids' | 'tobacco_type_ids'>
  junctionData: {
    tasting_note_ids: number[]
    cure_ids: number[]
    tobacco_type_ids: number[]
  }
}

export interface ApiRequestConfig {
  url: string
  method: 'POST' | 'PUT'
  body: object
}

export const transformFormData = (formData: WizardFormData): TransformedFormData => {
  const { tasting_note_ids, cure_type_ids, tobacco_type_ids, ...coreData } = formData

  return {
    specification: { ...coreData, created_at: new Date(), updated_at: new Date() },
    junctionData: {
      tasting_note_ids: tasting_note_ids || [],
      cure_ids: cure_type_ids || [],
      tobacco_type_ids: tobacco_type_ids || [],
    },
  }
}

export const buildApiRequest = (
  transformedData: TransformedFormData,
  userId: string,
  specificationId?: string | number
): ApiRequestConfig => {
  const isEditMode = !!specificationId

  return {
    url: isEditMode
      ? `/api/specifications/${specificationId}?userId=${userId}`
      : '/api/specifications',
    method: isEditMode ? 'PUT' : 'POST',
    body: isEditMode
      ? transformedData.specification
      : { ...transformedData },
  }
}
