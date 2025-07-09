#!/usr/bin/env node

/**
 * Redis Inspection Script using App's Redis Client
 * Directly inspects Redis cache using the same client as the application
 */

const path = require('path')
process.env.NODE_ENV = 'development'
process.chdir(path.join(__dirname, '..'))

async function main() {
  console.log('🔍 Redis Inspection via App Client\n')
  
  try {
    // Import the same Redis client the app uses
    const redis = await import('../lib/redis.ts')
    const redisClient = redis.default
    
    // Check enum cache key
    const enumCacheKey = 'enums:specification:all'
    console.log(`📊 Checking enum cache key: ${enumCacheKey}`)
    
    const enumExists = await redisClient.exists(enumCacheKey)
    console.log(`   - Key exists: ${enumExists ? '✅ YES' : '❌ NO'}`)
    
    if (enumExists) {
      const enumValue = await redisClient.get(enumCacheKey)
      console.log(`   - Value type: ${typeof enumValue}`)
      console.log(`   - Value size: ${JSON.stringify(enumValue).length} bytes`)
      
      if (typeof enumValue === 'string') {
        try {
          const parsed = JSON.parse(enumValue)
          console.log(`   - Parsed keys: [${Object.keys(parsed).join(', ')}]`)
        } catch (e) {
          console.log(`   - JSON parse error: ${e.message}`)
        }
      } else {
        console.log(`   - Object keys: [${Object.keys(enumValue || {}).join(', ')}]`)
      }
    }
    
    // Check product cache key
    const productCacheKey = 'shopify:products:all'
    console.log(`\n📊 Checking product cache key: ${productCacheKey}`)
    
    const productExists = await redisClient.exists(productCacheKey)
    console.log(`   - Key exists: ${productExists ? '✅ YES' : '❌ NO'}`)
    
    if (productExists) {
      const productValue = await redisClient.get(productCacheKey)
      console.log(`   - Value type: ${typeof productValue}`)
      console.log(`   - Value size: ${JSON.stringify(productValue).length} bytes`)
      
      if (typeof productValue === 'string') {
        try {
          const productParsed = JSON.parse(productValue)
          console.log(`   - Product count: ${Array.isArray(productParsed) ? productParsed.length : 'NOT ARRAY'}`)
        } catch (e) {
          console.log(`   - JSON parse error: ${e.message}`)
        }
      } else {
        console.log(`   - Product count: ${Array.isArray(productValue) ? productValue.length : 'NOT ARRAY'}`)
      }
    }
    
    // Test enum cache refresh
    console.log('\n🔄 Testing enum cache refresh...')
    const { redisEnumCache } = await import('../lib/cache/redis-enum-cache.ts')
    
    try {
      await redisEnumCache.refreshCache()
      console.log('   - Cache refresh: ✅ SUCCESS')
      
      // Check if key exists now
      const enumExistsAfter = await redisClient.exists(enumCacheKey)
      console.log(`   - Key exists after refresh: ${enumExistsAfter ? '✅ YES' : '❌ NO'}`)
      
      if (enumExistsAfter) {
        const enumValueAfter = await redisClient.get(enumCacheKey)
        console.log(`   - Value type after refresh: ${typeof enumValueAfter}`)
        console.log(`   - Value size after refresh: ${JSON.stringify(enumValueAfter).length} bytes`)
      }
    } catch (error) {
      console.log(`   - Cache refresh: ❌ FAILED - ${error.message}`)
    }
    
  } catch (error) {
    console.error('❌ Redis inspection failed:', error.message)
  }
}

main()
