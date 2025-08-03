
export type { Product } from '@/lib/types/product'
export interface ShopifyMetafield {
  key: string
  value: string
}

export interface ShopifyMetafieldEdge {
  node: ShopifyMetafield
}

export interface ShopifyProduct {
  handle: string
  title: string
  productType: string
  vendor: string
  featuredImage?: {
    url: string
  } | null
  metafields: {
    edges: ShopifyMetafieldEdge[]
  }
}

export interface ShopifyProductEdge {
  node: ShopifyProduct
}

export interface ShopifyProductsResponse {
  products: {
    edges: ShopifyProductEdge[]
    pageInfo: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      startCursor: string
      endCursor: string
    }
  }
}
