import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createApiError, withErrorHandling } from '@/lib/api/utils'
import { EnumTableNameSchema, type ValidatedEnumTableName } from '@/lib/validations/enums'
import { getEnumTable } from '@/types/enum'

// DELETE /api/enum/[table]/[id] - Delete enum value
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const { table, id } = await params
    
    // Validate table name
    const tableResult = EnumTableNameSchema.safeParse(table)
    if (!tableResult.success) {
      return createApiError('Invalid enum table name', 400, {
        validationErrors: tableResult.error.issues
      })
    }
    
    const tableName: ValidatedEnumTableName = tableResult.data
    const enumId = parseInt(id)
    
    if (isNaN(enumId) || enumId <= 0) {
      return createApiError('Invalid enum ID', 400)
    }
    
    // Get type-safe enum table access
    const enumTable = getEnumTable(prisma, tableName)
    
    // Check if enum value exists
    const enumValue = await enumTable.findUnique({
      where: { id: enumId }
    })
    
    if (!enumValue) {
      return createApiError('Enum value not found', 404)
    }
    
    // Check if enum value is referenced in any specification
    const { isReferenced, count } = await checkEnumReferences(tableName, enumId)
    
    if (isReferenced) {
      return createApiError(
        `Cannot delete enum value: it is referenced in ${count} specification(s)`,
        409
      )
    }
    
    // Delete the enum value
    await enumTable.delete({
      where: { id: enumId }
    })
    
    return createApiResponse(null, 'Enum value deleted successfully')
  })
}

// Helper function to check if enum value is referenced
async function checkEnumReferences(tableName: ValidatedEnumTableName, enumId: number): Promise<{ isReferenced: boolean; count: number }> {
  try {
    // Map enum table names to their corresponding specification field names
    const fieldMappings: Partial<Record<ValidatedEnumTableName, string>> = {
      'enum_product_types': 'product_type_id',
      'enum_product_brands': 'brand_id',
      'enum_experience_levels': 'experience_level_id',
      'enum_tobacco_types': 'tobacco_type_id',
      'enum_cures': 'cure_id',
      'enum_grinds': 'grind_id',
      'enum_tasting_notes': 'tasting_note_id',
      'enum_nicotine_levels': 'nicotine_level_id',
      'enum_moisture_levels': 'moisture_level_id',
      'enum_specification_statuses': 'specification_status_id',
      'enum_snuff_types': 'snuff_type_id',
      'enum_statuses': 'status_id',
      'enum_roles': 'role_id'  // This one might be in users table instead
    }
    
    const fieldName = fieldMappings[tableName]
    
    if (!fieldName) {
      // If no mapping found, assume it's safe to delete
      return { isReferenced: false, count: 0 }
    }
    
    // Special case for roles - check users table
    if (tableName === 'enum_roles') {
      const count = await prisma.users.count({
        where: { role_id: enumId }
      })
      return { isReferenced: count > 0, count }
    }
    
    // For other enum tables, check specifications table
    const count = await prisma.specifications.count({
      where: { [fieldName]: enumId }
    })
    
    return { isReferenced: count > 0, count }
  } catch (error) {
    console.error('Error checking enum references:', error)
    // If we can't check references, err on the side of caution
    return { isReferenced: true, count: 1 }
  }
}
