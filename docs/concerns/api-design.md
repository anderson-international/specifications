---
complianceLevel: critical
status: active
tags: [api-design, nextjs, restful, shopify, error-handling, validation]
id: 1005
---

# API Design Documentation

*Centralized API strategy for the Specification Builder project.*

<!-- AI_QUICK_REF
Overview: API design strategy - Next.js routes, dual error handling (retry/fail-fast), Shopify GraphQL integration, schema validation
Key Rules: Next.js API routes (line 14), RESTful CRUD (line 15), Fail-fast errors (line 25), Shopify GraphQL only (line 120)
Avoid: Shopify REST API, Silent error handling, Missing HTTP status codes, Retrying 4xx errors
-->

## Overview

This document provides strategic guidance for API design decisions and patterns. Focus is on simplicity and consistency. Designed for a solo hobbyist project with RESTful principles.

The following sections establish our core approach, then detail specific strategies for error handling and external integrations.

## API Strategy

**Core Approach**: Next.js API routes with RESTful patterns and consistent error handling.

Our API strategy builds on four foundational principles that work together to create a maintainable system:

### Route Philosophy
- **Next.js API Routes**: Leverage built-in API routing for backend functionality
- **RESTful Principles**: Follow standard REST patterns for CRUD operations
- **Simple Structure**: Avoid complex API architectures for solo development
- **Type Safety**: Integrate with TypeScript for request/response validation

These principles guide how we structure our URLs and organize our endpoints:

### URL Patterns
- **Resource-Based**: Structure URLs around data resources (specifications, users, etc.)
- **Nested Resources**: Use logical nesting for related data relationships
- **Admin Routes**: Separate admin functionality with dedicated route prefixes
- **Consistent Naming**: Use clear, descriptive resource names

With our foundational approach established, we turn to one of the most critical aspects of API design: how we handle errors and failures.

## 🔥 **HIGH**: Error Handling Strategy

**Philosophy**: Comprehensive error resilience. This combines thoughtful retry mechanisms with fail-fast principles. We surface errors appropriately based on error type and context.

Our error handling strategy operates on two complementary approaches. First, we identify when retries make sense:

### ⚠️ **CRITICAL**: Thoughtful Retry Mechanisms

**When to Retry**: Only for transient or recoverable errors where retries can succeed.

#### Retry-Appropriate Scenarios:
- **5xx Server Errors**: Internal server errors, service unavailable (503), gateway timeout (504)
- **Network Timeouts**: Connection timeouts, request timeouts
- **Rate Limiting**: 429 Too Many Requests with retry-after headers
- **External API Transient Failures**: Shopify API temporary unavailability

#### Retry Implementation Requirements:
- **Reasonable Limits**: Maximum 3-5 retry attempts. This avoids unnecessary load.
- **Exponential Backoff**: Increasing delays between retries (1s, 2s, 4s, 8s).
- **Jitter**: Add random variation. This prevents thundering herd effects.
- **Idempotency**: Ensure operations can be safely repeated. No unintended side effects.
- **Circuit Breaker**: Stop retrying after consecutive failures. This prevents cascade failures.

```typescript
interface RetryConfig {
  maxAttempts: number;        // 3-5 attempts maximum
  baseDelay: number;          // Starting delay in milliseconds
  maxDelay: number;           // Cap exponential growth
  exponentialBase: number;    // Backoff multiplier (2.0)
  jitter: boolean;           // Add randomization
}
```

However, not all errors should be retried. We must also know when to fail-fast:

### 🔥 **HIGH**: Fail-Fast Principles

**When to Fail-Fast**: For persistent or client errors where retries cannot succeed.

#### Fail-Fast Scenarios:
- **Client Errors**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **Validation Failures**: 422 Unprocessable Entity, malformed data
- **Authentication Issues**: Invalid credentials, expired tokens
- **Permission Violations**: Insufficient access rights
- **Business Logic Violations**: Data consistency errors, constraint violations

#### Fail-Fast Implementation:
- **Immediate Response**: Surface errors immediately without delay.
- **Clear Error Messages**: Provide actionable feedback to users.
- **No Retry Attempts**: Do not waste resources on unrecoverable errors.
- **Error Context**: Include sufficient details for debugging and user guidance.

By combining these two approaches, we achieve comprehensive error handling:

### 🔥 **HIGH**: Combined Strategy Implementation

**Principle**: Use both strategies together for comprehensive error handling.

#### Decision Matrix:
```typescript
function shouldRetry(error: ApiError): boolean {
  // Fail-fast for client errors (4xx)
  if (error.status >= 400 && error.status < 500) {
    return false;
  }
  
  // Retry for server errors (5xx) and timeouts
  if (error.status >= 500 || error.isTimeout) {
    return true;
  }
  
  // Retry for rate limiting with backoff
  if (error.status === 429) {
    return true;
  }
  
  return false;
}
```

#### Error Response Structure:
```typescript
interface ApiError {
  error: string;           // Human-readable error message
  code?: string;          // Machine-readable error code
  details?: unknown;      // Additional error context
  timestamp: string;      // ISO timestamp
  retryable: boolean;     // Whether error is retryable
  retryAfter?: number;    // Suggested retry delay (seconds)
}
```

