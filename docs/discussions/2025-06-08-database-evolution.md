# Database Evolution Discussion

**Date**: 2025-06-08 (Updated: 2025-06-11)

## Context/Background

This document tracks the evolution of the database structure for the Specification Builder application as it has moved from JotForm to a structured database schema in NeonDB. It captures key insights, pending work, and schema considerations to maintain historical context for development decisions.

**Update 2025-06-11**: Database finalization work has been completed successfully.

## Discussion Points

### Confirmed Database Schema (from NeonDB branch: br-tiny-lab-abtu8c62)

#### Main Tables
- **specifications** - Core specification data 
- **users** - Reviewer accounts
- **spec_cures, spec_tasting_notes, spec_tobacco_types** - Junction tables
- **enum_* tables** (11 total) - Lookup values including roles and status
- **jotform, jotform_shopify, transform_log** - Temporary tables to be dropped post-migration

#### Key Schema Insights
- NO separate reviews or star_ratings tables exist
- `star_rating` is a field within specifications table
- **Status workflow now implemented** - enum_specification_statuses with proper foreign keys
- All enum references are foreign key constrained
- **User role normalization complete** - users.role_id references enum_roles

### Completed Database Work (2025-06-11)

#### 1. Schema Documentation Automation
- **Implemented**: `npm run sync-schema` script for AI-optimized schema documentation
- **Location**: `scripts/sync-schema.js` 
- **Output**: Auto-generates `docs/db-schema.txt` with form hints, validation rules, relationships
- **Status**: Fully functional and tested

#### 2. User Role Normalization  
- **Completed**: Dropped old `role` TEXT column from users table
- **Foreign Key**: `users.role_id → enum_roles.id` properly constrained
- **Values**: Admin(1), Expert(2), Public(3) - roles updated from original Admin/Reviewer concept
- **Status**: 100% complete

#### 3. Status Workflow Implementation
- **Verified**: enum_specification_statuses contains: draft(1), published(2), needs_revision(3), under_review(4)
- **Migration**: All 1,286 existing specifications have valid status_id values (currently all draft)
- **Foreign Key**: `specifications.status_id → enum_specification_statuses.id` properly constrained
- **Workflow Rules**: Documented for application logic implementation
- **Status**: 100% complete

### Product Data Management Strategy

- **Decision**: Database-driven approach with both scheduled and on-demand refresh
- **Implementation**:
  - Store products in local database table (products)
  - Create stored procedure `refresh_shopify_products()` to handle Shopify API calls
  - Use NeonDB's pg_cron extension for scheduled refresh (every 6 hours)
  - Add admin API endpoint `/api/admin/refresh-products` for manual refresh
  - Both scheduled and manual refresh use the same stored procedure
  - Store minimal required fields (id, handle, title, images, vendor)
  - Include last_updated timestamp for tracking freshness
  - Log all refresh operations (scheduled vs. manual) for auditability
- **Rationale**:
  - Eliminates direct Shopify API calls from application code
  - Provides both automated and on-demand data freshness
  - Admin users can immediately sync known Shopify catalog changes
  - Simplifies queries and joins with other application data
  - Reduces API rate limit concerns
  - Maintains data consistency across the application
  - No external cron jobs or infrastructure needed

## Decisions/Conclusions

1. **Database finalization complete** - Status workflow, user role normalization, and schema documentation automation all implemented
2. **Schema documentation process** - Automated AI-optimized documentation ensures consistency
3. **Role system finalized** - Three-tier role system (Admin/Expert/Public) rather than binary Admin/Reviewer
4. **Product data management approach confirmed** - Database-driven with pg_cron scheduling
5. **Next phase ready** - Database foundation is solid for Next.js application development

## Current Discussion Point (2025-06-11)

With the database foundation now complete, we need to address the remaining implementation decisions for the product sync system and overall application architecture.

### Immediate Questions to Resolve:

1. **Product Table Structure**: What specific fields do we need in the `products` table beyond the basics (id, handle, title, images, vendor)?

### ✅ Product Table Structure Decision (2025-06-11)

**Confirmed Fields for `products` table:**
- **handle** - Unique product identifier (primary key)
- **title** - Product name/title
- **image** - Product image URL
- **product_type** - Product category/type
- **custom.brands** - Brand information from Shopify metafield
- **updated_at** - Shopify's updated_at timestamp for incremental sync
- **last_synced** - Our sync timestamp for tracking

**Key Design Principle**: Products are treated as single entities, not variants. Each product has multiple weight variants in Shopify, but we consolidate to one record per handle. This approach:
- Simplifies product discovery and selection in the app
- Avoids variant-level complexity (inventory, pricing variations)
- Aligns with how reviewers think about products conceptually
- Matches the existing `specifications.shopify_handle` field structure

**Excluded Fields**: Inventory, pricing, variant-specific data (these are variant-level in Shopify)

### ✅ Sync Strategy Decision: Incremental Updates via Shopify updated_at

**Approach**: Use Shopify's `updated_at` field for incremental sync instead of complex logging:
1. Store Shopify's `updated_at` timestamp in products table
2. On sync, query max(`updated_at`) from products table  
3. Filter Shopify API call: `updated_at_min` = our latest timestamp
4. Only fetch/update products modified since last sync

**Benefits**: 
- Eliminates need for refresh logging tables
- More efficient API usage (only changed products)
- Simpler implementation and maintenance
- Natural deduplication via Shopify timestamps

**Stored Procedure Logic**:
- Get latest `updated_at` from products table
- Call Shopify API with `updated_at_min` filter
- Upsert returned products
- Handle new products (no existing timestamp)

## Open Questions

1. ✅ **Product table structure** → **DECIDED**: handle, title, image, product_type, custom.brands, updated_at, last_synced
2. ✅ **Refresh Logging** → **DECIDED**: Use Shopify updated_at for incremental sync, no logging needed
3. ✅ **Error Handling** → **DECIDED**: Fail fast - abort sync, surface error to admin
4. ✅ **Initial Data** → **DECIDED**: Development subset sync, then manual full sync via admin, then scheduled
5. ✅ **Shopify Deletions** → **DECIDED**: Soft delete - mark deleted products as inactive, preserve for historical specs

## Final Decisions Summary (2025-06-11)

**Database Foundation**: ✅ Complete
- Schema documentation automation implemented
- User role normalization completed  
- Status workflow implemented

**Product Sync Strategy**: ✅ Defined
- **Table**: products (handle, title, image, product_type, custom.brands, updated_at, last_synced, is_active)
- **Sync**: Incremental via Shopify updated_at timestamps
- **Error handling**: Fail fast, surface errors to admin
- **Development**: Limited subset, manual full sync, then scheduled pg_cron
- **Deletions**: Soft delete with is_active flag

## Next Steps

**Integration Phase**: Update project documentation with final decisions

1. **Update `docs/project/architectural-guidelines.md`** - Add product sync patterns and database integration
2. **Update `docs/project/project-blueprint.md`** - Reflect final product discovery implementation
3. **Create implementation specifications** for:
   - Products table schema
   - Shopify sync stored procedure
   - Admin API endpoints
   - pg_cron job configuration

**Discussion Status**: ✅ **COMPLETE** - Ready for implementation planning

**Next Discussion Topic**: Next.js application architecture and authentication implementation
