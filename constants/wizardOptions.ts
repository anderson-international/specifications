// Minimal stub file to resolve TypeScript compilation errors
// This file contains placeholder constants to satisfy imports

export interface MockProduct {
  id: string
  title: string
  handle: string
  brand_id: string
  brand_name: string
  image_url: string
  is_reviewed: boolean
}

export const MOCK_PRODUCTS: MockProduct[] = []

export const EXPERIENCE_LEVELS = [
  { id: 1, label: 'Beginner', value: 1 },
  { id: 2, label: 'Intermediate', value: 2 },
  { id: 3, label: 'Expert', value: 3 }
]

export const NICOTINE_LEVELS = [
  { id: 1, label: 'Low', value: 1 },
  { id: 2, label: 'Medium', value: 2 },
  { id: 3, label: 'High', value: 3 }
]

export const MOISTURE_LEVELS = [
  { id: 1, label: 'Dry', value: 1 },
  { id: 2, label: 'Medium', value: 2 },
  { id: 3, label: 'Moist', value: 3 }
]
