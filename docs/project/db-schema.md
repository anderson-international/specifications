---
id: SfA_v5_k
title: AI-Optimized Database Schema Documentation
date: 2025-06-29
description: Provide structured database information for AI models to plan interactions and generate CRUD forms
---

# AI-Optimized Database Schema Documentation

*Generated: 2025-06-29*  
*Purpose: Provide structured database information for AI models to plan interactions and generate CRUD forms*

## Overview

This database supports a snuff specification management system with:
- Multi-reviewer specifications for products
- Enum-based categorization system
- Junction tables for many-to-many relationships
- Status-based workflow system
- Integration with Shopify for product data

## Core Tables

### spec_cures
**Purpose:** Junction table - handle as multi-select in forms
**Form:** Multi-select checkboxes or tags

**Columns:**
- **specification_id**: INTEGER *required* - FK: specifications.id, REQUIRED
- **enum_cure_id**: INTEGER *required* - FORM: dropdown from enum_cures, REQUIRED

**Relationships:**
- specification_id → specifications.id
- enum_cure_id → enum_cures.id

### spec_tasting_notes
**Purpose:** Junction table - handle as multi-select in forms
**Form:** Multi-select checkboxes or tags

**Columns:**
- **specification_id**: INTEGER *required* - FK: specifications.id, REQUIRED
- **enum_tasting_note_id**: INTEGER *required* - FORM: dropdown from enum_tasting_notes, REQUIRED

**Relationships:**
- enum_tasting_note_id → enum_tasting_notes.id
- specification_id → specifications.id

### spec_tobacco_types
**Purpose:** Junction table - handle as multi-select in forms
**Form:** Multi-select checkboxes or tags

**Columns:**
- **specification_id**: INTEGER *required* - FK: specifications.id, REQUIRED
- **enum_tobacco_type_id**: INTEGER *required* - FORM: dropdown from enum_tobacco_types, REQUIRED

**Relationships:**
- specification_id → specifications.id
- enum_tobacco_type_id → enum_tobacco_types.id

### specifications
**Purpose:** Core specification data - main CRUD operations focus here
**Form:** Multi-step wizard (product selection, ratings, text review, enum selections)
**Workflow:** Published ↔ Needs Revision

**Columns:**
- **id**: INTEGER *required*
- **shopify_handle**: CHARACTER VARYING(255) *required* - REQUIRED
- **product_type_id**: INTEGER *required* - FORM: dropdown from enum_product_types, REQUIRED
- **is_fermented**: BOOLEAN - FORM: checkbox or toggle
- **is_oral_tobacco**: BOOLEAN - FORM: checkbox or toggle
- **is_artisan**: BOOLEAN - FORM: checkbox or toggle
- **grind_id**: INTEGER *required* - FORM: dropdown from enum_grinds, REQUIRED
- **nicotine_level_id**: INTEGER *required* - FORM: dropdown from enum_nicotine_levels, REQUIRED
- **experience_level_id**: INTEGER *required* - FORM: dropdown from enum_experience_levels, REQUIRED
- **review**: TEXT - FORM: textarea for long text
- **star_rating**: INTEGER - FORM: 1-5 star rating input
- **rating_boost**: INTEGER
- **created_at**: TIMESTAMP WITHOUT TIME ZONE
- **updated_at**: TIMESTAMP WITHOUT TIME ZONE
- **user_id**: UUID *required* - FK: users.id, REQUIRED
- **moisture_level_id**: INTEGER *required* - FORM: dropdown from enum_moisture_levels, REQUIRED
- **product_brand_id**: INTEGER *required* - FORM: dropdown from enum_product_brands, REQUIRED
- **submission_id**: CHARACTER VARYING(20)
- **status_id**: INTEGER *required* - FORM: dropdown from enum_specification_statuses

**Relationships:**
- product_type_id → enum_product_types.id
- moisture_level_id → enum_moisture_levels.id
- grind_id → enum_grinds.id
- experience_level_id → enum_experience_levels.id
- status_id → enum_specification_statuses.id
- product_brand_id → enum_product_brands.id
- user_id → users.id
- nicotine_level_id → enum_nicotine_levels.id

**Indexes:**
- **idx_specifications_experience_level_id**: STANDARD on (experience_level_id) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_specifications_grind_id**: STANDARD on (grind_id) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_specifications_nicotine_level_id**: STANDARD on (nicotine_level_id) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_specifications_product_brand_id**: STANDARD on (product_brand_id) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_specifications_product_type_id**: STANDARD on (product_type_id) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_specifications_shopify_handle**: STANDARD on (shopify_handle) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_specifications_status_id**: STANDARD on (status_id) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_specifications_submission_id**: STANDARD on (submission_id) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **specifications_submission_id_key**: UNIQUE on (submission_id) - QUERY: Optimized for WHERE/GROUP BY on these columns

### users
**Purpose:** User management - Admin vs Reviewer roles
**Form:** Simple user profile form

