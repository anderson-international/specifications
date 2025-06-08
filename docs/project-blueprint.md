# Specifications Project Blueprint

## Overview
This document serves as the comprehensive blueprint for the snuff specification management application, defining its vision, requirements, and implementation plan. It represents the single source of truth for project direction and key decisions. Last updated: 2025-06-07

## Getting Started

### Development Environment Setup

#### Prerequisites
- Node.js 18+ (LTS)
- Git
- A code editor (Windsurf IDE recommended for native Netlify integration)

#### Initial Setup

1. **Clone the Repository**
   ```cmd
   git clone <repository-url>
   cd specifications
   ```

2. **Install Dependencies**
   ```cmd
   npm install
   ```

3. **Environment Configuration**
   ```cmd
   copy .env.example .env
   ```
   Edit `.env` with your specific environment values:
   - `DATABASE_URL` - NeonDB connection string for PostgreSQL
   - `SHOPIFY_STORE_URL` - Your Shopify store URL
   - `SHOPIFY_ACCESS_TOKEN` - Shopify Storefront API access token
   - `SHOPIFY_API_VERSION` - Shopify API version to use
   - `SHOPIFY_API_KEY` - Shopify API key
   - `SHOPIFY_API_SECRET_KEY` - Shopify API secret key

4. **Database Setup**
   ```cmd
   :: Generate Prisma client based on schema
   npx prisma generate
   
   :: Apply migrations to your development database
   npx prisma migrate dev
   ```

5. **Start Development Server**
   ```cmd
   npm run dev
   ```
   The application will be available at http://localhost:3000

#### NeonDB Connection

You'll need to create a NeonDB project and obtain a connection string from the NeonDB dashboard. The connection string format is:

```
postgres://user:password@host:port/database
```

Connect to your development branch for local development and the main branch for production deployment.

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

### Dev Mode Authentication UI
- **Decision**: Dropdown list for user selection
- **Implementation**:
  - Simple dropdown with test users
  - Shows user name and role (admin/reviewer)
  - "Login" button below dropdown
- **Rationale**: Simple, familiar pattern for development testing

### UI/UX Design Decisions

### Mobile-First Design
- **Primary Design Target**: Mobile devices
- All UX decisions will prioritize mobile user experience
- Desktop experience will be an enhancement of the mobile design

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
   - Leverages pre-fetched Shopify data (cached before auth)
   - Visual indicator showing total products vs. remaining to review
   
2. **Step 2: Product Characteristics**
   - Product type - segmented control/chip selector
   - Grind - segmented control/chip selector  
   - Nicotine level - segmented control/chip selector
   - Moisture level - segmented control/chip selector
   - Product brand - compact dropdown/modal picker
   - Boolean flags - toggle switches (fermented, oral tobacco, artisan)
   
3. **Step 3: Sensory Profile**
   - Tasting notes (multi-select, minimum 1 required)
   - Cures (multi-select, optional)
   - Tobacco types (multi-select, optional)
   
4. **Step 4: Review & Rating**
   - Review text (textarea)
   - Star rating
   - Rating boost
   - Experience level

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
- **Decision**: Home dashboard - central screen with cards/buttons
- **Implementation**:
  - Dashboard shows main actions as cards
  - "My Specifications" card
  - "Create New Specification" card  
  - "Admin" card (only visible to admin users)
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
  - Banner: #FFFFFF (255, 255, 255)
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
  - Dialog (modal pickers)
  - Transition (wizard step animations)
- **Build from scratch**:
  - Cards, buttons, toggles
  - Progress indicators
  - Simple form inputs
- **Rationale**: 
  - Handles complex mobile/accessibility concerns
  - Maintains full visual control with CSS Modules
  - Minimal dependencies

### Form State Management
- **Decision**: React Hook Form
- **Rationale**:
  - Built-in validation and error handling
  - Excellent performance with many fields
  - Automatic state persistence across wizard steps
  - Minimal re-renders
  - Works well with TypeScript
- **Key patterns**:
  - Custom hook for multi-step form logic
  - Step validation before progression
  - Draft saving capabilities

