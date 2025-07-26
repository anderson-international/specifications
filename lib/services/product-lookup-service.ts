import { redisProductCache } from '@/lib/cache/redis-product-cache'
import { Product } from '@/lib/types/product'

interface SpecificationWithProduct {
  id: number
  shopify_handle: string
  product?: Product | null
}

export class ProductLookupService {
  static async populateProductsInSpecs<T extends SpecificationWithProduct>(
    specifications: T[]
  ): Promise<T[]> {
    if (specifications.length === 0) {
      return specifications
    }

    try {
      const handles = [...new Set(specifications.map(spec => spec.shopify_handle))]
      
      const products = await redisProductCache.getProductsByHandles(handles)
      
      const productMap = new Map<string, Product>()
      for (const product of products) {
        if (product && product.handle) {
          productMap.set(product.handle, product)
        }
      }
      
      const missingProducts: string[] = []
      
      const populatedSpecs = specifications.map(spec => {
        const product = productMap.get(spec.shopify_handle)
        if (!product) {
          missingProducts.push(spec.shopify_handle)
          return { ...spec, product: null }
        }
        return { ...spec, product }
      })
      
      if (missingProducts.length > 0) {
        throw new Error(
          `Data integrity violation: Specifications reference non-existent products. ` +
          `Missing product handles: ${missingProducts.join(', ')}. ` +
          `This indicates either: (1) Product cache is stale/incomplete, ` +
          `(2) Specification shopify_handle values are invalid, or ` +
          `(3) Products were deleted from Shopify but specifications still reference them.`
        )
      }
      
      return populatedSpecs
    } catch (error) {
      throw new Error(`Product lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  static async populateProductInSpec<T extends SpecificationWithProduct>(
    specification: T
  ): Promise<T> {
    try {
      const product = await redisProductCache.getProductByHandle(specification.shopify_handle)
      return {
        ...specification,
        product
      }
    } catch (error) {
      throw new Error(`Product lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
