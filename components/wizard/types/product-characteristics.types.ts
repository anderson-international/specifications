import { ChangeEvent } from 'react'

export interface ProductCharacteristicsFormData {
  grind_id: number | null
  experience_level_id: number | null
  nicotine_level_id: number | null
  moisture_level_id: number | null
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
}

export interface ProductCharacteristicsHandlers {
  handleGrindChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleExperienceChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleNicotineLevelChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleMoistureLevelChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleFermentedChange: (checked: boolean) => void
  handleOralTobaccoChange: (checked: boolean) => void
  handleArtisanChange: (checked: boolean) => void
}

export interface UseProductCharacteristicsReturn {
  grindId: number | null
  experienceLevelId: number | null
  nicotineLevelId: number | null
  moistureLevelId: number | null
  isFermented: boolean
  isOralTobacco: boolean
  isArtisan: boolean
  isValid: boolean
  handleGrindChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleExperienceChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleNicotineLevelChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleMoistureLevelChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleFermentedChange: (checked: boolean) => void
  handleOralTobaccoChange: (checked: boolean) => void
  handleArtisanChange: (checked: boolean) => void
}
