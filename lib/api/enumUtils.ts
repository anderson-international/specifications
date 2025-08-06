import { prisma } from '@/lib/prisma'
import type { ValidatedEnumTableName } from '@/lib/validations/enums'

export async function checkEnumReferences(
  tableName: ValidatedEnumTableName,
  enumId: number
): Promise<{ isReferenced: boolean; count: number }> {
  try {
    const fieldMappings: Partial<Record<ValidatedEnumTableName, string>> = {
      enum_product_brands: 'brand_id',
      enum_experience_levels: 'experience_level_id',
      enum_tobacco_types: 'tobacco_type_id',
      enum_cures: 'cure_id',
      enum_grinds: 'grind_id',
      enum_tasting_notes: 'tasting_note_id',
      enum_nicotine_levels: 'nicotine_level_id',
      enum_moisture_levels: 'moisture_level_id',
      enum_specification_statuses: 'specification_status_id',
      enum_snuff_types: 'snuff_type_id',
      enum_statuses: 'status_id',
      enum_roles: 'role_id',
    }

    const fieldName = fieldMappings[tableName]

    if (!fieldName) {
      return { isReferenced: false, count: 0 }
    }

    if (tableName === 'enum_roles') {
      const count = await prisma.system_users.count({
        where: { role_id: enumId },
      })
      return { isReferenced: count > 0, count }
    }

    const count = await prisma.specifications.count({
      where: { [fieldName]: enumId },
    })

    return { isReferenced: count > 0, count }
  } catch (_error) {
    return { isReferenced: true, count: 1 }
  }
}
