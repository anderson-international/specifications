# Redis Hash Schema for Product Lookups

## Schema Design

### Hash Key Structure
```
Key: "shopify:products:by_handle"
Type: Hash
TTL: 30 minutes (1800 seconds)
```

### Hash Field Structure
```
Field: {shopify_handle}
Value: {Product JSON object}
```

Example:
```redis
HSET shopify:products:by_handle "vintage-blend-250g" '{"id":1,"shopify_handle":"vintage-blend-250g","title":"Vintage Blend 250g","brand":"Premium Tobacco Co","type":"pipe_tobacco","price":"24.99"}'
```

### Product Object Format
```typescript
interface CachedProduct {
  id: number
  shopify_handle: string
  title: string
  brand: string
  type: string
  price?: string
  image_url?: string
  description?: string
}
```

## Cache Operations

### Write Operations (Cache Refresh)
1. `DEL shopify:products:by_handle` - Remove existing hash
2. `HSET shopify:products:by_handle field1 value1 field2 value2 ...` - Set all products in single command
3. `EXPIRE shopify:products:by_handle 1800` - Set 30 minute TTL

### Read Operations
1. `HMGET shopify:products:by_handle handle1 handle2 handle3` - Get multiple products by handles
2. `HGET shopify:products:by_handle handle` - Get single product by handle
3. `HGETALL shopify:products:by_handle` - Get all products (for migration compatibility)

## Migration Strategy

### Phase 1: Dual Storage
- Maintain existing array storage temporarily
- Add hash storage alongside array
- Use hash for new lookups, array as fallback validation

### Phase 2: Hash-Only
- Remove array storage completely
- All consumers use hash storage exclusively
- Fail-fast on hash lookup errors

### Phase 3: Optimization
- Remove legacy getAllProducts array compatibility if not needed
- Optimize cache refresh batch operations
- Monitor and tune TTL based on usage patterns

## Performance Characteristics

### Expected Improvements
- **Before**: O(n×m) - n specifications × m products array scan
- **After**: O(m) - m hash lookups for specification list
- **Batch lookup**: Single HMGET for multiple handles vs individual array scans

### Cache Refresh Cost
- **Upstash REST API**: Sequential HTTP calls (del, hset, expire)
- **Acceptable**: Brief non-atomic window during refresh
- **Frequency**: On-demand when cache expires or manual trigger
