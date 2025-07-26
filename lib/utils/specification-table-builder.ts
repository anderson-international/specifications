import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'

export class SpecificationTableBuilder {

  static buildCharacteristicsTable(spec: SpecificationWithRelations): string {
    let markdown = `| **Characteristics** ||
`
    markdown += `|:------------------|:------|
`
    
    if (spec.spec_enum_grinds?.name) {
      markdown += `| **Grind** | ${spec.spec_enum_grinds.name} |
`
    }
    if (spec.spec_enum_nicotine?.name) {
      markdown += `| **Nicotine Level** | ${spec.spec_enum_nicotine.name} |
`
    }
    if (spec.spec_enum_moisture?.name) {
      markdown += `| **Moisture Level** | ${spec.spec_enum_moisture.name} |
`
    }
    if (spec.spec_enum_experience?.name) {
      markdown += `| **Experience Level** | ${spec.spec_enum_experience.name} |
`
    }
    
    const characteristics = []
    if (spec.is_fermented) characteristics.push('Fermented')
    if (spec.is_oral_tobacco) characteristics.push('Oral Tobacco')
    if (spec.is_artisan) characteristics.push('Artisan')
    
    if (characteristics.length > 0) {
      markdown += `| **Characteristics** | ${characteristics.join(', ')} |
`
    }
    
    return markdown
  }
}
