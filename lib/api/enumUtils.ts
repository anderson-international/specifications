import { prisma } from '@/lib/prisma'
import type { ValidatedEnumTableName } from '@/lib/validations/enums'

/**
 * Checks if a specific enum value is currently referenced in the specifications or users table.
 * This is used to prevent deletion of enum values that are in use.
 * @param tableName The validated name of the enum table.
 * @param enumId The ID of the enum value to check.
 * @returns An object indicating if the value is referenced and the count of references.
 */
export async function checkEnumReferences(
  tableName: ValidatedEnumTableName,
  enumId: number
): Promise<{ isReferenced: boolean; count: number }> {
  try {
    // Map enum table names to their corresponding specification field names
    const fieldMappings: Partial<Record<ValidatedEnumTableName, string>> = {
      enum_product_types: 'product_type_id',
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
      enum_roles: 'role_id', // This one might be in users table instead
    }

    const fieldName = fieldMappings[tableName]

    if (!fieldName) {
      // If no mapping found, assume it's safe to delete
      return { isReferenced: false, count: 0 }
    }

    // Special case for roles - check users table
    if (tableName === 'enum_roles') {
      const count = await prisma.users.count({
        where: { role_id: enumId },
      })
      return { isReferenced: count > 0, count }
    }

    // For other enum tables, check specifications table
    const count = await prisma.specifications.count({
      where: { [fieldName]: enumId },
    })

    return { isReferenced: count > 0, count }
  } catch (_error) {
    // If we can't check references, err on the side of caution
    return { isReferenced: true, count: 1 }
  }
}
