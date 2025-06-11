# Specifications Project Blueprint

## Overview
This document serves as the comprehensive blueprint for the Specification Builder application, defining its vision, requirements, and implementation plan. It represents the single source of truth for project direction and key decisions. Last updated: 2025-06-08

## Business Context

### Current Situation
- **Business**: Online snuff retailer
- **Problem**: Lack of reliable product information
- **Solution**: Structured review system with 20 trusted reviewers (experts + newbies)
- **Current Process**: Using JotForm for specification collection
- **Migration**: Recently normalized and migrated data from JotForm to NeonDB using jotform-sync app
- **Scale**: ~1,200 specifications collected, ~600 products in Shopify store

### Ultimate Goal
Building a comprehensive dataset for AI/LLM training with multiple perspectives on each product. Eventually opening to public reviewers for "wisdom of crowds" data.

## User Types and Access

### Phase 1 (MVP)
1. **Reviewers** (~20 users)
   - Can create and edit their own specifications
   - Can view (but not edit) other reviewers' specifications
   - Each reviewer expected to eventually review all 600 products
   - Can save specifications as drafts before publishing

2. **Admin** (store owner)
   - Full CRUD access to all primary tables:
     - specifications: Can create, read, update, and delete any specification regardless of author
     - users: Complete user management (create, update, delete reviewer accounts)
     - All enum tables: Can manage values for all 11 enum tables (product types, grinds, nicotine levels, etc.)
   - Workflow management:
     - Can change specification status (draft, published, needs_revision, under_review)
     - Can approve or request revisions for specifications
   - System configuration: Can modify system settings and integrations
   - Data management: Export data and generate reports
   - Can manually trigger product data refresh from Shopify

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
- Hard to track which of 600 products have been reviewed
- Popular products become over-represented
- Manual process is inefficient

