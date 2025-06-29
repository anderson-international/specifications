// Debug API to track cache timeline and identify when/why cache becomes empty
import { NextRequest, NextResponse } from 'next/server';
import { ProductCache } from '@/lib/cache/product-cache';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== DEBUGGING CACHE TIMELINE ===');
    
    const instance = ProductCache.getInstance();
    const core = (instance as any).core;
    const cache = core.getCache();
    
    console.log('Current cache state:');
    console.log('  Size:', cache.size);
    console.log('  Keys:', Array.from(cache.keys()));
    
    // Check 'all' entry specifically
    const allEntry = cache.get('all');
    if (allEntry) {
      const currentTime = Date.now();
      const age = currentTime - allEntry.timestamp;
      const isExpired = age > allEntry.ttl;
      
      console.log('All entry found:');
      console.log('  Products count:', allEntry.products?.length || 0);
      console.log('  Timestamp:', allEntry.timestamp);
      console.log('  TTL (ms):', allEntry.ttl);
      console.log('  TTL (minutes):', allEntry.ttl / (60 * 1000));
      console.log('  Current time:', currentTime);
      console.log('  Age (ms):', age);
      console.log('  Age (minutes):', age / (60 * 1000));
      console.log('  Is expired:', isExpired);
      console.log('  Should be valid:', !isExpired);
      
      // Manual validation check
      const manualValidation = !isExpired;
      const coreValidation = core.isValid('all');
      
      console.log('Manual validation result:', manualValidation);
      console.log('Core validation result:', coreValidation);
      console.log('Validation mismatch:', manualValidation !== coreValidation);
      
      return NextResponse.json({
        success: true,
        cacheState: 'populated',
        allEntry: {
          productsCount: allEntry.products?.length || 0,
          timestamp: allEntry.timestamp,
          ttl: allEntry.ttl,
          ttlMinutes: allEntry.ttl / (60 * 1000),
          currentTime,
          age,
          ageMinutes: age / (60 * 1000),
          isExpired,
          manualValidation,
          coreValidation,
          validationMismatch: manualValidation !== coreValidation,
          sampleProduct: allEntry.products?.[0] ? {
            handle: allEntry.products[0].handle,
            title: allEntry.products[0].title,
            hasHandle: 'handle' in allEntry.products[0]
          } : null
        }
      });
      
    } else {
      console.log('All entry NOT found - cache is empty');
      
      // Try to trigger a fresh initialization to see what happens
      console.log('Attempting fresh cache initialization...');
      try {
        await ProductCache.ensureReady();
        console.log('Fresh initialization completed');
        
        // Check cache again after initialization
        const freshCache = core.getCache();
        const freshEntry = freshCache.get('all');
        
        console.log('After fresh init:');
        console.log('  Cache size:', freshCache.size);
        console.log('  Has all entry:', !!freshEntry);
        
        return NextResponse.json({
          success: true,
          cacheState: 'empty_but_refreshed',
          beforeRefresh: {
            size: cache.size,
            hasAllEntry: false
          },
          afterRefresh: {
            size: freshCache.size,
            hasAllEntry: !!freshEntry,
            productsCount: freshEntry?.products?.length || 0
          }
        });
        
      } catch (error) {
        console.log('Fresh initialization failed:', error);
        return NextResponse.json({
          success: false,
          cacheState: 'empty_and_failed_refresh',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
  } catch (error) {
    console.error('Error debugging cache timeline:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
