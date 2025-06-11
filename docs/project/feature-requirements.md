# Feature Requirements

## Core MVP Features

### 1. Authentication & User Management
- Email magic links for production, user selection dropdown for development
- Role-based access control (Admin and Reviewer roles)
- Protected routes based on user role

### 2. Product Discovery & Integration
- Products displayed as cards with filters by brand and type-ahead search box
- Visual indicator showing which products have been reviewed vs. those awaiting review
- Product images displayed only on product cards
- Products managed via database-driven sync strategy

### 3. Specification Management
- Create new specifications with all required fields via multi-step wizard
- Edit draft specifications
- Status workflow (draft, published, needs_revision, under_review)
- View list with filters (status, brand, product title)
- Grouped by status in UI (Draft, Published, Needs Revision, Under Review)

## Post-MVP Features

### 1. Snuff Request Builder
- Semi-automated product selection (70% system, 30% personal)
- Weight constraint management (1800g limit)
- Track reviewed vs available products

### 2. Quality Control System
- AI-assisted specification scoring
- Metrics: Completeness, review sentiment/clarity
- Reviewer leaderboard for gamification
- Review improvement suggestions
- Goal: Maintain high standards, avoid extreme reviews

### 3. Public Reviewer Access
- Extended user type with limited permissions
- Separate data pool for crowd-sourced reviews

### 4. Advanced Features
- Bulk operations
- Data export functionality
- Advanced analytics
- Slack integration for notifications

## Specification Field Requirements

### Always Required Fields
- Product selection (shopify_handle)
- Product type
- Grind
- Nicotine level
- Experience level (reviewer's experience)

### Required Fields
- **Product selection** (shopify_handle) - Links to product data from Shopify
- **Product type** - Selected from enum_product_types table
- **Star rating** - Numeric rating on standard 5-star scale
- **Experience level** - Selected from enum_experience_levels
- **Nicotine level** - Selected from enum_nicotine_levels
- **Moisture level** - Selected from enum_moisture_levels
- **Grind** - Selected from enum_grinds table
- **Review text** - Free text narrative review
- **Tasting notes** - Multi-select from enum_tasting_notes (minimum 1 required)
- **Cures** - Multi-select from enum_cures (at least one required)

### Optional Fields
- **Tobacco types** - Multi-select from enum_tobacco_types (optional, requires specialized knowledge)
- **Boolean Flags**:
  - Fermented? (yes/no)
  - Oral tobacco? (yes/no)
  - Artisan? (yes/no)
- **Rating boost** - Optional field for exceptional products

### Form Validation Rules

#### Tasting Notes
- Minimum 1 tasting note required
- **Validation Message**: "Please select at least one tasting note. The more notes you can identify, the better your review will be - but only select notes you can genuinely smell or taste. If you can only identify one, that's fine."

### Quality Indicators
- Number of tasting notes (more is better)
- Completeness of review text
- Appropriate star rating

## Admin Interface Requirements

### Enum Table Management
- Enum values are editable - The text can be modified after creation
- Deletion prevention - Cannot delete values referenced by specifications
- Addition allowed - New enum values can be added at any time

### User Management
- Simple table view with role assignment
- No password management (magic link authentication)

### Data Refresh
- Manual trigger button for product data refresh
