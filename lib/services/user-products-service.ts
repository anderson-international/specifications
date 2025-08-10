import { SpecificationReadRepository } from '@/lib/repositories/specification-read-repository'
import { productCache } from '@/lib/cache'
import { type Product } from '@/lib/types/product'
import { getAllSpecCountsMap } from '@/lib/shopify/database'

export type UserProduct = Product & {
  userHasSpec: boolean
  specCount: number
  specification_id?: string
  lastModified?: string
}

export class UserProductsService {
  static async getUserProducts(userId: string, userHasSpec: boolean): Promise<UserProduct[]> {
    const cachedProducts = await productCache.getAllProducts()
    const specCountsMap: Map<string, number> = await getAllSpecCountsMap()

    const allProducts: Product[] = cachedProducts.map(p => ({
      ...p,
      spec_count_total: specCountsMap.get(p.handle) ?? 0,
    }))

    const userSpecs = await SpecificationReadRepository.findMany({ userId })
    const handles: Set<string> = new Set(userSpecs.map(s => s.shopify_handle))

    const specIdMap = new Map<string, string>(userSpecs.map(s => [s.shopify_handle, s.id.toString()]))

    const latestUpdatedByHandle = new Map<string, Date>()
    for (const spec of userSpecs) {
      const current = latestUpdatedByHandle.get(spec.shopify_handle)
      if (!current || (spec.updated_at && spec.updated_at > current)) {
        latestUpdatedByHandle.set(spec.shopify_handle, spec.updated_at as Date)
      }
    }

    const lastModifiedMap: Map<string, string> = new Map<string, string>(
      Array.from(latestUpdatedByHandle.entries()).map(([h, d]) => [h, d.toISOString()])
    )

    const filtered: Product[] = allProducts.filter(p => handles.has(p.handle) === userHasSpec)

    const augmented: UserProduct[] = filtered.map(p => ({
      ...p,
      userHasSpec,
      specCount: p.spec_count_total,
      specification_id: specIdMap.get(p.handle),
      lastModified: userHasSpec ? lastModifiedMap.get(p.handle) : undefined,
    }))

    if (userHasSpec) {
      augmented.sort((a, b) => {
        const at = a.lastModified ? Date.parse(a.lastModified) : 0
        const bt = b.lastModified ? Date.parse(b.lastModified) : 0
        if (bt !== at) return bt - at
        const t = a.title.localeCompare(b.title)
        return t !== 0 ? t : a.brand.localeCompare(b.brand)
      })
    } else {
      augmented.sort((a, b) => {
        const t = a.title.localeCompare(b.title)
        return t !== 0 ? t : a.brand.localeCompare(b.brand)
      })
    }

    return augmented
  }
}
