import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export interface Product {
  id: string
  handle: string
  title: string
  brand: string
  image_url: string | null
  is_reviewed: boolean
}

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Get unique products from specifications table
    // Group by shopify_handle and get the first specification for each product
    const rawProducts = await prisma.specifications.findMany({
      select: {
        shopify_handle: true,
        enum_product_brands: {
          select: {
            name: true
          }
        }
      },
      distinct: ['shopify_handle'],
      orderBy: {
        created_at: 'desc'
      }
    })

    // Get specification counts to determine if product is reviewed
    const specificationCounts = await prisma.specifications.groupBy({
      by: ['shopify_handle'],
      _count: {
        id: true
      }
    })

    // Transform data to match frontend interface
    const products: Product[] = rawProducts.map((spec, index) => {
      const specCount = specificationCounts.find(
        s => s.shopify_handle === spec.shopify_handle
      )?._count.id || 0

      // Generate title from handle (replace hyphens with spaces, capitalize)
      const title = spec.shopify_handle
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      return {
        id: `prod-${index + 1}`,
        handle: spec.shopify_handle,
        title: title,
        brand: spec.enum_product_brands.name,
        image_url: null, // No image storage in current schema
        is_reviewed: specCount > 0
      }
    })

    return NextResponse.json({
      products,
      total: products.length,
      reviewed_count: products.filter(p => p.is_reviewed).length
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
