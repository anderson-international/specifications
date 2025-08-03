import { Product, ShopifyProduct } from '../types'

export function transformShopifyProduct(shopifyProduct: ShopifyProduct): Omit<Product, 'spec_count_total'> {
  if (!shopifyProduct.handle) {
    throw new Error(`CRITICAL: Shopify product missing required handle field: ${JSON.stringify(shopifyProduct)}`)
  }
  if (!shopifyProduct.vendor) {
    throw new Error(`Product ${shopifyProduct.handle} missing required vendor field`)
  }
  if (!shopifyProduct.title) {
    throw new Error(`Product ${shopifyProduct.handle} missing required title field`)
  }

  let brand = shopifyProduct.vendor
  const brandsMetafield = shopifyProduct.metafields?.edges?.find(
    (edge) => edge.node.key === 'brands'
  )
  if (brandsMetafield?.node.value) {
    try {
      const brandArray = JSON.parse(brandsMetafield.node.value)
      if (Array.isArray(brandArray) && brandArray.length > 0) {
        brand = brandArray[0]
      }
    } catch {
      brand = brandsMetafield.node.value
    }
  }

  return {
    id: shopifyProduct.handle,
    handle: shopifyProduct.handle,
    title: shopifyProduct.title,
    brand,
    image_url: shopifyProduct.featuredImage?.url ?? '/images/product-placeholder.svg',
  }
}
