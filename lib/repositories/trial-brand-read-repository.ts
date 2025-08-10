import { prisma } from '@/lib/prisma'

export class TrialBrandReadRepository {
  static async findMany(): Promise<Array<{ id: bigint; name: string }>> {
    return prisma.trial_product_brands.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
  }
}