**Columns:**
- **id**: UUID *required*
- **email**: TEXT *required* - REQUIRED, FORM: email input with validation
- **name**: TEXT - FORM: text input
- **created_at**: TIMESTAMP WITH TIME ZONE
- **slack_userid**: CHARACTER VARYING(30)
- **jotform_name**: CHARACTER VARYING(100)
- **role_id**: INTEGER *required* - FORM: dropdown from enum_roles

**Relationships:**
- role_id → enum_roles.id

**Indexes:**
- **idx_user_email**: STANDARD on (email) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **idx_user_slack_userid**: STANDARD on (slack_userid) - QUERY: Optimized for WHERE/GROUP BY on these columns
- **users_email_key**: UNIQUE on (email) - QUERY: Optimized for WHERE/GROUP BY on these columns

## Junction Tables (Many-to-Many Relationships)

### spec_cures
**Purpose:** Junction table - handle as multi-select in forms
**Form:** Multi-select checkboxes or tags

**Columns:**
- **specification_id**: INTEGER *required* - FK: specifications.id, REQUIRED
- **enum_cure_id**: INTEGER *required* - FORM: dropdown from enum_cures, REQUIRED

**Relationships:**
- specification_id → specifications.id
- enum_cure_id → enum_cures.id

### spec_tasting_notes
**Purpose:** Junction table - handle as multi-select in forms
**Form:** Multi-select checkboxes or tags

**Columns:**
- **specification_id**: INTEGER *required* - FK: specifications.id, REQUIRED
- **enum_tasting_note_id**: INTEGER *required* - FORM: dropdown from enum_tasting_notes, REQUIRED

**Relationships:**
- enum_tasting_note_id → enum_tasting_notes.id
- specification_id → specifications.id

### spec_tobacco_types
**Purpose:** Junction table - handle as multi-select in forms
**Form:** Multi-select checkboxes or tags

**Columns:**
- **specification_id**: INTEGER *required* - FK: specifications.id, REQUIRED
- **enum_tobacco_type_id**: INTEGER *required* - FORM: dropdown from enum_tobacco_types, REQUIRED

**Relationships:**
- specification_id → specifications.id
- enum_tobacco_type_id → enum_tobacco_types.id

## Enum Tables (Lookup Values)

All enum tables follow the standard structure with id, name, created_at, updated_at.

### enum_cures
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"Air Cured", 2:"Fire Cured", 3:"Flue Cured", 4:"Sun Cured", 5:"Toasted"}

### enum_experience_levels
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"Beginner", 2:"Intermediate", 3:"Experienced"}

### enum_grinds
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"Fine", 2:"Medium Fine", 3:"Medium", 4:"Medium Course", 5:"Course", 6:"Small Pellets"}

### enum_moisture_levels
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"Very Dry", 2:"Dry", 3:"Slightly Moist", 4:"Moist"}

### enum_nicotine_levels
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"None", 2:"Low", 3:"Low-Medium", 4:"Medium", 5:"Medium-High", 6:"High"}

### enum_product_brands
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** 43 options including McChrystals, Mullins & Westley, NTSU...

### enum_product_types
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"Tobacco Snuff", 2:"Chew Bag", 3:"Oral Tobacco", 4:"Glucose Snuff", 5:"Accessory", 6:"Nicotine Pouch", 7:"Herbal Snuff"}

### enum_roles
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"Admin", 2:"Expert", 3:"Public"}

### enum_snuff_types
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** 21 options including American Scotch, Chewing Tobacco, Complex and Unique...

### enum_specification_statuses
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** {1:"published", 2:"needs_revision"}

### enum_tasting_notes
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** 80 options including Almond, Ammonia, Anise...

### enum_tobacco_types
**Form:** Dropdown/select options | **Validation:** Required field, foreign key constraint
**Values:** 26 options including Bahia, Basma, Brazilian...


## AI Development Guidance

### CRUD Form Generation Priority
1. **specifications** - Primary focus, multi-step wizard form
2. **users** - Simple user management forms  
3. **enum_* tables** - Admin-only management forms
4. **Junction tables** - Handle as multi-select in specification forms

### Key Relationships for AI Models
- specifications.user_id → users.id (one-to-many)
- specifications.status_id → enum_specification_statuses.id (workflow)
- specifications → spec_tasting_notes → enum_tasting_notes (many-to-many)
- specifications → spec_cures → enum_cures (many-to-many)
- specifications → spec_tobacco_types → enum_tobacco_types (many-to-many)

### Form Validation Rules
- All enum foreign keys: REQUIRED
- star_rating: INTEGER 1-5 range
- review: TEXT minimum 10 characters recommended
- Multi-select fields: At least 1 tasting note required, cures optional
- Email: Valid email format for users table

### Status Workflow Logic
- Published (1): Visible to all, read-only for reviewers.
- Needs Revision (2): Flagged for improvement, editable by owner.

### Performance Considerations
- Use indexes on foreign key columns for joins
- specifications table will be largest - optimize queries
- Enum tables are small - safe to cache in memory
- Junction tables - use batch operations for multi-select updates

---
Generated by scripts/sync-schema.js - DO NOT EDIT MANUALLY
Run 'npm run sync-schema' to regenerate this file
