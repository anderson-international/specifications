// Shopify Database Utilities

import { prisma } from '@/lib/prisma';
import { Product } from './types';

// Get spec count for single product
export async function hydrateSpecCountSingle(handle: string): Promise<number> {
  try {
    const count = await prisma.specifications.count({
      where: {
        shopify_handle: handle
      }
    });
    
    return count;
  } catch (error) {
    console.error(`Error hydrating spec count for handle ${handle}:`, error);
    return 0; // Return 0 rather than failing
  }
}

// Get spec counts for multiple products (batch)
export async function hydrateSpecCounts(products: Product[]): Promise<Product[]> {
  try {
    // Get all handles from products
    const handles = products.map(p => p.handle);
    
    // Query database for spec counts grouped by shopify_handle
    const specCounts = await prisma.specifications.groupBy({
      by: ['shopify_handle'],
      where: {
        shopify_handle: {
          in: handles
        }
      },
      _count: {
        id: true
      }
    });

    // Create a map for fast lookup
    const specCountMap = new Map<string, number>();
    specCounts.forEach(item => {
      specCountMap.set(item.shopify_handle, item._count.id);
    });

    // Hydrate products with spec counts
    return products.map(product => ({
      ...product,
      spec_count_total: specCountMap.get(product.handle) || 0
    }));
    
  } catch (error) {
    console.error('Error hydrating spec counts:', error);
    // Return products with zero counts rather than failing
    return products.map(product => ({
      ...product,
      spec_count_total: 0
    }));
  }
}
