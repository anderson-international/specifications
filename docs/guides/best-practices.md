# Development Best Practices

<!-- AI_NAVIGATION
Primary Focus: File size limits, separation of concerns, simplicity principles
Key Compliance Points:
- Component files: 150 line limit (line 30)
- Page files: 200 line limit (line 31)
- Utility files: 100 line limit (line 32)
- Simplicity and brevity principles (line 12-23)
- Single responsibility per file (line 16)
Critical for: All .ts/.tsx files, component organization, refactoring decisions
Cross-references: architectural-guidelines.md (structure), code-quality-standards.md (enforcement)
Enforcement: Strictly enforced - refactor immediately when exceeded
-->

> **📋 Quick Navigation:**
> - **Architecture & Organization**: [Architectural Guidelines](architectural-guidelines.md) | [Code Quality Standards](code-quality-standards.md)
> - **React Patterns**: [React Development Patterns](react-patterns.md) | [Form Management](../concerns/form-management.md)
> - **UI/UX Implementation**: [UI/UX Design Decisions](../project/ui-ux-design.md) | [Component Patterns](../concerns/ui-ux-patterns.md)
> - **Database Integration**: [Database-Form Integration Guide](database-form-integration.md) | [Database Schema](../db-schema.txt)
> - **Deployment & Environment**: [Deployment Environment](../concerns/deployment-environment.md) | [Technical Stack](../project/technical-stack.md)

## Core Principles

### Simplicity and Brevity

As a solo hobbyist coder, I prioritize:

- **Small, Focused Files**: Single responsibility per file
- **Self-documenting Code**: Clear code over extensive comments
- **Straightforward Solutions**: Simple implementations over complex patterns
- **Pragmatic Development**: Build only what's needed
- **Concise Functions**: Small, single-purpose functions
- **Clear Naming**: Names that make comments unnecessary

### ⚠️ **CRITICAL**: File Size and Separation of Concerns

#### ⚠️ **CRITICAL - NON-NEGOTIABLE LIMITS**: File Size Limits
- **Component Files**: 150 lines maximum
- **Page Files**: 200 lines maximum  
- **Utility Files**: 100 line maximum

**VIOLATION CONSEQUENCES**: 
- Immediate refactoring required
- Development blocked until compliance

**MANDATORY ACTIONS when approaching limits**:
- **Extract Custom Hooks**: Move complex state logic
- **Separate Concerns**: Split UI, business logic, and state management
- **Create Container Components**: For data flow management
- **Extract Utility Components**: Create reusable UI elements
- **Move Constants**: Large data to separate files

#### 🔥 **HIGH**: When to Split Components

**Splitting Triggers:**
- Component approaching 150-line limit
- Multiple responsibilities in one component
- Complex state management
- Unclear component purpose

#### ✨ **SUCCESSFUL PATTERN**: Splitting Examples

**Example: SpecificationWizard (328 lines → Multiple Components)**
- **Split Into**:
  - `WizardContainer` (navigation, progress)
  - `DraftManager` (draft functionality)  
  - `ValidationProvider` (validation logic)
  - `SpecificationWizard` (main component <150 lines)

**Form Component Patterns**:
- Extract step logic into custom hooks
- Separate form UI from form logic
- Move validation schemas to separate files

#### ⚙️ **MEDIUM**: File Organization

- **Flat Structure**: Minimal directory nesting
- **Feature-Based Grouping**: Group by functionality
- **Co-location**: Related files kept together
- **Clear Naming**: Match filenames to component names

### ⚙️ **MEDIUM**: API Strategy

- **Use Next.js API Routes** for backend needs
- **Direct GraphQL queries** to Shopify API
- **Simple integration code**: Modular and concise
- **Minimal abstractions**: No unnecessary complexity

### 🔥 **HIGH**: Form Management Strategy

See [Form Management Documentation](../concerns/form-management.md) for complete form handling approach.

### ⚙️ **MEDIUM**: CSS/Styling Strategy

- **CSS Modules**: Default for all components
- **Component-scoped styles**: Small, focused files
- **Descriptive class names**: Reflect component structure
- **Inline styles**: Only for highly dynamic styling
- **Avoid global styles**: Prevent style conflicts

### 🔥 **HIGH**: Authentication Strategy

See [Authentication Documentation](../concerns/authentication.md) for comprehensive authentication approach.
