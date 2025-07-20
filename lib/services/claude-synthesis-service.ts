import { ClaudeAPIService } from './claude-api-service'
import { SynthesisPrompts } from '@/lib/utils/synthesis-prompts'
import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'

export interface SynthesisData {
  review: string
  star_rating: number
  grind_id: number
  nicotine_level_id: number
  moisture_level_id: number
  experience_level_id: number
  is_fermented: boolean
  is_oral_tobacco: boolean
  is_artisan: boolean
  tasting_note_ids: number[]
  cure_ids: number[]
  tobacco_type_ids: number[]
  confidence_level: number
}

export class ClaudeSynthesisService {
  static async synthesizeSpecifications(sources: SpecificationWithRelations[]): Promise<SynthesisData> {
    if (!sources || sources.length === 0) {
      throw new Error('No source specifications provided for synthesis')
    }

    const systemPrompt = SynthesisPrompts.buildSystemPrompt()
    const userPrompt = SynthesisPrompts.buildUserPrompt(sources)

    try {
      const response = await ClaudeAPIService.generateCompletion(systemPrompt, userPrompt, 0.3, 2048)
      
      const synthesisData: SynthesisData = JSON.parse(response)
      
      this.validateSynthesisData(synthesisData)
      
      return synthesisData
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`AI synthesis returned invalid JSON: ${error.message}`)
      }
      throw new Error(`AI synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static validateSynthesisData(data: SynthesisData): void {
    if (!data.review || typeof data.review !== 'string') {
      throw new Error('Invalid synthesis data: review must be a non-empty string')
    }
    if (!Number.isInteger(data.star_rating) || data.star_rating < 1 || data.star_rating > 5) {
      throw new Error('Invalid synthesis data: star_rating must be an integer 1-5')
    }
    if (!Number.isInteger(data.confidence_level) || data.confidence_level < 1 || data.confidence_level > 3) {
      throw new Error('Invalid synthesis data: confidence_level must be an integer 1-3')
    }
  }
}
