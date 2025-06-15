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

As a solo hobbyist coder, I prioritize simplicity and brevity above all else in my code. This means:

- **Small Code Files**: Keep files small and focused on a single responsibility
- **Minimal Comments**: Rely on self-documenting code rather than extensive comments
- **Simple Solutions**: Choose the most straightforward implementation over complex patterns
- **Pragmatic Approach**: Avoid over-engineering and only build what's actually needed
- **Function Size**: Keep functions small and focused on a single task
- **Naming**: Use clear, descriptive names that make comments unnecessary

These principles guide all coding decisions in this project to maintain enjoyable and sustainable development as a solo developer.

### ⚠️ **CRITICAL**: File Size and Separation of Concerns

To maintain clarity and simplicity in the Next.js project structure:

#### ⚠️ **CRITICAL - NON-NEGOTIABLE LIMITS**: File Size Limits
- **Component Files**: 150 lines maximum
- **Page Files**: 200 lines maximum  
- **Utility Files**: 100 lines maximum

**VIOLATION CONSEQUENCES**: 
- Immediate refactoring required
- Development blocked until compliance
- Code review rejection

**MANDATORY ACTIONS when approaching limits**:
- **Extract Custom Hooks**: Move complex state logic to custom hooks
- **Separate Concerns**: UI rendering vs. business logic vs. state management
- **Create Container Components**: Wrapper components that manage data flow
- **Extract Utility Components**: Reusable UI elements into separate files
- **Move Constants**: Large constant objects/arrays to separate files

#### 🔥 **HIGH**: When to Split Components
**Splitting Triggers:**
- Any component approaching the 150-line limit
- Components handling multiple responsibilities
- Complex state management within a single component
- Difficulty in understanding component purpose at first glance

#### ✨ **SUCCESSFUL PATTERN**: Splitting Patterns
Based on actual refactoring experience:

**Example 1: SpecificationWizard Component (328 lines → Multiple Components)**
- **Original Issue**: Single component handling wizard navigation, draft management, validation, and UI rendering
- **Successful Split**:
  - `WizardContainer` (navigation, progress tracking)
  - `DraftManager` (draft save/load/prompt functionality)  
  - `ValidationProvider` (step validation logic)
  - `SpecificationWizard` (main component under 150 lines)

**Example 2: Large Form Components**  
- **Pattern**: Extract step-specific logic into custom hooks
- **Pattern**: Separate form UI from form logic
- **Pattern**: Extract validation schemas to separate files

#### ⚙️ **MEDIUM**: File Organization Best Practices
- **Flat Structure**: Avoid deep nesting in component directories
- **Feature-Based Grouping**: Group related components by functionality
- **Co-location**: Keep component files near related logic and styles
- **Clear Naming**: Component files should match component names exactly

These limits are enforced during code reviews and violating them requires immediate refactoring for maintainability and clarity.

### ⚙️ **MEDIUM**: API Strategy

- **Default to Next.js API Routes** for custom backend needs
- **Use direct GraphQL queries** to the Shopify Storefront API with a minimal client
- **Keep API integration code** simple, concise, and modular
- **Avoid unnecessary abstractions** or extra infrastructure

This approach balances simplicity with the specific requirements of Shopify's GraphQL API while maintaining a straightforward development experience.

### 🔥 **HIGH**: Form Management Strategy

**Complete Implementation**: See [Form Management Documentation](../concerns/form-management.md) for comprehensive form handling strategy including React Hook Form patterns, validation approaches, and multi-step form management.

### ⚙️ **MEDIUM**: CSS/Styling Strategy

- **Default to CSS Modules** for all component styling
- **Keep style files small** and scoped to individual components
- **Use clear, descriptive class names** that reflect the component's structure
- **Only use inline styles or CSS-in-JS** for rare, highly dynamic styling needs
- **Avoid global styles** and large, shared CSS files

CSS Modules provide automatic scoping, prevent style conflicts, and have minimal learning curve with low runtime overhead, making them ideal for a solo developer workflow.

### 🔥 **HIGH**: Authentication Strategy

**Complete Implementation**: See [Authentication Documentation](../concerns/authentication.md) for comprehensive authentication strategy including magic link approach, role management, and development patterns.

## 📝 **LOW**: File Operations

### Always Create Destination Folders Before Writing Files

When writing files to the filesystem, always check if the destination directory exists first. If it doesn't exist, create it using the `mkdir` command before attempting to write the file.

Steps to follow:
1. Extract the directory path from the target file path
2. Check if the directory exists using a command like `list_dir` or similar
3. If the directory doesn't exist, create it using `run_command` with `mkdir` (example: `cmd /c "mkdir "path/to/directory""`)
4. Only after confirming the directory exists, proceed with `write_to_file`

This prevents errors when trying to write files to non-existent directories and ensures smoother file operations.

Example:
```javascript
// Example of proper file writing workflow
// 1. Determine directory path
const targetFile = "path/to/directory/file.txt";
const dirPath = targetFile.substring(0, targetFile.lastIndexOf("/"));

// 2. Check if directory exists 
// 3. If not, create it: 
//    cmd /c "mkdir "path/to/directory""
// 4. Then write the file
```

## 📝 **LOW**: Solo Development Workflow

### Streamlined Process

- Use direct commits to main branch for most changes
- Create feature branches only for experimental features
- Keep documentation lightweight and focused on "why" not "what"
- Use TODO comments for future enhancements
- Prioritize working code over perfect code

### Version Control

- Use meaningful commit messages that explain the reason for the change
- Group related changes in single commits
- Use tags for major version changes
