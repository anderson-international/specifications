import { NextRequest, NextResponse } from 'next/server'
import { productCache, RedisProductCache } from '@/lib/cache'
import { getAllSpecCountsMap } from '@/lib/shopify/database'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const isWarming = RedisProductCache.isWarming()

    if (isWarming) {
      return NextResponse.json(
        {
          warming: true,
          message: 'Redis cache is initializing, please wait...',
        },
        { status: 202 }
      )
    }

    const cachedProducts = await productCache.getAllProducts()
    const specCountsMap = await getAllSpecCountsMap()

    const products = cachedProducts.map(product => ({
      ...product,
      spec_count_total: specCountsMap.get(product.handle) ?? 0
    }))
    
    const withSpecs = products.filter((p) => p.spec_count_total > 0).length

    return NextResponse.json({
      products: products,
      total: products.length,
      total_with_specs: withSpecs,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    return NextResponse.json(
      {
        error: 'Redis API operation failed',
        details: errorMessage,
        stack: errorStack,
      },
      { status: 500 }
    )
  }
}
