#!/usr/bin/env node

/**
 * Redis Cache Debug Script
 * Directly inspects Redis cache keys and values
 */

const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

async function main() {
  console.log('🔍 Redis Cache Debug Test\n')
  
  try {
    // Check if enum cache key exists in Redis
    console.log('📊 Checking Redis enum cache key...')
    const enumCacheKey = 'enums:specification:all'
    
    const { stdout: existsOutput } = await execAsync(`redis-cli EXISTS ${enumCacheKey}`)
    const exists = existsOutput.trim() === '1'
    
    console.log(`   - Key "${enumCacheKey}" exists: ${exists ? '✅ YES' : '❌ NO'}`)
    
    if (exists) {
      // Get the value
      const { stdout: valueOutput } = await execAsync(`redis-cli GET ${enumCacheKey}`)
      console.log(`   - Value size: ${valueOutput.length} bytes`)
      console.log(`   - Value preview: ${valueOutput.slice(0, 200)}...`)
      
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(valueOutput)
        console.log(`   - Parsed keys: [${Object.keys(parsed).join(', ')}]`)
      } catch (e) {
        console.log(`   - JSON parse error: ${e.message}`)
      }
    }
    
    // Check product cache key for comparison
    console.log('\n📊 Checking Redis product cache key...')
    const productCacheKey = 'shopify:products:all'
    
    const { stdout: productExistsOutput } = await execAsync(`redis-cli EXISTS ${productCacheKey}`)
    const productExists = productExistsOutput.trim() === '1'
    
    console.log(`   - Key "${productCacheKey}" exists: ${productExists ? '✅ YES' : '❌ NO'}`)
    
    if (productExists) {
      const { stdout: productValueOutput } = await execAsync(`redis-cli GET ${productCacheKey}`)
      console.log(`   - Value size: ${productValueOutput.length} bytes`)
      
      try {
        const productParsed = JSON.parse(productValueOutput)
        console.log(`   - Product count: ${Array.isArray(productParsed) ? productParsed.length : 'NOT ARRAY'}`)
      } catch (e) {
        console.log(`   - JSON parse error: ${e.message}`)
      }
    }
    
    // Show all redis keys
    console.log('\n📊 All Redis keys:')
    const { stdout: allKeys } = await execAsync('redis-cli KEYS "*"')
    const keys = allKeys.trim().split('\n').filter(k => k.length > 0)
    console.log(`   - Total keys: ${keys.length}`)
    keys.forEach(key => console.log(`   - ${key}`))
    
  } catch (error) {
    console.error('❌ Redis debug failed:', error.message)
  }
}

main()