### API Route Structure
- **Decision**: RESTful pattern with App Router
- **Structure**:
  - `/api/specifications` - GET (list), POST (create)
  - `/api/specifications/[id]` - GET, PUT, DELETE
  - `/api/enum/[table]` - Generic CRUD for enum tables
  - `/api/auth/*` - Authentication endpoints
- **Rationale**:
  - Standard REST conventions
  - Clear resource-based organization
  - Easy to understand and maintain
  - Works well with Prisma models

### Data Validation Strategy
- **Decision**: Zod schemas for validation
- **Rationale**:
  - Type-safe validation with TypeScript
  - Single source of truth for validation rules
  - Reusable between client and server
  - Integrates perfectly with React Hook Form
  - Automatic error messages
- **Implementation**:
  - Define schemas in `lib/validations/`
  - Use zodResolver with React Hook Form
  - Parse API inputs with same schemas
  - Generate TypeScript types from schemas

### Shopify Caching Strategy
- **Decision**: ISR (Incremental Static Regeneration) with client-side caching
- **Implementation**:
  - API route with `revalidate: 3600` (1 hour)
  - Fetch minimal fields only (handle, title, images, vendor)
  - Client-side SWR for additional caching layer
  - Pre-fetch before auth for perceived performance
- **Rationale**:
  - Balances freshness with performance
  - Simple implementation, no background jobs
  - Handles ~600 products efficiently
  - Updates automatically without manual intervention

### Deployment Strategy
- **Decision**: Netlify with Windsurf IDE integration
- **Implementation**:
  - Deploy via Windsurf's native Netlify integration
  - Configure with netlify.toml for Next.js App Router
  - Configure environment variables in Netlify dashboard
- **Rationale**:
  - Seamless one-click deployments from Windsurf IDE
  - Excellent Next.js support with the Netlify plugin
  - Built-in preview deployments for testing changes
  - No manual deployment steps required

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
### UI/UX Preferences ✓ COMPLETED
All major UI/UX decisions have been documented above, including:
- Mobile-first approach
- Multi-step wizard for forms
- Dark theme with existing brand colors
- Navigation and component patterns

### Technical Stack ✓ CORE DECISIONS MADE
Core technical decisions documented:
- Frontend: Next.js
- Styling: CSS Modules
- Database: Prisma ORM
- UI Components: Headless UI for complex interactions

Further technical decisions will be made during implementation as needed.

## Implementation Roadmap

> This consolidated roadmap serves as the single source of truth for implementation priorities across all documentation.

### Phase 1: Foundation Setup

1. **Documentation & Planning**
   - Create comprehensive documentation (this phase)
   - Define database schema and API contracts
   - Establish project standards and guidelines

2. **Project Setup**
   - Initialize Next.js 14 project with App Router
   - Configure TypeScript, ESLint, and Prettier
   - Set up Prisma ORM and connect to NeonDB
   - Configure environment variables

3. **Authentication System**
   - Implement Auth.js (NextAuth) with email provider
   - Configure NeonDB adapter for auth persistence
   - Create login/logout flows with magic link authentication

### Phase 2: Core Functionality

4. **Database & API Structure**
   - Implement Prisma models for specifications
   - Create RESTful API routes with consistent error handling
   - Set up Shopify API integration with ISR caching

5. **Form Foundation**
   - Implement React Hook Form with Zod validation
   - Create multi-step wizard form components
   - Build form state management utilities

### Phase 3: User Interface

6. **Mobile-First Implementation**
   - Implement responsive layouts prioritizing mobile experience
   - Optimize touch targets and gestures
   - Implement dark theme with system preference detection

7. **CRUD Operations**
   - Build specification creation workflow
   - Implement listing, editing, and deletion interfaces
   - Add search and filtering capabilities

### Phase 4: Refinement

8. **Performance Optimization**
   - Implement ISR caching for Shopify product data
   - Add pagination for large data sets
   - Optimize client-side data fetching with SWR

9. **Deployment & Testing**
   - Configure Netlify deployment pipeline
   - Implement critical path testing
   - Verify mobile and desktop experiences
