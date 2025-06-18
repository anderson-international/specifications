---
title: Database Documentation  
description: Database strategy, Prisma ORM patterns, and product sync implementation
version: 1.0.0
status: active
lastUpdated: 2025-06-17
author: Development Team
complianceLevel: required
readingTime: 12 minutes
tags: [database, prisma, orm, shopify-sync, schema, performance]
---

# Database Documentation

*Database strategy for the Specification Builder project.*

<!-- AI_NAVIGATION
Reading Priority: 3 (Important reference for database implementation)
Primary Focus: Database architecture strategy, Prisma ORM patterns, Shopify product sync implementation, and development workflow for data layer
Key Compliance Points:
- Prisma ORM singleton pattern and type safety (line 46-48)
- Product sync fail-fast error handling approach (line 29-31)
- Schema change workflow with forward-fix strategy (line 57-60)
- Database transaction usage for atomic operations (line 53)
Critical Cross-references:
- Database Schema (../db-schema.txt): Complete table structures and relationships reference
- Form Management (form-management.md): Database integration patterns for forms
- API Design (api-design.md): Database interaction patterns for API endpoints
- Database-Form Integration (../guides/database-form-integration.md): Type-safe data handling patterns
Anti-patterns:
- Using fallback data when sync operations fail
- Complex database rollback procedures instead of fix-forward approach
- Multiple Prisma client instances across application
- Hard deleting products instead of soft deletes
Additional Context: This document focuses on practical database patterns for solo development, emphasizing simplicity and reliability over complex architectures
-->

<!-- AI_SUMMARY
This document establishes the database architecture strategy for the Specification Builder project with these key components:

• Prisma ORM Strategy - Single client instance, type-safe operations, generated types throughout application
• Shopify Product Sync - Database-driven incremental sync with fail-fast error handling and scheduled refresh patterns
• Schema Management - Simple SQL-based changes with fix-forward approach rather than complex rollbacks
• Performance Guidelines - Query-based indexing, connection pooling, and monitoring strategies for solo development
• Development Workflow - Separate test environments, clean slate testing, and basic seeding approaches

The strategy prioritizes simplicity and reliability for hobbyist development while maintaining data integrity and performance.
-->

## Overview

This document provides strategic guidance for database-related decisions and patterns. For current schema structure and table definitions, always reference the auto-generated [schema documentation](../db-schema.txt).

## Schema Reference

**Current Schema**: Read [docs/db-schema.txt](../db-schema.txt) for complete, up-to-date table structures, relationships, constraints, and enum values.

Auto-sync schema documentation after changes:
```bash
cmd /c npm run sync-schema
```

## Product Sync Strategy

**Approach**: Database-driven sync with local caching and scheduled refresh from Shopify API.

### Core Strategy
- **Incremental Sync**: Use Shopify timestamps to only fetch changed products
- **Local Storage**: Cache products in database for fast access and offline capability
- **Scheduled Refresh**: Automated periodic sync via database scheduling (pg_cron)
- **Manual Trigger**: Admin interface for on-demand sync operations

### Error Handling Philosophy
- **Fail-Fast**: Abort operations on errors, surface issues immediately
- **No Fallbacks**: Don't use stale or substitute data when sync fails
- **Explicit Logging**: Record sync operations for debugging and monitoring

### Development Approach
- **Start Small**: Limit to product subset during development
- **Manual Control**: Full sync via admin interface before production
- **Automated Production**: Schedule regular sync jobs after initial setup

### Data Integrity
- **Soft Deletes**: Mark removed products as inactive rather than hard delete
- **Preserve References**: Maintain historical data for existing specifications
- **Handle Conflicts**: Shopify data always wins during sync operations

## Database Interaction Patterns

### ORM Strategy
- **Prisma ORM**: Single data access layer for all database operations
- **Type Safety**: Leverage Prisma's generated types throughout application
- **Singleton Pattern**: Use single Prisma client instance across application

### Query Philosophy
- **Validation First**: Always validate data before database operations
- **Efficient Queries**: Use Prisma's select/include features for performance
- **Transaction Support**: Use Prisma transactions for atomic operations

## Development Workflow

### Schema Changes
- **Simple Approach**: Use direct SQL scripts for schema modifications
- **Fix Forward**: Address issues as they arise rather than complex rollback procedures
- **Document Changes**: Update schema documentation after modifications

### Testing Strategy
- **Separate Environment**: Use test database for development testing
- **Simple Seeding**: Basic data setup for consistent testing
- **Clean Slate**: Reset test data between runs for reliable results

## Performance Guidelines

### Indexing Strategy
- **Query-Based**: Index fields based on actual query patterns
- **Foreign Keys**: Always index relationship fields
- **Monitor Performance**: Adjust indexes based on usage patterns

### Connection Management
- **Prisma Pooling**: Use built-in connection pooling features
- **Environment Limits**: Configure connections based on deployment platform
- **Simple Monitoring**: Basic connection usage tracking

---

*This document focuses on strategic guidance for database planning. All specific schema details are maintained in the auto-generated [docs/db-schema.txt](../db-schema.txt).*
