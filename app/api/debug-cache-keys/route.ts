// Debug API to identify what cache keys are actually being used
import { NextRequest, NextResponse } from 'next/server';
import { ProductCache } from '@/lib/cache/product-cache';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    console.log('=== DEBUGGING CACHE KEYS ===');
    
    const instance = ProductCache.getInstance();
    const core = (instance as any).core;
    const cache = core.getCache();
    
    console.log('Current cache map:');
    console.log('  Size:', cache.size);
    console.log('  Keys:', Array.from(cache.keys()));
    
    // Inspect each key and its contents
    const keyDetails = {};
    for (const [key, value] of cache.entries()) {
      console.log(`\nInspecting key "${key}":`);
      console.log(`  Type: ${typeof key}`);
      console.log(`  String value: "${String(key)}"`);
      console.log(`  Products count: ${value.products?.length || 0}`);
      console.log(`  Timestamp: ${value.timestamp}`);
      console.log(`  TTL: ${value.ttl}`);
      
      keyDetails[key] = {
        type: typeof key,
        stringValue: String(key),
        productsCount: value.products?.length || 0,
        timestamp: value.timestamp,
        ttl: value.ttl,
        age: Date.now() - value.timestamp
      };
    }
    
    // Test different key lookups
    const lookupTests = {
      'all': cache.get('all'),
      '"all"': cache.get('"all"'),
      'null': cache.get(null as any),
      'undefined': cache.get(undefined as any)
    };
    
    console.log('\nKey lookup tests:');
    Object.entries(lookupTests).forEach(([testKey, result]) => {
      console.log(`  ${testKey}: ${result ? 'FOUND' : 'NOT FOUND'}`);
    });
    
    // Test validation with different keys
    const validationTests = {};
    for (const key of cache.keys()) {
      validationTests[String(key)] = core.isValid(key);
      console.log(`Validation for key "${key}": ${core.isValid(key)}`);
    }
    
    return NextResponse.json({
      success: true,
      cache: {
        size: cache.size,
        keys: Array.from(cache.keys()),
        keyDetails,
        lookupTests: Object.fromEntries(
          Object.entries(lookupTests).map(([k, v]) => [k, !!v])
        ),
        validationTests
      }
    });
    
  } catch (error) {
    console.error('Error debugging cache keys:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
