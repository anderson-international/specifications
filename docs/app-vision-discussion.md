# Snuff Specification App Vision Discussion

## Overview
This document captures the ongoing discussion about the vision and requirements for the nasal snuff specification management application. Last updated: 2025-06-07

## Business Context

### Current Situation
- **Business**: Online nasal snuff retailer
- **Problem**: Lack of reliable product information
- **Solution**: Structured review system with 20 trusted reviewers (experts + newbies)
- **Current Process**: Using JotForm for specification collection
- **Migration**: Recently normalized and migrated data from JotForm to NeonDB using jotform-sync app
- **Scale**: ~1,200 specifications collected, ~600 products in Shopify store

### Ultimate Goal
Building a comprehensive dataset for AI/LLM training with multiple perspectives on each product. Eventually opening to public reviewers for "wisdom of crowds" data.

## User Types and Access

### Phase 1 (MVP)
1. **Trusted Reviewers** (~20 users)
   - Can create and edit their own specifications
   - Can view (but not edit) other reviewers' specifications
   - Each reviewer expected to eventually review all 600 products

2. **Admin** (store owner)
   - Full access to all data and features
   - Manages reviewer accounts

### Phase 2 (Future)
3. **Public Reviewers**
   - Can only see and edit their own specifications
   - Provides additional data volume (less trusted but valuable)

## Core Workflow

### Current Review Process
1. Reviewer decides which snuffs to review next
2. Submits "snuff request" to Slack #snuff-requests channel  
3. Request processed and products physically shipped
4. Upon receipt, reviewer selects product from dropdown
5. Creates specification in JotForm

### Problems to Solve
- Hard to track which of 1,200+ products have been reviewed
- Popular products become over-represented
- Manual process is inefficient

### New App Workflow
1. **Product Discovery**
   - Clear display of completed vs available products
   - Integration with Shopify for product data and images

2. **Snuff Request Builder** (Semi-automated)
   - System automatically includes under-represented products
   - Allows limited slots for personal picks
   - Prevents over-representation

3. **Specification Creation**
   - Direct entry in app (replacing JotForm)
   - Rich form with all specification fields

## Technical Considerations

### Shopify Integration
- Read-only access to ~600 products
- Performance issue: Slow to fetch product list
- Solution: Pre-fetch and cache data before user authentication
- Used for: Product images, product list for requests
- Relationship: One product → many specifications (one per reviewer)

### Authentication
- Development: User selection mode
- Production: Magic link email authentication
- No password storage

## User Experience Strategy

### Separate User Journeys
To avoid information overload, different tasks have distinct UI flows:
1. Creating new specifications
2. Editing existing specifications
3. Improving specification quality
4. Viewing others' specifications as examples

### Quality Control (Nice-to-Have)
- AI-assisted scoring system for specifications
- Metrics: Completeness, review sentiment/clarity
- Reviewer leaderboard for gamification
- Goal: Maintain high standards, avoid extreme reviews

## MVP Scope - Simplified Focus

### Core MVP Features (Essential CRUD Application)
1. **Authentication**
   - Email magic links (production)
   - User selection mode (development)
   
2. **User Roles**
   - **Reviewers**: 
     - Create, read, update, delete their own specifications
     - Read-only access to other reviewers' specifications
   - **Admin** (Jonny - jonny@ail.im):
     - Full CRUD access to all specifications
     - Full CRUD access to all enum tables
     - User management

3. **Specifications CRUD**
   - Create new specifications with all required fields
   - Edit draft specifications
   - Save as draft functionality (using status field)
   - Publish specifications
   - View list with filters (status, brand, product title)

4. **Basic Shopify Integration**
   - Product dropdown for specification creation
   - Display product images where available
   - Pre-fetch and cache for performance

### Nice-to-Have Features (Post-MVP)
1. **Snuff Request Builder**
   - Semi-automated product selection (70% system, 30% personal)
   - Weight constraint management (1800g limit)
   - Track reviewed vs available products
   
2. **Quality Scoring System**
   - AI-assisted specification scoring
   - Reviewer leaderboard
   - Review improvement suggestions

3. **Public Reviewer Access**
   - Extended user type with limited permissions
   - Separate data pool for crowd-sourced reviews

4. **Advanced Features**
   - Bulk operations
   - Data export functionality
   - Advanced analytics
   - Slack integration for notifications

## Open Questions
1. 10-20 products, constrained by 1800g weight limit
2. 70% system-selected, 30% personal choice
3. Simple algorithm: products with fewest total specifications
4. Specific UI/UX preferences?

## Specification Field Requirements

### Always Required Fields
- Product selection (shopify_handle)
- Product type
- Grind
- Nicotine level
- Experience level (reviewer's experience)
- Moisture level
- Product brand
- Is fermented (default: false)
- Is oral tobacco (default: false)
- Is artisan (default: false)
- Star rating (default: 0)
- Rating boost (default: 0)

### Multi-Select Fields
- **Tasting notes** - Should always have at least 1 selection
  - Key quality indicator: more notes = better review
  - Provides formalized categorization for linking snuffs
- **Cures** - Often empty (requires specialized knowledge)
- **Tobacco types** - Often empty (requires specialized knowledge)

### Free Text Fields
- Review text - The narrative review

### Quality Indicators
- Number of tasting notes (more is better)
- Completeness of review text
- Appropriate star rating

## Form Validation Rules

### Tasting Notes Requirement
- **Minimum**: 1 tasting note required
- **Validation Message**: "Please select at least one tasting note. The more notes you can identify, the better your review will be - but only select notes you can genuinely smell or taste. If you can only identify one, that's fine."

## User Interface Decisions

### Specification List View
- Drafts integrated into main specification list
- Filter system to view different slices of data
- Filters include:
  - Draft vs Published status
  - Product brand (dropdown from enum_product_brands)
  - Product title (type-ahead search box)

### Enum Table Management (Admin)
- **Enum values are editable** - The text of enum values can be modified after creation
- **Deletion prevention** - Cannot delete enum values that are referenced by specifications
- **Addition allowed** - New enum values can be added at any time
- **Rationale**: Normalization allows for fixing typos, improving clarity, and maintaining consistency

## Confirmed Database Schema (from NeonDB branch: br-tiny-lab-abtu8c62)

### Main Tables
- **specifications** - Core specification data 
- **users** - Reviewer accounts
- **spec_cures, spec_tasting_notes, spec_tobacco_types** - Junction tables
- **enum_* tables** (10 total) - Lookup values
- **jotform, jotform_shopify, transform_log** - Temporary tables to be dropped post-migration

### Key Schema Insights
- NO separate reviews or star_ratings tables exist
- `star_rating` is a field within specifications table
- **NO draft/published field exists** - will need to implement status workflow
- All enum references are foreign key constrained

## Pending Database Work
- Created `enum_specification_statuses` table with values: draft, published, needs_revision, under_review
- Added `status_id` column to specifications table (defaults to 1/draft)
- Need to UPDATE all existing specifications to status_id = 2 (published) when Prisma is configured

## Current Discussion Point
**Question pending answer:** Do you have any specific UI/UX preferences for the specification form layout (e.g., single page vs multi-step wizard, field grouping, etc.)?

## Next Steps
1. Complete pending database work (UPDATE specifications to published status)
2. Continue clarifying requirements:
   - UI/UX preferences for specification forms and lists
   - Any other MVP requirements
3. Begin project setup (Task #1 from shrimp task list)
