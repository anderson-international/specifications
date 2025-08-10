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
    const productByHandle = new Map<string, Product>(allProducts.map(p => [p.handle, p]))

    if (userHasSpec) {
      
      const augmented: UserProduct[] = userSpecs
        .map(spec => {
          const p = productByHandle.get(spec.shopify_handle)
          if (!p) return null
          return {
            ...p,
            userHasSpec: true,
            specCount: p.spec_count_total,
            specification_id: spec.id.toString(),
            lastModified: spec.updated_at ? (spec.updated_at as Date).toISOString() : undefined,
          } as UserProduct
        })
        .filter((x): x is UserProduct => x !== null)

      augmented.sort((a, b) => {
        const at = a.lastModified ? Date.parse(a.lastModified) : 0
        const bt = b.lastModified ? Date.parse(b.lastModified) : 0
        if (bt !== at) return bt - at
        const t = a.title.localeCompare(b.title)
        return t !== 0 ? t : a.brand.localeCompare(b.brand)
      })

      return augmented
    }

    
    const handles: Set<string> = new Set(userSpecs.map(s => s.shopify_handle))
    const filtered: Product[] = allProducts.filter(p => !handles.has(p.handle))
    const augmented: UserProduct[] = filtered.map(p => ({
      ...p,
      userHasSpec: false,
      specCount: p.spec_count_total,
      specification_id: undefined,
      lastModified: undefined,
    }))

    augmented.sort((a, b) => {
      const t = a.title.localeCompare(b.title)
      return t !== 0 ? t : a.brand.localeCompare(b.brand)
    })

    return augmented
  }
}
