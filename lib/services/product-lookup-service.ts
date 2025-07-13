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
      // Extract unique handles for batch lookup
      const handles = [...new Set(specifications.map(spec => spec.shopify_handle))]
      
      // O(1) batch lookup from Redis hash
      const products = await redisProductCache.getProductsByHandles(handles)
      
      // Create handle-to-product map for efficient assignment
      const productMap = new Map<string, Product>()
      for (const product of products) {
        if (product && product.handle) {
          productMap.set(product.handle, product)
        }
      }
      
      // Populate product data in specifications
      return specifications.map(spec => ({
        ...spec,
        product: productMap.get(spec.shopify_handle) || null
      }))
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
