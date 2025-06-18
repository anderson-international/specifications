---
title: API Design Documentation
description: Centralized API strategy for Next.js routes, RESTful patterns, and Shopify integration
version: 1.0.0
status: active
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: critical
readingTime: 18 minutes
tags: [api-design, nextjs, restful, shopify, error-handling, validation]
---

# API Design Documentation

*Centralized API strategy for the Specification Builder project.*

<!-- AI_QUICK_REF
Key Rules: Next.js API routes (line 14), RESTful CRUD (line 15), Fail-fast errors (line 25), Shopify GraphQL only (line 120)
Avoid: Shopify REST API, Silent error handling, Missing HTTP status codes, Retrying 4xx errors
-->

<!-- AI_SUMMARY
This document defines the API design strategy for the Specification Builder project with these key components:

• Next.js API Route Strategy - RESTful patterns with resource-based URLs, consistent naming, and TypeScript integration for type safety
• Dual Error Handling Approach - Thoughtful retry mechanisms for transient errors (5xx, timeouts, rate limits) combined with fail-fast principles for client errors (4xx, validation failures)
• Shopify GraphQL Integration - Direct GraphQL API usage with rate limiting respect, exponential backoff retry logic, and webhook processing
• Validation Strategy - Schema-based input validation, consistent response structures, and explicit error messages with early validation
• Performance Guidelines - Lightweight route handlers, efficient database queries, appropriate caching, and optimized response sizes
• External API Integration Patterns - Service layer separation, error mapping, timeout handling, and environment-based configuration

The strategy emphasizes simplicity and consistency for solo development while maintaining comprehensive error resilience and external API integration capabilities.
-->

## Overview

This document provides strategic guidance for API design decisions and patterns. Focus is on simplicity and consistency for a solo hobbyist project with RESTful principles.

## API Strategy

**Core Approach**: Next.js API routes with RESTful patterns and consistent error handling.

### Route Philosophy
- **Next.js API Routes**: Leverage built-in API routing for backend functionality
- **RESTful Principles**: Follow standard REST patterns for CRUD operations
- **Simple Structure**: Avoid complex API architectures for solo development
- **Type Safety**: Integrate with TypeScript for request/response validation

### URL Patterns
- **Resource-Based**: Structure URLs around data resources (specifications, users, etc.)
- **Nested Resources**: Use logical nesting for related data relationships
- **Admin Routes**: Separate admin functionality with dedicated route prefixes
- **Consistent Naming**: Use clear, descriptive resource names

## 🔥 **HIGH**: Error Handling Strategy

**Philosophy**: Comprehensive error resilience combining thoughtful retry mechanisms with fail-fast principles - surface errors appropriately based on error type and context.

### ⚠️ **CRITICAL**: Thoughtful Retry Mechanisms

**When to Retry**: Only for transient or recoverable errors where retries can succeed.

#### Retry-Appropriate Scenarios:
- **5xx Server Errors**: Internal server errors, service unavailable (503), gateway timeout (504)
- **Network Timeouts**: Connection timeouts, request timeouts
- **Rate Limiting**: 429 Too Many Requests with retry-after headers
- **External API Transient Failures**: Shopify API temporary unavailability

#### Retry Implementation Requirements:
- **Reasonable Limits**: Maximum 3-5 retry attempts to avoid unnecessary load
- **Exponential Backoff**: Increasing delays between retries (1s, 2s, 4s, 8s)
- **Jitter**: Add random variation to prevent thundering herd effects
- **Idempotency**: Ensure operations can be safely repeated without unintended side effects
- **Circuit Breaker**: Stop retrying after consecutive failures to prevent cascade failures

```typescript
interface RetryConfig {
  maxAttempts: number;        // 3-5 attempts maximum
  baseDelay: number;          // Starting delay in milliseconds
  maxDelay: number;           // Cap exponential growth
  exponentialBase: number;    // Backoff multiplier (2.0)
  jitter: boolean;           // Add randomization
}
```

### 🔥 **HIGH**: Fail-Fast Principles

**When to Fail-Fast**: For persistent or client errors where retries cannot succeed.

#### Fail-Fast Scenarios:
- **Client Errors**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **Validation Failures**: 422 Unprocessable Entity, malformed data
- **Authentication Issues**: Invalid credentials, expired tokens
- **Permission Violations**: Insufficient access rights
- **Business Logic Violations**: Data consistency errors, constraint violations

#### Fail-Fast Implementation:
- **Immediate Response**: Surface errors immediately without delay
- **Clear Error Messages**: Provide actionable feedback to users
- **No Retry Attempts**: Do not waste resources on unrecoverable errors
- **Error Context**: Include sufficient details for debugging and user guidance

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

Error Response Validation:
- Standard HTTP status codes: 200, 201, 400, 401, 403, 404, 422, 429, 500, 502, 503, 504
- Consistent error format: { error: string, code?: string, details?: unknown, retryable: boolean }
- Retry/fail-fast classification: Client errors (4xx) fail-fast, server errors (5xx) retry with backoff
- No silent failures: All errors returned to client with appropriate status

Retry Mechanism Validation:
- Exponential backoff implementation: baseDelay * (exponentialBase ^ attempt)
- Maximum retry attempts: 3-5 attempts only
- Idempotency checks: Safe retry operations only
- Circuit breaker pattern: Stop retrying after consecutive failures
- Jitter implementation: Random variation in retry delays

Fail-Fast Pattern Validation:
- Client errors (400-499): Immediate response, no retry attempts
- Validation failures: Surface immediately with actionable messages
- Authentication/authorization: Fail immediately on credentials/permissions
- Business logic violations: No retry for constraint/consistency errors

Request Validation Patterns:
- Zod schema validation: Input validation with zodResolver
- Method validation: Check for unsupported HTTP methods
- Authentication checks: Verify user permissions before processing
- Data sanitization: Clean and validate all input data

Shopify Integration Compliance:
- GraphQL usage: Must use GraphQL API, not REST
- Rate limiting: Respect 40 calls/second limit with 429 retry handling
- Error handling: Exponential backoff retry logic for 5xx errors
- Webhook validation: Signature verification for webhook endpoints

API Endpoint Validation:
- RESTful patterns: /api/[resource]/[id] structure
- Proper HTTP methods: GET for reads, POST for creates, etc.
- Response consistency: Same response format across endpoints
- Authentication middleware: Protect sensitive endpoints

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

### Integration Patterns
- **Service Layer**: Separate external API logic from route handlers
- **Error Mapping**: Convert external API errors to consistent internal format
- **Timeout Handling**: Implement reasonable timeouts for external calls
- **Environment Config**: Use environment variables for API credentials

## Validation Strategy

**Approach**: Schema-based validation with explicit error messages.

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

## Performance Guidelines

### Route Optimization
- **Lightweight Routes**: Keep API route handlers simple and focused
- **Database Efficiency**: Use efficient database queries and connection patterns
- **Caching Strategy**: Implement caching where appropriate for read-heavy operations
- **Response Size**: Return only necessary data in API responses

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
