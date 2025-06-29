import { NextRequest, NextResponse } from 'next/server'
import { productCache, RedisProductCache } from '@/lib/cache'
import type { Product } from '@/lib/types/product'

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== API /products called (Redis) ===');
    
    // Check if Redis cache is still warming up
    const isWarming = RedisProductCache.isWarming();
    console.log('Redis cache warming status:', isWarming);
    
    if (isWarming) {
      console.log('Redis cache still warming, returning 202');
      return NextResponse.json({
        warming: true,
        message: 'Redis cache is initializing, please wait...'
      }, { status: 202 }); // 202 Accepted - processing
    }

    console.log('Redis cache ready, fetching products...');
    
    // Fetch all products from Redis cache with enhanced error logging
    const products = await productCache.getAllProducts();
    
    console.log(`Successfully fetched ${products.length} products from Redis cache`);
    const withSpecs = products.filter(p => p.spec_count_total > 0).length;
    console.log(`Products with specs: ${withSpecs}`);

    return NextResponse.json({
      products: products,
      total: products.length,
      total_with_specs: withSpecs
    })

  } catch (error) {
    console.error('🚨 CRITICAL Redis API error - detailed logging:');
    console.error('Error type:', typeof error);
    console.error('Error instanceof Error:', error instanceof Error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Full error object:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error instanceof Error ? error.message : String(error),
        type: typeof error
      },
      { status: 500 }
    )
  }
}
