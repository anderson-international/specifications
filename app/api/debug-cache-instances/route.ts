// Debug API to check if different cache instances are being used
import { NextRequest, NextResponse } from 'next/server';
import { ProductCache } from '@/lib/cache/product-cache';
import { productCache } from '@/lib/cache';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== DEBUGGING CACHE INSTANCES ===');
    
    // Get different ways of accessing the cache
    const instance1 = ProductCache.getInstance();
    const instance2 = productCache;
    
    // Check if they're the same object
    console.log('Instance 1 === Instance 2:', instance1 === instance2);
    
    // Check internal core objects
    const core1 = (instance1 as any).core;
    const core2 = (instance2 as any).core;
    console.log('Core 1 === Core 2:', core1 === core2);
    
    // Check cache maps
    const cache1 = core1.getCache();
    const cache2 = core2.getCache();
    console.log('Cache Map 1 === Cache Map 2:', cache1 === cache2);
    
    // Check sizes and validation
    console.log('Cache 1 size:', cache1.size);
    console.log('Cache 2 size:', cache2.size);
    console.log('Cache 1 keys:', Array.from(cache1.keys()));
    console.log('Cache 2 keys:', Array.from(cache2.keys()));
    
    // Check validation status
    const isValid1 = core1.isValid('all');
    const isValid2 = core2.isValid('all');
    console.log('Cache 1 isValid:', isValid1);
    console.log('Cache 2 isValid:', isValid2);
    
    // Check warming status
    const isWarming = ProductCache.isWarming();
    console.log('Is warming (static):', isWarming);
    
    // Try to manually check what's in the cache
    const allEntry1 = cache1.get('all');
    const allEntry2 = cache2.get('all');
    
    if (allEntry1) {
      console.log('Cache 1 all entry exists');
      console.log('Cache 1 products count:', allEntry1.products?.length || 0);
      console.log('Cache 1 timestamp:', allEntry1.timestamp);
      console.log('Cache 1 TTL:', allEntry1.ttl);
      console.log('Cache 1 age (ms):', Date.now() - allEntry1.timestamp);
      console.log('Cache 1 is expired:', Date.now() - allEntry1.timestamp > allEntry1.ttl);
    } else {
      console.log('Cache 1 all entry does NOT exist');
    }
    
    if (allEntry2) {
      console.log('Cache 2 all entry exists');
      console.log('Cache 2 products count:', allEntry2.products?.length || 0);
      console.log('Cache 2 timestamp:', allEntry2.timestamp);
      console.log('Cache 2 TTL:', allEntry2.ttl);
      console.log('Cache 2 age (ms):', Date.now() - allEntry2.timestamp);
      console.log('Cache 2 is expired:', Date.now() - allEntry2.timestamp > allEntry2.ttl);
    } else {
      console.log('Cache 2 all entry does NOT exist');
    }
    
    return NextResponse.json({
      success: true,
      instances: {
        sameInstance: instance1 === instance2,
        sameCore: core1 === core2,
        sameCacheMap: cache1 === cache2,
        cache1Size: cache1.size,
        cache2Size: cache2.size,
        cache1Valid: isValid1,
        cache2Valid: isValid2,
        isWarming,
        cache1Entry: allEntry1 ? {
          productsCount: allEntry1.products?.length || 0,
          timestamp: allEntry1.timestamp,
          age: Date.now() - allEntry1.timestamp,
          isExpired: Date.now() - allEntry1.timestamp > allEntry1.ttl
        } : null,
        cache2Entry: allEntry2 ? {
          productsCount: allEntry2.products?.length || 0,
          timestamp: allEntry2.timestamp,
          age: Date.now() - allEntry2.timestamp,
          isExpired: Date.now() - allEntry2.timestamp > allEntry2.ttl
        } : null
      }
    });
    
  } catch (error) {
    console.error('Error debugging cache instances:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
