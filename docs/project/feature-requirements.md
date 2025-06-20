---
complianceLevel: critical
status: active
tags: [features, requirements, specifications, validation, admin-interface]
id: 1017
---

# Feature Requirements

<!-- AI_QUICK_REF
Overview: This document serves as the definitive specification guide that translates business requirements into specific develo...
Key Rules: Required field specifications (line 52), Multi-step wizard requirements (line 17), Role-based access (line 6)
Avoid: Missing required field validation, Ignoring wizard structure, Overlooking admin interface specs
-->

## Core MVP Features

### 1. Authentication & User Management
- Email magic links for production, user selection for development
- Role-based access control (Admin and Reviewer)
- Protected routes based on user role

### 2. Product Discovery & Integration
- Product cards with filters and search
- Visual indicators for reviewed vs. unreviewed products
- Product images displayed on cards only
- Database-driven product sync strategy

### 3. Specification Management
- Multi-step wizard for creating specifications
- Draft editing capability
- Status workflow (draft, published, needs_revision, under_review)
- Filtered list view grouped by status

## Post-MVP Features

### 1. Snuff Request Builder
- Semi-automated product selection (70% system, 30% personal)
- Weight constraint management (1800g limit)
- Track reviewed vs available products

### 2. Quality Control System
- AI-assisted specification scoring
- Metrics for completeness and clarity
- Reviewer leaderboard for gamification
- Review improvement suggestions

### 3. Public Reviewer Access
- Extended user type with limited permissions
- Separate data pool for crowd-sourced reviews

### 4. Advanced Features
- Bulk operations
- Data export functionality
- Advanced analytics
- Slack integration

## Specification Field Requirements

### Always Required Fields
- Product selection (shopify_handle)
- Product type
- Grind
- Nicotine level
- Experience level (reviewer's experience)

### Required Fields
- **Product selection** - Links to Shopify product data
- **Product type** - From enum_product_types
- **Star rating** - 5-star scale
- **Experience level** - From enum_experience_levels
- **Nicotine level** - From enum_nicotine_levels
- **Moisture level** - From enum_moisture_levels
- **Grind** - From enum_grinds
- **Review text** - Narrative review
- **Tasting notes** - Multi-select (minimum 1)
- **Cures** - Multi-select (minimum 1)

### Optional Fields
- **Tobacco types** - Multi-select
- **Boolean Flags**:
  - Fermented? (yes/no)
  - Oral tobacco? (yes/no)
  - Artisan? (yes/no)
- **Rating boost** - Provides a boost to the current star rating

### Form Validation Rules

#### Tasting Notes
- Minimum 1 tasting note required
- **Validation Message**: "Please select at least one tasting note. The more notes you can identify, the better your review will be - but only select notes you can genuinely smell or taste."

### Quality Indicators
- Number of tasting notes
- Review text completeness
- Appropriate star rating

## Admin Interface Requirements

### Enum Table Management
- Editable enum values
- Deletion prevention for referenced values
- Addition of new values allowed

### User Management
- Table view with role assignment
- Magic link authentication (no passwords)

### Data Refresh
- Manual product data refresh trigger
