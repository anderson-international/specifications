import { prisma } from '@/lib/prisma'
import type { TrialUserProduct } from '@/lib/types/trial'

async function countTrialsByProductId(ids: number[]): Promise<Map<number, number>> {
  if (ids.length === 0) return new Map()
  const grouped = await prisma.trial_product_reviews.groupBy({
    by: ['trial_product_id'],
    where: { trial_product_id: { in: ids } },
    _count: { _all: true },
  })
  return new Map<number, number>(grouped.map(g => [Number(g.trial_product_id), g._count._all]))
}

export class TrialProductsService {
  static async getUserProducts(userId: string, userHasReview: boolean): Promise<TrialUserProduct[]> {
    if (userHasReview) {
      const reviews = await prisma.trial_product_reviews.findMany({
        where: { user_id: userId },
        include: {
          trial_products: {
            select: {
              id: true,
              name: true,
              trial_product_brands: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { updated_at: 'desc' },
      })

      const ids = Array.from(new Set(reviews.map(r => Number(r.trial_product_id)).filter(Boolean)))
      const countMap = await countTrialsByProductId(ids)

      return reviews.map(r => ({
        id: Number(r.trial_product_id),
        name: r.trial_products?.name ?? '',
        brand: {
          id: Number(r.trial_products?.trial_product_brands?.id ?? 0),
          name: r.trial_products?.trial_product_brands?.name ?? '',
        },
        userReviewId: Number(r.id),
        lastModified: r.updated_at ? (r.updated_at as Date).toISOString() : undefined,
        rating: r.rating,
        totalTrialsCount: countMap.get(Number(r.trial_product_id)) ?? 0,
      }))
    }

    const products = await prisma.trial_products.findMany({
      where: {
        trial_product_reviews: {
          none: { user_id: userId },
        },
      },
      include: {
        trial_product_brands: { select: { id: true, name: true } },
      },
      orderBy: [{ name: 'asc' }, { brand_id: 'asc' }],
    })

    const ids = products.map(p => Number(p.id))
    const countMap = await countTrialsByProductId(ids)

    return products.map(p => ({
      id: Number(p.id),
      name: p.name,
      brand: { id: Number(p.trial_product_brands.id), name: p.trial_product_brands.name },
      totalTrialsCount: countMap.get(Number(p.id)) ?? 0,
    }))
  }
}
