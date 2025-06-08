# Database Evolution Discussion

**Date**: 2025-06-08

## Context/Background

This document tracks the evolution of the database structure for the Specification Builder application as it has moved from JotForm to a structured database schema in NeonDB. It captures key insights, pending work, and schema considerations to maintain historical context for development decisions.

## Discussion Points

### Confirmed Database Schema (from NeonDB branch: br-tiny-lab-abtu8c62)

#### Main Tables
- **specifications** - Core specification data 
- **users** - Reviewer accounts
- **spec_cures, spec_tasting_notes, spec_tobacco_types** - Junction tables
- **enum_* tables** (10 total) - Lookup values
- **jotform, jotform_shopify, transform_log** - Temporary tables to be dropped post-migration

#### Key Schema Insights
- NO separate reviews or star_ratings tables exist
- `star_rating` is a field within specifications table
- **NO draft/published field exists** - will need to implement status workflow
- All enum references are foreign key constrained

### Pending Database Work
- Created `enum_specification_statuses` table with values: draft, published, needs_revision, under_review
- Added `status_id` column to specifications table (defaults to 1/draft)
- Need to UPDATE all existing specifications to status_id = 2 (published) when Prisma is configured

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

1. We will use a database-driven approach with NeonDB's pg_cron for product data management rather than ISR caching
2. The existing database schema is largely sufficient, just needing status workflow implementation
3. The database is already set up and populated; special tables from JotForm migration will be removed later

## Open Questions

1. What is the optimal structure for logging product refresh operations?
2. Is there a need for versioning specifications as they go through workflow states?

## Next Steps

1. I'll prepare the implementation plan for the stored procedure and pg_cron job setup
2. We should review the specific fields needed for the product data table to ensure it contains all necessary information
3. I need to draft the API endpoint design for manual product refreshes

The next step in our discussion should focus on the implementation details of the stored procedure and how to properly set up the pg_cron job in NeonDB.
