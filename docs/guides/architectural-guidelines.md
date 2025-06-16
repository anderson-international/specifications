# Architectural Guidelines

*Comprehensive patterns for scalable component architecture and system design.*

<!-- AI_NAVIGATION
Primary Focus: Component hierarchy, API design principles, Next.js App Router patterns
Key Compliance Points:
- Single responsibility principle (line 27-33)
- Composition over inheritance (line 29)
- Component organization patterns (line 42-68)
- API design principles (line 70-85)
- Next.js 15 App Router structure (line 156-185)
Critical for: Project structure, component design, API architecture
Cross-references: best-practices.md (file limits), api-design.md (API patterns), ui-ux-patterns.md (components)
Decision Framework: When to create new components vs extend existing
-->

> **📋 Quick Navigation:**
> - **Development Standards**: [Best Practices](best-practices.md) | [Code Quality Standards](code-quality-standards.md)
> - **React Implementation**: [React Development Patterns](react-patterns.md) | [Database-Form Integration](database-form-integration.md)
> - **UI/UX Design**: [UI/UX Design Decisions](../project/ui-ux-design.md) | [Component Patterns](../concerns/ui-ux-patterns.md)
> - **Technical Strategy**: [Form Management](../concerns/form-management.md) | [Authentication](../concerns/authentication.md)
> - **Project Context**: [Technical Stack](../project/technical-stack.md) | [Feature Requirements](../project/feature-requirements.md)

This document outlines the architectural principles for the specifications project - a snuff specification builder and CRUD admin application built with Next.js.

## Table of Contents

1. [Core Architectural Principles](#core-architectural-principles)
2. [Component Hierarchy](#component-hierarchy)
3. [API Design Principles](#api-design-principles)
4. [Data Modeling](#data-modeling)
5. [Error Handling](#error-handling)
6. [Performance Optimization](#performance-optimization)
7. [Next.js App Router Patterns](#nextjs-app-router-patterns)

## ⚠️ **CRITICAL**: Core Architectural Principles

1. **⚠️ CRITICAL: Simplicity First**: Choose the simplest solution that meets requirements
2. **🔥 HIGH: Minimize Dependencies**: Avoid unnecessary libraries or abstractions
3. **⚠️ CRITICAL: Small, Focused Files**: Keep components and modules compact and single-purpose
4. **⚙️ MEDIUM: Pragmatic Patterns**: Use established patterns where they add value
5. **✨ ENHANCE: Progressive Enhancement**: Start simple, enhance as needed

## 🔥 **HIGH**: Component Hierarchy

### ⚠️ **CRITICAL**: Component Structure

- **⚠️ CRITICAL**: Use functional components with hooks exclusively
- **⚠️ CRITICAL**: Keep components small and focused (single responsibility)
- **⚠️ CRITICAL**: Limit component files to **150 lines maximum**

### ⚙️ **MEDIUM**: Component Organization

```
/components
  /common            # Reusable components across features
  /layout            # Layout components  
  /specifications    # Feature-specific components
```

### 🔥 **HIGH**: Component Composition Patterns

1. **🔥 HIGH: Container/Presentation Pattern**
   - Separate data fetching from presentation
   - Container components handle data/logic
   - Presentation components handle rendering

2. **⚙️ MEDIUM: Composition Over Inheritance**
   - Build complex components by composing smaller ones
   - Use props to pass data and behavior down

### 🔥 **HIGH**: State Management

- **🔥 HIGH**: Use React's built-in `useState` for component-local state
- **🔥 HIGH**: Use `useReducer` for more complex component state
- **⚠️ CRITICAL**: Use Context API sparingly for truly global state
- **🔥 HIGH**: Avoid external state management libraries unless necessary

## 🔥 **HIGH**: API Design Principles

### ⚠️ **CRITICAL**: API Routes Structure

Use Next.js App Router for backend functionality:

```
/app/api
  /specifications
    route.ts              # GET (list), POST (create)
    [id]/
      route.ts            # GET, PUT, DELETE for specific item
```

## 🔥 **HIGH**: Data Modeling

### ⚠️ **CRITICAL**: Type Safety

Define TypeScript interfaces for all data models:

```typescript
interface Specification {
  id: string;
  title: string;
  properties: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
```

### ⚠️ **CRITICAL**: Database Interaction

1. **⚠️ CRITICAL**: Use Prisma ORM for all database operations
2. **⚠️ CRITICAL**: Use Zod schemas for type-safe validation

## ⚠️ **CRITICAL**: Error Handling

### ⚠️ **CRITICAL**: Error Handling Principles

1. **⚠️ CRITICAL: Explicit Error Surfacing**
   - Never hide errors or use fallback/substitute data
   - Surface errors immediately to user

2. **🔥 HIGH: Error Boundaries**
   - Use React Error Boundaries for UI error handling
   - Provide useful error messages and recovery options

3. **🔥 HIGH: API Error Handling**
   - Return appropriate status codes
   - Include error codes, messages, and retryability info

## 🔥 **HIGH**: Performance Optimization

1. **⚠️ CRITICAL: Component Memoization**
   - Use React.memo for pure functional components
   - Use useCallback for event handlers passed to child components
   - Use useMemo for expensive calculations

2. **🔥 HIGH: Code Splitting**
   - Use dynamic imports for large components/pages
   - Lazy load routes and heavy components

## ⚠️ **CRITICAL**: Next.js App Router Patterns

### 🔥 **HIGH**: Routing Structure

```
/app
  /page.tsx             # Home page
  /specifications
    /page.tsx           # Specifications list
    /[id]/page.tsx      # Specification detail
    /create/page.tsx    # Create specification
  /api
    /specifications
      /route.ts         # API endpoints
```

### ⚠️ **CRITICAL**: Server vs Client Components

- **⚠️ CRITICAL**: Use Server Components for data fetching and initial render
- **🔥 HIGH**: Use Client Components for interactive UI elements
- **⚙️ MEDIUM**: Keep client bundle size minimal by leveraging server components

### ⚙️ **MEDIUM**: Data Fetching Strategies

1. **🔥 HIGH: Server-Side Data Fetching**
   - Use in Server Components for initial page load
   - Provides better SEO and initial page load performance

2. **⚙️ MEDIUM: Client-Side Data Fetching**
   - Use for interactive features that need fresh data
   - Implement loading states and error handling

## ⚠️ **CRITICAL**: Security Patterns

1. **⚠️ CRITICAL: Authentication & Authorization**
   - Implement robust auth checks on all protected routes
   - Use NextAuth.js for authentication

2. **⚠️ CRITICAL: Validation**
   - Validate all inputs on both client and server
   - Use Zod for schema validation

## 📋 References & Tools

- **Documentation**: [Next.js App Router](https://nextjs.org/docs/app)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Form Validation**: [Zod](https://github.com/colinhacks/zod)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
