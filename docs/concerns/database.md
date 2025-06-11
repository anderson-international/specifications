# Database Documentation

*Centralized database strategy and implementation planning for the Specification Builder project.*

## Overview

This document provides strategic guidance for database-related decisions and patterns. For current schema structure and table definitions, always reference the auto-generated [schema documentation](../db-schema.txt).

## Schema Reference

**Current Schema**: See [docs/db-schema.txt](../db-schema.txt) for complete, up-to-date table structures, relationships, constraints, and enum values.

Auto-sync schema documentation after changes:
```bash
npm run sync-schema
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
