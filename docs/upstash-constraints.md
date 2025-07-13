# Upstash Redis Constraints & Implementation

## Upstash Limitations

### No Pipeline Support
- **Limitation**: No `pipeline()` or `multi()/exec()` commands
- **Impact**: Cannot batch commands atomically
- **Solution**: Use sequential HTTP REST API calls

### Sequential Operations Only
```typescript
// ❌ NOT AVAILABLE: Pipelines
const pipeline = redis.pipeline()
pipeline.del(key)
pipeline.hset(key, data)
pipeline.expire(key, ttl)
await pipeline.exec()

// ✅ REQUIRED: Sequential calls
await redis.del(key)
await redis.hset(key, data) 
await redis.expire(key, ttl)
```

### JSON Auto-Serialization
- **Benefit**: Upstash automatically handles JSON serialization
- **Usage**: Objects stored/retrieved as JavaScript objects
- **No manual**: `JSON.stringify()` or `JSON.parse()` needed

## Cache Refresh Implementation

### Sequential Command Pattern
```typescript
async refreshCache(): Promise<void> {
  try {
    // Step 1: Clear existing hash
    await this.redis.del(this.hashKey)
    
    // Step 2: Populate new data
    const products = await this.fetchProductsFromShopify()
    const hashData: Record<string, Product> = {}
    
    for (const product of products) {
      hashData[product.shopify_handle] = product
    }
    
    // Step 3: Set all data in single HSET
    await this.redis.hset(this.hashKey, hashData)
    
    // Step 4: Set TTL
    await this.redis.expire(this.hashKey, this.ttlSeconds)
    
  } catch (error) {
    // Fail-fast: Let errors bubble up
    throw new Error(`Cache refresh failed: ${error.message}`)
  }
}
```

### Non-Atomic Window
- **Duration**: Brief window between `del` and `expire` commands
- **Impact**: Concurrent reads may see partial/missing data
- **Acceptance**: Acceptable for product cache use case
- **Mitigation**: Keep refresh operations fast

## Error Handling Strategy

### Fail-Fast Implementation
```typescript
async getProductsByHandles(handles: string[]): Promise<Product[]> {
  try {
    const products = await this.redis.hmget(this.hashKey, ...handles)
    return products.filter(Boolean) // Remove null values
  } catch (error) {
    // NO FALLBACKS - fail immediately
    throw new Error(`Product lookup failed: ${error.message}`)
  }
}
```

### No Fallback Policy
- **Principle**: Surface Redis errors immediately
- **Rationale**: Prevent masking of real cache issues
- **Implementation**: Remove all array fallback logic
- **Monitoring**: Allow errors to bubble for observability

## TTL Behavior

### Hash-Level TTL
- **Scope**: TTL applies to entire hash key
- **Command**: `EXPIRE shopify:products:by_handle 1800`
- **Limitation**: Cannot set TTL on individual hash fields
- **Strategy**: Refresh entire hash when any part expires

### TTL Management
```typescript
// Set TTL on hash key
await redis.expire('shopify:products:by_handle', 1800) // 30 minutes

// Check TTL remaining
const ttl = await redis.ttl('shopify:products:by_handle')
if (ttl <= 0) {
  await this.refreshCache()
}
```

## Performance Considerations

### HTTP REST API
- **Protocol**: HTTP REST vs TCP Redis protocol
- **Latency**: Higher per-command latency than traditional Redis
- **Batching**: Use HSET with multiple fields vs multiple SET commands
- **Connection**: Serverless-friendly, no persistent connections

### Optimization Strategies
- **Batch Operations**: Use `HSET` with multiple field-value pairs
- **Minimal Calls**: Combine operations where possible
- **Efficient Payloads**: Only cache necessary product fields
- **TTL Tuning**: Balance freshness vs API call frequency