### New App Workflow
1. **Product Discovery**
   - Clear visual indicator showing which products have already been reviewed vs. those awaiting review
   - Products displayed as cards with filters by brand and type-ahead search box
   - Product images displayed only on product cards
   - Products managed via database-driven sync strategy (see [Architectural Guidelines](architectural-guidelines.md#database-driven-product-sync) for implementation details)

2. **Specification Creation**
   - Direct entry in app (replacing JotForm) using multi-step wizard form
   - Rich form with all specification fields organized in logical steps
   - Draft saving capability using status workflow
   - Form validation with clear feedback

3. **Specification Management**
   - View lists grouped by status (Draft, Published, Needs Revision, Under Review)
   - Edit draft specifications
   - View read-only published specifications
   - Filter by product attributes

## Technical Architecture

### Authentication
- **Production**: Magic link email authentication (no password storage)
- **Development**: User selection dropdown for testing
- Role-based access control (Admin vs Reviewer)

## Feature Requirements

### Core MVP Features

1. **Authentication & User Management**
   - Email magic links for production, user selection dropdown for development
   - Role-based access control (Admin and Reviewer roles)
   - Protected routes based on user role

2. **Product Discovery & Integration**
   - Products displayed as cards with filters by brand and type-ahead search box
   - Visual indicator showing which products have been reviewed vs. those awaiting review
   - Product images displayed only on product cards
   - Products managed via database-driven sync strategy (see [Architectural Guidelines](architectural-guidelines.md#database-driven-product-sync) for implementation details)

3. **Specification Management**
   - Create new specifications with all required fields via multi-step wizard
   - Edit draft specifications
   - Status workflow (draft, published, needs_revision, under_review)
   - View list with filters (status, brand, product title)
   - Grouped by status in UI (Draft, Published, Needs Revision, Under Review)

### Post-MVP Features

1. **Snuff Request Builder**
   - Semi-automated product selection (70% system, 30% personal)
   - Weight constraint management (1800g limit)
   - Track reviewed vs available products
   
2. **Quality Control System**
   - AI-assisted specification scoring
   - Metrics: Completeness, review sentiment/clarity
   - Reviewer leaderboard for gamification
   - Review improvement suggestions
   - Goal: Maintain high standards, avoid extreme reviews

3. **Public Reviewer Access**
   - Extended user type with limited permissions
   - Separate data pool for crowd-sourced reviews

4. **Advanced Features**
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

#### Required Fields
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

#### Optional Fields
- **Tobacco types** - Multi-select from enum_tobacco_types (optional, requires specialized knowledge)
- **Boolean Flags**:
  - Fermented? (yes/no)
  - Oral tobacco? (yes/no)
  - Artisan? (yes/no)
- **Rating boost** - Optional field for exceptional products

### Form Validation Rules

- **Tasting Notes**: Minimum 1 tasting note required
  - **Validation Message**: "Please select at least one tasting note. The more notes you can identify, the better your review will be - but only select notes you can genuinely smell or taste. If you can only identify one, that's fine."

### Quality Indicators
- Number of tasting notes (more is better)
- Completeness of review text
- Appropriate star rating

## UI/UX Design Decisions

### Mobile-First Design
- **Primary Design Target**: Mobile devices
- All UX decisions will prioritize mobile user experience
- Desktop experience will be an enhancement of the mobile design
- Touch-friendly UI elements throughout the application

### App Navigation Structure
- **Decision**: Left-hand navigation panel with collapsible behavior on mobile
- **Implementation**:
  - Fixed left nav with main sections:
    - Specifications
    - Products
    - New Specification
    - Admin (only visible to admin users)
  - Main content area shows relevant data for selected section
  - Collapsible on mobile for maximum screen space
  - Shows progress stats (e.g., "245/600 products reviewed")
- **Rationale**: Clear entry points, shows progress, scales well for future features

### Specifications List View
- **Decision**: Grouped by status layout
- **Implementation**:
  - Sections: Draft, Published, Needs Revision, Under Review
  - Each section collapsible with count badge
  - Within sections: product title, date, and star rating
  - Swipe actions for quick edit/delete (draft only)
  - Filter system to view different slices of data:
    - Product brand (dropdown from enum_product_brands)
    - Product title (type-ahead search box)

### Admin Interface Elements
- **Enum Table Management**:
  - Enum values are editable - The text can be modified after creation
  - Deletion prevention - Cannot delete values referenced by specifications
  - Addition allowed - New enum values can be added at any time
- **User Management**:
  - Simple table view with role assignment
  - No password management (magic link authentication)
- **Data Refresh**:
  - Manual trigger button for product data refresh

### Specification Form Layout: Multi-Step Wizard
- **Decision**: Multi-step wizard approach for specification forms
- **Rationale**: 
  - Reduces cognitive load on small screens
  - Natural vertical flow for mobile
  - Clear progress indication
  - Better error handling per step
  - Prevents overwhelm with 15+ fields

#### Wizard Steps Structure
1. **Step 1: Product Selection** 
   - Filter by brand dropdown (populated from enum_product_brands)
   - Type-ahead search box within selected brand
   - **Excludes products already reviewed by current user**
   - Shows product image and name in search results
   - Visual indicator showing total products vs. remaining to review
   
2. **Step 2: Product Characteristics 1**
   - Product type - segmented control/chip selector
   - Experience level
   - Tobacco types (multi-select, optional)

3. **Step 3: Product Characteristics 2**
   - Cures (multi-select, optional)
   - Grind - segmented control/chip selector  
   - Boolean flags - toggle switches (fermented, oral tobacco, artisan)
   
4. **Step 4: Sensory Profile**
   - Tasting notes (multi-select, minimum 1 required)
   - Nicotine level - segmented control/chip selector
   - Moisture level - segmented control/chip selector
   
5. **Step 5: Review & Rating**
   - Review text (textarea)
   - Star rating
   - Rating boost

#### Wizard Navigation Pattern
- **Decision**: Swipe gestures for step navigation
- **Implementation**: Swipe left/right between steps with visual hints
- **Rationale**: Natural mobile interaction pattern, maximizes screen space

#### Mobile-Optimized UI Components
- **Segmented controls**: For enum selections with 3-5 options (replaces dropdowns)
- **Toggle switches**: For boolean fields (more touch-friendly than checkboxes)
- **Compact design**: Ensures each wizard step fits on screen without scrolling
- **Touch targets**: Minimum 48px height for all interactive elements

#### Form Validation Pattern
- **Decision**: Step validation - validate when swiping to next step
- **Implementation**: 
  - Validation triggers on swipe gesture
  - All errors for current step shown at once
  - Prevents progression until step is valid
- **Rationale**: Natural checkpoint, all errors visible on single screen, less distracting

#### App Navigation Structure
- **Decision**: Dashboard with left-hand navigation panel
- **Implementation**:
  - Fixed left-hand navigation panel with main sections:
    - Dashboard (home/overview)
    - My Specifications 
    - New Specification
    - Admin (only visible to admin users)
  - Main content area shows relevant data for selected section
  - Collapsible on mobile for maximum screen space
  - Shows progress stats (e.g., "245/600 products reviewed")
- **Rationale**: Clear entry points, shows progress, scales well for future features

#### Specifications List View
- **Decision**: Grouped by status layout
- **Implementation**:
  - Sections: Draft, Published, Needs Revision, Under Review
  - Each section collapsible with count badge
  - Within sections: product image, name, date
  - Swipe actions for quick edit/delete (draft only)
- **Rationale**: Clear organization, easy to find specs needing attention

#### Multi-Select Field Pattern
- **Decision**: Search + chips pattern for multi-select fields
- **Implementation**: 
  - Search box to filter available options
  - Selected items appear as chips below search
  - Chips have 'x' to remove selection
- **Applies to**: Tasting notes, cures, tobacco types
- **Rationale**: Handles large option sets efficiently, clear selection state, familiar mobile pattern

#### Visual Design Style
- **Decision**: Card-based design with dark theme
- **Color Palette** (matching existing website):
  - Content Background: #1E2128 (30, 33, 40)
  - Card Background: #252831 (slightly lighter) with #343741 border
  - Border: #343741 (52, 55, 65)
  - Text: #FFFFFF (255, 255, 255)
  - Link: #4693D1 (70, 147, 209)
  - Primary Button: #1878B9 (24, 120, 185)
  - Success Button: #469B3B (70, 155, 59)
  - Divider: #A1A1A1 (161, 161, 161)
- **Implementation**:
  - Cards with both border and lighter background for maximum distinction
  - Each form section in its own card
  - Consistent spacing using 8px grid
- **Rationale**: Brand consistency, visual organization, reduces eye strain

## Technical Stack Decisions

### Frontend Framework
- **Decision**: Next.js
- **Rationale**: 
  - React-based with strong ecosystem
  - Excellent mobile performance
  - Server-side rendering for fast initial loads
  - Built-in API routes
  - Image optimization for product images

### CSS/Styling Approach
- **Decision**: CSS Modules
- **Rationale**:
  - Simplicity - plain CSS, no new syntax
  - Zero runtime overhead (small file sizes)
  - Clear separation of concerns
  - Built into Next.js (no dependencies)
  - Automatic style scoping
- **Implementation**:
  - Global CSS variables for theme colors
  - Component-specific `.module.css` files
  - Mobile-first responsive design

### Database ORM
- **Decision**: Prisma
- **Rationale**:
  - Type-safe database access
  - Auto-generated types from schema
  - Excellent developer experience
  - Powerful migration system
  - Already established in architectural guidelines

### UI Component Library
- **Decision**: Headless UI for complex components + custom for simple ones
- **Use Headless UI for**:
  - Combobox (product search with autocomplete)
  - Listbox (dropdowns like brand filter)

### Form State Management
- **Library**: React Hook Form with Zod schemas
- **Implementation**:
  - Multi-step wizard with controlled progression
  - Custom hook for form state across steps
  - Step validation before progression
  - Draft saving capabilities via status field

### API Design
- **Pattern**: RESTful endpoints with Next.js App Router
- **Key Routes**:
  - `/api/specifications` - Specification management
  - `/api/enum/[table]` - Enum table CRUD operations
  - `/api/auth/*` - Authentication endpoints
  - `/api/admin/refresh-products` - Manual product refresh trigger

### Data Validation
- **Strategy**: Single source of truth with Zod schemas
- **Implementation**:
  - Shared schemas between client and server
  - Type-safe validation with TypeScript
  - Integration with React Hook Form
  - Consistent error messaging

### Product Data Management
- **Approach**: Database-driven with scheduled and manual refresh
- **Implementation**: See [Architectural Guidelines - Database-Driven Product Sync](architectural-guidelines.md#database-driven-product-sync) for complete implementation details including table structure, sync procedures, and API endpoints

### Deployment
- **Platform**: Netlify via Windsurf IDE integration
- **Configuration**: netlify.toml with environment variables
- **Benefits**: Seamless deployment, preview environments, excellent Next.js support

## Implementation Roadmap

### Phase 1: Foundation

1. **Project Setup**
   - Initialize Next.js 14 project with App Router
   - Configure TypeScript, ESLint, and Prettier
   - Connect to existing NeonDB database with Prisma ORM
   - Set up environment variables for development and production

2. **Authentication System**
   - Implement Auth.js (NextAuth) with email magic link provider
   - Configure NeonDB adapter for user data persistence
   - Create login/logout flows with appropriate redirects
   - Implement user roles (Admin, Reviewer) with middleware
   - Set up protected routes based on user role

### Phase 2: Core Functionality

3. **Database & API Integration**
   - Implement Prisma models for all required tables
   - Create RESTful API routes with consistent error handling
   - Configure stored procedure `refresh_shopify_products()` for Shopify data
   - Set up NeonDB's pg_cron extension for scheduled product refresh (every 6 hours)
   - Create admin API endpoint for manual product data refresh

4. **Form Architecture**
   - Define Zod validation schemas for all forms
   - Implement React Hook Form with validation integration
   - Create multi-step wizard form components
   - Build form state management with step transition handling
   - Implement draft saving functionality using specification status

### Phase 3: User Interface

5. **Product Discovery & Selection UI**
   - Implement product cards with filtering by brand
   - Create type-ahead search functionality
   - Build visual indicators for reviewed vs. unreviewed products
   - Implement responsive product browsing interface

6. **Specification Management UI**
   - Implement left-hand navigation panel with mobile collapse
   - Build specifications list view with status grouping
   - Create filtering and sorting capabilities
   - Implement CRUD operations for specifications
   - Develop admin-only interfaces for enum table management

### Phase 4: Refinement & Deployment

7. **Mobile Optimization**
   - Fine-tune responsive layouts for all form steps
   - Optimize touch targets and gesture controls
   - Test and refine mobile user flows

8. **Performance & Deployment**
   - Implement client-side data fetching with SWR
   - Add pagination for large data sets
   - Configure Netlify deployment pipeline
   - Implement critical path testing
   - Final QA verification on mobile and desktop
