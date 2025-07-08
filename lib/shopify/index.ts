// Shopify Products Service Entry Point

import { ShopifyProductService } from './products'

// Singleton instance
let productService: ShopifyProductService | null = null

export function getShopifyProductService(): ShopifyProductService {
  if (!productService) {
    productService = new ShopifyProductService()
  }
  return productService
}

// Re-export types for convenience
export type { Product } from './types'
export { ShopifyProductService } from './products'
