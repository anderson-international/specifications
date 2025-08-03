

import { prisma } from '@/lib/prisma'
export async function getAllSpecCountsMap(): Promise<Map<string, number>> {
  try {
    const counts = await prisma.specifications.groupBy({
      by: ["shopify_handle"],
      _count: { id: true }
    })
    
    return new Map(counts.map(item => [item.shopify_handle, item._count.id]))
  } catch (error) {
    throw new Error(`Failed to fetch spec counts map: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
