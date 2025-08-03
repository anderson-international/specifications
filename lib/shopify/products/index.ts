

import { getShopifyClient } from '../client'
import { Product, ShopifyProductsResponse } from '../types'
import { PRODUCTS_QUERY } from '../queries'
import { transformShopifyProduct } from './transformer'

export class ShopifyProductService {
  private client = getShopifyClient()
  async fetchAllProducts(first: number = 250): Promise<Product[]> {
    try {
      const allProducts: Product[] = []
      let hasNextPage = true
      let cursor: string | undefined

      while (hasNextPage) {
        const response = await this.client.query<ShopifyProductsResponse>(PRODUCTS_QUERY, {
          first,
          after: cursor,
        })
        const products = response.products.edges.map((edge) => {
          const product = transformShopifyProduct(edge.node)
          return {
            ...product,
            spec_count_total: 0
          }
        })

        allProducts.push(...products)
        hasNextPage = response.products.pageInfo.hasNextPage
        cursor = response.products.pageInfo.endCursor
      }

      return allProducts
    } catch (error) {
      throw new Error(
        `Failed to fetch products from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

}
