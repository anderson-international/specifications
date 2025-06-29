// Shopify Products Service

import { getShopifyClient } from '../client';
import { Product, ShopifyProduct, ShopifyProductsResponse, ShopifyMetafieldEdge } from '../types';
import { PRODUCTS_QUERY, SINGLE_PRODUCT_QUERY } from '../queries';
import { hydrateSpecCounts, hydrateSpecCountSingle } from '../database';

export class ShopifyProductService {
  private client = getShopifyClient();

  // Fetch all products from Shopify with spec counts (memory-optimized chunked processing)
  async fetchAllProducts(first: number = 250): Promise<Product[]> {
    const allProducts: Product[] = [];
    let hasNextPage = true;
    let cursor: string | undefined;
    let totalFetched = 0;

    while (hasNextPage) {
      try {
        const response = await this.client.query<ShopifyProductsResponse>(
          PRODUCTS_QUERY,
          {
            first,
            after: cursor,
          }
        );

        const products = response.products.edges.map(edge => this.transformShopifyProduct(edge.node));
        
        // Memory optimization: hydrate spec counts per chunk instead of accumulating all
        const productsWithSpecCounts = await hydrateSpecCounts(products);
        allProducts.push(...productsWithSpecCounts);
        
        totalFetched += products.length;

        // Update pagination
        hasNextPage = response.products.pageInfo.hasNextPage;
        cursor = response.products.pageInfo.endCursor;

        console.log(`Processed chunk: ${products.length} products (Total: ${totalFetched})`);
      } catch (error) {
        console.error('Error fetching Shopify products:', error);
        throw new Error(`Failed to fetch products from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`Successfully fetched ${allProducts.length} products from Shopify with spec counts`);
    return allProducts;
  }

  // Fetch single product by handle with spec count
  async fetchProductByHandle(handle: string): Promise<Product | null> {
    try {
      const response = await this.client.query<{ productByHandle: ShopifyProduct | null }>(
        SINGLE_PRODUCT_QUERY,
        { handle }
      );

      if (!response.productByHandle) {
        return null;
      }

      const product = this.transformShopifyProduct(response.productByHandle);
      const specCount = await hydrateSpecCountSingle(product.handle);
      return { ...product, spec_count_total: specCount };
    } catch (error) {
      console.error(`Error fetching product by handle (${handle}):`, error);
      throw new Error(`Failed to fetch product ${handle} from Shopify: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Transform Shopify product to internal format
  private transformShopifyProduct(shopifyProduct: ShopifyProduct): Product {
    // CRITICAL: Ensure handle is always present (fail-fast)
    if (!shopifyProduct.handle) {
      throw new Error(`CRITICAL: Shopify product missing required handle field: ${JSON.stringify(shopifyProduct)}`);
    }

    // Extract brand from custom.brands metafield, fallback to vendor
    let brand = shopifyProduct.vendor || 'Unknown';
    const brandsMetafield = shopifyProduct.metafields?.edges?.find(
      edge => edge.node.key === 'brands'
    );
    if (brandsMetafield?.node.value) {
      try {
        // Handle list.single_line_text_field format (JSON array)
        const brandArray = JSON.parse(brandsMetafield.node.value);
        if (Array.isArray(brandArray) && brandArray.length > 0) {
          brand = brandArray[0];
        }
      } catch {
        // If not JSON, use as string directly
        brand = brandsMetafield.node.value;
      }
    }

    return {
      id: shopifyProduct.handle, // Use handle as ID for consistency
      handle: shopifyProduct.handle,
      title: shopifyProduct.title || 'Untitled Product',
      brand,
      image_url: shopifyProduct.featuredImage?.url || null,
      spec_count_total: 0, // Will be hydrated from database
    };
  }
}
