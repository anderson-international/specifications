# UI/UX Design Decisions

## Mobile-First Design Philosophy

### Primary Design Target
- **Primary Design Target**: Mobile devices
- All UX decisions will prioritize mobile user experience
- Desktop experience will be an enhancement of the mobile design
- Touch-friendly UI elements throughout the application

## App Navigation Structure

### Left-Hand Navigation Panel
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

### Dashboard Structure
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

## Specifications List View

### Grouped by Status Layout
- **Decision**: Grouped by status layout
- **Implementation**:
  - Sections: Draft, Published, Needs Revision, Under Review
  - Each section collapsible with count badge
  - Within sections: product title, date, and star rating
  - Swipe actions for quick edit/delete (draft only)
  - Filter system to view different slices of data:
    - Product brand (dropdown from enum_product_brands)
    - Product title (type-ahead search box)
- **Rationale**: Clear organization, easy to find specs needing attention

## Specification Form Layout: Multi-Step Wizard

### Wizard Approach
- **Decision**: Multi-step wizard approach for specification forms
- **Rationale**: 
  - Reduces cognitive load on small screens
  - Natural vertical flow for mobile
  - Clear progress indication
  - Better error handling per step
  - Prevents overwhelm with 15+ fields

### Wizard Steps Structure

#### Step 1: Product Selection
- Filter by brand dropdown (populated from enum_product_brands)
- Type-ahead search box within selected brand
- **Excludes products already reviewed by current user**
- Shows product image and name in search results
- Visual indicator showing total products vs. remaining to review

#### Step 2: Product Characteristics 1
- Product type - segmented control/chip selector
- Experience level
- Tobacco types (multi-select, optional)

#### Step 3: Product Characteristics 2
- Cures (multi-select, optional)
- Grind - segmented control/chip selector  
- Boolean flags - toggle switches (fermented, oral tobacco, artisan)

#### Step 4: Sensory Profile
- Tasting notes (multi-select, minimum 1 required)
- Nicotine level - segmented control/chip selector
- Moisture level - segmented control/chip selector

#### Step 5: Review & Rating
- Review text (textarea)
- Star rating
- Rating boost

### Wizard Navigation Pattern
- **Decision**: Swipe gestures for step navigation
- **Implementation**: Swipe left/right between steps with visual hints
- **Rationale**: Natural mobile interaction pattern, maximizes screen space

## Mobile-Optimized UI Components

### Component Choices
- **Segmented controls**: For enum selections with 3-5 options (replaces dropdowns)
- **Toggle switches**: For boolean fields (more touch-friendly than checkboxes)
- **Compact design**: Ensures each wizard step fits on screen without scrolling
- **Touch targets**: Minimum 48px height for all interactive elements

### Multi-Select Field Pattern
- **Decision**: Search + chips pattern for multi-select fields
- **Implementation**: 
  - Search box to filter available options
  - Selected items appear as chips below search
  - Chips have 'x' to remove selection
- **Applies to**: Tasting notes, cures, tobacco types
- **Rationale**: Handles large option sets efficiently, clear selection state, familiar mobile pattern

## Form Validation Pattern

### Step Validation
- **Decision**: Step validation - validate when swiping to next step
- **Implementation**: 
  - Validation triggers on swipe gesture
  - All errors for current step shown at once
  - Prevents progression until step is valid
- **Rationale**: Natural checkpoint, all errors visible on single screen, less distracting

## Visual Design Style

### Dark Theme Design
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

### Card Layout Implementation
- **Implementation**:
  - Cards with both border and lighter background for maximum distinction
  - Each form section in its own card
  - Consistent spacing using 8px grid
- **Rationale**: Brand consistency, visual organization, reduces eye strain
