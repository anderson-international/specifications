import { type SpecificationWithRelations } from '@/lib/repositories/types/specification-types'

export function buildCharacteristicsTable(spec: SpecificationWithRelations): string {
  let markdown = `| **Characteristics** ||\n`
  markdown += `|:------------------|:------|\n`

  if (spec.spec_enum_grinds?.name) {
    markdown += `| **Grind** | ${spec.spec_enum_grinds.name} |\n`
  }
  if (spec.spec_enum_nicotine?.name) {
    markdown += `| **Nicotine Level** | ${spec.spec_enum_nicotine.name} |\n`
  }
  if (spec.spec_enum_moisture?.name) {
    markdown += `| **Moisture Level** | ${spec.spec_enum_moisture.name} |\n`
  }
  if (spec.spec_enum_experience?.name) {
    markdown += `| **Experience Level** | ${spec.spec_enum_experience.name} |\n`
  }

  const characteristics: string[] = []
  if (spec.is_fermented) characteristics.push('Fermented')
  if (spec.is_oral_tobacco) characteristics.push('Oral Tobacco')
  if (spec.is_artisan) characteristics.push('Artisan')

  if (characteristics.length > 0) {
    markdown += `| **Characteristics** | ${characteristics.join(', ')} |\n`
  }

  return markdown
}
