import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createApiError, withErrorHandling } from '@/lib/api/utils'
import { EnumTableNameSchema, type ValidatedEnumTableName } from '@/lib/validations/enums'
import { getEnumTable } from '@/types/enum'
import { checkEnumReferences } from '@/lib/api/enumUtils'

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
        validationErrors: tableResult.error.issues,
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
      where: { id: enumId },
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
      where: { id: enumId },
    })

    return createApiResponse(null, 'Enum value deleted successfully')
  })
}

