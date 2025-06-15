# UI/UX Design Decisions

*Comprehensive UI/UX strategy, design system, and component patterns for the Specification Builder.*

> **📋 Quick Navigation:**
> - **Implementation Guides**: [Database-Form Integration](../guides/database-form-integration.md) | [React Development Patterns](../guides/react-patterns.md)
> - **Development Standards**: [Best Practices](../guides/best-practices.md) | [Architectural Guidelines](../guides/architectural-guidelines.md)
> - **Form Strategy**: [Form Management](../concerns/form-management.md) | [Component Patterns](../concerns/ui-ux-patterns.md)
> - **Technical Context**: [Technical Stack](technical-stack.md) | [Code Quality Standards](../guides/code-quality-standards.md)
> - **Project Context**: [Feature Requirements](feature-requirements.md) | [Business Context](business-context.md)

## Strategic Overview

This document serves as the **authoritative source** for all UI/UX design decisions, component patterns, and implementation strategies for the Specification Builder project.

> **🔄 Implementation Status:** See [our-plan.md](../our-plan.md) → Phase 2.1 Product Discovery UI and Phase 2.2 Specification Form Wizard for current UI implementation progress.

This document provides comprehensive UI/UX guidance combining strategic patterns with specific design decisions. Focus is on simplicity and consistency for a solo hobbyist project with mobile-first responsive design.

## Core UI/UX Philosophy

### Mobile-First Design Philosophy
- **Primary Design Target**: Mobile devices
- All UX decisions will prioritize mobile user experience
- Desktop experience will be an enhancement of the mobile design
- Touch-friendly UI elements throughout the application
- Progressive enhancement: Add desktop features as screen size increases
- Performance focus: Optimize for mobile performance and loading times

### Design Principles
- **Simplicity**: Clear, intuitive interfaces following KISS principle
- **Consistency**: Standardized patterns and behaviors across the application
- **Accessibility**: Keyboard navigation and screen reader support throughout
- **Performance**: Efficient rendering and minimal resource usage

## Styling Strategy

### CSS Modules Implementation
- **Approach**: Component-scoped styling with CSS Modules
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

### Component Organization Philosophy
- **Single Responsibility**: Each component handles one clear purpose
- **Reasonable Size**: Keep components focused and maintainable (see file size limits in best-practices.md)
- **Composition Over Inheritance**: Build complex UIs from simple component combinations
- **Clear Interfaces**: Well-defined props and consistent API patterns
- **Feature-Based Organization**: Group related components by functionality
- **Co-location**: Keep component files near related logic and styles

## User Experience Patterns

### Navigation Strategy
- **Simple Structure**: Clear, intuitive navigation hierarchy
- **Mobile-Friendly**: Touch-friendly navigation for mobile devices
- **Consistent Patterns**: Standardized navigation behaviors across the application
- **Accessibility**: Keyboard navigation and screen reader support

### Interaction Patterns
- **Immediate Feedback**: Visual feedback for user actions
- **Loading States**: Clear indication of async operations
- **Error Handling**: User-friendly error messages and recovery options
- **Progressive Disclosure**: Show information as needed, avoid overwhelming users

### Performance Considerations
- **Image Optimization**: Appropriate image formats and sizing for web delivery
- **Code Splitting**: Load only necessary CSS and JavaScript for each page
- **Minimal Dependencies**: Avoid heavy UI libraries for simple styling needs
- **Efficient Rendering**: Minimize unnecessary re-renders and DOM manipulations

## Accessibility Guidelines

### Core Principles
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper semantic markup and ARIA labels
- **Color Accessibility**: Sufficient contrast ratios and color-independent information
- **Focus Management**: Clear visual focus indicators and logical tab order

### Implementation Patterns
- **Semantic HTML**: Use appropriate HTML elements for their intended purpose
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Error Accessibility**: Screen reader accessible error messages and validation
- **Skip Links**: Navigation shortcuts for keyboard and screen reader users

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

## Multi-Step Form Wizard UI Design

### Wizard Structure and Navigation
- **Design Pattern**: Step-based progression with clear visual indicators
- **Step Navigation**:
  - Progress bar showing completed/current/remaining steps
  - Step numbers and titles visible throughout wizard
  - Previous step navigation always available (preserves data)
  - Next step blocked until current step validation passes
- **Visual Elements**:
  - Each step in dedicated card container
  - Consistent button placement (Previous/Next at bottom)
  - Loading states during validation and submission
  - Clear step completion indicators

### Form Field Organization
- **Card-Based Layout**: Each logical section in separate cards within steps
- **Field Grouping**: Related fields grouped visually with section headers
- **Input Styling**: Consistent form controls matching dark theme
- **Validation Display**: Inline error messages below each field
- **Required Field Indicators**: Clear visual markers for required fields

### Progress and State Management
- **Visual Progress**: Multi-level progress indication
  - Overall wizard progress (e.g., "Step 2 of 5")
  - Step-level progress for complex steps (e.g., "3 of 7 sections complete")
- **Draft State Handling**:
  - Auto-save indicators and status
  - Draft resume prompts with clear options
  - Visual differentiation for saved vs unsaved changes
- **Loading States**: Consistent loading indicators for async operations

### Mobile-First Wizard Considerations
- **Touch-Friendly Navigation**: Large tap targets for step navigation
- **Swipe Support**: Optional gesture navigation between steps
- **Compact Layout**: Optimized form field spacing for mobile screens
- **Keyboard Handling**: Proper focus management and virtual keyboard optimization
- **Scroll Behavior**: Smooth step transitions with proper scroll positioning

### Error Handling and Validation UI
- **Step-Level Validation**: Block progression with clear error summary
- **Field-Level Feedback**: Immediate validation feedback during input
- **Error Recovery**: Clear path to fix validation errors
- **Success Indicators**: Positive feedback for completed sections
- **Consistent Messaging**: Standardized error message styling and placement

**Technical Implementation**: See [Form Management Documentation](../concerns/form-management.md) for React Hook Form integration, validation patterns, and state management strategies.
