/**
 * Shopify GraphQL Client
 * Handles authentication and GraphQL queries to Shopify API
 */

// Legacy types removed - now using updated types from ./types.ts with metafields support

export interface ShopifyErrorResponse {
  errors: Array<{
    message: string
    locations?: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

export class ShopifyGraphQLClient {
  private readonly storeUrl: string
  private readonly accessToken: string
  private readonly apiVersion: string

  constructor() {
    const storeUrl = process.env.SHOPIFY_STORE_URL
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN
    const apiVersion = process.env.SHOPIFY_API_VERSION

    if (!storeUrl || !accessToken || !apiVersion) {
      throw new Error(
        'Missing required Shopify configuration: SHOPIFY_STORE_URL, SHOPIFY_ACCESS_TOKEN, or SHOPIFY_API_VERSION'
      )
    }

    this.storeUrl = storeUrl
    this.accessToken = accessToken
    this.apiVersion = apiVersion
  }

  private getGraphQLEndpoint(): string {
    return `${this.storeUrl}/admin/api/${this.apiVersion}/graphql.json`
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': this.accessToken,
    }
  }

  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const endpoint = this.getGraphQLEndpoint()
    const headers = this.getHeaders()

    const body = JSON.stringify({
      query,
      variables,
    })

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body,
      })

      if (!response.ok) {
        throw new Error(`Shopify API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Check for GraphQL errors
      if (data.errors && data.errors.length > 0) {
        const errorMessages = data.errors
          .map((error: { message: string }) => error.message)
          .join(', ')
        throw new Error(`Shopify GraphQL errors: ${errorMessages}`)
      }

      return data.data as T
    } catch (error) {
      throw new Error(`Failed to execute Shopify GraphQL query: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Singleton instance
let shopifyClient: ShopifyGraphQLClient | null = null

export function getShopifyClient(): ShopifyGraphQLClient {
  if (!shopifyClient) {
    shopifyClient = new ShopifyGraphQLClient()
  }
  return shopifyClient
}
