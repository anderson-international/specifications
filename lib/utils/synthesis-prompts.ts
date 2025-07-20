import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'
import { SYNTHESIS_SYSTEM_PROMPT } from './synthesis-prompt-templates'

export class SynthesisPrompts {
  static buildSystemPrompt(): string {
    return SYNTHESIS_SYSTEM_PROMPT
  }

  static buildUserPrompt(sources: SpecificationWithRelations[]): string {
    const sourceTexts = sources.map((spec, index) => {
      const tastingNotes = spec.spec_junction_tasting_notes?.map(tn => tn.spec_enum_tasting_notes.id) || []
      const cures = spec.spec_junction_cures?.map(c => c.spec_enum_cures.id) || []
      const tobaccoTypes = spec.spec_junction_tobacco_types?.map(tt => tt.spec_enum_tobacco_types.id) || []

      return `Source ${index + 1}:
Review: "${spec.review || 'No review provided'}"
Rating: ${spec.star_rating}/5
Grind ID: ${spec.grind_id}
Nicotine Level ID: ${spec.nicotine_level_id}
Moisture Level ID: ${spec.moisture_level_id}
Experience Level ID: ${spec.experience_level_id}
Fermented: ${spec.is_fermented}
Oral Tobacco: ${spec.is_oral_tobacco}
Artisan: ${spec.is_artisan}
Tasting Note IDs: [${tastingNotes.join(', ')}]
Cure IDs: [${cures.join(', ')}]
Tobacco Type IDs: [${tobaccoTypes.join(', ')}]`
    }).join('\n\n')

    return `Product: ${sources[0].shopify_handle}
Total specifications to synthesize: ${sources.length}

${sourceTexts}

Synthesize these specifications into a single, comprehensive specification.`
  }
}
