import { prisma } from '@/lib/prisma'
import { SPECIFICATION_INCLUDE } from './includes/specification-include'
import { SpecificationWithRelations } from './types/specification-types'

export class SpecificationReadRepository {
  static async findMany(filters: {
    userId?: string
    status?: string
  }): Promise<SpecificationWithRelations[]> {
    const where = {
      ...(filters.userId && { user_id: filters.userId }),
      ...(filters.status && { spec_enum_statuses: { name: filters.status } }),
    }

    return prisma.specifications.findMany({
      where,
      include: SPECIFICATION_INCLUDE,
      orderBy: { updated_at: 'desc' },
    })
  }

  static async findById(
    id: number,
    userId?: string
  ): Promise<SpecificationWithRelations | null> {
    return prisma.specifications.findFirst({
      where: {
        id,
        ...(userId && { user_id: userId }),
      },
      include: SPECIFICATION_INCLUDE,
    })
  }
}
