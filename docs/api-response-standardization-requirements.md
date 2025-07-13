# API Response Standardization Requirements

## Executive Summary
System-wide analysis revealed inconsistent API response patterns causing frontend integration failures. This document specifies unified requirements to ensure seamless API/frontend communication.

## Current Issues Identified

### 1. Inconsistent Response Patterns
- **Raw Response**: `/api/enums` bypasses NextResponse.json() due to suspected framework issues
- **Direct JSON**: `/api/products` uses NextResponse.json() with flat data structure  
- **Wrapped Response**: `/api/specifications` uses withErrorHandling() adding `data` wrapper

### 2. Frontend Hook Misalignment
- `useSpecifications`: Expects `response.data.specifications` (canonical format)
- `useProducts`: Expects `response.products` (flat format)
- `useSpecificationEnums`: Expects `response.data.*` (canonical format)

### 3. Dynamic Route Parameter Issues
- Incorrect `await params` usage in Next.js dynamic routes
- String ID handling without proper integer parsing/validation

## Canonical API Response Format

### Standard Response Structure
```typescript
interface ApiResponse<T> {
  data: T;
  timestamp: string;
  message?: string;
}

interface ApiError {
  error: string;
  details?: unknown;
  timestamp: string;
}
```

### Success Response Examples
```typescript
// GET /api/specifications
{
  "data": {
    "specifications": [...],
    "total": 5
  },
  "timestamp": "2025-01-13T14:15:11.000Z"
}

// GET /api/enums  
{
  "data": {
    "productTypes": [...],
    "brands": [...],
    "experienceLevels": [...]
  },
  "timestamp": "2025-01-13T14:15:11.000Z"
}
```

### Error Response Example
```typescript
{
  "error": "Specification not found",
  "details": { "id": 999 },
  "timestamp": "2025-01-13T14:15:11.000Z"
}
```

## Implementation Requirements

### 1. API Endpoint Standards

#### Dynamic Route Parameter Handling
```typescript
// ❌ INCORRECT - Do not await params
const { id: idString } = await params

// ✅ CORRECT - Params is already an object
const { id: idString } = params
const id = parseInt(idString, 10)

if (isNaN(id)) {
  return NextResponse.json(
    { error: "Invalid ID parameter", timestamp: new Date().toISOString() },
    { status: 400 }
  )
}
```

#### Response Wrapper Usage
```typescript
// ✅ All API endpoints must use withErrorHandling wrapper
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async () => {
    const data = await fetchData()
    return { data, timestamp: new Date().toISOString() }
  })
}
```

#### Field Name Alignment
- Use exact Prisma schema field names (e.g., `review` not `review_text`)
- Validate field mappings during development
- Document any intentional transformations

### 2. Frontend Hook Standards

#### Data Access Pattern
```typescript
// ✅ All hooks must expect canonical response format
const response = await fetch('/api/endpoint')
const json = await response.json()

// Access data via response.data
const specifications = json.data.specifications
const enums = json.data.productTypes
```

#### Error Handling Pattern
```typescript
if (!response.ok) {
  const errorData = await response.json()
  throw new Error(errorData.error || 'Request failed')
}
```

### 3. Cache Integration Standards

#### Response Format Consistency
```typescript
// ✅ Cache methods must return data in canonical format
async getAllEnums(): Promise<SpecificationEnumData> {
  try {
    return await this.getData()
  } catch {
    await this.refreshCache()
    return this.getData()
  }
}
```

## Migration Strategy

### Phase 1: Core Endpoints (Immediate)
- [x] `/api/specifications` - Already using canonical format
- [x] `/api/specifications/[id]` - TypeScript errors resolved
- [ ] `/api/enums` - Remove NextResponse.json() bypass
- [ ] `/api/products` - Wrap response in canonical format

### Phase 2: Frontend Hooks (Next)
- [x] `useSpecifications` - Already expects canonical format
- [ ] `useProducts` - Update to expect `response.data.products`
- [x] `useSpecificationEnums` - Already expects canonical format

### Phase 3: Dynamic Routes (Final)
- [x] `/api/specifications/[id]` - Fixed async params usage
- [ ] Audit all other `[param]` routes for async compliance

## Testing Requirements

### Endpoint Compliance Verification
```typescript
// Each endpoint must pass this test structure
const response = await fetch('/api/endpoint')
const json = await response.json()

// Success responses
expect(json).toHaveProperty('data')
expect(json).toHaveProperty('timestamp')
expect(typeof json.timestamp).toBe('string')

// Error responses  
expect(json).toHaveProperty('error')
expect(json).toHaveProperty('timestamp')
```

### Frontend Integration Testing
- Verify hooks access `response.data.*` correctly
- Confirm error handling uses `response.error`
- Test loading states with canonical response format

## Next.js Framework Considerations

### NextResponse.json() Issues
- Investigation needed: Why `/api/enums` bypasses standard response handling
- Test NextResponse.json() with large payloads (5KB+ enum data)
- Document any framework-specific workarounds required

### Edge Runtime Compatibility
- Ensure canonical format works with Edge Runtime
- Verify Redis cache integration maintains response consistency
- Test lazy initialization patterns

## Success Criteria

### API Consistency
- All endpoints return identical response structure
- No bypasses or special cases for response handling
- Dynamic routes handle params synchronously

### Frontend Reliability  
- All hooks expect and handle canonical format
- Consistent error handling across components
- No data access failures due to response structure

### Developer Experience
- Clear TypeScript interfaces for all responses
- Documented patterns for new endpoint creation
- Automated testing for response format compliance

## Implementation Priority

1. **High Priority**: Fix `/api/enums` NextResponse.json() bypass
2. **Medium Priority**: Update `/api/products` to canonical format
3. **Low Priority**: Audit remaining dynamic routes for async compliance

---

**Status**: Ready for implementation approval and execution
**Last Updated**: 2025-01-13T14:15:11+01:00