With error handling in place, we can ensure our API is resilient and provides a good user experience.

### Standard HTTP Status Codes
- **200**: Successful operation with data
- **201**: Resource created successfully
- **400**: Bad request (invalid data, validation errors) - **FAIL-FAST**
- **401**: Authentication required or failed - **FAIL-FAST**
- **403**: Access forbidden (insufficient permissions) - **FAIL-FAST**
- **404**: Resource not found - **FAIL-FAST**
- **422**: Unprocessable entity (business logic validation failed) - **FAIL-FAST**
- **429**: Too many requests (rate limited) - **RETRY WITH BACKOFF**
- **500**: Internal server error (unexpected failures) - **RETRY WITH BACKOFF**
- **502**: Bad gateway - **RETRY WITH BACKOFF**
- **503**: Service unavailable - **RETRY WITH BACKOFF**
- **504**: Gateway timeout - **RETRY WITH BACKOFF**

<!-- AI_VALIDATION
API Design Compliance Patterns:

Next.js API Route Structure:
- Route handlers in app/api/: Check for proper app/api/ directory structure
- HTTP method handling: GET, POST, PUT, DELETE method exports
- Request/response typing: TypeScript interfaces for req/res
- Error handling: try/catch blocks with proper error responses

Retry Mechanism Validation:
- Exponential backoff implementation: baseDelay * (exponentialBase ^ attempt)
- Maximum retry attempts: 3-5 attempts only
- Idempotency checks: Safe retry operations only
- Circuit breaker pattern: Stop retrying after consecutive failures
- Jitter implementation: Random variation in retry delays

Shopify Integration Compliance:
- GraphQL usage: Must use GraphQL API, not REST
- Rate limiting: Respect 40 calls/second limit with 429 retry handling
- Webhook validation: Signature verification for webhook endpoints

Critical API Anti-Patterns:
1. Silent error handling (no error response to client)
2. Inconsistent error response formats
3. Missing HTTP status codes or retry classification
4. Retrying non-retryable errors (4xx client errors)
5. No exponential backoff or retry limits
6. Shopify REST API usage (should be GraphQL)
7. Missing authentication on protected routes
8. No circuit breaker for cascade failure prevention
-->

## External API Integration

### Shopify Integration
- **GraphQL Client**: Simple wrapper for Shopify GraphQL queries
- **Direct Queries**: Avoid complex SDK dependencies for straightforward needs
- **Error Handling**: Handle Shopify API errors with fail-fast approach. All errors must be surfaced, never swallowed.
- **Rate Limiting**: Respect Shopify API limits with appropriate retry logic

Our Shopify integration is critical to the success of our project. We must ensure we are using the correct API and handling errors properly.

### Integration Patterns
- **Service Layer**: Separate external API logic from route handlers
- **Error Mapping**: Convert external API errors to consistent internal format
- **Timeout Handling**: Implement reasonable timeouts for external calls
- **Environment Config**: Use environment variables for API credentials

By following these integration patterns, we can ensure our external API integrations are robust and maintainable.

## Validation Strategy

**Approach**: Schema-based validation with explicit error messages.

Our validation strategy is designed to ensure data consistency and prevent errors.

### Input Validation
- **Schema Validation**: Use validation libraries for request body validation
- **Type Checking**: Leverage TypeScript for compile-time validation
- **Sanitization**: Clean and validate user input before processing
- **Early Validation**: Validate requests at the route entry point

### Response Validation
- **Consistent Structure**: Standardized response format across endpoints
- **Type Safety**: Ensure response types match expected client contracts
- **Data Transformation**: Convert database results to API response format
- **Null Handling**: Explicit handling of missing or null data

By validating both input and output data, we can ensure our API is robust and provides accurate results.

## Performance Guidelines

### Route Optimization
- **Lightweight Routes**: Keep API route handlers simple and focused
- **Database Efficiency**: Use efficient database queries and connection patterns
- **Caching Strategy**: Implement caching where appropriate for read-heavy operations
- **Response Size**: Return only necessary data in API responses

Our performance guidelines are designed to ensure our API is fast and efficient.

## Shopify Integration

**Implementation**: You must use the Shopify GraphQL API. Do not use the REST API.

### API Configuration
- **Store Domain**: Configure via SHOPIFY_STORE_URL environment variable
- **Admin Access Token**: Read permissions for products via SHOPIFY_ADMIN_ACCESS_TOKEN
- **API Version**: Configure via SHOPIFY_API_VERSION environment variable

### Product Sync Implementation
- **Scheduled Sync**: pg_cron every 6 hours for incremental updates using `updated_at` timestamps
- **Manual Refresh**: Admin API endpoint `/api/admin/refresh-products` for on-demand sync
- **Soft Delete Strategy**: Mark removed products as inactive rather than deleting
- **Error Handling**: Retry logic with exponential backoff for API failures

### Integration Patterns
- **Rate Limiting**: Respect Shopify's API limits (40 calls/second)
- **Webhook Processing**: Real-time product updates via webhook endpoints
- **Fallback Procedures**: Do not use fallbacks. Report errors to user.
- **Data Validation**: Verify webhook signatures and sanitize incoming data

By following these guidelines and patterns, we can ensure our Shopify integration is robust and maintainable.
